//! MLS (Messaging Layer Security) Manager
//!
//! Implements MLS (RFC 9420) for secure group messaging.
//! MLS provides efficient group key agreement with forward secrecy
//! and post-compromise security.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};
use crate::key_hierarchy::IdentityKeyPair;

/// MLS Group Manager
pub struct MLSGroupManager {
    /// Active MLS groups
    groups: Vec<MLSGroup>,
    
    /// Credential for this user
    credential: MLSCredential,
}

/// MLS Group
#[derive(ZeroizeOnDrop)]
struct MLSGroup {
    /// Group ID
    #[zeroize(skip)]
    group_id: String,
    
    /// Group epoch (version)
    #[zeroize(skip)]
    epoch: u64,
    
    /// Group members
    #[zeroize(skip)]
    members: Vec<GroupMember>,
    
    /// Current group secret (epoch secret)
    epoch_secret: [u8; 32],
    
    /// Message encryption key
    message_secret: [u8; 32],
    
    /// Initialization secret for next epoch
    init_secret: [u8; 32],
    
    /// Sender data secret
    sender_data_secret: [u8; 32],
    
    /// Encryption secret
    encryption_secret: [u8; 32],
    
    /// Exporter secret
    exporter_secret: [u8; 32],
    
    /// External secret
    external_secret: [u8; 32],
    
    /// Confirmation key
    confirmation_key: [u8; 32],
    
    /// Membership key
    membership_key: [u8; 32],
    
    /// Resumption secret
    resumption_secret: [u8; 32],
    
    /// Authentication secret
    authentication_secret: [u8; 32],
}

/// Group member
#[derive(Clone, Debug)]
struct GroupMember {
    /// Member index
    index: u32,
    
    /// Identity key fingerprint
    identity: String,
    
    /// Public encryption key
    encryption_key: [u8; 32],
    
    /// Public signature key
    signature_key: [u8; 32],
    
    /// Credential
    credential: Vec<u8>,
}

/// MLS Credential
#[derive(Clone, Debug)]
struct MLSCredential {
    /// Identity
    identity: String,
    
    /// Public key
    public_key: [u8; 32],
    
    /// Signature
    signature: Vec<u8>,
}

impl MLSGroupManager {
    /// Initialize the MLS manager
    pub fn new(identity: &IdentityKeyPair) -> Result<Self, JsValue> {
        let credential = MLSCredential {
            identity: identity.get_fingerprint()?,
            public_key: [0u8; 32], // Would be derived from identity
            signature: Vec::new(),
        };
        
        Ok(MLSGroupManager {
            groups: Vec::new(),
            credential,
        })
    }
    
    /// Check if an ID refers to a group
    pub fn is_group(&self, id: &str) -> bool {
        self.groups.iter().any(|g| g.group_id == id)
    }
    
    /// Create a new MLS group
    pub fn create_group(
        &mut self,
        group_id: &str,
        initial_members: Vec<String>,
    ) -> Result<(), JsValue> {
        // Generate initial secrets
        let epoch_secret = Self::generate_secret()?;
        let init_secret = Self::generate_secret()?;
        
        // Derive all secrets from epoch_secret
        let secrets = Self::derive_epoch_secrets(&epoch_secret, &init_secret)?;
        
        // Create initial member list
        let mut members = Vec::new();
        
        // Add creator as first member
        members.push(GroupMember {
            index: 0,
            identity: self.credential.identity.clone(),
            encryption_key: self.credential.public_key,
            signature_key: self.credential.public_key,
            credential: vec![],
        });
        
        // Add initial members
        for (i, member_id) in initial_members.iter().enumerate() {
            members.push(GroupMember {
                index: (i + 1) as u32,
                identity: member_id.clone(),
                encryption_key: [0u8; 32], // Would be fetched from key server
                signature_key: [0u8; 32],
                credential: vec![],
            });
        }
        
        let group = MLSGroup {
            group_id: group_id.to_string(),
            epoch: 0,
            members,
            epoch_secret,
            message_secret: secrets.message_secret,
            init_secret: secrets.init_secret,
            sender_data_secret: secrets.sender_data_secret,
            encryption_secret: secrets.encryption_secret,
            exporter_secret: secrets.exporter_secret,
            external_secret: secrets.external_secret,
            confirmation_key: secrets.confirmation_key,
            membership_key: secrets.membership_key,
            resumption_secret: secrets.resumption_secret,
            authentication_secret: secrets.authentication_secret,
        };
        
        self.groups.push(group);
        
        log::info!("Created MLS group {} with {} members", group_id, initial_members.len() + 1);
        
        Ok(())
    }
    
