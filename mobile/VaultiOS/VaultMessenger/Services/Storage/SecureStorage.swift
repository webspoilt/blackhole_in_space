//
//  SecureStorage.swift
//  VaultMessenger
//
//  Keychain-based secure storage for sensitive data
//

import Foundation
import Security

class SecureStorage {
    
    private static let serviceName = "com.vault.messenger"
    
    // MARK: - Initialization
    static func initialize() {
        // Setup keychain access
        setupKeychainAccessGroup()
    }
    
    private static func setupKeychainAccessGroup() {
        // Configure keychain access group for app group sharing
        #if os(iOS)
        let accessGroup = "group.com.vault.messenger"
        // Additional setup if needed
        #endif
    }
    
    // MARK: - Identity Keys
    static func saveIdentityKey(_ keyData: Data) {
        save(keyData, for: .identityKey)
    }
    
    static func getIdentityKey() -> Data? {
        return retrieve(for: .identityKey)
    }
    
    // MARK: - User Data
    static func saveUserId(_ userId: String) {
        if let data = userId.data(using: .utf8) {
            save(data, for: .userId)
        }
    }
    
    static func getUserId() -> String? {
        guard let data = retrieve(for: .userId) else { return nil }
        return String(data: data, encoding: .utf8)
    }
    
    static func saveUserData(_ userData: Data) {
        save(userData, for: .userData)
    }
    
    static func getUserData() -> Data? {
        return retrieve(for: .userData)
    }
    
    // MARK: - Authentication
    static func saveAuthToken(_ token: String) {
        if let data = token.data(using: .utf8) {
            save(data, for: .authToken)
        }
    }
    
    static func getAuthToken() -> String? {
        guard let data = retrieve(for: .authToken) else { return nil }
        return String(data: data, encoding: .utf8)
    }
    
    // MARK: - Messages (Ephemeral)
    static func saveMessage(_ messageData: Data, messageId: String) {
        save(messageData, for: .message(messageId))
    }
    
    static func getMessage(_ messageId: String) -> Data? {
        return retrieve(for: .message(messageId))
    }
    
    static func deleteMessage(_ messageId: String) {
        delete(for: .message(messageId))
    }
    
    // MARK: - Conversations
    static func saveConversation(_ conversationData: Data, conversationId: String) {
        save(conversationData, for: .conversation(conversationId))
    }
    
    static func getConversation(_ conversationId: String) -> Data? {
        return retrieve(for: .conversation(conversationId))
    }
    
    // MARK: - Generic Operations
    private static func save(_ data: Data, for key: KeychainKey) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        
        // Delete existing item
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)
        
        if status != errSecSuccess {
            print("❌ Keychain save failed for \(key.rawValue): \(status)")
        }
    }
    
    private static func retrieve(for key: KeychainKey) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        if status == errSecSuccess, let data = result as? Data {
            return data
        }
        
        return nil
    }
    
    private static func delete(for key: KeychainKey) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key.rawValue
        ]
        
        SecItemDelete(query as CFDictionary)
    }
    
    // MARK: - Clear All
    static func clearAll() {
        let secClasses = [
            kSecClassGenericPassword,
            kSecClassInternetPassword,
            kSecClassCertificate,
            kSecClassKey,
            kSecClassIdentity
        ]
        
        for secClass in secClasses {
            let query: [String: Any] = [
                kSecClass as String: secClass
            ]
            SecItemDelete(query as CFDictionary)
        }
    }
    
    // MARK: - Keychain Keys
    enum KeychainKey {
        case identityKey
        case userId
        case userData
        case authToken
        case message(String)
        case conversation(String)
        
        var rawValue: String {
            switch self {
            case .identityKey:
                return "identity_key"
            case .userId:
                return "user_id"
            case .userData:
                return "user_data"
            case .authToken:
                return "auth_token"
            case .message(let id):
                return "message_\(id)"
            case .conversation(let id):
                return "conversation_\(id)"
            }
        }
    }
}

// MARK: - Memory Protection
class MemoryProtection {
    static func enableSecureMemory() {
        // Enable data protection
        #if os(iOS)
        // iOS automatically protects data when device is locked
        // Additional measures can be implemented here
        #endif
    }
    
    static func secureWipe(_ data: inout Data) {
        // Overwrite memory with zeros before deallocation
        data.withUnsafeMutableBytes { ptr in
            memset(ptr.baseAddress, 0, data.count)
        }
        data = Data()
    }
    
    static func secureWipe<T>(_ value: inout T) {
        withUnsafeMutableBytes(of: &value) { ptr in
            memset(ptr.baseAddress, 0, ptr.count)
        }
    }
}

// MARK: - Network Security
class NetworkSecurity {
    static func configureCertificatePinning() {
        // Certificate pinning configuration
        CertificatePinner.configure()
    }
}

// MARK: - Certificate Pinner
class CertificatePinner {
    private static var pinnedCertificates: [String: [Data]] = [:]
    
    static func configure() {
        // Load pinned certificates from bundle
        if let certPath = Bundle.main.path(forResource: "vault-server", ofType: "cer"),
           let certData = try? Data(contentsOf: URL(fileURLWithPath: certPath)) {
            pinnedCertificates["b2g-vault.vercel.app"] = [certData]
        }
    }
    
    static func verify(serverTrust: SecTrust, for host: String) -> Bool {
        guard let pinnedCerts = pinnedCertificates[host] else {
            // No pinning configured for this host
            return true
        }
        
        // Get server certificate
        guard let serverCert = SecTrustGetCertificateAtIndex(serverTrust, 0) else {
            return false
        }
        
        let serverCertData = SecCertificateCopyData(serverCert) as Data
        
        // Compare with pinned certificates
        return pinnedCerts.contains(serverCertData)
    }
}

// MARK: - Biometric Authentication
import LocalAuthentication

class BiometricAuth {
    static func authenticate(reason: String, completion: @escaping (Bool, Error?) -> Void) {
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            completion(false, error)
            return
        }
        
        context.evaluatePolicy(
            .deviceOwnerAuthenticationWithBiometrics,
            localizedReason: reason
        ) { success, error in
            DispatchQueue.main.async {
                completion(success, error)
            }
        }
    }
    
    static var biometricType: BiometricType {
        let context = LAContext()
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil) else {
            return .none
        }
        
        switch context.biometryType {
        case .faceID:
            return .faceID
        case .touchID:
            return .touchID
        default:
            return .none
        }
    }
    
    enum BiometricType {
        case none
        case touchID
        case faceID
    }
}
