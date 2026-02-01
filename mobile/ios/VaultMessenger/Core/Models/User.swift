//
//  User.swift
//  VaultMessenger
//
//  User model with cryptographic identity
//

import Foundation

struct User: Identifiable, Codable {
    let id: String
    let username: String
    let displayName: String
    let publicKey: String
    let identityKey: String
    let registrationDate: Date
    var lastSeen: Date
    var profileImageURL: String?
    var status: String?
    
    // Cryptographic keys (not persisted)
    var privateKey: Data?
    var signedPreKey: Data?
    var oneTimePreKeys: [Data]?
    
    enum CodingKeys: String, CodingKey {
        case id, username, displayName, publicKey, identityKey
        case registrationDate, lastSeen, profileImageURL, status
    }
    
    init(id: String, username: String, displayName: String,
         publicKey: String, identityKey: String) {
        self.id = id
        self.username = username
        self.displayName = displayName
        self.publicKey = publicKey
        self.identityKey = identityKey
        self.registrationDate = Date()
        self.lastSeen = Date()
    }
    
    static func from(data: Data) -> User? {
        try? JSONDecoder().decode(User.self, from: data)
    }
    
    func toData() -> Data? {
        try? JSONEncoder().encode(self)
    }
}

// MARK: - Contact
struct Contact: Identifiable, Codable {
    let id: String
    let userId: String
    let username: String
    let displayName: String
    let publicKey: String
    var isVerified: Bool
    var fingerprint: String
    var addedDate: Date
    var lastMessageDate: Date?
    
    init(user: User) {
        self.id = user.id
        self.userId = user.id
        self.username = user.username
        self.displayName = user.displayName
        self.publicKey = user.publicKey
        self.isVerified = false
        self.fingerprint = CryptoUtils.generateFingerprint(publicKey: user.publicKey)
        self.addedDate = Date()
    }
}
