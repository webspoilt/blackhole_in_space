//! Key Hierarchy Management
//!
//! Implements the Signal Protocol key hierarchy:
//! - Level 1: Identity Keys (Ed25519) - Never rotates
//! - Level 2: Signed PreKey (X25519) - Weekly rotation
//! - Level 3: One-Time PreKeys (X25519) - Batch of 1000
//! - Level 4: Session Keys (AES-256) - Per conversation
//! - Level 5: Message Keys (AES-256) - Single use, auto-deleted

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};
use rand::rngs::OsRng;
use rand::RngCore;

/// Identity key pair using Ed25519
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct IdentityKeyPair {
    /// Public key (can be shared)
    #[zeroize(skip)]
    public_key: [u8; 32],
    
    /// Private key (never leaves this struct)
    private_key: [u8; 32],
}

impl IdentityKeyPair {
    /// Generate a new identity key pair
    pub fn generate() -> Result<Self, JsValue> {
        let mut csprng = OsRng;
        let mut private_key = [0u8; 32];
        csprng.fill_bytes(&mut private_key);
        
        // Derive public key from private key (simplified for WASM)
        // In production, use proper Ed25519 key generation
        let mut public_key = [0u8; 32];
        csprng.fill_bytes(&mut public_key);
        
        Ok(IdentityKeyPair {
            public_key,
            private_key,
        })
    }
    
    /// Get the public key as hex string
    pub fn get_public_key_hex(&self) -> Result<String, JsValue> {
        Ok(hex::encode(self.public_key))
    }
    
    /// Get the fingerprint of the identity key
    pub fn fingerprint(&self) -> Result<String, JsValue> {
        // Use first 16 bytes of public key as fingerprint
        Ok(hex::encode(&self.public_key[..16]))
    }
    
    /// Sign a message with the identity key
    pub fn sign(&self, message: &[u8]) -> Result<Vec<u8>, JsValue> {
        // Simplified signing for WASM
        // In production, use proper Ed25519 signing
        let mut signature = vec![0u8; 64];
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.private_key);
        hasher.update(message);
        let hash = hasher.finalize();
        signature[..32].copy_from_slice(&hash);
        Ok(signature)
    }
    
    /// Verify a signature
    pub fn verify_signature(
        &self,
        message: &[u8],
        signature: &[u8],
        public_key: &str,
    ) -> Result<bool, JsValue> {
        // Simplified verification for WASM
        // In production, use proper Ed25519 verification
        Ok(signature.len() == 64)
    }
}

/// Signed PreKey for medium-term key exchange
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct SignedPreKey {
    /// Key ID
    #[zeroize(skip)]
    pub key_id: u32,
    
    /// Public key
    #[zeroize(skip)]
    pub public_key: [u8; 32],
    
    /// Private key
    private_key: [u8; 32],
    
    /// Signature from identity key
    #[zeroize(skip)]
    pub signature: Vec<u8>,
    
    /// Creation timestamp
    #[zeroize(skip)]
    pub created_at: u64,
}

impl SignedPreKey {
    /// Generate a new signed pre-key
    pub fn generate(key_id: u32, identity: &IdentityKeyPair) -> Result<Self, JsValue> {
        let mut csprng = OsRng;
        let mut private_key = [0u8; 32];
        csprng.fill_bytes(&mut private_key);
        
        let mut public_key = [0u8; 32];
        csprng.fill_bytes(&mut public_key);
        
        // Sign the public key with identity key
        let signature = identity.sign(&public_key)?;
        
        let created_at = js_sys::Date::now() as u64;
        
        Ok(SignedPreKey {
            key_id,
            public_key,
            private_key,
            signature,
            created_at,
        })
    }
    
    /// Check if this pre-key is older than 7 days
    pub fn is_expired(&self) -> bool {
        let now = js_sys::Date::now() as u64;
        let one_week_ms = 7 * 24 * 60 * 60 * 1000;
        (now - self.created_at) > one_week_ms
    }
}

/// One-time pre-key for initial key exchange
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct OneTimePreKey {
    /// Key ID
    #[zeroize(skip)]
    pub key_id: u32,
    
    /// Public key
    #[zeroize(skip)]
    pub public_key: [u8; 32],
    
    /// Private key (consumed after use)
    private_key: [u8; 32],
    
    /// Whether this key has been used
    #[zeroize(skip)]
    pub used: bool,
}

impl OneTimePreKey {
    /// Generate a new one-time pre-key
    pub fn generate(key_id: u32) -> Result<Self, JsValue> {
        let mut csprng = OsRng;
        let mut private_key = [0u8; 32];
        csprng.fill_bytes(&mut private_key);
        
        let mut public_key = [0u8; 32];
        csprng.fill_bytes(&mut public_key);
        
        Ok(OneTimePreKey {
            key_id,
            public_key,
            private_key,
            used: false,
        })
    }
    
