//! 🔢 Mathematical Foundations Module
//!
//! This module contains the mathematical primitives underlying the
//! cryptographic operations in FortiComm Black Hole.

pub mod elliptic_curve;
pub mod lattice;

pub use elliptic_curve::Curve25519;
pub use lattice::{MLWEParams, ModuleLWE};

/// Finite field arithmetic
pub struct FiniteField {
    /// Field modulus
    pub modulus: u64,
}

impl FiniteField {
    /// Create a new finite field
    pub fn new(modulus: u64) -> Self {
        FiniteField { modulus }
    }
    
    /// Add two elements in the field
    pub fn add(&self, a: u64, b: u64) -> u64 {
        let sum = a.wrapping_add(b);
        if sum >= self.modulus {
            sum.wrapping_sub(self.modulus)
        } else {
            sum
        }
    }
    
    /// Multiply two elements in the field
    pub fn mul(&self, a: u64, b: u64) -> u64 {
        ((a as u128 * b as u128) % self.modulus as u128) as u64
    }
    
    /// Compute modular inverse using extended Euclidean algorithm
    pub fn inv(&self, a: u64) -> Option<u64> {
        let mut t = 0i128;
        let mut new_t = 1i128;
        let mut r = self.modulus as i128;
        let mut new_r = a as i128;
        
        while new_r != 0 {
            let quotient = r / new_r;
            let temp_t = t;
            t = new_t;
            new_t = temp_t - quotient * new_t;
            let temp_r = r;
            r = new_r;
            new_r = temp_r - quotient * new_r;
        }
        
        if r > 1 {
            return None;
        }
        
        if t < 0 {
            t += self.modulus as i128;
        }
        
        Some(t as u64)
    }
}

/// Polynomial ring R_q = Z_q[x] / (x^n + 1)
pub struct PolynomialRing {
    /// Coefficient modulus
    pub q: u16,
    /// Polynomial degree
    pub n: usize,
}

impl PolynomialRing {
    /// Create a new polynomial ring
    pub fn new(q: u16, n: usize) -> Self {
        PolynomialRing { q, n }
    }
    
    /// Add two polynomials
    pub fn add(&self, a: &[u16], b: &[u16]) -> Vec<u16> {
        a.iter()
            .zip(b.iter())
            .map(|(x, y)| {
                let sum = x + y;
                if sum >= self.q { sum - self.q } else { sum }
            })
            .collect()
    }
    
    /// Multiply two polynomials (NTT domain)
    pub fn multiply(&self, a: &[u16], b: &[u16]) -> Vec<u16> {
        // Simplified schoolbook multiplication
        let mut result = vec![0u16; self.n];
        
        for i in 0..self.n {
            for j in 0..self.n {
                let idx = (i + j) % self.n;
                let sign = if i + j >= self.n { self.q - 1 } else { 1 };
                let product = (a[i] as u32 * b[j] as u32) % self.q as u32;
                result[idx] = ((result[idx] as u32 + product * sign as u32) % self.q as u32) as u16;
            }
        }
        
        result
    }
}

/// Number-Theoretic Transform for fast polynomial multiplication
pub struct NTT;

impl NTT {
    /// Forward NTT
    pub fn forward(input: &[u16], modulus: u16, root: u16) -> Vec<u16> {
        let n = input.len();
        let mut result = input.to_vec();
        
        let mut len = 1;
        while len < n {
            let mut i = 0;
            while i < n {
                let mut j = 0;
                while j < len {
                    let u = result[i + j];
                    let v = (result[i + j + len] as u32 * Self::pow_mod(root, (n / (2 * len) * j) as u32, modulus) as u32) % modulus as u32;
                    
                    result[i + j] = ((u as u32 + v) % modulus as u32) as u16;
                    result[i + j + len] = ((u as u32 + modulus as u32 - v) % modulus as u32) as u16;
                    
                    j += 1;
                }
                i += 2 * len;
            }
            len *= 2;
        }
        
        result
    }
    
    /// Modular exponentiation
    fn pow_mod(base: u16, exp: u32, modulus: u16) -> u16 {
        let mut result = 1u32;
        let mut b = base as u32;
        let mut e = exp;
        let m = modulus as u32;
        
        while e > 0 {
            if e & 1 == 1 {
                result = (result * b) % m;
            }
            b = (b * b) % m;
            e >>= 1;
        }
        
        result as u16
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_finite_field() {
        let field = FiniteField::new(17);
        
        assert_eq!(field.add(5, 8), 13);
        assert_eq!(field.add(10, 10), 3); // 20 mod 17
        
        assert_eq!(field.mul(3, 6), 1); // 18 mod 17
        
        assert_eq!(field.inv(3), Some(6)); // 3 * 6 = 18 ≡ 1 (mod 17)
    }
    
    #[test]
    fn test_polynomial_ring() {
        let ring = PolynomialRing::new(3329, 256);
        
        let a = vec![1u16, 2, 3];
        let b = vec![4u16, 5, 6];
        
        let sum = ring.add(&a, &b);
        assert_eq!(sum, vec![5, 7, 9]);
    }
}
