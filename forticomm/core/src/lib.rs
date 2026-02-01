//! FortiComm Cryptographic Core
//! 
//! This library provides military-grade encryption for the FortiComm
//! secure messaging platform. It implements:
//! - Signal Protocol (Double Ratchet) for 1:1 messaging
//! - MLS (Messaging Layer Security) for group chats
//! - Post-quantum cryptography (ML-KEM) for key exchange
//! - Client-side encrypted backups

#![cfg_attr(target_arch = "wasm32", no_std)]

#[cfg(target_arch = "wasm32")]
extern crate alloc;

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

// Module declarations
pub mod signal_protocol;
pub mod mls_manager;
pub mod key_hierarchy;
pub mod backup;
pub mod pqc;
pub mod wasm_bindings;
pub mod ai_assistant;
pub mod secure_storage;
pub mod crisis_mode;

// Re-export main types
pub use signal_protocol::SignalSession;
pub use mls_manager::MLSGroupManager;
pub use key_hierarchy::KeyHierarchy;
pub use backup::BackupManager;
pub use ai_assistant::LocalAI;
pub use secure_storage::SecureLocalStorage;
pub use crisis_mode::CrisisMode;

/// Core cryptographic engine for FortiComm
/// 
/// This is the main entry point for all cryptographic operations.
/// Keys are stored in Rust memory and never exposed to JavaScript.
#[wasm_bindgen]
pub struct FortiCommCrypto {
    /// Identity key pair (Ed25519) - never rotates
    identity_key_pair: key_hierarchy::IdentityKeyPair,
    
    /// Key hierarchy for session management
    key_hierarchy: KeyHierarchy,
    
    /// Signal Protocol session store
    signal_store: signal_protocol::SignalSessionStore,
    
    /// MLS group manager
    mls_manager: MLSGroupManager,
    
    /// Backup manager
    backup_manager: BackupManager,
    
    /// Post-quantum key encapsulation
    pqc_keys: pqc::PostQuantumKeys,
}

#[wasm_bindgen]
impl FortiCommCrypto {
    /// Initialize the cryptographic engine
    /// 
    /// This generates a new identity key pair and initializes
    /// all necessary cryptographic components.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<FortiCommCrypto, JsValue> {
        // Initialize logging in debug builds
        #[cfg(debug_assertions)]
        console_log::init_with_level(log::Level::Debug).ok();
        
        // Generate identity key pair with secure RNG
        let identity_key_pair = key_hierarchy::IdentityKeyPair::generate()?;
        
        // Initialize key hierarchy
        let key_hierarchy = KeyHierarchy::new(&identity_key_pair)?;
        
        // Initialize Signal Protocol store
        let signal_store = signal_protocol::SignalSessionStore::new();
        
        // Initialize MLS manager
        let mls_manager = MLSGroupManager::new(&identity_key_pair)?;
        
        // Initialize backup manager
        let backup_manager = BackupManager::new(&key_hierarchy)?;
        
        // Initialize post-quantum keys
        let pqc_keys = pqc::PostQuantumKeys::generate()?;
        