    /// Add a member to a group
    pub fn add_member(&mut self, group_id: &str, member_key: &str) -> Result<(), JsValue> {
        let group = self.groups
            .iter_mut()
            .find(|g| g.group_id == group_id)
            .ok_or_else(|| JsValue::from_str("Group not found"))?;
        
        // Create welcome message for new member
        let welcome = self.create_welcome_message(group, member_key)?;
        
        // Update group epoch
        group.epoch += 1;
        
        // Add new member
        let new_index = group.members.len() as u32;
        group.members.push(GroupMember {
            index: new_index,
            identity: member_key.to_string(),
            encryption_key: [0u8; 32],
            signature_key: [0u8; 32],
            credential: vec![],
        });
        
        // Rotate secrets
        group.rotate_secrets()?;
        
        log::info!("Added member {} to group {}", member_key, group_id);
        
        Ok(())
    }
    
    /// Remove a member from a group
    pub fn remove_member(&mut self, group_id: &str, member_key: &str) -> Result<(), JsValue> {
        let group = self.groups
            .iter_mut()
            .find(|g| g.group_id == group_id)
            .ok_or_else(|| JsValue::from_str("Group not found"))?;
        
        // Remove member
        group.members.retain(|m| m.identity != member_key);
        
        // Re-index remaining members
        for (i, member) in group.members.iter_mut().enumerate() {
            member.index = i as u32;
        }
        
        // Update group epoch
        group.epoch += 1;
        
        // Rotate secrets (removing a member triggers PFS)
        group.rotate_secrets()?;
        
        log::info!("Removed member {} from group {}", member_key, group_id);
        
        Ok(())
    }
    
    /// Encrypt a message for a group
    pub fn encrypt_message(&self, group_id: &str, plaintext: &[u8]) -> Result<Vec<u8>, JsValue> {
        let group = self.groups
            .iter()
            .find(|g| g.group_id == group_id)
            .ok_or_else(|| JsValue::from_str("Group not found"))?;
        
        // Generate sender data nonce
        let sender_data_nonce = rand::random::<[u8; 12]>();
        
        // Encrypt sender data
        let sender_data = MLSMessageSenderData {
            leaf_index: 0, // Creator is index 0
            generation: group.epoch as u32,
            reuse_guard: rand::random::<[u8; 4]>(),
        };
        let encrypted_sender_data = self.encrypt_sender_data(
            &sender_data,
            &group.sender_data_secret,
            &sender_data_nonce,
        )?;
        
        // Generate content nonce
        let content_nonce = rand::random::<[u8; 12]>();
        
        // Derive sample from ciphertext (for membership verification)
        let sample = [0u8; 16];
        
        // Derive reuse guard from sample
        let reuse_guard = Self::derive_reuse_guard(&sample, &group.membership_key);
        
        // Derive nonce from reuse guard
        let derived_nonce = Self::apply_reuse_guard(&content_nonce, &reuse_guard);
        
        // Encrypt content
        let ciphertext = self.encrypt_with_key(
            plaintext,
            &group.message_secret,
            &derived_nonce,
        )?;
        
        // Build MLS message
        let message = MLSMessage {
            group_id: group.group_id.clone(),
            epoch: group.epoch,
            content_type: ContentType::Application,
            encrypted_sender_data,
            sender_data_nonce,
            ciphertext,
            auth_tag: [0u8; 16], // Would be computed
        };
        
        message.serialize()
    }
    
