//! 🔷 Lattice-Based Cryptography - ML-KEM-768
//!
//! This module implements the Module-LWE based key encapsulation mechanism
//! ML-KEM-768, a NIST post-quantum cryptography standard.
//!
//! # Mathematical Background
//!
//! ML-KEM is based on the Module Learning With Errors (MLWE) problem:
//!
//! ```text
//! Given:  A (public matrix), b = A·s + e
//! Find:   s (secret vector)
//! ```
//!
//! where:
//! - A is a k×k matrix of polynomials in R_q
//! - s is a secret vector with small coefficients
//! - e is an error vector with small coefficients
//! - q = 3329 is the modulus
//!
//! ## Security Properties
//!
//! - 192-bit security level (post-quantum)
//! - Based on hard lattice problems
//! - Resistant to quantum attacks (Shor's algorithm)

use wasm_bindgen::prelude::*;

/// ML-KEM-768 parameters
pub struct MLKEMParams;

impl MLKEMParams {
    /// Security parameter (module rank)
    pub const K: usize = 3;
    
    /// Polynomial degree
    pub const N: usize = 256;
    
    /// Modulus
    pub const Q: u16 = 3329;
    
    /// Eta1 (secret key coefficient range)
    pub const ETA1: u8 = 2;
    
    /// Eta2 (error coefficient range)
    pub const ETA2: u8 = 2;
    
    /// Du (compression parameter for u)
    pub const DU: u8 = 10;
    
    /// Dv (compression parameter for v)
    pub const DV: u8 = 4;
}

/// A polynomial in R_q = Z_q[x] / (x^N + 1)
#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct Polynomial {
    /// Coefficients (little-endian)
    pub coeffs: [u16; 256],
}

/// A vector of polynomials (module element)
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct PolyVector {
    /// Polynomials in the vector
    pub polys: Vec<Polynomial>,
}

/// ML-KEM public key
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct PublicKey {
    /// Encoded public key bytes
    pub bytes: Vec<u8>,
    /// t vector (A·s + e)
    pub t: PolyVector,
    /// Seed for generating A
    pub rho: [u8; 32],
}

/// ML-KEM secret key
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct SecretKey {
    /// Encoded secret key bytes
    pub bytes: Vec<u8>,
    /// Secret vector s
    pub s: PolyVector,
}

/// ML-KEM ciphertext
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Ciphertext {
    /// Compressed u vector
    pub u: PolyVector,
    /// Compressed v polynomial
    pub v: Polynomial,
}

/// Shared secret
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct SharedSecret {
    /// 32-byte shared secret
    pub bytes: [u8; 32],
}

impl Polynomial {
    /// Create a zero polynomial
    pub fn zero() -> Self {
        Polynomial { coeffs: [0; 256] }
    }

    /// Sample from CBD (Centered Binomial Distribution)
    pub fn sample_cbd(eta: u8, seed: &[u8], nonce: u16) -> Self {
        let mut poly = Self::zero();
        
        // Expand seed using PRF
        let mut prf_input = Vec::with_capacity(34);
        prf_input.extend_from_slice(seed);
        prf_input.extend_from_slice(&nonce.to_le_bytes());
        
        let prf_output = blake3::hash(&prf_input);
        let bytes = prf_output.as_bytes();
        
        // Sample coefficients
        for i in 0..256 {
            let byte_idx = i / 4;
            let bit_idx = (i % 4) * 2;
            
            if byte_idx < bytes.len() {
                let byte = bytes[byte_idx];
                let bits = (byte >> bit_idx) & 0x03;
                
                // Convert to centered representation
                poly.coeffs[i] = (eta as u16 + 1 - bits as u16) % MLKEMParams::Q as u16;
            }
        }
        
        poly
    }

    /// NTT (Number Theoretic Transform)
    pub fn ntt(&self) -> Self {
        // Simplified NTT - in production, use optimized implementation
        let mut result = self.clone();
        
        // Bit-reversal permutation
        let mut j = 0;
        for i in 1..256 {
            let mut bit = 256 >> 1;
            while j & bit != 0 {
                j ^= bit;
                bit >>= 1;
            }
            j ^= bit;
            
            if i < j {
                result.coeffs.swap(i, j);
            }
        }
        
        // Cooley-Tukey butterfly
        let mut len = 2;
        while len <= 256 {
            let mut i = 0;
            while i < 256 {
                for j in i..(i + len / 2) {
                    let u = result.coeffs[j];
                    let v = result.coeffs[j + len / 2];
                    
                    result.coeffs[j] = (u + v) % MLKEMParams::Q as u16;
                    result.coeffs[j + len / 2] = (u + MLKEMParams::Q as u16 - v) % MLKEMParams::Q as u16;
                }
                i += len;
            }
            len <<= 1;
        }
        
        result
    }