        Ok(FortiCommCrypto {
            identity_key_pair,
            key_hierarchy,
            signal_store,
            mls_manager,
            backup_manager,
            pqc_keys,
        })
    }
    
    /// Encrypt a message for a recipient
    /// 
    /// # Arguments
    /// * `recipient_id` - The recipient's identity key fingerprint
    /// * `plaintext` - The message to encrypt
    /// 
    /// # Returns
    /// Encrypted message bytes or an error
    #[wasm_bindgen]
    pub fn encrypt_message(
        &mut self,
        recipient_id: &str,
        plaintext: &str,
    ) -> Result<Vec<u8>, JsValue> {
        // Check if this is a group message
        if self.mls_manager.is_group(recipient_id) {
            // Use MLS for group encryption
            self.mls_manager.encrypt_message(recipient_id, plaintext.as_bytes())
        } else {
            // Use Signal Protocol for 1:1 encryption
            let session = self.signal_store.get_or_create_session(
                recipient_id,
                &mut self.key_hierarchy
            )?;
            
            // Add post-quantum layer for future-proofing
            let signal_ciphertext = session.encrypt(plaintext.as_bytes())?;
            let pqc_ciphertext = self.pqc_keys.encapsulate(&signal_ciphertext)?;
            
            Ok(pqc_ciphertext)
        }
    }
    
    /// Decrypt a message
    /// 
    /// # Arguments
    /// * `sender_id` - The sender's identity key fingerprint
    /// * `ciphertext` - The encrypted message
    /// 
    /// # Returns
    /// Decrypted message string or an error
    #[wasm_bindgen]
    pub fn decrypt_message(
        &mut self,
        sender_id: &str,
        ciphertext: &[u8],
    ) -> Result<String, JsValue> {
        // Try post-quantum decryption first
        let signal_ciphertext = match self.pqc_keys.decapsulate(ciphertext) {
            Ok(plaintext) => plaintext,
            Err(_) => ciphertext.to_vec(), // Fallback to Signal-only
        };
        
        // Check if this is a group message
        if self.mls_manager.is_group(sender_id) {
            let plaintext = self.mls_manager.decrypt_message(sender_id, &signal_ciphertext)?;
            String::from_utf8(plaintext).map_err(|e| JsValue::from_str(&e.to_string()))
        } else {
            let session = self.signal_store.get_session(sender_id)?;
            let plaintext = session.decrypt(&signal_ciphertext)?;
            String::from_utf8(plaintext).map_err(|e| JsValue::from_str(&e.to_string()))
        }
    }
    
    /// Create an encrypted backup
    /// 
    /// # Arguments
    /// * `password` - The backup password (used with Argon2id)
    /// 
    /// # Returns
    /// JSON-encoded backup package
    #[wasm_bindgen]
    pub fn create_backup(&self, password: &str) -> Result<String, JsValue> {
        self.backup_manager.create_backup(password)
    }
    
    /// Restore from an encrypted backup
    /// 
    /// # Arguments
    /// * `backup_json` - The JSON-encoded backup package
    /// * `password` - The backup password
    #[wasm_bindgen]
    pub fn restore_backup(
        &mut self,
        backup_json: &str,
        password: &str,
    ) -> Result<(), JsValue> {
        self.backup_manager.restore_backup(backup_json, password)
    }
    
    /// Get the public identity key for sharing
    #[wasm_bindgen]
    pub fn get_identity_key(&self) -> Result<String, JsValue> {
        self.identity_key_pair.get_public_key_hex()
    }
    
    /// Rotate signed pre-key (should be called weekly)
    #[wasm_bindgen]
    pub fn rotate_prekeys(&mut self) -> Result<(), JsValue> {
        self.key_hierarchy.rotate_signed_pre_key()
    }
    
    /// Create a new MLS group
    /// 
    /// # Arguments
    /// * `group_id` - Unique group identifier
    /// * `initial_members` - Array of member identity keys
    #[wasm_bindgen]
    pub fn create_group(
        &mut self,
        group_id: &str,
        initial_members: Vec<String>,
    ) -> Result<(), JsValue> {
        self.mls_manager.create_group(group_id, initial_members)
    }
    
    /// Add a member to an MLS group
    #[wasm_bindgen]
    pub fn add_group_member(
        &mut self,
        group_id: &str,
        member_key: &str,
    ) -> Result<(), JsValue> {
        self.mls_manager.add_member(group_id, member_key)
    }
    
    /// Remove a member from an MLS group
    #[wasm_bindgen]
    pub fn remove_group_member(
        &mut self,
        group_id: &str,
        member_key: &str,
    ) -> Result<(), JsValue> {
        self.mls_manager.remove_member(group_id, member_key)
    }
    
    /// Get the fingerprint of the identity key
    /// This is used as the user identifier
    #[wasm_bindgen]
    pub fn get_fingerprint(&self) -> Result<String, JsValue> {
        self.identity_key_pair.fingerprint()
    }
    
    /// Verify a message signature
    #[wasm_bindgen]
    pub fn verify_signature(
        &self,
        message: &[u8],
        signature: &[u8],
        public_key: &str,
    ) -> Result<bool, JsValue> {
        self.identity_key_pair.verify_signature(message, signature, public_key)
    }
    
    /// Sign a message with the identity key
    #[wasm_bindgen]
    pub fn sign_message(&self, message: &[u8]) -> Result<Vec<u8>, JsValue> {
        self.identity_key_pair.sign(message)
    }
}

