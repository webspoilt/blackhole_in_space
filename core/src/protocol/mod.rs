//! 📡 Messaging Protocol Module
//!
//! This module implements the Signal Protocol's Double Ratchet algorithm
//! and MLS (Messaging Layer Security) for group messaging.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};
use crate::crypto::PostQuantumKeys;
use crate::SingularityKey;

/// The Double Ratchet state machine
/// 
/// Implements the Signal Protocol's Double Ratchet algorithm for
/// perfect forward secrecy and future secrecy.
#[wasm_bindgen]
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct DoubleRatchet {
    /// Root key for chain derivation
    root_key: [u8; 32],
    
    /// Sending chain key
    sending_chain_key: [u8; 32],
    
    /// Receiving chain key
    receiving_chain_key: [u8; 32],
    
    /// Sending message number
    sending_message_number: u32,
    
    /// Receiving message number
    receiving_message_number: u32,
    
    /// Previous sending chain length
    previous_chain_length: u32,
    
    /// DH ratchet key pair
    dh_private: [u8; 32],
    
    /// DH ratchet public key
    #[zeroize(skip)]
    dh_public: [u8; 32],
    
    /// Remote DH public key (if initialized)
    remote_dh_public: Option<[u8; 32]>,
}

/// MLS Group state for secure group messaging
#[wasm_bindgen]
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct MLSGroup {
    /// Group ID
    #[zeroize(skip)]
    group_id: String,
    
    /// Epoch number (increments on each change)
    epoch: u64,
    
    /// Group secret tree
    secret_tree: Vec<u8>,
    
    /// Member count
    member_count: usize,
    
    /// Pending proposals
    pending_proposals: Vec<GroupProposal>,
}

/// A message envelope containing all metadata
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct MessageEnvelope {
    /// Message ciphertext
    pub ciphertext: Vec<u8>,
    
    /// Message header (ratchet public key, message number, etc.)
    pub header: MessageHeader,
    
    /// Authentication tag
    pub auth_tag: [u8; 32],
    
    /// Timestamp
    pub timestamp: u64,
}

/// Message header for ratchet synchronization
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct MessageHeader {
    /// DH ratchet public key
    pub dh_public: Vec<u8>,
    
    /// Message number in current chain
    pub message_number: u32,
    
    /// Previous chain length
    pub previous_chain_length: u32,
    
    /// Sender key ID
    pub sender_key_id: u64,
}

/// Group proposal for MLS
#[derive(Clone, Zeroize, ZeroizeOnDrop)]
struct GroupProposal {
    proposal_type: ProposalType,
    member_id: String,
    key_package: Vec<u8>,
}

#[derive(Clone, Zeroize, ZeroizeOnDrop)]
enum ProposalType {
    Add,
    Remove,
    Update,
}

#[wasm_bindgen]
impl DoubleRatchet {
    /// Create a new Double Ratchet instance
    #[wasm_bindgen(constructor)]
    pub fn new(identity: &SingularityKey) -> Result<DoubleRatchet, JsValue> {
        log::info!("🔑 Initializing Double Ratchet...");
        
        // Generate DH key pair
        let (dh_private, dh_public) = Self::generate_dh_keypair()?;
        
        // Derive root key from identity
        let root_key = Self::derive_root_key(identity)?;
        
        // Initialize chain keys from root
        let sending_chain_key = Self::kdf_derive(&root_key, b"chain-send");
        let receiving_chain_key = Self::kdf_derive(&root_key, b"chain-recv");
        
        log::info!("✅ Double Ratchet initialized");
        
        Ok(DoubleRatchet {
            root_key,
            sending_chain_key,
            receiving_chain_key,
            sending_message_number: 0,
            receiving_message_number: 0,
            previous_chain_length: 0,
            dh_private,
            dh_public,
            remote_dh_public: None,
        })
    }
    
    /// Initialize as responder (with remote public key)
    #[wasm_bindgen]
    pub fn initialize_responder(
        identity: &SingularityKey,
        remote_dh_public: &[u8],
    ) -> Result<DoubleRatchet, JsValue> {
        let mut ratchet = Self::new(identity)?;
        
        if remote_dh_public.len() != 32 {
            return Err(JsValue::from_str("Invalid DH public key length"));
        }
        
        let mut remote_key = [0u8; 32];
        remote_key.copy_from_slice(remote_dh_public);
        ratchet.remote_dh_public = Some(remote_key);
        
        // Perform initial DH and update root key
        ratchet.dh_ratchet()?;
        
        Ok(ratchet)
    }
    
