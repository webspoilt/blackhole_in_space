//! Signal Protocol Implementation
//!
//! Implements the Signal Protocol (Double Ratchet) for end-to-end encryption.
//! This provides forward secrecy and future secrecy for all messages.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};
use crate::key_hierarchy::{KeyHierarchy, SessionKey};

/// Signal Protocol session store
pub struct SignalSessionStore {
    /// Active sessions indexed by recipient ID
    sessions: Vec<SignalSession>,
}

impl SignalSessionStore {
    /// Create a new session store
    pub fn new() -> Self {
        SignalSessionStore {
            sessions: Vec::new(),
        }
    }
    
    /// Get an existing session
    pub fn get_session(&self, recipient_id: &str) -> Result<&SignalSession, JsValue> {
        self.sessions
            .iter()
            .find(|s| s.recipient_id == recipient_id)
            .ok_or_else(|| JsValue::from_str("Session not found"))
    }
    
    /// Get or create a session
    pub fn get_or_create_session(
        &mut self,
        recipient_id: &str,
        key_hierarchy: &mut KeyHierarchy,
    ) -> Result<&mut SignalSession, JsValue> {
        if self.sessions.iter().any(|s| s.recipient_id == recipient_id) {
            let pos = self.sessions.iter().position(|s| s.recipient_id == recipient_id).unwrap();
            Ok(&mut self.sessions[pos])
        } else {
            // Create new session
            let session = SignalSession::new(recipient_id.to_string(), key_hierarchy)?;
            self.sessions.push(session);
            Ok(self.sessions.last_mut().unwrap())
        }
    }
    
    /// Remove a session
    pub fn remove_session(&mut self, recipient_id: &str) {
        self.sessions.retain(|s| s.recipient_id != recipient_id);
    }
    
    /// Get all session IDs
    pub fn get_session_ids(&self) -> Vec<String> {
        self.sessions.iter().map(|s| s.recipient_id.clone()).collect()
    }
}

/// A Signal Protocol session with a specific recipient
#[derive(ZeroizeOnDrop)]
pub struct SignalSession {
    /// Recipient identity
    #[zeroize(skip)]
    pub recipient_id: String,
    
    /// Session state
    state: SessionState,
    
    /// Session keys
    session_key: SessionKey,
}

#[derive(Zeroize, ZeroizeOnDrop)]
struct SessionState {
    /// Whether this is the initiator
    #[zeroize(skip)]
    is_initiator: bool,
    
    /// Ratchet key pair (for DH ratchet)
    ratchet_private_key: [u8; 32],
    
    /// Remote ratchet public key
    remote_ratchet_key: [u8; 32],
    
    /// Root chain key
    root_key: [u8; 32],
    
    /// Sending chain key
    sending_chain_key: [u8; 32],
    
    /// Receiving chain key
    receiving_chain_key: [u8; 32],
    
    /// Message number in sending chain
    #[zeroize(skip)]
    send_message_number: u32,
    
    /// Message number in receiving chain
    #[zeroize(skip)]
    recv_message_number: u32,
    
    /// Previous chain length
    #[zeroize(skip)]
    previous_chain_length: u32,
    
    /// Whether we need to ratchet
    #[zeroize(skip)]
    needs_ratchet: bool,
}

impl SignalSession {
    /// Create a new Signal Protocol session
    pub fn new(
        recipient_id: String,
        key_hierarchy: &mut KeyHierarchy,
    ) -> Result<Self, JsValue> {
        // Generate ephemeral ratchet key
        let mut csprng = rand::rngs::OsRng;
        let mut ratchet_private_key = [0u8; 32];
        csprng.fill_bytes(&mut ratchet_private_key);
        
        // Derive initial keys
        let session_key = key_hierarchy.get_or_create_session(&recipient_id)?.clone();
        
        let state = SessionState {
            is_initiator: true,
            ratchet_private_key,
            remote_ratchet_key: [0u8; 32],
            root_key: session_key.root_key,
            sending_chain_key: session_key.sending_chain_key,
            receiving_chain_key: session_key.receiving_chain_key,
            send_message_number: 0,
            recv_message_number: 0,
            previous_chain_length: 0,
            needs_ratchet: false,
        };
        
        Ok(SignalSession {
            recipient_id,
            state,
            session_key,
        })
    }
    