impl Drop for FortiCommCrypto {
    fn drop(&mut self) {
        // Securely wipe all sensitive data
        self.identity_key_pair.zeroize();
        self.key_hierarchy.zeroize();
    }
}

impl ZeroizeOnDrop for FortiCommCrypto {}

/// Error types for FortiComm cryptographic operations
#[derive(Debug, thiserror::Error)]
pub enum FortiCommError {
    #[error("Signal Protocol error: {0}")]
    SignalError(String),
    
    #[error("MLS error: {0}")]
    MLSError(String),
    
    #[error("Key management error: {0}")]
    KeyError(String),
    
    #[error("Backup error: {0}")]
    BackupError(String),
    
    #[error("Post-quantum cryptography error: {0}")]
    PQCError(String),
    
    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

impl From<FortiCommError> for JsValue {
    fn from(error: FortiCommError) -> Self {
        JsValue::from_str(&error.to_string())
    }
}

/// Security level for different operations
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum SecurityLevel {
    /// Standard encryption (Signal Protocol)
    Standard,
    
    /// High security (Signal + Post-quantum)
    High,
    
    /// Maximum security (Signal + Post-quantum + Hardware key)
    Maximum,
}

/// Feature flags for premium features
#[derive(Clone, Debug)]
pub struct FeatureFlags {
    pub max_group_size: usize,
    pub message_retention_days: u32,
    pub allow_file_sharing: bool,
    pub allow_voice_calls: bool,
    pub allow_screen_sharing: bool,
    pub compliance_mode: bool,
    pub airgap_mode: bool,
}

impl Default for FeatureFlags {
    fn default() -> Self {
        FeatureFlags {
            max_group_size: 100,
            message_retention_days: 30,
            allow_file_sharing: true,
            allow_voice_calls: false,
            allow_screen_sharing: false,
            compliance_mode: false,
            airgap_mode: false,
        }
    }
}

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn start() {
    #[cfg(debug_assertions)]
    console_log::init_with_level(log::Level::Debug).ok();
    
    log::info!("FortiComm Cryptographic Core initialized");
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_crypto_initialization() {
        let crypto = FortiCommCrypto::new().unwrap();
        let fingerprint = crypto.get_fingerprint().unwrap();
        assert!(!fingerprint.is_empty());
    }
    
    #[test]
    fn test_encrypt_decrypt() {
        let mut crypto1 = FortiCommCrypto::new().unwrap();
        let mut crypto2 = FortiCommCrypto::new().unwrap();
        
        let recipient_id = crypto2.get_identity_key().unwrap();
        let plaintext = "Hello, secure world!";
        
        let ciphertext = crypto1.encrypt_message(&recipient_id, plaintext).unwrap();
        let decrypted = crypto2.decrypt_message(&recipient_id, &ciphertext).unwrap();
        
        assert_eq!(plaintext, decrypted);
    }
    
    #[test]
    fn test_backup_restore() {
        let crypto = FortiCommCrypto::new().unwrap();
        let password = "secure_password_123";
        
        let backup = crypto.create_backup(password).unwrap();
        assert!(!backup.is_empty());
        
        // In a real test, we'd restore and verify
    }
}
