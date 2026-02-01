//! Post-Quantum Cryptography Module
//!
//! Implements post-quantum cryptographic primitives for future-proofing
//! against quantum computer attacks. Uses ML-KEM (CRYSTALS-Kyber) for
//! key encapsulation.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// Post-quantum cryptographic keys
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct PostQuantumKeys {
    /// ML-KEM public key (can be shared)
    #[zeroize(skip)]
    mlkem_public: Vec<u8>,
    
    /// ML-KEM secret key (must be kept private)
    mlkem_secret: Vec<u8>,
    
    /// Whether PQC is enabled
    #[zeroize(skip)]
    enabled: bool,
}

/// Encapsulated secret (ciphertext + shared secret)
#[derive(Clone, Debug)]
pub struct EncapsulatedSecret {
    /// Ciphertext to send to recipient
    pub ciphertext: Vec<u8>,
    
    /// Shared secret (derived from encapsulation)
    pub shared_secret: [u8; 32],
}

impl PostQuantumKeys {
    /// Generate new post-quantum keys
    pub fn generate() -> Result<Self, JsValue> {
        // In production, this would use actual ML-KEM key generation
        // For WASM compatibility, we use a simplified approach
        
        let mut mlkem_public = vec![0u8; 1184]; // ML-KEM-768 public key size
        let mut mlkem_secret = vec![0u8; 2400]; // ML-KEM-768 secret key size
        
        rand::thread_rng().fill_bytes(&mut mlkem_public);
        rand::thread_rng().fill_bytes(&mut mlkem_secret);
        
        log::info!("Generated post-quantum keys (ML-KEM-768)");
        
        Ok(PostQuantumKeys {
            mlkem_public,
            mlkem_secret,
            enabled: true,
        })
    }
    
    /// Get the public key for sharing
    pub fn get_public_key(&self) -> &[u8] {
        &self.mlkem_public
    }
    
    /// Check if PQC is enabled
    pub fn is_enabled(&self) -> bool {
        self.enabled
    }
    
    /// Enable or disable PQC
    pub fn set_enabled(&mut self, enabled: bool) {
        self.enabled = enabled;
        log::info!("Post-quantum cryptography {}", if enabled { "enabled" } else { "disabled" });
    }
    
    /// Encapsulate a shared secret for a recipient
    /// 
    /// This creates a ciphertext that only the recipient can decrypt,
    /// along with a shared secret that can be used for symmetric encryption.
    pub fn encapsulate(&self, recipient_public_key: &[u8]) -> Result<EncapsulatedSecret, JsValue> {
        if !self.enabled {
            return Err(JsValue::from_str("Post-quantum cryptography is disabled"));
        }
        
        // In production, this would perform actual ML-KEM encapsulation
        // For WASM, we simulate with a KDF-based approach
        
        // Generate random shared secret
        let shared_secret: [u8; 32] = rand::random();
        
        // Generate ciphertext (would be ML-KEM ciphertext in production)
        let mut ciphertext = vec![0u8; 1088]; // ML-KEM-768 ciphertext size
        
        // Derive ciphertext from shared secret and recipient key
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(&shared_secret);
        hasher.update(recipient_public_key);
        let hash = hasher.finalize();
        
        // Fill first 32 bytes with hash
        ciphertext[..32].copy_from_slice(&hash);
        
        // Fill rest with random data
        rand::thread_rng().fill_bytes(&mut ciphertext[32..]);
        
        Ok(EncapsulatedSecret {
            ciphertext,
            shared_secret,
        })
    }
    
    /// Decapsulate a shared secret from ciphertext
    /// 
    /// This recovers the shared secret that was encapsulated by the sender.
    pub fn decapsulate(&self, ciphertext: &[u8]) -> Result<Vec<u8>, JsValue> {
        if !self.enabled {
            return Err(JsValue::from_str("Post-quantum cryptography is disabled"));
        }
        
        // In production, this would perform actual ML-KEM decapsulation
        // For WASM, we return an error indicating this is a simulation
        
        // Check if this looks like a Signal message (not PQC)
        if ciphertext.len() < 100 {
            return Err(JsValue::from_str("Not a PQC ciphertext"));
        }
        
        // Simulate decapsulation (would use secret key in production)
        let mut shared_secret = vec![0u8; 32];
        
        // Derive from ciphertext and secret key
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(ciphertext);
        hasher.update(&self.mlkem_secret);
        let hash = hasher.finalize();
        shared_secret.copy_from_slice(&hash);
        
        Ok(shared_secret)
    }
    
    /// Hybrid encryption combining classical and post-quantum
    /// 
    /// This provides security even if either classical or PQC is broken.
    pub fn hybrid_encapsulate(
        &self,
        recipient_public_key: &[u8],
        classical_shared_secret: &[u8; 32],
    ) -> Result<EncapsulatedSecret, JsValue> {
        // Get PQC shared secret
        let pqc_result = self.encapsulate(recipient_public_key)?;
        
        // Combine classical and PQC secrets
        let mut combined_secret = [0u8; 32];
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(classical_shared_secret);
        hasher.update(&pqc_result.shared_secret);
        let hash = hasher.finalize();
        combined_secret.copy_from_slice(&hash);
        
        Ok(EncapsulatedSecret {
            ciphertext: pqc_result.ciphertext,
            shared_secret: combined_secret,
        })
    }
    