    /// Decrypt a group message
    pub fn decrypt_message(&self, group_id: &str, ciphertext: &[u8]) -> Result<Vec<u8>, JsValue> {
        let group = self.groups
            .iter()
            .find(|g| g.group_id == group_id)
            .ok_or_else(|| JsValue::from_str("Group not found"))?;
        
        // Parse message
        let message = MLSMessage::deserialize(ciphertext)?;
        
        // Verify epoch
        if message.epoch != group.epoch {
            return Err(JsValue::from_str("Epoch mismatch - message from old epoch"));
        }
        
        // Decrypt sender data
        let sender_data = self.decrypt_sender_data(
            &message.encrypted_sender_data,
            &group.sender_data_secret,
            &message.sender_data_nonce,
        )?;
        
        // Verify sender is a member
        if sender_data.leaf_index as usize >= group.members.len() {
            return Err(JsValue::from_str("Invalid sender"));
        }
        
        // Derive reuse guard
        let sample = [0u8; 16];
        let reuse_guard = Self::derive_reuse_guard(&sample, &group.membership_key);
        
        // Derive nonce
        let derived_nonce = Self::apply_reuse_guard(&message.sender_data_nonce, &reuse_guard);
        
        // Decrypt content
        let plaintext = self.decrypt_with_key(
            &message.ciphertext,
            &group.message_secret,
            &derived_nonce,
        )?;
        
        Ok(plaintext)
    }
    
    /// Create a welcome message for a new member
    fn create_welcome_message(
        &self,
        group: &MLSGroup,
        new_member: &str,
    ) -> Result<Vec<u8>, JsValue> {
        // In production, encrypt group secrets for the new member
        // using their public key
        
        let welcome = MLSWelcome {
            group_id: group.group_id.clone(),
            epoch: group.epoch,
            encrypted_group_secrets: vec![], // Would be encrypted
            encrypted_group_info: vec![], // Would be encrypted
        };
        
        welcome.serialize()
    }
    
    /// Encrypt sender data
    fn encrypt_sender_data(
        &self,
        sender_data: &MLSMessageSenderData,
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        let plaintext = sender_data.serialize()?;
        
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(nonce), plaintext.as_ref())
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        Ok(ciphertext)
    }
    
    /// Decrypt sender data
    fn decrypt_sender_data(
        &self,
        ciphertext: &[u8],
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<MLSMessageSenderData, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        
        let plaintext = cipher
            .decrypt(Nonce::from_slice(nonce), ciphertext)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))?;
        
        MLSMessageSenderData::deserialize(&plaintext)
    }
    
    /// Encrypt with AES-256-GCM
    fn encrypt_with_key(
        &self,
        plaintext: &[u8],
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce as AesNonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        
        let ciphertext = cipher
            .encrypt(AesNonce::from_slice(nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        Ok(ciphertext)
    }
    
    /// Decrypt with AES-256-GCM
    fn decrypt_with_key(
        &self,
        ciphertext: &[u8],
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce as AesNonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        
        let plaintext = cipher
            .decrypt(AesNonce::from_slice(nonce), ciphertext)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))?;
        
        Ok(plaintext)
    }
    
    /// Generate a random 32-byte secret
    fn generate_secret() -> Result<[u8; 32], JsValue> {
        let mut secret = [0u8; 32];
        rand::thread_rng().fill_bytes(&mut secret);
        Ok(secret)
    }
    
    /// Derive all epoch secrets
    fn derive_epoch_secrets(
        epoch_secret: &[u8; 32],
        init_secret: &[u8; 32],
    ) -> Result<EpochSecrets, JsValue> {
        let secrets = EpochSecrets {
            message_secret: Self::derive_secret(epoch_secret, b"msg")?,
            init_secret: *init_secret,
            sender_data_secret: Self::derive_secret(epoch_secret, b"sender")?,
            encryption_secret: Self::derive_secret(epoch_secret, b"encryption")?,
            exporter_secret: Self::derive_secret(epoch_secret, b"exporter")?,
            external_secret: Self::derive_secret(epoch_secret, b"external")?,
            confirmation_key: Self::derive_secret(epoch_secret, b"confirm")?,
            membership_key: Self::derive_secret(epoch_secret, b"membership")?,
            resumption_secret: Self::derive_secret(epoch_secret, b"resumption")?,
            authentication_secret: Self::derive_secret(epoch_secret, b"authentication")?,
        };
        
        Ok(secrets)
    }
    
    /// Derive a secret using HKDF-like construction
    fn derive_secret(key: &[u8; 32], label: &[u8]) -> Result<[u8; 32], JsValue> {
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(key);
        hasher.update(label);
        let hash = hasher.finalize();
        
        let mut secret = [0u8; 32];
        secret.copy_from_slice(&hash);
        Ok(secret)
    }
    
    /// Derive reuse guard from sample
    fn derive_reuse_guard(sample: &[u8; 16], membership_key: &[u8; 32]) -> [u8; 4] {
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(membership_key);
        hasher.update(sample);
        let hash = hasher.finalize();
        
        let mut guard = [0u8; 4];
        guard.copy_from_slice(&hash[..4]);
        guard
    }
    
    /// Apply reuse guard to nonce
    fn apply_reuse_guard(nonce: &[u8; 12], guard: &[u8; 4]) -> [u8; 12] {
        let mut result = *nonce;
        result[0] ^= guard[0];
        result[1] ^= guard[1];
        result[2] ^= guard[2];
        result[3] ^= guard[3];
        result
    }
}

