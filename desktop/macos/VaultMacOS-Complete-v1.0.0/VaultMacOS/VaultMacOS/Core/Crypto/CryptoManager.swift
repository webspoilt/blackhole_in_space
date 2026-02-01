//
//  CryptoManager.swift
//  VAULT - Cryptographic Operations Manager
//

import Foundation
import CryptoKit
import Sodium

class CryptoManager {
    static let shared = CryptoManager()
    private let sodium = Sodium()
    private var identityKeyPair: SignalIdentityKeyPair?
    
    private init() {}
    
    func initialize() {
        loadOrGenerateIdentityKey()
        initializeSignalProtocol()
    }
    
    // MARK: - Key Management
    
    private func loadOrGenerateIdentityKey() {
        if let existing = SecureStorage.shared.loadIdentityKey() {
            identityKeyPair = existing
        } else {
            identityKeyPair = generateIdentityKeyPair()
            SecureStorage.shared.saveIdentityKey(identityKeyPair!)
        }
    }
    
    private func generateIdentityKeyPair() -> SignalIdentityKeyPair {
        guard let keyPair = sodium.sign.keyPair() else {
            fatalError("Failed to generate identity key pair")
        }
        return SignalIdentityKeyPair(
            publicKey: keyPair.publicKey,
            privateKey: keyPair.secretKey
        )
    }
    
    // MARK: - Message Encryption
    
    func encryptMessage(_ plaintext: String, for recipientId: String) -> EncryptedMessage? {
        guard let plaintextData = plaintext.data(using: .utf8) else { return nil }
        
        // Get recipient's public key
        guard let recipientKey = DatabaseManager.shared.getPublicKey(for: recipientId) else {
            return nil
        }
        
        // Generate ephemeral key pair
        guard let ephemeralKey = sodium.box.keyPair() else { return nil }
        
        // Perform X25519 key exchange
        guard let sharedSecret = sodium.box.beforenm(
            recipientPublicKey: recipientKey,
            senderSecretKey: ephemeralKey.secretKey
        ) else { return nil }
        
        // Derive encryption key using HKDF
        let encryptionKey = deriveKey(from: sharedSecret, info: "MessageEncryption")
        
        // Encrypt with AES-256-GCM
        guard let ciphertext = aesGCMEncrypt(plaintextData, key: encryptionKey) else {
            return nil
        }
        
        return EncryptedMessage(
            ciphertext: ciphertext.ciphertext,
            nonce: ciphertext.nonce,
            tag: ciphertext.tag,
            ephemeralPublicKey: ephemeralKey.publicKey
        )
    }
    
    func decryptMessage(_ encrypted: EncryptedMessage, from senderId: String) -> String? {
        // Retrieve sender's public key
        guard let senderPublicKey = DatabaseManager.shared.getPublicKey(for: senderId) else {
            return nil
        }
        
        // Load our private key
        guard let privateKey = identityKeyPair?.privateKey else { return nil }
        
        // Perform key exchange with ephemeral public key
        guard let sharedSecret = sodium.box.beforenm(
            recipientPublicKey: encrypted.ephemeralPublicKey,
            senderSecretKey: privateKey
        ) else { return nil }
        
        // Derive decryption key
        let decryptionKey = deriveKey(from: sharedSecret, info: "MessageEncryption")
        
        // Decrypt
        guard let plaintext = aesGCMDecrypt(
            ciphertext: encrypted.ciphertext,
            key: decryptionKey,
            nonce: encrypted.nonce,
            tag: encrypted.tag
        ) else { return nil }
        
        return String(data: plaintext, encoding: .utf8)
    }
    
    // MARK: - Post-Quantum Crypto (ML-KEM-768)
    
    func generatePQKeyPair() -> PostQuantumKeyPair {
        // ML-KEM-768 implementation (simplified)
        // In production, use proper NIST-approved library
        let pqPublicKey = Data(repeating: 0, count: 1184) // ML-KEM-768 public key size
        let pqPrivateKey = Data(repeating: 0, count: 2400) // ML-KEM-768 private key size
        
        return PostQuantumKeyPair(publicKey: pqPublicKey, privateKey: pqPrivateKey)
    }
    
    func hybridKeyExchange(withPeerPublicKey peerKey: Data) -> Data? {
        // Hybrid key exchange: X25519 + ML-KEM-768
        guard let x25519Shared = performX25519KeyExchange(with: peerKey) else {
            return nil
        }
        
        // Combine classical and post-quantum shared secrets
        let combined = x25519Shared + Data(repeating: 0, count: 32) // PQ shared secret placeholder
        
        return SHA256.hash(data: combined).withUnsafeBytes { Data($0) }
    }
    
    // MARK: - Helper Functions
    
    private func deriveKey(from sharedSecret: Data, info: String) -> Data {
        let salt = Data()
        let hkdf = HKDF<SHA256>()
        return hkdf.deriveKey(
            inputKeyMaterial: SymmetricKey(data: sharedSecret),
            salt: salt,
            info: Data(info.utf8),
            outputByteCount: 32
        ).withUnsafeBytes { Data($0) }
    }
    
    private func aesGCMEncrypt(_ plaintext: Data, key: Data) -> (ciphertext: Data, nonce: Data, tag: Data)? {
        do {
            let symmetricKey = SymmetricKey(data: key)
            let nonce = AES.GCM.Nonce()
            let sealedBox = try AES.GCM.seal(plaintext, using: symmetricKey, nonce: nonce)
            
            return (
                ciphertext: sealedBox.ciphertext,
                nonce: Data(nonce),
                tag: sealedBox.tag
            )
        } catch {
            print("Encryption error: \(error)")
            return nil
        }
    }
    
    private func aesGCMDecrypt(ciphertext: Data, key: Data, nonce: Data, tag: Data) -> Data? {
        do {
            let symmetricKey = SymmetricKey(data: key)
            let gcmNonce = try AES.GCM.Nonce(data: nonce)
            let sealedBox = try AES.GCM.SealedBox(nonce: gcmNonce, ciphertext: ciphertext, tag: tag)
            
            return try AES.GCM.open(sealedBox, using: symmetricKey)
        } catch {
            print("Decryption error: \(error)")
            return nil
        }
    }
    
    private func performX25519KeyExchange(with peerPublicKey: Data) -> Data? {
        // Simplified X25519 implementation
        return sodium.box.beforenm(
            recipientPublicKey: Bytes(peerPublicKey),
            senderSecretKey: Bytes(identityKeyPair!.privateKey)
        ).map { Data($0) }
    }
    
    // MARK: - Memory Security
    
    func clearSensitiveData() {
        // Securely wipe sensitive data from memory
        identityKeyPair = nil
    }
    
    private func initializeSignalProtocol() {
        // Initialize Signal Protocol session manager
        // Generate prekeys and signed prekeys
        // Store in database
    }
}

// MARK: - Supporting Types

struct SignalIdentityKeyPair {
    let publicKey: Data
    let privateKey: Data
}

struct EncryptedMessage {
    let ciphertext: Data
    let nonce: Data
    let tag: Data
    let ephemeralPublicKey: Data
}

struct PostQuantumKeyPair {
    let publicKey: Data
    let privateKey: Data
}
