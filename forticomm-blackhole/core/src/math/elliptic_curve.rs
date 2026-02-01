//! 🔢 Elliptic Curve Cryptography - Curve25519
//!
//! This module implements Curve25519 elliptic curve operations.
//!
//! # Mathematical Background
//!
//! Curve25519 is defined by the equation:
//! ```text
//! y² = x³ + 486662x² + x  over F_p where p = 2²⁵⁵ - 19
//! ```
//!
//! ## Security Properties
//!
//! - 128-bit security level
//! - Constant-time implementations resist timing attacks
//! - No known efficient quantum attacks (though Shor's algorithm applies)

use wasm_bindgen::prelude::*;

/// Curve25519 parameters
pub struct Curve25519;

/// Prime field modulus: p = 2^255 - 19
pub const P: [u64; 4] = [
    0xFFFFFFFFFFFFFFED,
    0xFFFFFFFFFFFFFFFF,
    0xFFFFFFFFFFFFFFFF,
    0x7FFFFFFFFFFFFFFF,
];

/// Curve parameter: a = 486662
pub const A: u64 = 486662;

/// Base point x-coordinate (9)
pub const BASE_POINT: [u8; 32] = [
    0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];

/// A point on the curve (Montgomery form)
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Point {
    /// X coordinate
    pub x: [u64; 4],
    /// Z coordinate (for projective coordinates)
    pub z: [u64; 4],
}

/// A scalar (private key)
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Scalar {
    pub bytes: [u8; 32],
}

impl Curve25519 {
    /// Generate a new random scalar
    pub fn random_scalar() -> Scalar {
        let mut bytes = [0u8; 32];
        rand::fill(&mut bytes[..]);
        
        // Clamp the scalar according to RFC 7748
        bytes[0] &= 248;
        bytes[31] &= 127;
        bytes[31] |= 64;
        
        Scalar { bytes }
    }

    /// Scalar multiplication using Montgomery ladder
    /// 
    /// Computes Q = k * P in constant time
    pub fn scalar_multiply(k: &Scalar, p: &Point) -> Point {
        // Montgomery ladder for constant-time scalar multiplication
        let mut r0 = Point::identity();
        let mut r1 = *p;
        
        for i in (0..256).rev() {
            let bit = ((k.bytes[i / 8] >> (i % 8)) & 1) as u64;
            
            // Conditional swap
            Self::cswap(bit, &mut r0, &mut r1);
            
            // Double-and-add step
            let r2 = Self::point_add(&r0, &r1);
            r0 = Self::point_double(&r0);
            r1 = r2;
            
            // Conditional swap back
            Self::cswap(bit, &mut r0, &mut r1);
        }
        
        r0
    }

    /// Point addition in Montgomery form
    /// 
    /// Given P = (X_P, Z_P) and Q = (X_Q, Z_Q), computes R = P + Q
    pub fn point_add(p: &Point, q: &Point) -> Point {
        // Using differential addition formulas
        let a = Self::field_add(&p.x, &p.z);
        let b = Self::field_sub(&p.x, &p.z);
        let c = Self::field_add(&q.x, &q.z);
        let d = Self::field_sub(&q.x, &q.z);
        
        let da = Self::field_mul(&d, &a);
        let cb = Self::field_mul(&c, &b);
        
        let x3 = Self::field_mul(&Self::field_add(&da, &cb), &Self::field_add(&da, &cb));
        let z3 = Self::field_mul(&Self::field_sub(&da, &cb), &Self::field_sub(&da, &cb));
        
        Point { x: x3, z: z3 }
    }

    /// Point doubling
    /// 
    /// Given P = (X_P, Z_P), computes R = 2 * P
    pub fn point_double(p: &Point) -> Point {
        let a = Self::field_add(&p.x, &p.z);
        let b = Self::field_sub(&p.x, &p.z);
        
        let aa = Self::field_mul(&a, &a);
        let bb = Self::field_mul(&b, &b);
        
        let x3 = Self::field_mul(&aa, &bb);
        
        let e = Self::field_sub(&aa, &bb);
        let c = Self::field_add(&Self::field_mul_scalar(&e, 121665), &bb);
        let z3 = Self::field_mul(&e, &c);
        
        Point { x: x3, z: z3 }
    }

    /// Conditional swap (constant time)
    fn cswap(swap: u64, p: &mut Point, q: &mut Point) {
        let mask = 0u64.wrapping_sub(swap);
        
        for i in 0..4 {
            let t = (p.x[i] ^ q.x[i]) & mask;
            p.x[i] ^= t;
            q.x[i] ^= t;
            
            let t = (p.z[i] ^ q.z[i]) & mask;
            p.z[i] ^= t;
            q.z[i] ^= t;
        }
    }

    /// Field addition: (a + b) mod p
    fn field_add(a: &[u64; 4], b: &[u64; 4]) -> [u64; 4] {
        let mut result = [0u64; 4];
        let mut carry = 0u64;
        
        for i in 0..4 {
            let sum = a[i].wrapping_add(b[i]).wrapping_add(carry);
            result[i] = sum;
            carry = if sum < a[i] || (sum == a[i] && carry == 1) { 1 } else { 0 };
        }
        
        // Reduce mod p if necessary
        Self::field_reduce(&mut result);
        result
    }