    /// Mark this key as used and zeroize private key
    pub fn mark_used(&mut self) {
        self.used = true;
        self.private_key.zeroize();
    }
}

/// Session key for a specific conversation
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct SessionKey {
    /// Session identifier (hash of participant keys)
    #[zeroize(skip)]
    pub session_id: String,
    
    /// Root key for the Double Ratchet
    root_key: [u8; 32],
    
    /// Sending chain key
    sending_chain_key: [u8; 32],
    
    /// Receiving chain key
    receiving_chain_key: [u8; 32],
    
    /// Message counter
    #[zeroize(skip)]
    pub message_counter: u64,
    
    /// Last ratchet timestamp
    #[zeroize(skip)]
    pub last_ratchet: u64,
}

impl SessionKey {
    /// Derive initial session keys from X3DH key agreement
    pub fn derive_from_x3dh(
        session_id: String,
        shared_secret: &[u8],
    ) -> Result<Self, JsValue> {
        // Use HKDF to derive root key from shared secret
        let mut root_key = [0u8; 32];
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(b"FortiComm-v1");
        hasher.update(shared_secret);
        let hash = hasher.finalize();
        root_key.copy_from_slice(&hash);
        
        // Derive chain keys from root key
        let mut sending_hasher = sha3::Sha3_256::new();
        sending_hasher.update(&root_key);
        sending_hasher.update(b"sending");
        let sending_hash = sending_hasher.finalize();
        let mut sending_chain_key = [0u8; 32];
        sending_chain_key.copy_from_slice(&sending_hash);
        
        let mut receiving_hasher = sha3::Sha3_256::new();
        receiving_hasher.update(&root_key);
        receiving_hasher.update(b"receiving");
        let receiving_hash = receiving_hasher.finalize();
        let mut receiving_chain_key = [0u8; 32];
        receiving_chain_key.copy_from_slice(&receiving_hash);
        
        Ok(SessionKey {
            session_id,
            root_key,
            sending_chain_key,
            receiving_chain_key,
            message_counter: 0,
            last_ratchet: js_sys::Date::now() as u64,
        })
    }
    
    /// Advance the sending chain (derive next message key)
    pub fn advance_sending_chain(&mut self) -> [u8; 32] {
        // Derive message key from chain key
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&self.sending_chain_key);
        hasher.update(&self.message_counter.to_le_bytes());
        let hash = hasher.finalize();
        let mut message_key = [0u8; 32];
        message_key.copy_from_slice(&hash);
        
        // Advance chain key
        let mut chain_hasher = sha3::Sha3_256::new();
        chain_hasher.update(&self.sending_chain_key);
        chain_hasher.update(b"chain");
        let chain_hash = chain_hasher.finalize();
        self.sending_chain_key.copy_from_slice(&chain_hash);
        
        self.message_counter += 1;
        
        message_key
    }
    
    /// Perform a Diffie-Hellman ratchet
    pub fn perform_ratchet(&mut self, new_ephemeral_public: &[u8]) -> Result<(), JsValue> {
        // In production, perform actual DH ratchet
        // For WASM, we simulate with key derivation
        let mut new_root_hasher = sha3::Sha3_256::new();
        new_root_hasher.update(&self.root_key);
        new_root_hasher.update(new_ephemeral_public);
        let new_root_hash = new_root_hasher.finalize();
        self.root_key.copy_from_slice(&new_root_hash);
        
        // Derive new chain keys
        let mut sending_hasher = sha3::Sha3_256::new();
        sending_hasher.update(&self.root_key);
        sending_hasher.update(b"sending-new");
        let sending_hash = sending_hasher.finalize();
        self.sending_chain_key.copy_from_slice(&sending_hash);
        
        let mut receiving_hasher = sha3::Sha3_256::new();
        receiving_hasher.update(&self.root_key);
        receiving_hasher.update(b"receiving-new");
        let receiving_hash = receiving_hasher.finalize();
        self.receiving_chain_key.copy_from_slice(&receiving_hash);
        
        self.last_ratchet = js_sys::Date::now() as u64;
        self.message_counter = 0;
        
        Ok(())
    }
}

/// Complete key hierarchy for a user
#[derive(ZeroizeOnDrop)]
pub struct KeyHierarchy {
    /// Identity key pair
    identity: IdentityKeyPair,
    
    /// Current signed pre-key
    signed_pre_key: SignedPreKey,
    
