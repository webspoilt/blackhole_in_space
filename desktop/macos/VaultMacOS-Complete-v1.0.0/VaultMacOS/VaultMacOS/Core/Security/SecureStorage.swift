//
//  SecureStorage.swift
//  VAULT - Secure Keychain Storage
//

import Foundation
import Security

class SecureStorage {
    static let shared = SecureStorage()
    private let service = "com.vault.messenger"
    
    private init() {}
    
    func saveIdentityKey(_ keyPair: SignalIdentityKeyPair) {
        save(key: "identityPublicKey", data: keyPair.publicKey)
        save(key: "identityPrivateKey", data: keyPair.privateKey)
    }
    
    func loadIdentityKey() -> SignalIdentityKeyPair? {
        guard let publicKey = load(key: "identityPublicKey"),
              let privateKey = load(key: "identityPrivateKey") else {
            return nil
        }
        return SignalIdentityKeyPair(publicKey: publicKey, privateKey: privateKey)
    }
    
    func getDatabaseKey() -> String {
        if let existing = load(key: "databaseKey") {
            return String(data: existing, encoding: .utf8) ?? generateDatabaseKey()
        }
        return generateDatabaseKey()
    }
    
    private func generateDatabaseKey() -> String {
        let key = UUID().uuidString + UUID().uuidString
        save(key: "databaseKey", data: Data(key.utf8))
        return key
    }
    
    private func save(key: String, data: Data) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }
    
    private func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        return status == errSecSuccess ? result as? Data : nil
    }
}