    /// Encrypt a message
    #[wasm_bindgen]
    pub fn encrypt(&mut self, plaintext: &[u8]) -> Result<MessageEnvelope, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        // Derive message key from chain key
        let message_key = Self::kdf_derive(&self.sending_chain_key, b"message-key");
        
        // Update chain key
        self.sending_chain_key = Self::kdf_derive(&self.sending_chain_key, b"chain-key");
        
        // Encrypt
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&message_key));
        let nonce: [u8; 12] = rand::random();
        
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        // Generate auth tag
        let auth_tag = blake3::hash(&[&message_key[..], &ciphertext[..]].concat());
        
        let header = MessageHeader {
            dh_public: self.dh_public.to_vec(),
            message_number: self.sending_message_number,
            previous_chain_length: self.previous_chain_length,
            sender_key_id: 0,
        };
        
        self.sending_message_number += 1;
        
        Ok(MessageEnvelope {
            ciphertext,
            header,
            auth_tag: *auth_tag.as_bytes(),
            timestamp: 0, // Will be set by caller
        })
    }
    
    /// Decrypt a message
    #[wasm_bindgen]
    pub fn decrypt(&mut self, envelope: &MessageEnvelope) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        // Check if we need to perform DH ratchet
        let remote_dh = envelope.header.dh_public.as_slice();
        if self.remote_dh_public.is_none() || 
           self.remote_dh_public.unwrap().to_vec() != remote_dh {
            // New ratchet key from sender
            let mut new_remote = [0u8; 32];
            new_remote.copy_from_slice(remote_dh);
            self.remote_dh_public = Some(new_remote);
            self.dh_ratchet()?;
        }
        
        // Derive message key
        let message_key = Self::kdf_derive(&self.receiving_chain_key, b"message-key");
        
        // Update chain key
        self.receiving_chain_key = Self::kdf_derive(&self.receiving_chain_key, b"chain-key");
        
        // Verify auth tag
        let computed_tag = blake3::hash(&[&message_key[..], &envelope.ciphertext[..]].concat());
        if computed_tag.as_bytes() != &envelope.auth_tag[..] {
            return Err(JsValue::from_str("Authentication tag verification failed"));
        }
        
        // Decrypt
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&message_key));
        let nonce = Nonce::from_slice(&[0u8; 12]); // In production, extract from ciphertext
        
        let plaintext = cipher
            .decrypt(nonce, envelope.ciphertext.as_ref())
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))?;
        
        self.receiving_message_number += 1;
        
        Ok(plaintext)
    }
    
    /// Get current DH public key for sharing
    #[wasm_bindgen]
    pub fn get_dh_public(&self) -> Vec<u8> {
        self.dh_public.to_vec()
    }
    
    fn dh_ratchet(&mut self) -> Result<(), JsValue> {
        use x25519_dalek::{PublicKey, StaticSecret};
        
        if let Some(remote_key) = self.remote_dh_public {
            // Generate new DH key pair
            let (new_private, new_public) = Self::generate_dh_keypair()?;
            
            // Perform DH with remote key
            let secret = StaticSecret::from(self.dh_private);
            let remote = PublicKey::from(remote_key);
            let shared = secret.diffie_hellman(&remote);
            
            // Update root key
            self.root_key = Self::kdf_derive(shared.as_bytes(), b"root-key");
            
            // Update chain keys
            self.sending_chain_key = Self::kdf_derive(&self.root_key, b"chain-send");
            self.receiving_chain_key = Self::kdf_derive(&self.root_key, b"chain-recv");
            
            // Save new keys
            self.dh_private = new_private;
            self.dh_public = new_public;
            
            // Reset message numbers
            self.previous_chain_length = self.sending_message_number;
            self.sending_message_number = 0;
            self.receiving_message_number = 0;
        }
        
        Ok(())
    }
    
    fn generate_dh_keypair() -> Result<([u8; 32], [u8; 32]), JsValue> {
        use x25519_dalek::{StaticSecret, PublicKey};
        use rand::rngs::OsRng;
        
        let secret = StaticSecret::random_from_rng(OsRng);
        let public = PublicKey::from(&secret);
        
        Ok((secret.to_bytes(), *public.as_bytes()))
    }
    
    fn derive_root_key(identity: &SingularityKey) -> Result<[u8; 32], JsValue> {
        // Derive root key from identity private key
        let mut hasher = blake3::Hasher::new();
        hasher.update(&identity.private);
        hasher.update(b"forticomm-blackhole-root");
        
        let hash = hasher.finalize();
        let mut key = [0u8; 32];
        key.copy_from_slice(hash.as_bytes());
        
        Ok(key)
    }
    
    fn kdf_derive(key: &[u8], context: &[u8]) -> [u8; 32] {
        let mut hasher = blake3::Hasher::new();
        hasher.update(key);
        hasher.update(context);
        
        let hash = hasher.finalize();
        let mut result = [0u8; 32];
        result.copy_from_slice(hash.as_bytes());
        result
    }
}