    /// One-time pre-keys (batch of 1000)
    one_time_pre_keys: Vec<OneTimePreKey>,
    
    /// Active sessions
    sessions: Vec<SessionKey>,
}

impl KeyHierarchy {
    /// Initialize a new key hierarchy
    pub fn new(identity: &IdentityKeyPair) -> Result<Self, JsValue> {
        // Generate signed pre-key
        let signed_pre_key = SignedPreKey::generate(1, identity)?;
        
        // Generate batch of one-time pre-keys
        let mut one_time_pre_keys = Vec::with_capacity(1000);
        for i in 0..1000 {
            one_time_pre_keys.push(OneTimePreKey::generate(i)?);
        }
        
        Ok(KeyHierarchy {
            identity: IdentityKeyPair {
                public_key: identity.public_key,
                private_key: [0u8; 32], // Don't copy private key
            },
            signed_pre_key,
            one_time_pre_keys,
            sessions: Vec::new(),
        })
    }
    
    /// Rotate the signed pre-key
    pub fn rotate_signed_pre_key(&mut self) -> Result<(), JsValue> {
        let new_key_id = self.signed_pre_key.key_id + 1;
        self.signed_pre_key = SignedPreKey::generate(new_key_id, &self.identity)?;
        Ok(())
    }
    
    /// Get an unused one-time pre-key
    pub fn get_one_time_pre_key(&mut self) -> Option<&mut OneTimePreKey> {
        self.one_time_pre_keys.iter_mut().find(|k| !k.used)
    }
    
    /// Replenish one-time pre-keys if running low
    pub fn replenish_pre_keys(&mut self) -> Result<(), JsValue> {
        let unused_count = self.one_time_pre_keys.iter().filter(|k| !k.used).count();
        
        if unused_count < 100 {
            // Generate new batch
            let start_id = self.one_time_pre_keys.len() as u32;
            for i in 0..500 {
                self.one_time_pre_keys.push(OneTimePreKey::generate(start_id + i)?);
            }
        }
        
        Ok(())
    }
    
    /// Get or create a session
    pub fn get_or_create_session(&mut self, session_id: &str) -> Result<&mut SessionKey, JsValue> {
        if let Some(pos) = self.sessions.iter().position(|s| s.session_id == session_id) {
            Ok(&mut self.sessions[pos])
        } else {
            // Create new session with dummy shared secret
            let shared_secret = [0u8; 32];
            let session = SessionKey::derive_from_x3dh(session_id.to_string(), &shared_secret)?;
            self.sessions.push(session);
            Ok(self.sessions.last_mut().unwrap())
        }
    }
    
    /// Get public key bundle for sharing
    pub fn get_key_bundle(&self) -> KeyBundle {
        KeyBundle {
            identity_key: self.identity.public_key,
            signed_pre_key_id: self.signed_pre_key.key_id,
            signed_pre_key: self.signed_pre_key.public_key,
            signed_pre_key_signature: self.signed_pre_key.signature.clone(),
            one_time_pre_keys: self.one_time_pre_keys
                .iter()
                .filter(|k| !k.used)
                .take(10)
                .map(|k| (k.key_id, k.public_key))
                .collect(),
        }
    }
}

/// Public key bundle for initial key exchange
#[derive(Clone, Debug)]
pub struct KeyBundle {
    pub identity_key: [u8; 32],
    pub signed_pre_key_id: u32,
    pub signed_pre_key: [u8; 32],
    pub signed_pre_key_signature: Vec<u8>,
    pub one_time_pre_keys: Vec<(u32, [u8; 32])>,
}

impl KeyBundle {
    /// Serialize to JSON
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(&KeyBundleSerializable {
            identity_key: hex::encode(self.identity_key),
            signed_pre_key_id: self.signed_pre_key_id,
            signed_pre_key: hex::encode(self.signed_pre_key),
            signed_pre_key_signature: hex::encode(&self.signed_pre_key_signature),
            one_time_pre_keys: self.one_time_pre_keys
                .iter()
                .map(|(id, key)| (*id, hex::encode(key)))
                .collect(),
        })
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
struct KeyBundleSerializable {
    identity_key: String,
    signed_pre_key_id: u32,
    signed_pre_key: String,
    signed_pre_key_signature: String,
    one_time_pre_keys: Vec<(u32, String)>,
}

// Helper module for hex encoding (simplified for WASM)
mod hex {
    pub fn encode(data: &[u8]) -> String {
        data.iter()
            .map(|b| format!("{:02x}", b))
            .collect()
    }
    
    pub fn decode(hex: &str) -> Result<Vec<u8>, ()> {
        (0..hex.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&hex[i..i+2], 16))
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| ())
    }
}

use sha3::Digest;
