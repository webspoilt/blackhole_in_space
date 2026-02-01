//! WebAssembly Bindings
//!
//! Exports the FortiComm cryptographic core to JavaScript via WebAssembly.
//! All crypto operations happen in Rust memory, keys never touch JS heap.

use wasm_bindgen::prelude::*;
use crate::FortiCommCrypto;

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn start() {
    // Set panic hook for better error messages
    console_error_panic_hook::set_once();
    
    // Initialize logging
    #[cfg(debug_assertions)]
    console_log::init_with_level(log::Level::Debug).ok();
    
    log::info!("FortiComm WASM module initialized");
}

/// JavaScript-exposed cryptographic interface
#[wasm_bindgen]
pub struct FortiCommWasm {
    inner: FortiCommCrypto,
}

#[wasm_bindgen]
impl FortiCommWasm {
    /// Create a new FortiComm instance
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<FortiCommWasm, JsValue> {
        let inner = FortiCommCrypto::new()?;
        Ok(FortiCommWasm { inner })
    }
    
    /// Encrypt a message
    /// 
    /// # Arguments
    /// * `recipient_id` - Recipient's identity key fingerprint
    /// * `plaintext` - Message to encrypt
    #[wasm_bindgen]
    pub fn encrypt(&mut self, recipient_id: &str, plaintext: &str) -> Result<Vec<u8>, JsValue> {
        self.inner.encrypt_message(recipient_id, plaintext)
    }
    
    /// Decrypt a message
    /// 
    /// # Arguments
    /// * `sender_id` - Sender's identity key fingerprint
    /// * `ciphertext` - Encrypted message
    #[wasm_bindgen]
    pub fn decrypt(&mut self, sender_id: &str, ciphertext: &[u8]) -> Result<String, JsValue> {
        self.inner.decrypt_message(sender_id, ciphertext)
    }
    
    /// Get the identity key fingerprint
    #[wasm_bindgen]
    pub fn get_fingerprint(&self) -> Result<String, JsValue> {
        self.inner.get_fingerprint()
    }
    
    /// Get the public identity key
    #[wasm_bindgen]
    pub fn get_identity_key(&self) -> Result<String, JsValue> {
        self.inner.get_identity_key()
    }
    
    /// Create an encrypted backup
    /// 
    /// # Arguments
    /// * `password` - Backup password (will be used with Argon2id)
    #[wasm_bindgen]
    pub fn create_backup(&self, password: &str) -> Result<String, JsValue> {
        self.inner.create_backup(password)
    }
    
    /// Restore from an encrypted backup
    /// 
    /// # Arguments
    /// * `backup_json` - JSON-encoded backup package
    /// * `password` - Backup password
    #[wasm_bindgen]
    pub fn restore_backup(&mut self, backup_json: &str, password: &str) -> Result<(), JsValue> {
        self.inner.restore_backup(backup_json, password)
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
        self.inner.create_group(group_id, initial_members)
    }
    
    /// Add a member to a group
    #[wasm_bindgen]
    pub fn add_group_member(&mut self, group_id: &str, member_key: &str) -> Result<(), JsValue> {
        self.inner.add_group_member(group_id, member_key)
    }
    
    /// Remove a member from a group
    #[wasm_bindgen]
    pub fn remove_group_member(&mut self, group_id: &str, member_key: &str) -> Result<(), JsValue> {
        self.inner.remove_group_member(group_id, member_key)
    }
    
    /// Encrypt a message for a group
    #[wasm_bindgen]
    pub fn encrypt_group_message(
        &mut self,
        group_id: &str,
        plaintext: &str,
    ) -> Result<Vec<u8>, JsValue> {
        self.inner.encrypt_message(group_id, plaintext)
    }
    
    /// Decrypt a group message
    #[wasm_bindgen]
    pub fn decrypt_group_message(
        &mut self,
        group_id: &str,
        ciphertext: &[u8],
    ) -> Result<String, JsValue> {
        self.inner.decrypt_message(group_id, ciphertext)
    }
    
    /// Sign a message
    #[wasm_bindgen]
    pub fn sign(&self, message: &[u8]) -> Result<Vec<u8>, JsValue> {
        self.inner.sign_message(message)
    }
    
    /// Verify a signature
    #[wasm_bindgen]
    pub fn verify(
        &self,
        message: &[u8],
        signature: &[u8],
        public_key: &str,
    ) -> Result<bool, JsValue> {
        self.inner.verify_signature(message, signature, public_key)
    }
    
    /// Rotate pre-keys (should be called weekly)
    #[wasm_bindgen]
    pub fn rotate_prekeys(&mut self) -> Result<(), JsValue> {
        self.inner.rotate_prekeys()
    }
    
    /// Check if an ID is a group
    #[wasm_bindgen]
    pub fn is_group(&self, id: &str) -> bool {
        self.inner.mls_manager.is_group(id)
    }
}

/// Security utilities exposed to JavaScript
#[wasm_bindgen]
pub struct SecurityUtils;

#[wasm_bindgen]
impl SecurityUtils {
    /// Generate a secure random string
    #[wasm_bindgen]
    pub fn random_string(length: usize) -> String {
        use rand::Rng;
        const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        let mut rng = rand::thread_rng();
        (0..length)
            .map(|_| CHARSET[rng.gen_range(0..CHARSET.len())] as char)
            .collect()
    }
    
