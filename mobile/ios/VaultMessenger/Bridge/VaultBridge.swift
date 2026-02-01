//
//  VaultBridge.swift
//  VaultMessenger
//
//  Swift wrapper for Rust crypto functions
//

import Foundation

enum VaultBridge {
    
    // MARK: - Initialization
    static func initialize() -> Bool {
        return vault_crypto_init() == 0
    }
    
    static func cleanup() {
        vault_crypto_cleanup()
    }
    
    // MARK: - Key Generation
    static func generateIdentityKeyPair() throws -> (publicKey: Data, privateKey: Data) {
        var publicKey = Data(count: 32)
        var privateKey = Data(count: 32)
        
        let result = publicKey.withUnsafeMutableBytes { pubPtr in
            privateKey.withUnsafeMutableBytes { privPtr in
                vault_generate_identity_keypair(
                    pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                    privPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                )
            }
        }
        
        guard result == 0 else {
            throw VaultBridgeError.keyGenerationFailed
        }
        
        return (publicKey, privateKey)
    }
    
    static func generateSignedPreKey(identityPrivateKey: Data) throws -> (publicKey: Data, privateKey: Data, signature: Data) {
        var publicKey = Data(count: 32)
        var privateKey = Data(count: 32)
        var signature = Data(count: 64)
        
        let result = publicKey.withUnsafeMutableBytes { pubPtr in
            privateKey.withUnsafeMutableBytes { privPtr in
                signature.withUnsafeMutableBytes { sigPtr in
                    identityPrivateKey.withUnsafeBytes { idPrivPtr in
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
        
        guard result == 0 else {
            throw VaultBridgeError.keyGenerationFailed
        }
        
        return (publicKey, privateKey, signature)
    }
    
    // MARK: - Post-Quantum Cryptography
    static func generatePostQuantumKeys() throws -> (publicKey: Data, privateKey: Data) {
        var publicKey = Data(count: 1184)  // ML-KEM-768 public key size
        var privateKey = Data(count: 2400) // ML-KEM-768 private key size
        
        let result = publicKey.withUnsafeMutableBytes { pubPtr in
            privateKey.withUnsafeMutableBytes { privPtr in
                vault_pq_keygen(
                    pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                    privPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                )
            }
        }
        
        guard result == 0 else {
            throw VaultBridgeError.postQuantumKeyGenerationFailed
        }
        
        return (publicKey, privateKey)
    }
    
    static func encapsulatePostQuantum(publicKey: Data) throws -> (ciphertext: Data, sharedSecret: Data) {
        var ciphertext = Data(count: 1088)
        var sharedSecret = Data(count: 32)
        
        let result = publicKey.withUnsafeBytes { pubPtr in
            ciphertext.withUnsafeMutableBytes { cipherPtr in
                sharedSecret.withUnsafeMutableBytes { secretPtr in
                    vault_pq_encapsulate(
                        pubPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                        cipherPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                        secretPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                    )
                }
            }
        }
        
        guard result == 0 else {
            throw VaultBridgeError.encapsulationFailed
        }
        
        return (ciphertext, sharedSecret)
    }
    
    // MARK: - Hashing
    static func hashSHA3(_ data: Data) throws -> Data {
        var hash = Data(count: 32)
        
        let result = data.withUnsafeBytes { dataPtr in
            hash.withUnsafeMutableBytes { hashPtr in
                vault_hash_sha3_256(
                    dataPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                    Int32(data.count),
                    hashPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                )
            }
        }
        
        guard result == 0 else {
            throw VaultBridgeError.hashingFailed
        }
        
        return hash
    }
    
    static func hashBlake3(_ data: Data) throws -> Data {
        var hash = Data(count: 32)
        
        let result = data.withUnsafeBytes { dataPtr in
            hash.withUnsafeMutableBytes { hashPtr in
                vault_hash_blake3(
                    dataPtr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                    Int32(data.count),
                    hashPtr.baseAddress?.assumingMemoryBound(to: UInt8.self)
                )
            }
        }
        
        guard result == 0 else {
            throw VaultBridgeError.hashingFailed
        }
        
        return hash
    }
    
    // MARK: - Secure Random
    static func generateSecureRandom(length: Int) throws -> Data {
        var buffer = Data(count: length)
        
        let result = buffer.withUnsafeMutableBytes { ptr in
            vault_secure_random(
                ptr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                Int32(length)
            )
        }
        
        guard result == 0 else {
            throw VaultBridgeError.randomGenerationFailed
        }
        
        return buffer
    }
    
    // MARK: - Secure Memory
    static func secureZero(_ data: inout Data) {
        data.withUnsafeMutableBytes { ptr in
            vault_secure_zero(
                ptr.baseAddress?.assumingMemoryBound(to: UInt8.self),
                Int32(data.count)
            )
        }
    }
    
    static func getVersion() -> String {
        if let cString = vault_get_version() {
            return String(cString: cString)
        }
        return "Unknown"
    }
}

// MARK: - Bridge Errors
enum VaultBridgeError: Error {
    case keyGenerationFailed
    case postQuantumKeyGenerationFailed
    case encapsulationFailed
    case decapsulationFailed
    case hashingFailed
    case randomGenerationFailed
    case invalidInput
    
    var localizedDescription: String {
        switch self {
        case .keyGenerationFailed:
            return "Failed to generate cryptographic keys"
        case .postQuantumKeyGenerationFailed:
            return "Failed to generate post-quantum keys"
        case .encapsulationFailed:
            return "Failed to encapsulate shared secret"
        case .decapsulationFailed:
            return "Failed to decapsulate shared secret"
        case .hashingFailed:
            return "Failed to compute hash"
        case .randomGenerationFailed:
            return "Failed to generate secure random data"
        case .invalidInput:
            return "Invalid input parameters"
        }
    }
}
