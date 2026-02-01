//
//  CryptoService.swift
//  VaultMessenger
//
//  Cryptographic service using Rust core bridge
//

import Foundation
import CryptoKit
import Combine

class CryptoService: ObservableObject {
    static let shared = CryptoService()
    
    @Published var isInitialized = false
    
    private var identityKeyPair: IdentityKeyPair?
    private var signedPreKey: SignedPreKey?
    private var oneTimePreKeys: [OneTimePreKey] = []
    
    private init() {}
    
    // MARK: - Initialization
    func initialize() async {
        do {
            // Initialize Rust crypto core
            vault_crypto_init()
            
            // Load or generate identity keys
            if let existingKeys = SecureStorage.getIdentityKey() {
                identityKeyPair = try loadIdentityKeyPair(from: existingKeys)
            } else {
                identityKeyPair = try await generateIdentityKeyPair()
                if let keyData = try? identityKeyPair?.serialize() {
                    SecureStorage.saveIdentityKey(keyData)
                }
            }
            
            // Generate pre-keys
            signedPreKey = try await generateSignedPreKey()
            oneTimePreKeys = try await generateOneTimePreKeys(count: 100)
            
            await MainActor.run {
                isInitialized = true
            }
        } catch {
            print("❌ Crypto initialization failed: \(error)")
        }
    }
    
    // MARK: - Key Generation
    private func generateIdentityKeyPair() async throws -> IdentityKeyPair {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                var publicKey = Data(count: 32)
                var privateKey = Data(count: 32)
                
                publicKey.withUnsafeMutableBytes { pubPtr in
                    privateKey.withUnsafeMutableBytes { privPtr in
                        vault_generate_identity_keypair(
                            pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                            privPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                        )
                    }
                }
                
                let keyPair = IdentityKeyPair(publicKey: publicKey, privateKey: privateKey)
                continuation.resume(returning: keyPair)
            }
        }
    }
    
    private func generateSignedPreKey() async throws -> SignedPreKey {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                guard let identityKeyPair = self.identityKeyPair else {
                    continuation.resume(throwing: CryptoError.noIdentityKey)
                    return
                }
                
                var publicKey = Data(count: 32)
                var privateKey = Data(count: 32)
                var signature = Data(count: 64)
                
                publicKey.withUnsafeMutableBytes { pubPtr in
                    privateKey.withUnsafeMutableBytes { privPtr in
                        signature.withUnsafeMutableBytes { sigPtr in
                            identityKeyPair.privateKey.withUnsafeBytes { idPrivPtr in
                                vault_generate_signed_prekey(
                                    pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    privPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    sigPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    idPrivPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                                )
                            }
                        }
                    }
                }
                
                let preKey = SignedPreKey(
                    id: 1,
                    publicKey: publicKey,
                    privateKey: privateKey,
                    signature: signature,
                    timestamp: Date()
                )
                continuation.resume(returning: preKey)
            }
        }
    }
    
    private func generateOneTimePreKeys(count: Int) async throws -> [OneTimePreKey] {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .utility).async {
                var preKeys: [OneTimePreKey] = []
                
                for i in 0..<count {
                    var publicKey = Data(count: 32)
                    var privateKey = Data(count: 32)
                    
                    publicKey.withUnsafeMutableBytes { pubPtr in
                        privateKey.withUnsafeMutableBytes { privPtr in
                            vault_generate_onetime_prekey(
                                pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                privPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                            )
                        }
                    }
                    
                    let preKey = OneTimePreKey(
                        id: i,
                        publicKey: publicKey,
                        privateKey: privateKey
                    )
                    preKeys.append(preKey)
                }
                
                continuation.resume(returning: preKeys)
            }
        }
    }
    
    // MARK: - Encryption/Decryption
    func encrypt(message: String, for recipientPublicKey: Data) async throws -> Data {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                guard let messageData = message.data(using: .utf8) else {
                    continuation.resume(throwing: CryptoError.invalidMessage)
                    return
                }
                
                var ciphertext = Data(count: messageData.count + 48) // Message + overhead
                var ciphertextLength: Int32 = 0
                
                messageData.withUnsafeBytes { msgPtr in
                    recipientPublicKey.withUnsafeBytes { pubKeyPtr in
                        ciphertext.withUnsafeMutableBytes { cipherPtr in
                            let result = vault_encrypt_message(
                                msgPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                Int32(messageData.count),
                                pubKeyPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                cipherPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                &ciphertextLength
                            )
                            
                            if result == 0 {
                                ciphertext = ciphertext.prefix(Int(ciphertextLength))
                                continuation.resume(returning: ciphertext)
                            } else {
                                continuation.resume(throwing: CryptoError.encryptionFailed)
                            }
                        }
                    }
                }
            }
        }
    }
    
    func decrypt(ciphertext: Data, from senderPublicKey: Data) async throws -> String {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                guard let identityKeyPair = self.identityKeyPair else {
                    continuation.resume(throwing: CryptoError.noIdentityKey)
                    return
                }
                
                var plaintext = Data(count: ciphertext.count)
                var plaintextLength: Int32 = 0
                
                ciphertext.withUnsafeBytes { cipherPtr in
                    senderPublicKey.withUnsafeBytes { pubKeyPtr in
                        identityKeyPair.privateKey.withUnsafeBytes { privKeyPtr in
                            plaintext.withUnsafeMutableBytes { plainPtr in
                                let result = vault_decrypt_message(
                                    cipherPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    Int32(ciphertext.count),
                                    pubKeyPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    privKeyPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    plainPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                                    &plaintextLength
                                )
                                
                                if result == 0 {
                                    plaintext = plaintext.prefix(Int(plaintextLength))
                                    if let message = String(data: plaintext, encoding: .utf8) {
                                        continuation.resume(returning: message)
                                    } else {
                                        continuation.resume(throwing: CryptoError.invalidMessage)
                                    }
                                } else {
                                    continuation.resume(throwing: CryptoError.decryptionFailed)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Key Management
    func getPublicKey() -> Data? {
        return identityKeyPair?.publicKey
    }
    
    func getIdentityKey() -> String? {
        guard let publicKey = identityKeyPair?.publicKey else { return nil }
        return publicKey.base64EncodedString()
    }
    
    private func loadIdentityKeyPair(from data: Data) throws -> IdentityKeyPair {
        // Deserialize key pair from stored data
        let decoder = JSONDecoder()
        return try decoder.decode(IdentityKeyPair.self, from: data)
    }
}

// MARK: - Crypto Models
struct IdentityKeyPair: Codable {
    let publicKey: Data
    let privateKey: Data
    
    func serialize() throws -> Data {
        try JSONEncoder().encode(self)
    }
}

struct SignedPreKey {
    let id: Int
    let publicKey: Data
    let privateKey: Data
    let signature: Data
    let timestamp: Date
}

struct OneTimePreKey {
    let id: Int
    let publicKey: Data
    let privateKey: Data
}

// MARK: - Crypto Errors
enum CryptoError: Error {
    case initializationFailed
    case noIdentityKey
    case invalidMessage
    case encryptionFailed
    case decryptionFailed
    case keyGenerationFailed
}
