//
//  DatabaseManager.swift
//  VAULT - Database Management with SQLCipher
//

import Foundation
import GRDB

class DatabaseManager {
    static let shared = DatabaseManager()
    private var dbQueue: DatabaseQueue?
    
    private init() {}
    
    func setup() {
        let fileManager = FileManager.default
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        let vaultDir = appSupport.appendingPathComponent("VAULT")
        
        try? fileManager.createDirectory(at: vaultDir, withIntermediateDirectories: true)
        
        let dbPath = vaultDir.appendingPathComponent("vault.db").path
        var config = Configuration()
        config.prepareDatabase { db in
            try db.usePassphrase(SecureStorage.shared.getDatabaseKey())
        }
        
        dbQueue = try? DatabaseQueue(path: dbPath, configuration: config)
        createTables()
    }
    
    private func createTables() {
        try? dbQueue?.write { db in
            try db.create(table: "messages", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("conversationId", .text).notNull().indexed()
                t.column("senderId", .text).notNull()
                t.column("content", .blob).notNull()
                t.column("timestamp", .datetime).notNull()
                t.column("status", .text).notNull()
                t.column("isEncrypted", .boolean).notNull().defaults(to: true)
            }
            
            try db.create(table: "conversations", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("participantId", .text).notNull().unique()
                t.column("lastMessage", .text)
                t.column("lastTimestamp", .datetime)
                t.column("unreadCount", .integer).defaults(to: 0)
            }
            
            try db.create(table: "identities", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("userId", .text).notNull().unique()
                t.column("publicKey", .blob).notNull()
                t.column("trustLevel", .integer).defaults(to: 0)
            }
        }
    }
    
    func getPublicKey(for userId: String) -> Data? {
        return try? dbQueue?.read { db in
            try Data.fetchOne(db, sql: "SELECT publicKey FROM identities WHERE userId = ?", arguments: [userId])
        }
    }
    
    func close() {
        dbQueue = nil
    }
}
