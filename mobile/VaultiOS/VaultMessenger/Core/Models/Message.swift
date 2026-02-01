//
//  Message.swift
//  VaultMessenger
//
//  Encrypted message model
//

import Foundation

struct Message: Identifiable, Codable {
    let id: String
    let conversationId: String
    let senderId: String
    let recipientId: String
    let encryptedContent: String
    let timestamp: Date
    let messageType: MessageType
    var status: MessageStatus
    var expiresAt: Date?
    var isRead: Bool
    
    // Decrypted content (not persisted)
    var decryptedContent: String?
    var attachments: [MessageAttachment]?
    
    enum MessageType: String, Codable {
        case text
        case image
        case video
        case audio
        case file
        case location
    }
    
    enum MessageStatus: String, Codable {
        case sending
        case sent
        case delivered
        case read
        case failed
    }
    
    enum CodingKeys: String, CodingKey {
        case id, conversationId, senderId, recipientId
        case encryptedContent, timestamp, messageType
        case status, expiresAt, isRead
    }
    
    init(conversationId: String, senderId: String, recipientId: String,
         content: String, type: MessageType = .text, expiryMinutes: Int? = nil) {
        self.id = UUID().uuidString
        self.conversationId = conversationId
        self.senderId = senderId
        self.recipientId = recipientId
        self.encryptedContent = content
        self.timestamp = Date()
        self.messageType = type
        self.status = .sending
        self.isRead = false
        
        if let minutes = expiryMinutes {
            self.expiresAt = Date().addingTimeInterval(TimeInterval(minutes * 60))
        }
    }
    
    var isExpired: Bool {
        guard let expiresAt = expiresAt else { return false }
        return Date() > expiresAt
    }
}

// MARK: - Message Attachment
struct MessageAttachment: Codable {
    let id: String
    let type: AttachmentType
    let url: String
    let encryptedKey: String
    var thumbnailURL: String?
    var fileName: String?
    var fileSize: Int64?
    var duration: TimeInterval?
    
    enum AttachmentType: String, Codable {
        case image, video, audio, document
    }
}

// MARK: - Conversation
struct Conversation: Identifiable, Codable {
    let id: String
    let participantIds: [String]
    let type: ConversationType
    var title: String?
    var lastMessage: Message?
    var unreadCount: Int
    var isMuted: Bool
    var isPinned: Bool
    var createdAt: Date
    var updatedAt: Date
    
    enum ConversationType: String, Codable {
        case oneToOne
        case group
    }
    
    init(participantIds: [String], type: ConversationType = .oneToOne) {
        self.id = UUID().uuidString
        self.participantIds = participantIds
        self.type = type
        self.unreadCount = 0
        self.isMuted = false
        self.isPinned = false
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}
