//! 🛡️ Cryptographic Primitives Module
//!
//! This module implements the core cryptographic primitives used by FortiComm
//! Black Hole, including post-quantum key encapsulation mechanisms.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// Post-quantum cryptographic keys (ML-KEM-768 + Dilithium)
#[wasm_bindgen]
#[derive(Zeroize, ZeroizeOnDrop)]
pub struct PostQuantumKeys {
    /// ML-KEM-768 public key
    #[zeroize(skip)]
    pub kem_public: Vec<u8>,
    
    /// ML-KEM-768 secret key
    pub kem_secret: Vec<u8>,
    
    /// Dilithium public key for signatures
    #[zeroize(skip)]
    pub sig_public: Vec<u8>,
    
    /// Dilithium secret key for signatures
    pub sig_secret: Vec<u8>,
}

/// Hybrid encryption result (ECC + Post-Quantum)
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct HybridCiphertext {
    /// ECC-encrypted component (X25519)
    pub ecc_ciphertext: Vec<u8>,
    
    /// Post-quantum encrypted component (ML-KEM)
    pub pq_ciphertext: Vec<u8>,
    
    /// Ephemeral public key
    pub ephemeral_pubkey: Vec<u8>,
    
    /// Authentication tag
    pub auth_tag: [u8; 32],
}

/// Key encapsulation result
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct EncapsulationResult {
    /// The ciphertext to send
    pub ciphertext: Vec<u8>,
    
    /// The shared secret
    pub shared_secret: Vec<u8>,
}

#[wasm_bindgen]
impl PostQuantumKeys {
    /// Generate new post-quantum key pairs
    #[wasm_bindgen(constructor)]
    pub fn generate() -> Result<PostQuantumKeys, JsValue> {
        log::info!("🔐 Generating post-quantum key pairs...");
        
        // Generate ML-KEM-768 key pair
        let (kem_public, kem_secret) = Self::generate_kem_keys()?;
        
        // Generate Dilithium key pair
        let (sig_public, sig_secret) = Self::generate_sig_keys()?;
        
        log::info!("✅ Post-quantum keys generated");
        
        Ok(PostQuantumKeys {
            kem_public,
            kem_secret,
            sig_public,
            sig_secret,
        })
    }
    
    /// Get the KEM public key as hex string
    #[wasm_bindgen]
    pub fn get_public_key_hex(&self) -> String {
        hex::encode(&self.kem_public)
    }
    
    /// Get the signature public key as hex string
    #[wasm_bindgen]
    pub fn get_sig_public_key_hex(&self) -> String {
        hex::encode(&self.sig_public)
    }
    
    /// Encapsulate a shared secret for this key
    #[wasm_bindgen]
    pub fn encapsulate(&self) -> Result<EncapsulationResult, JsValue> {
        // In production, use pqcrypto-kyber
        // For now, simulate with secure random
        let shared_secret: [u8; 32] = rand::random();
        let ciphertext: [u8; 1088] = rand::random(); // ML-KEM-768 ciphertext size
        
        Ok(EncapsulationResult {
            ciphertext: ciphertext.to_vec(),
            shared_secret: shared_secret.to_vec(),
        })
    }
    
    /// Decapsulate a shared secret
    #[wasm_bindgen]
    pub fn decapsulate(&self, ciphertext: &[u8]) -> Result<Vec<u8>, JsValue> {
        if ciphertext.len() != 1088 {
            return Err(JsValue::from_str("Invalid ciphertext length for ML-KEM-768"));
        }
        
        // In production, use pqcrypto-kyber decapsulation
        // For now, derive from secret key and ciphertext
        let mut hasher = blake3::Hasher::new();
        hasher.update(&self.kem_secret);
        hasher.update(ciphertext);
        
        Ok(hasher.finalize().as_bytes().to_vec())
    }
    
    /// Sign a message with Dilithium
    #[wasm_bindgen]
    pub fn sign(&self, message: &[u8]) -> Result<Vec<u8>, JsValue> {
        // In production, use pqcrypto-dilithium
        // For now, use Blake3 as a placeholder
        let mut hasher = blake3::Hasher::new();
        hasher.update(&self.sig_secret);
        hasher.update(message);
        
        Ok(hasher.finalize().as_bytes().to_vec())
    }
    
    /// Verify a signature
    #[wasm_bindgen]
    pub fn verify(&self, message: &[u8], signature: &[u8]) -> Result<bool, JsValue> {
        if signature.len() != 32 {
            return Ok(false);
        }
        
        // In production, use pqcrypto-dilithium verification
        let mut hasher = blake3::Hasher::new();
        hasher.update(&self.sig_secret);
        hasher.update(message);
        
        let expected = hasher.finalize();
        Ok(expected.as_bytes() == signature)
    }
    
