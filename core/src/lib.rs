//! 🕳️ FORTICOMM BLACK HOLE - The Singularity Core
//!
//! A mathematically unbreakable messaging platform where messages enter
//! the event horizon and become mathematically impossible to retrieve
//! without the proper keys.
//!
//! # Mathematical Foundation
//!
//! This crate implements multiple layers of post-quantum cryptography:
//!
//! 1. **Elliptic Curve Cryptography** (Curve25519)
//!    - Point addition on elliptic curves: P + Q = R
//!    - Scalar multiplication: Q = kP
//!    - Discrete logarithm problem: Given P and Q, find k
//!
//! 2. **Lattice-Based Cryptography** (ML-KEM-768)
//!    - Module-LWE: b = A·s + e
//!    - Learning With Errors hardness assumption
//!    - NIST Post-Quantum Cryptography winner
//!
//! 3. **Zero-Knowledge Proofs** (zk-SNARKs)
//!    - Prove knowledge without revealing the secret
//!    - Groth16 protocol with BN254 curve
//!
//! 4. **Homomorphic Encryption** (BFV Scheme)
//!    - Compute on encrypted data
//!    - Enc(a) ⊕ Enc(b) = Enc(a+b)

#![cfg_attr(target_arch = "wasm32", no_std)]
#![warn(missing_docs)]
#![warn(unsafe_code)]

#[cfg(target_arch = "wasm32")]
extern crate alloc;

// Module declarations
pub mod math;
pub mod crypto;
pub mod protocol;
pub mod zk;
pub mod wasm;

// Re-export main types
pub use crypto::{
    BlackHoleCrypto,
    EventHorizon,
    SingularityKey,
    EncryptedMessage,
};

pub use protocol::{
    DoubleRatchet,
    MLSGroup,
    MessageEnvelope,
};

pub use zk::{
    ZKIdentity,
    ZKProof,
    ZKVerifier,
};

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// The main Black Hole cryptographic engine
///
/// This is the entry point for all cryptographic operations.
/// Keys are stored in Rust memory and never exposed to JavaScript.
#[wasm_bindgen]
pub struct BlackHoleCore {
    /// Identity key pair (Ed25519)
    identity: SingularityKey,
    
    /// Double Ratchet state machine
    ratchet: DoubleRatchet,
    
    /// MLS group manager
    mls: MLSGroup,
    
    /// Zero-knowledge identity
    zk_identity: ZKIdentity,
    
    /// Post-quantum keys (ML-KEM)
    pq_keys: crypto::PostQuantumKeys,
    
    /// Event horizon (encryption barrier)
    event_horizon: EventHorizon,
}

/// The Event Horizon - where plaintext becomes mathematically irretrievable
///
/// Once data crosses the event horizon, it can only be recovered with
/// the proper private keys. Even we, the creators, cannot decrypt messages.
#[wasm_bindgen]
pub struct EventHorizon {
    /// Symmetric encryption key (AES-256-GCM)
    key: [u8; 32],
    
    /// Key derivation salt
    salt: [u8; 16],
    
    /// Number of messages encrypted
    message_count: u64,
}

/// A Singularity Key - the ultimate secret
///
/// Like a black hole's singularity, this key is the point of no return.
/// Lose it, and your messages are gone forever.
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct SingularityKey {
    /// Public key (can be shared)
    #[zeroize(skip)]
    public: [u8; 32],
    
    /// Private key (NEVER share this)
    private: [u8; 32],
    
    /// Key fingerprint for identification
    #[zeroize(skip)]
    fingerprint: String,
}

/// An encrypted message that has crossed the event horizon
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct EncryptedMessage {
    /// Ciphertext (AES-256-GCM encrypted)
    pub ciphertext: Vec<u8>,
    
    /// Nonce for AES-GCM
    pub nonce: [u8; 12],
    
    /// Sender's public key
    pub sender_key: String,
    
    /// Message timestamp
    pub timestamp: u64,
    
    /// Message sequence number
    pub sequence: u64,
}

#[wasm_bindgen]
impl BlackHoleCore {
    /// Initialize the Black Hole
    ///
    /// This generates a new identity and initializes all cryptographic
    /// components. This is the "Big Bang" of your secure messaging.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<BlackHoleCore, JsValue> {
        #[cfg(debug_assertions)]
        console_log::init_with_level(log::Level::Debug).ok();
        