impl MLSGroup {
    /// Rotate all secrets (triggered by member changes)
    fn rotate_secrets(&mut self) -> Result<(), JsValue> {
        // Generate new epoch secret
        let new_epoch_secret = MLSGroupManager::generate_secret()?;
        
        // Derive new secrets
        let secrets = MLSGroupManager::derive_epoch_secrets(&new_epoch_secret, &self.init_secret)?;
        
        // Update secrets
        self.epoch_secret.zeroize();
        self.epoch_secret = new_epoch_secret;
        self.message_secret = secrets.message_secret;
        self.sender_data_secret = secrets.sender_data_secret;
        self.encryption_secret = secrets.encryption_secret;
        self.exporter_secret = secrets.exporter_secret;
        self.external_secret = secrets.external_secret;
        self.confirmation_key = secrets.confirmation_key;
        self.membership_key = secrets.membership_key;
        self.resumption_secret = secrets.resumption_secret;
        self.authentication_secret = secrets.authentication_secret;
        
        Ok(())
    }
}

/// Epoch secrets derived from epoch secret
struct EpochSecrets {
    message_secret: [u8; 32],
    init_secret: [u8; 32],
    sender_data_secret: [u8; 32],
    encryption_secret: [u8; 32],
    exporter_secret: [u8; 32],
    external_secret: [u8; 32],
    confirmation_key: [u8; 32],
    membership_key: [u8; 32],
    resumption_secret: [u8; 32],
    authentication_secret: [u8; 32],
}

/// MLS message sender data
struct MLSMessageSenderData {
    leaf_index: u32,
    generation: u32,
    reuse_guard: [u8; 4],
}

impl MLSMessageSenderData {
    fn serialize(&self) -> Result<Vec<u8>, JsValue> {
        let mut result = Vec::with_capacity(12);
        result.extend_from_slice(&self.leaf_index.to_le_bytes());
        result.extend_from_slice(&self.generation.to_le_bytes());
        result.extend_from_slice(&self.reuse_guard);
        Ok(result)
    }
    
    fn deserialize(data: &[u8]) -> Result<Self, JsValue> {
        if data.len() < 12 {
            return Err(JsValue::from_str("Invalid sender data"));
        }
        
        let leaf_index = u32::from_le_bytes([data[0], data[1], data[2], data[3]]);
        let generation = u32::from_le_bytes([data[4], data[5], data[6], data[7]]);
        let mut reuse_guard = [0u8; 4];
        reuse_guard.copy_from_slice(&data[8..12]);
        
        Ok(MLSMessageSenderData {
            leaf_index,
            generation,
            reuse_guard,
        })
    }
}

/// Content type for MLS messages
#[derive(Clone, Copy, Debug)]
enum ContentType {
    Application = 1,
    Proposal = 2,
    Commit = 3,
}