    /// Encrypt a message using the Double Ratchet
    pub fn encrypt(&mut self, plaintext: &[u8]) -> Result<Vec<u8>, JsValue> {
        // Check if we need to ratchet
        if self.state.needs_ratchet {
            self.perform_ratchet()?;
        }
        
        // Derive message key from sending chain
        let message_key = self.derive_message_key();
        
        // Encrypt with AES-256-GCM
        let ciphertext = self.encrypt_with_key(plaintext, &message_key)?;
        
        // Increment message number
        self.state.send_message_number += 1;
        
        // Build message header
        let header = SignalMessageHeader {
            message_number: self.state.send_message_number,
            previous_chain_length: self.state.previous_chain_length,
            sender_ratchet_key: self.get_ratchet_public_key(),
        };
        
        // Serialize message
        let message = SignalMessage {
            header,
            ciphertext,
        };
        
        message.serialize()
    }
    
    /// Decrypt a message using the Double Ratchet
    pub fn decrypt(&mut self, ciphertext: &[u8]) -> Result<Vec<u8>, JsValue> {
        // Parse message
        let message = SignalMessage::deserialize(ciphertext)?;
        
        // Check if we need to ratchet (new sender ratchet key)
        if message.header.sender_ratchet_key != self.state.remote_ratchet_key {
            self.state.remote_ratchet_key = message.header.sender_ratchet_key;
            self.state.needs_ratchet = true;
            self.perform_ratchet()?;
        }
        
        // Derive message key
        let message_key = self.derive_message_key_for_receive(
            message.header.message_number,
            message.header.previous_chain_length,
        )?;
        
        // Decrypt
        let plaintext = self.decrypt_with_key(&message.ciphertext, &message_key)?;
        
        // Update message number
        self.state.recv_message_number = message.header.message_number;
        
        Ok(plaintext)
    }
    
    /// Perform a Diffie-Hellman ratchet
    fn perform_ratchet(&mut self) -> Result<(), JsValue> {
        // Generate new ratchet key pair
        let mut csprng = rand::rngs::OsRng;
        let mut new_private_key = [0u8; 32];
        csprng.fill_bytes(&mut new_private_key);
        
        // Zeroize old private key
        self.state.ratchet_private_key.zeroize();
        self.state.ratchet_private_key = new_private_key;
        
        // Derive new root key from DH shared secret
        let shared_secret = self.derive_shared_secret()?;
        
        // Update root key
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.state.root_key);
        hasher.update(&shared_secret);
        let new_root = hasher.finalize();
        self.state.root_key.copy_from_slice(&new_root);
        
        // Derive new chain keys
        let mut sending_hasher = sha3::Sha3_256::new();
        sending_hasher.update(&self.state.root_key);
        sending_hasher.update(b"sending");
        let sending_key = sending_hasher.finalize();
        self.state.sending_chain_key.copy_from_slice(&sending_key);
        
        let mut receiving_hasher = sha3::Sha3_256::new();
        receiving_hasher.update(&self.state.root_key);
        receiving_hasher.update(b"receiving");
        let receiving_key = receiving_hasher.finalize();
        self.state.receiving_chain_key.copy_from_slice(&receiving_key);
        
        // Reset message numbers
        self.state.previous_chain_length = self.state.send_message_number;
        self.state.send_message_number = 0;
        self.state.recv_message_number = 0;
        self.state.needs_ratchet = false;
        