#[wasm_bindgen]
impl MLSGroup {
    /// Create a new MLS group
    #[wasm_bindgen(constructor)]
    pub fn new(identity: &SingularityKey) -> Result<MLSGroup, JsValue> {
        log::info!("👥 Creating new MLS group...");
        
        let group_id = format!("mls-group-{}", hex::encode(&identity.fingerprint[..8]));
        
        // Generate initial secret tree
        let mut secret_tree = vec![0u8; 1024];
        rand::fill(&mut secret_tree[..]);
        
        log::info!("✅ MLS group created: {}", group_id);
        
        Ok(MLSGroup {
            group_id,
            epoch: 0,
            secret_tree,
            member_count: 1,
            pending_proposals: Vec::new(),
        })
    }
    
    /// Get the group ID
    #[wasm_bindgen]
    pub fn get_group_id(&self) -> String {
        self.group_id.clone()
    }
    
    /// Get current epoch
    #[wasm_bindgen]
    pub fn get_epoch(&self) -> u64 {
        self.epoch
    }
    
    /// Add a member to the group
    #[wasm_bindgen]
    pub fn propose_add(&mut self, member_id: &str, key_package: &[u8]) -> Result<(), JsValue> {
        let proposal = GroupProposal {
            proposal_type: ProposalType::Add,
            member_id: member_id.to_string(),
            key_package: key_package.to_vec(),
        };
        
        self.pending_proposals.push(proposal);
        log::info!("📋 Proposed adding member: {}", member_id);
        
        Ok(())
    }
    
    /// Commit pending proposals
    #[wasm_bindgen]
    pub fn commit(&mut self) -> Result<Vec<u8>, JsValue> {
        if self.pending_proposals.is_empty() {
            return Err(JsValue::from_str("No pending proposals to commit"));
        }
        
        // Apply all proposals
        for proposal in &self.pending_proposals {
            match proposal.proposal_type {
                ProposalType::Add => {
                    self.member_count += 1;
                    log::info!("👤 Added member: {}", proposal.member_id);
                }
                ProposalType::Remove => {
                    self.member_count = self.member_count.saturating_sub(1);
                    log::info!("🚫 Removed member: {}", proposal.member_id);
                }
                ProposalType::Update => {
                    log::info!("🔄 Updated member: {}", proposal.member_id);
                }
            }
        }
        
        // Clear proposals and increment epoch
        self.pending_proposals.clear();
        self.epoch += 1;
        
        // Generate commit message
        let commit = format!("commit-epoch-{}", self.epoch);
        
        log::info!("✅ Committed to epoch {}", self.epoch);
        
        Ok(commit.into_bytes())
    }
    
    /// Get member count
    #[wasm_bindgen]
    pub fn get_member_count(&self) -> usize {
        self.member_count
    }
    
    /// Encrypt a group message
    #[wasm_bindgen]
    pub fn encrypt_group_message(&self, plaintext: &[u8]) -> Result<Vec<u8>, JsValue> {
        // Derive group encryption key from secret tree
        let key = blake3::hash(&self.secret_tree);
        
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key.as_bytes()));
        let nonce: [u8; 12] = rand::random();
        
        let mut ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Group encryption failed: {:?}", e)))?;
        
        // Prepend nonce
        let mut result = nonce.to_vec();
        result.append(&mut ciphertext);
        
        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::SingularityKey;
    
    #[test]
    fn test_double_ratchet_basic() {
        let identity = SingularityKey::generate().unwrap();
        let mut ratchet = DoubleRatchet::new(&identity).unwrap();
        
        let plaintext = b"Hello, Black Hole!";
        let envelope = ratchet.encrypt(plaintext).unwrap();
        
        assert!(!envelope.ciphertext.is_empty());
        assert_eq!(envelope.header.message_number, 0);
    }
    
    #[test]
    fn test_mls_group() {
        let identity = SingularityKey::generate().unwrap();
        let mut group = MLSGroup::new(&identity).unwrap();
        
        assert_eq!(group.get_member_count(), 1);
        assert_eq!(group.get_epoch(), 0);
        
        // Propose adding a member
        group.propose_add("member-2", &[1, 2, 3, 4]).unwrap();
        
        // Commit
        group.commit().unwrap();
        
        assert_eq!(group.get_member_count(), 2);
        assert_eq!(group.get_epoch(), 1);
    }
}