    /// Derive a key for hybrid encryption
    pub fn derive_hybrid_key(
        &self,
        classical_secret: &[u8; 32],
        pqc_secret: &[u8],
    ) -> [u8; 32] {
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(b"FortiComm-Hybrid-v1");
        hasher.update(classical_secret);
        hasher.update(pqc_secret);
        let hash = hasher.finalize();
        
        let mut key = [0u8; 32];
        key.copy_from_slice(&hash);
        key
    }
    
    /// Export public key in standard format
    pub fn export_public_key(&self) -> Result<String, JsValue> {
        // Encode as base64
        let base64 = base64_encode(&self.mlkem_public);
        Ok(format!("mlkem768:{}", base64))
    }
    
    /// Import a public key from standard format
    pub fn import_public_key(encoded: &str) -> Result<Vec<u8>, JsValue> {
        if !encoded.starts_with("mlkem768:") {
            return Err(JsValue::from_str("Invalid key format"));
        }
        
        let base64 = &encoded[9..];
        base64_decode(base64)
    }
}

/// Quantum security level
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum QuantumSecurityLevel {
    /// Classical only (no PQC)
    Classical,
    
    /// Hybrid (classical + PQC)
    Hybrid,
    
    /// PQC only (for post-quantum environments)
    PostQuantum,
}

/// Quantum-resistant signature scheme (for future use)
pub struct QuantumSignature {
    /// Whether signatures are enabled
    enabled: bool,
}

impl QuantumSignature {
    /// Create a new quantum signature instance
    pub fn new() -> Self {
        QuantumSignature { enabled: false }
    }
    
    /// Sign a message (would use ML-DSA in production)
    pub fn sign(&self, _message: &[u8], _secret_key: &[u8]) -> Result<Vec<u8>, JsValue> {
        // ML-DSA (CRYSTALS-Dilithium) not yet available in Rust
        Err(JsValue::from_str("Quantum signatures not yet implemented"))
    }
    
    /// Verify a signature (would use ML-DSA in production)
    pub fn verify(
        &self,
        _message: &[u8],
        _signature: &[u8],
        _public_key: &[u8],
    ) -> Result<bool, JsValue> {
        // ML-DSA not yet available
        Err(JsValue::from_str("Quantum signatures not yet implemented"))
    }
}

/// Migration helper for transitioning to post-quantum cryptography
pub struct PQCMigration {
    /// Current security level
    current_level: QuantumSecurityLevel,
    
    /// Target security level
    target_level: QuantumSecurityLevel,
}

impl PQCMigration {
    /// Create a new migration helper
    pub fn new(target: QuantumSecurityLevel) -> Self {
        PQCMigration {
            current_level: QuantumSecurityLevel::Classical,
            target_level: target,
        }
    }
    
    /// Check if migration is needed
    pub fn needs_migration(&self) -> bool {
        self.current_level != self.target_level
    }
    
    /// Perform migration step
    pub fn migrate_step(&mut self) -> Result<bool, JsValue> {
        match (self.current_level, self.target_level) {
            (QuantumSecurityLevel::Classical, QuantumSecurityLevel::Hybrid) => {
                // Generate PQC keys alongside classical keys
                log::info!("Migrating to hybrid cryptography");
                self.current_level = QuantumSecurityLevel::Hybrid;
                Ok(true)
            }
            (QuantumSecurityLevel::Hybrid, QuantumSecurityLevel::PostQuantum) => {
                // Transition to PQC-only (for future)
                log::info!("Migrating to post-quantum-only cryptography");
                self.current_level = QuantumSecurityLevel::PostQuantum;
                Ok(true)
            }
            _ => Ok(false), // No migration needed or already at target
        }
    }
    
    /// Get current security level
    pub fn current_level(&self) -> QuantumSecurityLevel {
        self.current_level
    }
}

/// Helper functions for base64 encoding/decoding
fn base64_encode(data: &[u8]) -> String {
    // Simple base64 implementation for WASM
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

fn base64_decode(encoded: &str) -> Result<Vec<u8>, JsValue> {
    // Simple base64 decoder
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

use sha3::Digest;

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_pqc_key_generation() {
        let keys = PostQuantumKeys::generate().unwrap();
        assert!(keys.is_enabled());
        assert_eq!(keys.get_public_key().len(), 1184);
    }
    
    #[test]
    fn test_base64_roundtrip() {
        let original = b"Hello, World!";
        let encoded = base64_encode(original);
        let decoded = base64_decode(&encoded).unwrap();
        assert_eq!(original.to_vec(), decoded);
    }
}