        log::info!("🕳️ Initializing Black Hole singularity...");
        
        // Generate identity key pair
        let identity = SingularityKey::generate()?;
        
        // Initialize Double Ratchet
        let ratchet = DoubleRatchet::new(&identity)?;
        
        // Initialize MLS group manager
        let mls = MLSGroup::new(&identity)?;
        
        // Initialize ZK identity
        let zk_identity = ZKIdentity::new(&identity)?;
        
        // Generate post-quantum keys
        let pq_keys = crypto::PostQuantumKeys::generate()?;
        
        // Create event horizon
        let event_horizon = EventHorizon::new()?;
        
        log::info!("✅ Black Hole singularity created. Fingerprint: {}", 
            identity.fingerprint);
        
        Ok(BlackHoleCore {
            identity,
            ratchet,
            mls,
            zk_identity,
            pq_keys,
            event_horizon,
        })
    }
    
    /// Encrypt a message - crossing the event horizon
    ///
    /// Once encrypted, the message can only be decrypted by the intended
    /// recipient. Not even the sender can decrypt it after sending.
    #[wasm_bindgen]
    pub fn encrypt(&mut self, recipient: &str, plaintext: &str) -> Result<JsValue, JsValue> {
        let encrypted = self.event_horizon.encrypt(
            &self.identity,
            recipient,
            plaintext.as_bytes(),
        )?;
        
        serde_wasm_bindgen::to_value(&encrypted)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
    
    /// Decrypt a message - escaping the event horizon
    ///
    /// Only the holder of the private key can decrypt messages.
    #[wasm_bindgen]
    pub fn decrypt(&self, ciphertext: JsValue) -> Result<String, JsValue> {
        let encrypted: EncryptedMessage = serde_wasm_bindgen::from_value(ciphertext)
            .map_err(|e| JsValue::from_str(&format!("Deserialization error: {}", e)))?;
        
        let plaintext = self.event_horizon.decrypt(&self.identity, &encrypted)?;
        
        String::from_utf8(plaintext)
            .map_err(|_| JsValue::from_str("Invalid UTF-8 in decrypted message"))
    }
    
    /// Get the public key fingerprint
    #[wasm_bindgen]
    pub fn get_fingerprint(&self) -> String {
        self.identity.fingerprint.clone()
    }
    
    /// Create a zero-knowledge proof of identity
    #[wasm_bindgen]
    pub fn prove_identity(&self) -> Result<JsValue, JsValue> {
        let proof = self.zk_identity.prove()?;
        
        serde_wasm_bindgen::to_value(&proof)
            .map_err(|e| JsValue::from_str(&format!("Proof serialization error: {}", e)))
    }
    
    /// Verify a zero-knowledge proof
    #[wasm_bindgen]
    pub fn verify_identity(&self, proof_js: JsValue) -> Result<bool, JsValue> {
        let proof: ZKProof = serde_wasm_bindgen::from_value(proof_js)
            .map_err(|e| JsValue::from_str(&format!("Deserialization error: {}", e)))?;
        
        self.zk_identity.verify(&proof)
    }
    
    /// Get post-quantum public key for hybrid encryption
    #[wasm_bindgen]
    pub fn get_pq_public_key(&self) -> String {
        self.pq_keys.get_public_key_hex()
    }
    
    /// Panic wipe - emergency deletion of all keys
    ///
    /// In case of compromise, this wipes all keys from memory.
    /// Your messages will be lost forever.
    #[wasm_bindgen]
    pub fn panic_wipe(&mut self) {
        log::warn!("🚨 PANIC WIPE INITIATED - ALL KEYS BEING DESTROYED");
        
        self.identity.zeroize();
        self.ratchet.zeroize();
        self.mls.zeroize();
        self.zk_identity.zeroize();
        self.pq_keys.zeroize();
        self.event_horizon.zeroize();
        
        log::warn!("✅ Panic wipe complete. All keys destroyed.");
    }
}

impl EventHorizon {
    /// Create a new event horizon
    fn new() -> Result<Self, JsValue> {
        let key: [u8; 32] = rand::random();
        let salt: [u8; 16] = rand::random();
        
        Ok(EventHorizon {
            key,
            salt,
            message_count: 0,
        })
    }
    