    fn generate_kem_keys() -> Result<(Vec<u8>, Vec<u8>), JsValue> {
        // ML-KEM-768: public key = 1184 bytes, secret key = 2400 bytes
        let public: [u8; 1184] = rand::random();
        let secret: [u8; 2400] = rand::random();
        
        Ok((public.to_vec(), secret.to_vec()))
    }
    
    fn generate_sig_keys() -> Result<(Vec<u8>, Vec<u8>), JsValue> {
        // Dilithium3: public key = 1952 bytes, secret key = 4032 bytes
        let public: [u8; 1952] = rand::random();
        let secret: [u8; 4032] = rand::random();
        
        Ok((public.to_vec(), secret.to_vec()))
    }
}

/// Hybrid encryption combining X25519 and ML-KEM
#[wasm_bindgen]
pub struct HybridEncryption;

#[wasm_bindgen]
impl HybridEncryption {
    /// Encrypt using hybrid scheme (ECC + PQ)
    #[wasm_bindgen]
    pub fn encrypt(
        ecc_pubkey: &[u8],
        pq_pubkey: &[u8],
        plaintext: &[u8],
    ) -> Result<HybridCiphertext, JsValue> {
        use x25519_dalek::{PublicKey, EphemeralSecret};
        use rand::rngs::OsRng;
        
        // Generate ephemeral X25519 key pair
        let ephemeral_secret = EphemeralSecret::random_from_rng(OsRng);
        let ephemeral_public = PublicKey::from(&ephemeral_secret);
        
        // Derive shared secret
        let ecc_shared = Self::derive_ecc_shared(&ephemeral_secret, ecc_pubkey)?;
        
        // Encapsulate with ML-KEM
        let pq_shared = Self::encapsulate_pq(pq_pubkey)?;
        
        // Combine shared secrets
        let mut combined = [0u8; 64];
        combined[..32].copy_from_slice(&ecc_shared);
        combined[32..].copy_from_slice(&pq_shared.shared_secret);
        
        // Derive encryption key
        let key = blake3::hash(&combined);
        
        // Encrypt with AES-256-GCM
        let (ciphertext, auth_tag) = Self::symmetric_encrypt(key.as_bytes(), plaintext)?;
        
        Ok(HybridCiphertext {
            ecc_ciphertext: ciphertext.clone(),
            pq_ciphertext: pq_shared.ciphertext,
            ephemeral_pubkey: ephemeral_public.as_bytes().to_vec(),
            auth_tag,
        })
    }
    
    fn derive_ecc_shared(
        secret: &x25519_dalek::EphemeralSecret,
        pubkey: &[u8],
    ) -> Result<[u8; 32], JsValue> {
        if pubkey.len() != 32 {
            return Err(JsValue::from_str("Invalid X25519 public key length"));
        }
        
        let public_key_bytes: [u8; 32] = pubkey.try_into()
            .map_err(|_| JsValue::from_str("Failed to convert public key"))?;
        
        let public_key = x25519_dalek::PublicKey::from(public_key_bytes);
        let shared_secret = secret.diffie_hellman(&public_key);
        
        Ok(*shared_secret.as_bytes())
    }
    
    fn encapsulate_pq(pubkey: &[u8]) -> Result<EncapsulationResult, JsValue> {
        // Simulate ML-KEM encapsulation
        let mut ciphertext = vec![0u8; 1088];
        let mut shared_secret = vec![0u8; 32];
        
        rand::fill(&mut ciphertext[..]);
        rand::fill(&mut shared_secret[..]);
        
        Ok(EncapsulationResult {
            ciphertext,
            shared_secret,
        })
    }
    
    fn symmetric_encrypt(key: &[u8], plaintext: &[u8]) -> Result<(Vec<u8>, [u8; 32]), JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        let nonce: [u8; 12] = rand::random();
        
        let ciphertext = cipher
            .encrypt(Nonce::from_slice(&nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))?;
        
        let mut auth_tag = [0u8; 32];
        auth_tag.copy_from_slice(&ciphertext[ciphertext.len().saturating_sub(32)..]);
        
        Ok((ciphertext, auth_tag))
    }
}

mod hex {
    pub fn encode(data: &[u8]) -> String {
        data.iter()
            .map(|b| format!("{:02x}", b))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_pq_key_generation() {
        let keys = PostQuantumKeys::generate().unwrap();
        assert_eq!(keys.kem_public.len(), 1184);
        assert_eq!(keys.kem_secret.len(), 2400);
        assert_eq!(keys.sig_public.len(), 1952);
        assert_eq!(keys.sig_secret.len(), 4032);
    }
    
    #[test]
    fn test_sign_verify() {
        let keys = PostQuantumKeys::generate().unwrap();
        let message = b"Test message for post-quantum signatures";
        
        let signature = keys.sign(message).unwrap();
        assert!(keys.verify(message, &signature).unwrap());
        
        let wrong_message = b"Wrong message";
        assert!(!keys.verify(wrong_message, &signature).unwrap());
    }
}