    /// Generate a secure random bytes
    #[wasm_bindgen]
    pub fn random_bytes(length: usize) -> Vec<u8> {
        let mut bytes = vec![0u8; length];
        rand::thread_rng().fill_bytes(&mut bytes);
        bytes
    }
    
    /// Hash data with SHA-256
    #[wasm_bindgen]
    pub fn sha256(data: &[u8]) -> Vec<u8> {
        use sha3::Digest;
        let hash = sha3::Sha3_256::digest(data);
        hash.to_vec()
    }
    
    /// Hash data with SHA-512
    #[wasm_bindgen]
    pub fn sha512(data: &[u8]) -> Vec<u8> {
        use sha3::Digest;
        let hash = sha3::Sha3_512::digest(data);
        hash.to_vec()
    }
    
    /// Constant-time comparison (prevents timing attacks)
    #[wasm_bindgen]
    pub fn constant_time_compare(a: &[u8], b: &[u8]) -> bool {
        if a.len() != b.len() {
            return false;
        }
        
        let mut result = 0u8;
        for (x, y) in a.iter().zip(b.iter()) {
            result |= x ^ y;
        }
        
        result == 0
    }
    
    /// Encode bytes to hex string
    #[wasm_bindgen]
    pub fn to_hex(data: &[u8]) -> String {
        data.iter()
            .map(|b| format!("{:02x}", b))
            .collect()
    }
    
    /// Decode hex string to bytes
    #[wasm_bindgen]
    pub fn from_hex(hex: &str) -> Result<Vec<u8>, JsValue> {
        if hex.len() % 2 != 0 {
            return Err(JsValue::from_str("Invalid hex string length"));
        }
        
        (0..hex.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&hex[i..i+2], 16))
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| JsValue::from_str("Invalid hex character"))
    }
    
    /// Encode bytes to base64
    #[wasm_bindgen]
    pub fn to_base64(data: &[u8]) -> String {
        base64_encode(data)
    }
    
    /// Decode base64 to bytes
    #[wasm_bindgen]
    pub fn from_base64(encoded: &str) -> Result<Vec<u8>, JsValue> {
        base64_decode(encoded)
    }
}

/// Helper function for base64 encoding
fn base64_encode(data: &[u8]) -> String {
    const ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    
    let mut result = String::new();
    let mut i = 0;
    
    while i < data.len() {
        let b1 = data[i];
        let b2 = if i + 1 < data.len() { data[i + 1] } else { 0 };
        let b3 = if i + 2 < data.len() { data[i + 2] } else { 0 };
        
        let idx1 = (b1 >> 2) as usize;
        let idx2 = (((b1 & 0x3) << 4) | (b2 >> 4)) as usize;
        let idx3 = (((b2 & 0xF) << 2) | (b3 >> 6)) as usize;
        let idx4 = (b3 & 0x3F) as usize;
        
        result.push(ALPHABET[idx1] as char);
        result.push(ALPHABET[idx2] as char);
        
        if i + 1 < data.len() {
            result.push(ALPHABET[idx3] as char);
        } else {
            result.push('=');
        }
        
        if i + 2 < data.len() {
            result.push(ALPHABET[idx4] as char);
        } else {
            result.push('=');
        }
        
        i += 3;
    }
    
    result
}

/// Helper function for base64 decoding
fn base64_decode(encoded: &str) -> Result<Vec<u8>, JsValue> {
    let mut result = Vec::new();
    let mut buffer: u32 = 0;
    let mut bits_collected = 0;
    
    for c in encoded.chars() {
        if c == '=' {
            break;
        }
        
        let value = match c {
            'A'..='Z' => c as u8 - b'A',
            'a'..='z' => c as u8 - b'a' + 26,
            '0'..='9' => c as u8 - b'0' + 52,
            '+' => 62,
            '/' => 63,
            _ => return Err(JsValue::from_str("Invalid base64 character")),
        };
        
        buffer = (buffer << 6) | value as u32;
        bits_collected += 6;
        
        if bits_collected >= 8 {
            bits_collected -= 8;
            result.push((buffer >> bits_collected) as u8);
        }
    }
    
    Ok(result)
}

/// Memory management utilities
#[wasm_bindgen]
pub struct MemoryUtils;

#[wasm_bindgen]
impl MemoryUtils {
    /// Get WASM memory usage in bytes
    #[wasm_bindgen]
    pub fn memory_usage() -> usize {
        // This is a rough estimate
        std::mem::size_of::<FortiCommCrypto>()
    }
    
    /// Force garbage collection (if available)
    #[wasm_bindgen]
    pub fn gc() {
        // In WASM, GC is automatic
        log::debug!("Garbage collection requested");
    }
    
    /// Zero out a byte array (securely wipe)
    #[wasm_bindgen]
    pub fn secure_zero(data: &mut [u8]) {
        use zeroize::Zeroize;
        data.zeroize();
    }
}

/// Version information
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Get build information
#[wasm_bindgen]
pub fn build_info() -> String {
    format!(
        "FortiComm Core v{}\nBuilt: {}\nTarget: {}\nProfile: {}",
        env!("CARGO_PKG_VERSION"),
        env!("CARGO_PKG_BUILD_DATE"),
        env!("TARGET"),
        if cfg!(debug_assertions) { "debug" } else { "release" }
    )
}

/// Initialize panic hook
#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

// External dependencies for WASM
extern crate console_error_panic_hook;