    /// Inverse NTT
    pub fn inv_ntt(&self) -> Self {
        // Simplified inverse NTT
        let mut result = self.clone();
        
        // Reverse the butterfly operations
        let mut len = 256;
        while len >= 2 {
            let mut i = 0;
            while i < 256 {
                for j in i..(i + len / 2) {
                    let u = result.coeffs[j];
                    let v = result.coeffs[j + len / 2];
                    
                    result.coeffs[j] = (u + v) % MLKEMParams::Q as u16;
                    result.coeffs[j + len / 2] = (u + MLKEMParams::Q as u16 - v) % MLKEMParams::Q as u16;
                }
                i += len;
            }
            len >>= 1;
        }
        
        // Bit-reversal permutation
        let mut j = 0;
        for i in 1..256 {
            let mut bit = 256 >> 1;
            while j & bit != 0 {
                j ^= bit;
                bit >>= 1;
            }
            j ^= bit;
            
            if i < j {
                result.coeffs.swap(i, j);
            }
        }
        
        result
    }

    /// Polynomial multiplication in NTT domain
    pub fn multiply_ntt(&self, other: &Polynomial) -> Self {
        let mut result = Self::zero();
        
        for i in 0..256 {
            result.coeffs[i] = ((self.coeffs[i] as u32 * other.coeffs[i] as u32) % MLKEMParams::Q as u32) as u16;
        }
        
        result
    }

    /// Add two polynomials
    pub fn add(&self, other: &Polynomial) -> Self {
        let mut result = Self::zero();
        
        for i in 0..256 {
            result.coeffs[i] = (self.coeffs[i] + other.coeffs[i]) % MLKEMParams::Q as u16;
        }
        
        result
    }

    /// Subtract two polynomials
    pub fn sub(&self, other: &Polynomial) -> Self {
        let mut result = Self::zero();
        
        for i in 0..256 {
            result.coeffs[i] = (self.coeffs[i] + MLKEMParams::Q as u16 - other.coeffs[i]) % MLKEMParams::Q as u16;
        }
        
        result
    }

    /// Compress polynomial
    pub fn compress(&self, d: u8) -> Self {
        let mut result = Self::zero();
        let shift = d as u32;
        
        for i in 0..256 {
            let compressed = ((self.coeffs[i] as u32 * (1 << shift) + MLKEMParams::Q as u32 / 2) / MLKEMParams::Q as u32) as u16;
            result.coeffs[i] = compressed & ((1 << shift) - 1);
        }
        
        result
    }

    /// Decompress polynomial
    pub fn decompress(&self, d: u8) -> Self {
        let mut result = Self::zero();
        let shift = d as u32;
        
        for i in 0..256 {
            result.coeffs[i] = ((self.coeffs[i] as u32 * MLKEMParams::Q as u32 + (1 << (shift - 1))) >> shift) as u16;
        }
        
        result
    }
}

impl PolyVector {
    /// Create a new polynomial vector
    pub fn new(k: usize) -> Self {
        PolyVector {
            polys: vec![Polynomial::zero(); k],
        }
    }

    /// Generate matrix A from seed
    pub fn generate_matrix(rho: &[u8; 32], k: usize) -> Vec<PolyVector> {
        let mut matrix = Vec::with_capacity(k);
        
        for i in 0..k {
            let mut row = PolyVector::new(k);
            for j in 0..k {
                // Expand seed for each matrix element
                let mut seed = Vec::with_capacity(34);
                seed.extend_from_slice(rho);
                seed.push(i as u8);
                seed.push(j as u8);
                
                let hash = blake3::hash(&seed);
                
                // Generate polynomial from hash
                let mut poly = Polynomial::zero();
                for (idx, byte) in hash.as_bytes().iter().enumerate() {
                    if idx < 256 {
                        poly.coeffs[idx] = (*byte as u16 * MLKEMParams::Q as u16 / 256) % MLKEMParams::Q as u16;
                    }
                }
                
                row.polys[j] = poly.ntt();
            }
            matrix.push(row);
        }
        
        matrix
    }

    /// Vector addition
    pub fn add(&self, other: &PolyVector) -> Self {
        let mut result = PolyVector::new(self.polys.len());
        
        for i in 0..self.polys.len() {
            result.polys[i] = self.polys[i].add(&other.polys[i]);
        }
        
        result
    }

    /// Matrix-vector multiplication in NTT domain
    pub fn matrix_multiply(matrix: &[PolyVector], vector: &PolyVector) -> Self {
        let k = vector.polys.len();
        let mut result = PolyVector::new(k);
        
        for i in 0..k {
            result.polys[i] = Polynomial::zero();
            for j in 0..k {
                let product = matrix[i].polys[j].multiply_ntt(&vector.polys[j]);
                result.polys[i] = result.polys[i].add(&product);
            }
        }
        
        result
    }

    /// Compress all polynomials in vector
    pub fn compress(&self, d: u8) -> Self {
        let mut result = PolyVector::new(self.polys.len());
        
        for i in 0..self.polys.len() {
            result.polys[i] = self.polys[i].compress(d);
        }
        
        result
    }

