import Dexie, { Table } from 'dexie';

// Database schema types
export interface Device {
  deviceId: string;
  identityKeyPair: {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  };
  signedPreKey: {
    keyId: number;
    publicKey: Uint8Array;
    secretKey: Uint8Array;
    signature: Uint8Array;
  };
  registrationId: number;
  email?: string;
  createdAt: number;
}

export interface Contact {
  id: string;
  deviceId: string;
  identityKey: string;
  name?: string;
  email?: string;
  lastSeen?: number;
  publicKey?: Uint8Array;
  addedAt: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participantIds: string[];
  name?: string;
  lastMessageAt: number;
  lastMessage?: string;
  unreadCount: number;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderDeviceId: string;
  recipientDeviceId?: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileData?: {
    name: string;
    size: number;
    type: string;
    encryptedData: Uint8Array;
  };
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  expiresAt?: number;
  timestamp: number;
  encryptedPayload?: string;
}

export interface Session {
  id: string;
  deviceId: string;
  rootKey: Uint8Array;
  chainKey: Uint8Array;
  sendingChainKey?: Uint8Array;
  receivingChainKey?: Uint8Array;
  messageKeys: Map<number, Uint8Array>;
  previousCounter: number;
  createdAt: number;
  updatedAt: number;
}

export interface PreKey {
  keyId: number;
  publicKey: Uint8Array;
  secretKey: Uint8Array;
  used: boolean;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultExpiry: number | null; // null = never expire
  soundEnabled: boolean;
  encryptionPassphrase?: string;
}

class VaultDatabase extends Dexie {
  devices!: Table<Device, string>;
  contacts!: Table<Contact, string>;
  conversations!: Table<Conversation, string>;
  messages!: Table<Message, string>;
  sessions!: Table<Session, string>;
  preKeys!: Table<PreKey, number>;
  settings!: Table<Settings, string>;

  constructor() {
    super('VaultDB');
    
    this.version(1).stores({
      devices: 'deviceId, email, createdAt',
      contacts: 'id, deviceId, identityKey, addedAt',
      conversations: 'id, type, lastMessageAt, *participantIds',
      messages: 'id, conversationId, senderDeviceId, recipientDeviceId, timestamp, expiresAt',
      sessions: 'id, deviceId, updatedAt',
      preKeys: 'keyId, used',
      settings: 'id'
    });
  }
}

export const db = new VaultDatabase();

// Database utilities
export const dbUtils = {
  // Initialize device
  async initializeDevice(device: Device) {
    await db.devices.put(device);
  },

  // Get current device
  async getCurrentDevice(): Promise<Device | undefined> {
    return db.devices.toCollection().first();
  },

  // Add contact
  async addContact(contact: Contact) {
    await db.contacts.put(contact);
  },

  // Get all contacts
  async getContacts(): Promise<Contact[]> {
    return db.contacts.orderBy('addedAt').reverse().toArray();
  },

  // Create conversation
  async createConversation(conversation: Conversation) {
    await db.conversations.put(conversation);
    return conversation;
  },

  // Get conversations
  async getConversations(): Promise<Conversation[]> {
    return db.conversations.orderBy('lastMessageAt').reverse().toArray();
  },

  // Get conversation by ID
  async getConversation(id: string): Promise<Conversation | undefined> {
    return db.conversations.get(id);
  },

  // Add message
  async addMessage(message: Message) {
    await db.messages.put(message);
    
    // Update conversation
    const conversation = await db.conversations.get(message.conversationId);
    if (conversation) {
      await db.conversations.update(message.conversationId, {
        lastMessageAt: message.timestamp,
        lastMessage: message.content.substring(0, 100),
        unreadCount: message.senderDeviceId !== (await this.getCurrentDevice())?.deviceId 
          ? (conversation.unreadCount || 0) + 1 
          : conversation.unreadCount
      });
    }
  },

  // Get messages for conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    return db.messages
      .where('conversationId')
      .equals(conversationId)
      .sortBy('timestamp');
  },

  // Update message status
  async updateMessageStatus(messageId: string, status: Message['status']) {
    await db.messages.update(messageId, { status });
  },

  // Mark conversation as read
  async markConversationAsRead(conversationId: string) {
    await db.conversations.update(conversationId, { unreadCount: 0 });
  },

  // Search messages
  async searchMessages(query: string): Promise<Message[]> {
    const allMessages = await db.messages.toArray();
    return allMessages.filter(msg => 
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Clean expired messages
  async cleanExpiredMessages() {
    const now = Date.now();
    const expiredMessages = await db.messages
      .where('expiresAt')
      .below(now)
      .toArray();
    
    const ids = expiredMessages.map(m => m.id);
    await db.messages.bulkDelete(ids);
    
    return ids.length;
  },

  // Export backup
  async exportBackup(): Promise<string> {
    const data = {
      devices: await db.devices.toArray(),
      contacts: await db.contacts.toArray(),
      conversations: await db.conversations.toArray(),
      messages: await db.messages.toArray(),
      settings: await db.settings.toArray(),
      exportedAt: Date.now(),
      version: 1
    };
    
    return JSON.stringify(data);
  },

  // Import backup
  async importBackup(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      
      await db.transaction('rw', [
        db.devices,
        db.contacts,
        db.conversations,
        db.messages,
        db.settings
      ], async () => {
        if (data.devices) await db.devices.bulkPut(data.devices);
        if (data.contacts) await db.contacts.bulkPut(data.contacts);
        if (data.conversations) await db.conversations.bulkPut(data.conversations);
        if (data.messages) await db.messages.bulkPut(data.messages);
        if (data.settings) await db.settings.bulkPut(data.settings);
      });
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },

  // Clear all data
  async clearAllData() {
    await db.delete();
    await db.open();
  }
};