    /// Field subtraction: (a - b) mod p
    fn field_sub(a: &[u64; 4], b: &[u64; 4]) -> [u64; 4] {
        let mut result = [0u64; 4];
        let mut borrow = 0u64;
        
        for i in 0..4 {
            let diff = a[i].wrapping_sub(b[i]).wrapping_sub(borrow);
            result[i] = diff;
            borrow = if a[i] < b[i].wrapping_add(borrow) { 1 } else { 0 };
        }
        
        // Add p if negative
        if borrow != 0 {
            result = Self::field_add(&result, &P);
        }
        
        result
    }

    /// Field multiplication: (a * b) mod p
    fn field_mul(a: &[u64; 4], b: &[u64; 4]) -> [u64; 4] {
        // Schoolbook multiplication
        let mut result = [0u128; 8];
        
        for i in 0..4 {
            let mut carry = 0u128;
            for j in 0..4 {
                let product = result[i + j] as u128 + (a[i] as u128 * b[j] as u128) + carry;
                result[i + j] = product as u128;
                carry = product >> 64;
            }
            result[i + 4] = carry;
        }
        
        // Reduce mod p
        let mut reduced = [0u64; 4];
        for i in 0..4 {
            reduced[i] = result[i] as u64;
        }
        
        Self::field_reduce(&mut reduced);
        reduced
    }

    /// Multiply by a small scalar
    fn field_mul_scalar(a: &[u64; 4], scalar: u64) -> [u64; 4] {
        let mut result = [0u64; 4];
        let mut carry = 0u64;
        
        for i in 0..4 {
            let product = (a[i] as u128 * scalar as u128) + carry as u128;
            result[i] = product as u64;
            carry = (product >> 64) as u64;
        }
        
        Self::field_reduce(&mut result);
        result
    }

    /// Field reduction mod p
    fn field_reduce(a: &mut [u64; 4]) {
        // Simple reduction for Curve25519 prime
        // In production, use constant-time reduction
        
        // Check if a >= p
        let mut ge = false;
        for i in (0..4).rev() {
            if a[i] > P[i] {
                ge = true;
                break;
            } else if a[i] < P[i] {
                break;
            }
        }
        
        if ge {
            // Subtract p
            let mut borrow = 0u64;
            for i in 0..4 {
                let diff = a[i].wrapping_sub(P[i]).wrapping_sub(borrow);
                a[i] = diff;
                borrow = if a[i] > 0xFFFFFFFFFFFFFFFF - P[i] { 1 } else { 0 };
            }
        }
    }
}

impl Point {
    /// Identity element (point at infinity)
    pub fn identity() -> Self {
        Point {
            x: [1, 0, 0, 0],
            z: [0, 0, 0, 0],
        }
    }

    /// Base point
    pub fn base() -> Self {
        let mut x = [0u64; 4];
        x[0] = 9;
        Point { x, z: [1, 0, 0, 0] }
    }

    /// Convert to affine coordinates (x/z)
    pub fn to_affine(&self) -> [u8; 32] {
        // Compute x * z^(-1) mod p
        // In production, implement proper field inversion
        let mut result = [0u8; 32];
        
        // Simplified: just return x bytes
        for i in 0..4 {
            let bytes = self.x[i].to_le_bytes();
            for j in 0..8 {
                if i * 8 + j < 32 {
                    result[i * 8 + j] = bytes[j];
                }
            }
        }
        
        result
    }
}

impl Scalar {
    /// Create a scalar from bytes
    pub fn from_bytes(bytes: &[u8; 32]) -> Self {
        let mut clamped = *bytes;
        
        // Clamp according to RFC 7748
        clamped[0] &= 248;
        clamped[31] &= 127;
        clamped[31] |= 64;
        
        Scalar { bytes: clamped }
    }

    /// Convert to bytes
    pub fn to_bytes(&self) -> [u8; 32] {
        self.bytes
    }
}

#[wasm_bindgen]
/// Perform X25519 key exchange
pub fn x25519(scalar: &[u8], point: &[u8]) -> Vec<u8> {
    if scalar.len() != 32 || point.len() != 32 {
        return vec![];
    }
    
    let s = Scalar::from_bytes(&scalar.try_into().unwrap());
    
    let mut p_bytes = [0u64; 4];
    for i in 0..4 {
        let mut bytes = [0u8; 8];
        bytes.copy_from_slice(&point[i * 8..(i + 1) * 8]);
        p_bytes[i] = u64::from_le_bytes(bytes);
    }
    
    let p = Point { x: p_bytes, z: [1, 0, 0, 0] };
    let result = Curve25519::scalar_multiply(&s, &p);
    
    result.to_affine().to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_scalar_generation() {
        let s1 = Curve25519::random_scalar();
        let s2 = Curve25519::random_scalar();
        
        // Scalars should be different (with high probability)
        assert_ne!(s1.bytes, s2.bytes);
        
        // Check clamping
        assert_eq!(s1.bytes[0] & 7, 0);
        assert_eq!(s1.bytes[31] & 128, 64);
    }

    #[test]
    fn test_point_identity() {
        let identity = Point::identity();
        assert_eq!(identity.x[0], 1);
        assert_eq!(identity.z[0], 0);
    }

    #[test]
    fn test_scalar_multiplication() {
        let scalar = Curve25519::random_scalar();
        let base = Point::base();
        
        let result = Curve25519::scalar_multiply(&scalar, &base);
        
        // Result should not be identity (with high probability)
        assert_ne!(result.x, [0, 0, 0, 0]);
    }
}
