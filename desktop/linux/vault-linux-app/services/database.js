const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const crypto = require('crypto');
const config = require('../config');

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = path.join(app.getPath('userData'), config.DATABASE.NAME);
    this.encryptionKey = config.SECURITY.DB_ENCRYPTION_KEY;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err);
          reject(err);
        } else {
          console.log('Database connected successfully');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        public_key TEXT NOT NULL,
        private_key_encrypted TEXT NOT NULL,
        identity_key TEXT NOT NULL,
        registration_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        contact_username TEXT NOT NULL,
        contact_email TEXT,
        public_key TEXT NOT NULL,
        identity_key TEXT NOT NULL,
        trust_level INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 0,
        blocked INTEGER DEFAULT 0,
        added_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('direct', 'group')),
        name TEXT,
        avatar TEXT,
        last_message TEXT,
        last_message_time INTEGER,
        unread_count INTEGER DEFAULT 0,
        muted INTEGER DEFAULT 0,
        pinned INTEGER DEFAULT 0,
        disappearing_timer INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        recipient_id TEXT,
        type TEXT NOT NULL CHECK(type IN ('text', 'image', 'video', 'audio', 'file', 'system')),
        content_encrypted TEXT NOT NULL,
        content_type TEXT,
        file_path TEXT,
        file_size INTEGER,
        thumbnail TEXT,
        status TEXT NOT NULL CHECK(status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
        timestamp INTEGER NOT NULL,
        expires_at INTEGER,
        edited INTEGER DEFAULT 0,
        deleted INTEGER DEFAULT 0,
        forwarded INTEGER DEFAULT 0,
        reply_to TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS identities (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        remote_username TEXT NOT NULL,
        identity_key TEXT NOT NULL,
        trust_level INTEGER DEFAULT 0,
        first_use INTEGER DEFAULT 1,
        nonblocking_approval INTEGER DEFAULT 0,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, remote_username)
      )`,
      
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        remote_username TEXT NOT NULL,
        device_id INTEGER NOT NULL,
        session_data TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, remote_username, device_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS prekeys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        key_id INTEGER NOT NULL,
        public_key TEXT NOT NULL,
        private_key_encrypted TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, key_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, key)
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_messages_conversation 
       ON messages(conversation_id, timestamp DESC)`,
      
      `CREATE INDEX IF NOT EXISTS idx_messages_expires 
       ON messages(expires_at) WHERE expires_at IS NOT NULL`,
      
      `CREATE INDEX IF NOT EXISTS idx_contacts_user 
       ON contacts(user_id, contact_username)`,
      
      `CREATE INDEX IF NOT EXISTS idx_sessions_user 
       ON sessions(user_id, remote_username, device_id)`
    ];

    for (const sql of tables) {
      await this.run(sql);
    }
    
    console.log('Database tables created successfully');
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      encrypted: encrypted,
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    try {
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // User operations
  async createUser(userData) {
    const sql = `INSERT INTO users 
      (id, username, email, password_hash, public_key, private_key_encrypted, 
       identity_key, registration_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const now = Date.now();
    return this.run(sql, [
      userData.id,
      userData.username,
      userData.email,
      userData.passwordHash,
      userData.publicKey,
      userData.privateKeyEncrypted,
      userData.identityKey,
      userData.registrationId,
      now,
      now
    ]);
  }

  async getUserByUsername(username) {
    return this.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  async getUserByEmail(email) {
    return this.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  // Contact operations
  async addContact(contactData) {
    const sql = `INSERT INTO contacts 
      (id, user_id, contact_username, contact_email, public_key, 
       identity_key, trust_level, verified, added_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const now = Date.now();
    return this.run(sql, [
      contactData.id,
      contactData.userId,
      contactData.contactUsername,
      contactData.contactEmail || null,
      contactData.publicKey,
      contactData.identityKey,
      contactData.trustLevel || 0,
      contactData.verified || 0,
      now,
      now
    ]);
  }

  async getContacts(userId) {
    return this.all(
      'SELECT * FROM contacts WHERE user_id = ? AND blocked = 0 ORDER BY contact_username',
      [userId]
    );
  }

  // Message operations
  async saveMessage(messageData) {
    const sql = `INSERT INTO messages 
      (id, conversation_id, sender_id, recipient_id, type, content_encrypted, 
       content_type, file_path, file_size, thumbnail, status, timestamp, expires_at, reply_to) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    return this.run(sql, [
      messageData.id,
      messageData.conversationId,
      messageData.senderId,
      messageData.recipientId || null,
      messageData.type,
      messageData.contentEncrypted,
      messageData.contentType || null,
      messageData.filePath || null,
      messageData.fileSize || null,
      messageData.thumbnail || null,
      messageData.status,
      messageData.timestamp,
      messageData.expiresAt || null,
      messageData.replyTo || null
    ]);
  }

  async getMessages(conversationId, limit = 50, offset = 0) {
    return this.all(
      `SELECT * FROM messages 
       WHERE conversation_id = ? AND deleted = 0 
       ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [conversationId, limit, offset]
    );
  }

  async updateMessageStatus(messageId, status) {
    return this.run(
      'UPDATE messages SET status = ? WHERE id = ?',
      [status, messageId]
    );
  }

  // Conversation operations
  async createConversation(conversationData) {
    const sql = `INSERT INTO conversations 
      (id, user_id, type, name, avatar, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const now = Date.now();
    return this.run(sql, [
      conversationData.id,
      conversationData.userId,
      conversationData.type,
      conversationData.name || null,
      conversationData.avatar || null,
      now,
      now
    ]);
  }

  async getConversations(userId) {
    return this.all(
      `SELECT * FROM conversations 
       WHERE user_id = ? 
       ORDER BY pinned DESC, last_message_time DESC`,
      [userId]
    );
  }

  async updateConversation(conversationId, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), Date.now(), conversationId];
    
    return this.run(
      `UPDATE conversations SET ${fields}, updated_at = ? WHERE id = ?`,
      values
    );
  }

  // Cleanup expired messages
  async cleanupExpiredMessages() {
    const now = Date.now();
    return this.run(
      'DELETE FROM messages WHERE expires_at IS NOT NULL AND expires_at < ?',
      [now]
    );
  }
}

module.exports = new DatabaseService();