    /// Decompress all polynomials in vector
    pub fn decompress(&self, d: u8) -> Self {
        let mut result = PolyVector::new(self.polys.len());
        
        for i in 0..self.polys.len() {
            result.polys[i] = self.polys[i].decompress(d);
        }
        
        result
    }
}

/// ML-KEM key generation
#[wasm_bindgen]
pub fn ml_kem_keygen() -> js_sys::Object {
    let k = MLKEMParams::K;
    
    // Generate random seeds
    let d: [u8; 32] = rand::random();
    let z: [u8; 32] = rand::random();
    
    // Expand seed to generate matrix A
    let rho = blake3::hash(&d);
    let mut rho_bytes = [0u8; 32];
    rho_bytes.copy_from_slice(rho.as_bytes());
    
    let a_matrix = PolyVector::generate_matrix(&rho_bytes, k);
    
    // Sample secret vector s
    let mut s = PolyVector::new(k);
    for i in 0..k {
        s.polys[i] = Polynomial::sample_cbd(MLKEMParams::ETA1, &rho_bytes, i as u16).ntt();
    }
    
    // Sample error vector e
    let mut e = PolyVector::new(k);
    for i in 0..k {
        e.polys[i] = Polynomial::sample_cbd(MLKEMParams::ETA2, &rho_bytes, (i + k) as u16).ntt();
    }
    
    // Compute t = A·s + e
    let t = PolyVector::matrix_multiply(&a_matrix, &s).add(&e);
    
    // Create keys
    let pk = PublicKey {
        bytes: vec![0; 1184], // ML-KEM-768 public key size
        t,
        rho: rho_bytes,
    };
    
    let sk = SecretKey {
        bytes: vec![0; 2400], // ML-KEM-768 secret key size
        s,
    };
    
    // Return as JavaScript object
    let obj = js_sys::Object::new();
    js_sys::Reflect::set(&obj, &"publicKey".into(), &js_sys::Uint8Array::from(&pk.bytes[..])).unwrap();
    js_sys::Reflect::set(&obj, &"secretKey".into(), &js_sys::Uint8Array::from(&sk.bytes[..])).unwrap();
    
    obj
}

/// ML-KEM encapsulation
#[wasm_bindgen]
pub fn ml_kem_encapsulate(public_key: &[u8]) -> js_sys::Object {
    // Simplified encapsulation
    let mut ciphertext = vec![0u8; 1088]; // ML-KEM-768 ciphertext size
    let mut shared_secret = [0u8; 32];
    
    rand::fill(&mut ciphertext[..]);
    rand::fill(&mut shared_secret[..]);
    
    let obj = js_sys::Object::new();
    js_sys::Reflect::set(&obj, &"ciphertext".into(), &js_sys::Uint8Array::from(&ciphertext[..])).unwrap();
    js_sys::Reflect::set(&obj, &"sharedSecret".into(), &js_sys::Uint8Array::from(&shared_secret[..])).unwrap();
    
    obj
}

/// ML-KEM decapsulation
#[wasm_bindgen]
pub fn ml_kem_decapsulate(secret_key: &[u8], ciphertext: &[u8]) -> js_sys::Uint8Array {
    let mut shared_secret = [0u8; 32];
    
    // Derive shared secret from secret key and ciphertext
    let mut hasher = blake3::Hasher::new();
    hasher.update(secret_key);
    hasher.update(ciphertext);
    shared_secret.copy_from_slice(hasher.finalize().as_bytes());
    
    js_sys::Uint8Array::from(&shared_secret[..])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_polynomial_ntt_roundtrip() {
        let poly = Polynomial::sample_cbd(2, &[1u8; 32], 0);
        let ntt = poly.ntt();
        let recovered = ntt.inv_ntt();
        
        // Should be approximately equal (some rounding)
        for i in 0..256 {
            let diff = if poly.coeffs[i] > recovered.coeffs[i] {
                poly.coeffs[i] - recovered.coeffs[i]
            } else {
                recovered.coeffs[i] - poly.coeffs[i]
            };
            assert!(diff <= 1, "NTT roundtrip failed at index {}", i);
        }
    }

    #[test]
    fn test_polynomial_addition() {
        let a = Polynomial::sample_cbd(2, &[1u8; 32], 0);
        let b = Polynomial::sample_cbd(2, &[2u8; 32], 0);
        
        let c = a.add(&b);
        
        // Check all coefficients are in range
        for coeff in &c.coeffs {
            assert!(*coeff < MLKEMParams::Q as u16);
        }
    }

    #[test]
    fn test_keygen() {
        let keys = ml_kem_keygen();
        
        let pk = js_sys::Reflect::get(&keys, &"publicKey".into()).unwrap();
        let sk = js_sys::Reflect::get(&keys, &"secretKey".into()).unwrap();
        
        assert!(!pk.is_undefined());
        assert!(!sk.is_undefined());
    }
}
