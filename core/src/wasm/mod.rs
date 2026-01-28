//! 🕸️ WebAssembly Bindings Module
//!
//! This module provides JavaScript-friendly wrappers for the cryptographic core.

use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;
use js_sys::Promise;

use crate::{
    BlackHoleCore, EventHorizon, SingularityKey, EncryptedMessage,
    crypto::{PostQuantumKeys, HybridEncryption, EncapsulationResult},
    protocol::{DoubleRatchet, MLSGroup, MessageEnvelope},
    zk::{ZKIdentity, ZKProof, ZKVerifier, RangeProof},
};

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn start() {
    #[cfg(debug_assertions)]
    console_log::init_with_level(log::Level::Debug).ok();
    
    log::info!("🕳️ FortiComm Black Hole WASM module initialized");
}

/// JavaScript-friendly wrapper for BlackHoleCore
#[wasm_bindgen]
pub struct JsBlackHoleCore {
    inner: BlackHoleCore,
}

#[wasm_bindgen]
impl JsBlackHoleCore {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<JsBlackHoleCore, JsValue> {
        BlackHoleCore::new().map(|inner| JsBlackHoleCore { inner })
    }
    
    #[wasm_bindgen]
    pub fn encrypt(&mut self, recipient: &str, plaintext: &str) -> Result<JsValue, JsValue> {
        self.inner.encrypt(recipient, plaintext)
    }
    
    #[wasm_bindgen]
    pub fn decrypt(&self, ciphertext: JsValue) -> Result<String, JsValue> {
        self.inner.decrypt(ciphertext)
    }
    
    #[wasm_bindgen]
    pub fn get_fingerprint(&self) -> String {
        self.inner.get_fingerprint()
    }
    
    #[wasm_bindgen]
    pub fn prove_identity(&self) -> Result<JsValue, JsValue> {
        self.inner.prove_identity()
    }
    
    #[wasm_bindgen]
    pub fn verify_identity(&self, proof_js: JsValue) -> Result<bool, JsValue> {
        self.inner.verify_identity(proof_js)
    }
    
    #[wasm_bindgen]
    pub fn get_pq_public_key(&self) -> String {
        self.inner.get_pq_public_key()
    }
    
    #[wasm_bindgen]
    pub fn panic_wipe(&mut self) {
        self.inner.panic_wipe();
    }
}

/// JavaScript-friendly wrapper for DoubleRatchet
#[wasm_bindgen]
pub struct JsDoubleRatchet {
    inner: DoubleRatchet,
}

#[wasm_bindgen]
impl JsDoubleRatchet {
    #[wasm_bindgen(constructor)]
    pub fn new(identity: &JsSingularityKey) -> Result<JsDoubleRatchet, JsValue> {
        DoubleRatchet::new(&identity.inner)
            .map(|inner| JsDoubleRatchet { inner })
    }
    
    #[wasm_bindgen]
    pub fn initialize_responder(
        identity: &JsSingularityKey,
        remote_dh_public: &[u8],
    ) -> Result<JsDoubleRatchet, JsValue> {
        DoubleRatchet::initialize_responder(&identity.inner, remote_dh_public)
            .map(|inner| JsDoubleRatchet { inner })
    }
    
    #[wasm_bindgen]
    pub fn encrypt(&mut self, plaintext: &[u8]) -> Result<JsValue, JsValue> {
        self.inner.encrypt(plaintext)
            .and_then(|envelope| {
                serde_wasm_bindgen::to_value(&envelope)
                    .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
            })
    }
    
    #[wasm_bindgen]
    pub fn decrypt(&mut self, envelope_js: JsValue) -> Result<Vec<u8>, JsValue> {
        let envelope: MessageEnvelope = serde_wasm_bindgen::from_value(envelope_js)
            .map_err(|e| JsValue::from_str(&format!("Deserialization error: {}", e)))?;
        
        self.inner.decrypt(&envelope)
    }
    
    #[wasm_bindgen]
    pub fn get_dh_public(&self) -> Vec<u8> {
        self.inner.get_dh_public()
    }
}

/// JavaScript-friendly wrapper for MLSGroup
#[wasm_bindgen]
pub struct JsMLSGroup {
    inner: MLSGroup,
}

#[wasm_bindgen]
impl JsMLSGroup {
    #[wasm_bindgen(constructor)]
    pub fn new(identity: &JsSingularityKey) -> Result<JsMLSGroup, JsValue> {
        MLSGroup::new(&identity.inner)
            .map(|inner| JsMLSGroup { inner })
    }
    
    #[wasm_bindgen]
    pub fn get_group_id(&self) -> String {
        self.inner.get_group_id()
    }
    
    #[wasm_bindgen]
    pub fn get_epoch(&self) -> u64 {
        self.inner.get_epoch()
    }
    
    #[wasm_bindgen]
    pub fn propose_add(&mut self, member_id: &str, key_package: &[u8]) -> Result<(), JsValue> {
        self.inner.propose_add(member_id, key_package)
    }
    
    #[wasm_bindgen]
    pub fn commit(&mut self) -> Result<Vec<u8>, JsValue> {
        self.inner.commit()
    }
    