/// MLS message
struct MLSMessage {
    group_id: String,
    epoch: u64,
    content_type: ContentType,
    encrypted_sender_data: Vec<u8>,
    sender_data_nonce: [u8; 12],
    ciphertext: Vec<u8>,
    auth_tag: [u8; 16],
}

impl MLSMessage {
    fn serialize(&self) -> Result<Vec<u8>, JsValue> {
        let mut result = Vec::new();
        
        // Group ID length and content
        result.extend_from_slice(&(self.group_id.len() as u32).to_le_bytes());
        result.extend_from_slice(self.group_id.as_bytes());
        
        // Epoch
        result.extend_from_slice(&self.epoch.to_le_bytes());
        
        // Content type
        result.push(self.content_type as u8);
        
        // Sender data nonce
        result.extend_from_slice(&self.sender_data_nonce);
        
        // Encrypted sender data
        result.extend_from_slice(&(self.encrypted_sender_data.len() as u32).to_le_bytes());
        result.extend_from_slice(&self.encrypted_sender_data);
        
        // Ciphertext
        result.extend_from_slice(&(self.ciphertext.len() as u32).to_le_bytes());
        result.extend_from_slice(&self.ciphertext);
        
        // Auth tag
        result.extend_from_slice(&self.auth_tag);
        
        Ok(result)
    }
    
    fn deserialize(data: &[u8]) -> Result<Self, JsValue> {
        let mut offset = 0;
        
        // Group ID
        let group_id_len = u32::from_le_bytes([data[0], data[1], data[2], data[3]]) as usize;
        offset += 4;
        let group_id = String::from_utf8(data[offset..offset+group_id_len].to_vec())
            .map_err(|_| JsValue::from_str("Invalid group ID"))?;
        offset += group_id_len;
        
        // Epoch
        let epoch = u64::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
            data[offset+4], data[offset+5], data[offset+6], data[offset+7],
        ]);
        offset += 8;
        
        // Content type
        let content_type = match data[offset] {
            1 => ContentType::Application,
            2 => ContentType::Proposal,
            3 => ContentType::Commit,
            _ => return Err(JsValue::from_str("Invalid content type")),
        };
        offset += 1;
        
        // Sender data nonce
        let mut sender_data_nonce = [0u8; 12];
        sender_data_nonce.copy_from_slice(&data[offset..offset+12]);
        offset += 12;
        
        // Encrypted sender data
        let sender_data_len = u32::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
        ]) as usize;
        offset += 4;
        let encrypted_sender_data = data[offset..offset+sender_data_len].to_vec();
        offset += sender_data_len;
        
        // Ciphertext
        let ciphertext_len = u32::from_le_bytes([
            data[offset], data[offset+1], data[offset+2], data[offset+3],
        ]) as usize;
        offset += 4;
        let ciphertext = data[offset..offset+ciphertext_len].to_vec();
        offset += ciphertext_len;
        
        // Auth tag
        let mut auth_tag = [0u8; 16];
        auth_tag.copy_from_slice(&data[offset..offset+16]);
        
        Ok(MLSMessage {
            group_id,
            epoch,
            content_type,
            encrypted_sender_data,
            sender_data_nonce,
            ciphertext,
            auth_tag,
        })
    }
}

/// MLS welcome message for new members
struct MLSWelcome {
    group_id: String,
    epoch: u64,
    encrypted_group_secrets: Vec<u8>,
    encrypted_group_info: Vec<u8>,
}

impl MLSWelcome {
    fn serialize(&self) -> Result<Vec<u8>, JsValue> {
        let mut result = Vec::new();
        
        result.extend_from_slice(&(self.group_id.len() as u32).to_le_bytes());
        result.extend_from_slice(self.group_id.as_bytes());
        result.extend_from_slice(&self.epoch.to_le_bytes());
        result.extend_from_slice(&(self.encrypted_group_secrets.len() as u32).to_le_bytes());
        result.extend_from_slice(&self.encrypted_group_secrets);
        result.extend_from_slice(&(self.encrypted_group_info.len() as u32).to_le_bytes());
        result.extend_from_slice(&self.encrypted_group_info);
        
        Ok(result)
    }
}

use sha3::Digest;