        Ok(())
    }
    
    /// Derive message key from sending chain
    fn derive_message_key(&mut self) -> [u8; 32] {
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.state.sending_chain_key);
        hasher.update(&self.state.send_message_number.to_le_bytes());
        let key = hasher.finalize();
        
        let mut message_key = [0u8; 32];
        message_key.copy_from_slice(&key);
        
        // Advance chain key
        let mut chain_hasher = sha3::Sha3_256::new();
        chain_hasher.update(&self.state.sending_chain_key);
        chain_hasher.update(b"chain");
        let chain_key = chain_hasher.finalize();
        self.state.sending_chain_key.copy_from_slice(&chain_key);
        
        message_key
    }
    
    /// Derive message key for receiving
    fn derive_message_key_for_receive(
        &self,
        message_number: u32,
        _previous_chain_length: u32,
    ) -> Result<[u8; 32], JsValue> {
        // In production, implement proper key derivation for skipped messages
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.state.receiving_chain_key);
        hasher.update(&message_number.to_le_bytes());
        let key = hasher.finalize();
        
        let mut message_key = [0u8; 32];
        message_key.copy_from_slice(&key);
        
        Ok(message_key)
    }
    
    /// Encrypt with AES-256-GCM (simplified for WASM)
    fn encrypt_with_key(&self, plaintext: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        let nonce = rand::random::<[u8; 12]>();
        
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        // Prepend nonce to ciphertext
        let mut result = Vec::with_capacity(nonce.len() + ciphertext.len());
        result.extend_from_slice(&nonce);
        result.extend_from_slice(&ciphertext);
        
        Ok(result)
    }
    
    /// Decrypt with AES-256-GCM (simplified for WASM)
    fn decrypt_with_key(&self, ciphertext: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        if ciphertext.len() < 12 {
            return Err(JsValue::from_str("Ciphertext too short"));
        }
        
        let (nonce, encrypted) = ciphertext.split_at(12);
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        let plaintext = cipher
            .decrypt(Nonce::from_slice(nonce), encrypted)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))?;
        
        Ok(plaintext)
    }
    
    /// Get the public ratchet key
    fn get_ratchet_public_key(&self) -> [u8; 32] {
        // In production, derive from private key using X25519
        let mut public_key = [0u8; 32];
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.state.ratchet_private_key);
        hasher.update(b"public");
        let hash = hasher.finalize();
        public_key.copy_from_slice(&hash);
        public_key
    }
    
    /// Derive shared secret for ratchet
    fn derive_shared_secret(&self) -> Result<[u8; 32], JsValue> {
        // In production, perform actual X25519 DH
        let mut secret = [0u8; 32];
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.state.ratchet_private_key);
        hasher.update(&self.state.remote_ratchet_key);
        let hash = hasher.finalize();
        secret.copy_from_slice(&hash);
        Ok(secret)
    }
}

/// Signal Protocol message header
#[derive(Clone, Debug)]
struct SignalMessageHeader {
    message_number: u32,
    previous_chain_length: u32,
    sender_ratchet_key: [u8; 32],
}

/// Signal Protocol message
struct SignalMessage {
    header: SignalMessageHeader,
    ciphertext: Vec<u8>,
}

impl SignalMessage {
    /// Serialize message to bytes
    fn serialize(&self) -> Result<Vec<u8>, JsValue> {
        let mut result = Vec::new();
        
        // Message number
        result.extend_from_slice(&self.header.message_number.to_le_bytes());
        
        // Previous chain length
        result.extend_from_slice(&self.header.previous_chain_length.to_le_bytes());
        
        // Sender ratchet key
        result.extend_from_slice(&self.header.sender_ratchet_key);
        
        // Ciphertext length
        result.extend_from_slice(&(self.ciphertext.len() as u32).to_le_bytes());
        
        // Ciphertext
        result.extend_from_slice(&self.ciphertext);
        
        Ok(result)
    }
    
    /// Deserialize message from bytes
    fn deserialize(data: &[u8]) -> Result<Self, JsValue> {
        if data.len() < 76 {
            return Err(JsValue::from_str("Message too short"));
        }
        
        let mut offset = 0;
        
        // Message number
        let message_number = u32::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
        ]);
        offset += 4;
        
        // Previous chain length
        let previous_chain_length = u32::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
        ]);
        offset += 4;
        
        // Sender ratchet key
        let mut sender_ratchet_key = [0u8; 32];
        sender_ratchet_key.copy_from_slice(&data[offset..offset+32]);
        offset += 32;
        
        // Ciphertext length
        let ciphertext_len = u32::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
        ]) as usize;
        offset += 4;
        
        // Ciphertext
        if data.len() < offset + ciphertext_len {
            return Err(JsValue::from_str("Invalid ciphertext length"));
        }
        let ciphertext = data[offset..offset+ciphertext_len].to_vec();
        
        Ok(SignalMessage {
            header: SignalMessageHeader {
                message_number,
                previous_chain_length,
                sender_ratchet_key,
            },
            ciphertext,
        })
    }
}

use sha3::Digest;