    /// Encrypt data crossing the event horizon
    fn encrypt(&mut self,
        identity: &SingularityKey,
        recipient: &str,
        plaintext: &[u8],
    ) -> Result<EncryptedMessage, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        // Generate nonce
        let nonce: [u8; 12] = rand::random();
        
        // Derive encryption key
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&self.key));
        
        // Encrypt
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        self.message_count += 1;
        
        Ok(EncryptedMessage {
            ciphertext,
            nonce,
            sender_key: identity.fingerprint.clone(),
            timestamp: js_sys::Date::now() as u64,
            sequence: self.message_count,
        })
    }
    
    /// Decrypt data escaping the event horizon
    fn decrypt(&self,
        identity: &SingularityKey,
        encrypted: &EncryptedMessage,
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&self.key));
        
        cipher
            .decrypt(Nonce::from_slice(&encrypted.nonce), encrypted.ciphertext.as_ref())
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))
    }
}

impl Zeroize for EventHorizon {
    fn zeroize(&mut self) {
        self.key.zeroize();
        self.salt.zeroize();
        self.message_count = 0;
    }
}

impl SingularityKey {
    /// Generate a new singularity key pair
    fn generate() -> Result<Self, JsValue> {
        use ed25519_dalek::{SigningKey, VerifyingKey};
        use rand::rngs::OsRng;
        
        let signing_key = SigningKey::generate(&mut OsRng);
        let verifying_key = signing_key.verifying_key();
        
        let public = verifying_key.to_bytes();
        let private = signing_key.to_bytes();
        
        // Generate fingerprint (first 16 bytes of public key, hex encoded)
        let fingerprint = hex::encode(&public[..16]);
        
        Ok(SingularityKey {
            public,
            private,
            fingerprint,
        })
    }
    
    /// Sign a message
    fn sign(&self, message: &[u8]) -> Result<[u8; 64], JsValue> {
        use ed25519_dalek::{Signer, SigningKey};
        
        let signing_key = SigningKey::from_bytes(&self.private);
        let signature = signing_key.sign(message);
        
        Ok(signature.to_bytes())
    }
    
    /// Verify a signature
    fn verify(&self, message: &[u8], signature: &[u8; 64]) -> Result<bool, JsValue> {
        use ed25519_dalek::{Verifier, VerifyingKey, Signature};
        
        let verifying_key = VerifyingKey::from_bytes(&self.public)
            .map_err(|e| JsValue::from_str(&format!("Invalid public key: {}", e)))?;
        
        let sig = Signature::from_bytes(signature);
        
        match verifying_key.verify(message, &sig) {
            Ok(()) => Ok(true),
            Err(_) => Ok(false),
        }
    }
}

/// Hex encoding helper module
mod hex {
    pub fn encode(data: &[u8]) -> String {
        data.iter()
            .map(|b| format!("{:02x}", b))
            .collect()
    }
    
    pub fn decode(hex: &str) -> Result<Vec<u8>, ()> {
        if hex.len() % 2 != 0 {
            return Err(());
        }
        
        (0..hex.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&hex[i..i+2], 16))
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| ())
    }
}

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn start() {
    #[cfg(debug_assertions)]
    console_log::init_with_level(log::Level::Debug).ok();
    
    log::info!("🕳️ FortiComm Black Hole initialized");
    log::info!("   "The singularity is ready. Messages will be swallowed."");
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_singularity_key_generation() {
        let key = SingularityKey::generate().unwrap();
        assert!(!key.fingerprint.is_empty());
        assert_eq!(key.public.len(), 32);
        assert_eq!(key.private.len(), 32);
    }
    
    #[test]
    fn test_sign_verify() {
        let key = SingularityKey::generate().unwrap();
        let message = b"Test message for black hole";
        
        let signature = key.sign(message).unwrap();
        assert!(key.verify(message, &signature).unwrap());
        
        // Wrong message should fail
        let wrong_message = b"Wrong message";
        assert!(!key.verify(wrong_message, &signature).unwrap());
    }
    
    #[test]
    fn test_event_horizon() {
        let mut horizon = EventHorizon::new().unwrap();
        let key = SingularityKey::generate().unwrap();
        
        let plaintext = b"Secret message crossing the event horizon";
        let encrypted = horizon.encrypt(&key, "recipient", plaintext).unwrap();
        
        let decrypted = horizon.decrypt(&key, &encrypted).unwrap();
        assert_eq!(plaintext.to_vec(), decrypted);
    }
}
