// Configuration
const EMAIL_API_KEY = process.env.RESEND_API_KEY || 're_YOUR_KEY_HERE';
const EMAIL_FROM = 'noreply@b2g-vault';

module.exports = {
  // Server Configuration
  SERVER: {
    WS_URL: process.env.VAULT_SERVER_URL || 'wss://relay.vault-messaging.com/v1/stream',
    API_URL: process.env.VAULT_API_URL || 'https://api.vault-messaging.com/v1',
    TIMEOUT: 30000,
    RECONNECT_INTERVAL: 5000,
    MAX_RECONNECT_ATTEMPTS: 10
  },

  // Email Service (Resend API - Free 100 emails/day, no credit card required)
  EMAIL: {
    PROVIDER: 'resend',
    API_KEY: EMAIL_API_KEY,
    API_URL: 'https://api.resend.com/emails',
    FROM: EMAIL_FROM,
    FROM_NAME: 'VAULT Messenger'
  },

  // Security Configuration
  SECURITY: {
    // Database encryption
    DB_ENCRYPTION_KEY: 'vault-db-key-256bit-secure',
    
    // Session management
    SESSION_TIMEOUT: 300000, // 5 minutes
    
    // Auto-lock
    AUTO_LOCK_ENABLED: true,
    AUTO_LOCK_TIMEOUT: 300000, // 5 minutes
    
    // Encryption algorithms
    AES_KEY_SIZE: 256,
    RSA_KEY_SIZE: 2048,
    
    // Password requirements
    MIN_PASSWORD_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },

  // Features Configuration
  FEATURES: {
    // Messaging
    MAX_MESSAGE_LENGTH: 10000,
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    SUPPORTED_FILE_TYPES: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'],
    
    // Disappearing messages
    DISAPPEARING_MESSAGE_TIMES: [
      { label: '5 seconds', value: 5000 },
      { label: '30 seconds', value: 30000 },
      { label: '1 minute', value: 60000 },
      { label: '5 minutes', value: 300000 },
      { label: '1 hour', value: 3600000 },
      { label: '1 day', value: 86400000 },
      { label: '1 week', value: 604800000 }
    ],
    
    // Group chat
    MAX_GROUP_SIZE: 100,
    
    // Multi-device
    MAX_DEVICES: 5
  },

  // Database Configuration
  DATABASE: {
    NAME: 'vault-messenger.db',
    VERSION: 1,
    TABLES: {
      USERS: 'users',
      CONTACTS: 'contacts',
      MESSAGES: 'messages',
      CONVERSATIONS: 'conversations',
      IDENTITIES: 'identities',
      SESSIONS: 'sessions',
      PREKEYS: 'prekeys',
      SETTINGS: 'settings'
    }
  },

  // UI Configuration
  UI: {
    THEME: {
      DARK: 'dark',
      LIGHT: 'light',
      AMOLED: 'amoled'
    },
    DEFAULT_THEME: 'dark',
    COLORS: {
      PRIMARY: '#6200EA',
      SECONDARY: '#03DAC6',
      BACKGROUND_DARK: '#1a1a2e',
      SURFACE_DARK: '#16213e',
      ERROR: '#CF6679',
      SUCCESS: '#03DAC6',
      WARNING: '#FFB74D'
    }
  },

  // Crypto Configuration (Post-Quantum Ready)
  CRYPTO: {
    // Signal Protocol Configuration
    SIGNAL: {
      PREKEY_COUNT: 100,
      SIGNED_PREKEY_ROTATION: 604800000 // 7 days
    },
    
    // Post-Quantum (ML-KEM-768)
    POST_QUANTUM_ENABLED: true,
    
    // Memory security
    SECURE_MEMORY_WIPE: true
  },

  // Notification Configuration
  NOTIFICATIONS: {
    ENABLED: true,
    SHOW_PREVIEW: true,
    SOUND_ENABLED: true,
    VIBRATE_ENABLED: false // Desktop doesn't support vibration
  },

  // Development Configuration
  DEV: {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    MOCK_SERVER: false
  }
};