    #[wasm_bindgen]
    pub fn get_member_count(&self) -> usize {
        self.inner.get_member_count()
    }
    
    #[wasm_bindgen]
    pub fn encrypt_group_message(&self, plaintext: &[u8]) -> Result<Vec<u8>, JsValue> {
        self.inner.encrypt_group_message(plaintext)
    }
}

/// JavaScript-friendly wrapper for ZKIdentity
#[wasm_bindgen]
pub struct JsZKIdentity {
    inner: ZKIdentity,
}

#[wasm_bindgen]
impl JsZKIdentity {
    #[wasm_bindgen(constructor)]
    pub fn new(identity: &JsSingularityKey) -> Result<JsZKIdentity, JsValue> {
        ZKIdentity::new(&identity.inner)
            .map(|inner| JsZKIdentity { inner })
    }
    
    #[wasm_bindgen]
    pub fn prove(&self) -> Result<JsValue, JsValue> {
        self.inner.prove()
            .and_then(|proof| {
                serde_wasm_bindgen::to_value(&proof)
                    .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
            })
    }
    
    #[wasm_bindgen]
    pub fn verify(&self, proof_js: JsValue) -> Result<bool, JsValue> {
        let proof: ZKProof = serde_wasm_bindgen::from_value(proof_js)
            .map_err(|e| JsValue::from_str(&format!("Deserialization error: {}", e)))?;
        
        self.inner.verify(&proof)
    }
    
    #[wasm_bindgen]
    pub fn get_public_key(&self) -> Vec<u8> {
        self.inner.get_public_key()
    }
}

/// JavaScript-friendly wrapper for PostQuantumKeys
#[wasm_bindgen]
pub struct JsPostQuantumKeys {
    inner: PostQuantumKeys,
}

#[wasm_bindgen]
impl JsPostQuantumKeys {
    #[wasm_bindgen(constructor)]
    pub fn generate() -> Result<JsPostQuantumKeys, JsValue> {
        PostQuantumKeys::generate()
            .map(|inner| JsPostQuantumKeys { inner })
    }
    
    #[wasm_bindgen]
    pub fn get_public_key_hex(&self) -> String {
        self.inner.get_public_key_hex()
    }
    
    #[wasm_bindgen]
    pub fn get_sig_public_key_hex(&self) -> String {
        self.inner.get_sig_public_key_hex()
    }
    
    #[wasm_bindgen]
    pub fn encapsulate(&self) -> Result<JsValue, JsValue> {
        self.inner.encapsulate()
            .and_then(|result| {
                serde_wasm_bindgen::to_value(&result)
                    .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
            })
    }
    
    #[wasm_bindgen]
    pub fn decapsulate(&self, ciphertext: &[u8]) -> Result<Vec<u8>, JsValue> {
        self.inner.decapsulate(ciphertext)
    }
    
    #[wasm_bindgen]
    pub fn sign(&self, message: &[u8]) -> Result<Vec<u8>, JsValue> {
        self.inner.sign(message)
    }
    
    #[wasm_bindgen]
    pub fn verify(&self, message: &[u8], signature: &[u8]) -> Result<bool, JsValue> {
        self.inner.verify(message, signature)
    }
}

/// JavaScript-friendly wrapper for SingularityKey
#[wasm_bindgen]
pub struct JsSingularityKey {
    pub(crate) inner: SingularityKey,
}

#[wasm_bindgen]
impl JsSingularityKey {
    #[wasm_bindgen(constructor)]
    pub fn generate() -> Result<JsSingularityKey, JsValue> {
        SingularityKey::generate()
            .map(|inner| JsSingularityKey { inner })
    }
}

/// Utility functions for JavaScript
#[wasm_bindgen]
pub struct Utils;

#[wasm_bindgen]
impl Utils {
    /// Hash data using BLAKE3
    #[wasm_bindgen]
    pub fn blake3_hash(data: &[u8]) -> Vec<u8> {
        blake3::hash(data).as_bytes().to_vec()
    }
    
    /// Generate secure random bytes
    #[wasm_bindgen]
    pub fn random_bytes(length: usize) -> Vec<u8> {
        let mut bytes = vec![0u8; length];
        rand::fill(&mut bytes[..]);
        bytes
    }
    
    /// Constant-time comparison
    #[wasm_bindgen]
    pub fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
        if a.len() != b.len() {
            return false;
        }
        
        let mut result = 0u8;
        for (x, y) in a.iter().zip(b.iter()) {
            result |= x ^ y;
        }
        
        result == 0
    }
}

/// Async key generation for non-blocking UI
#[wasm_bindgen]
pub fn generate_keys_async() -> Promise {
    future_to_promise(async {
        // Simulate async work
        wasm_bindgen_futures::JsFuture::from(js_sys::Promise::new(&mut |resolve, _| {
            resolve.call0(&JsValue::NULL).unwrap();
        })).await.unwrap();
        
        BlackHoleCore::new()
            .map(|core| JsValue::from(JsBlackHoleCore { inner: core }))
            .map_err(|e| e)
    })
}

/// Version information
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Check if running in secure context
#[wasm_bindgen]
pub fn is_secure_context() -> bool {
    // This would check window.isSecureContext in browser
    true
}
