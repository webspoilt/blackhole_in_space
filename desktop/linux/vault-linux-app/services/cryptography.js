const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const forge = require('node-forge');

class CryptographyService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.rsaKeySize = 2048;
    this.aesKeySize = 256;
  }

  // ============================================
  // AES-256-GCM Encryption (Primary)
  // ============================================

  generateAESKey() {
    return crypto.randomBytes(32); // 256 bits
  }

  encryptAES(data, key) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      let encrypted = cipher.update(
        typeof data === 'string' ? data : JSON.stringify(data),
        'utf8',
        'hex'
      );
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('AES encryption error:', error);
      throw error;
    }
  }

  decryptAES(encryptedData, key) {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        key,
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('AES decryption error:', error);
      throw error;
    }
  }

  // ============================================
  // RSA Encryption (Key Exchange)
  // ============================================

  generateRSAKeyPair() {
    const key = new NodeRSA({ b: this.rsaKeySize });
    key.setOptions({ encryptionScheme: 'pkcs1_oaep' });
    
    return {
      publicKey: key.exportKey('public'),
      privateKey: key.exportKey('private')
    };
  }

  encryptRSA(data, publicKey) {
    try {
      const key = new NodeRSA(publicKey);
      key.setOptions({ encryptionScheme: 'pkcs1_oaep' });
      return key.encrypt(data, 'base64');
    } catch (error) {
      console.error('RSA encryption error:', error);
      throw error;
    }
  }

  decryptRSA(encryptedData, privateKey) {
    try {
      const key = new NodeRSA(privateKey);
      key.setOptions({ encryptionScheme: 'pkcs1_oaep' });
      return key.decrypt(encryptedData, 'utf8');
    } catch (error) {
      console.error('RSA decryption error:', error);
      throw error;
    }
  }

  // ============================================
  // Signal Protocol (E2E Encryption)
  // ============================================

  generateIdentityKeyPair() {
    const keyPair = crypto.generateKeyPairSync('x25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }

  generatePreKeys(count = 100) {
    const preKeys = [];
    
    for (let i = 0; i < count; i++) {
      const keyPair = this.generateIdentityKeyPair();
      preKeys.push({
        keyId: i + 1,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey
      });
    }
    
    return preKeys;
  }

  generateSignedPreKey() {
    const keyPair = this.generateIdentityKeyPair();
    const timestamp = Date.now();
    
    // Sign the public key with identity key
    const signature = this.signData(keyPair.publicKey, keyPair.privateKey);
    
    return {
      keyId: 1,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      signature: signature,
      timestamp: timestamp
    };
  }

  signData(data, privateKey) {
    try {
      const sign = crypto.createSign('SHA256');
      sign.update(data);
      sign.end();
      return sign.sign(privateKey, 'base64');
    } catch (error) {
      console.error('Signing error:', error);
      throw error;
    }
  }

  verifySignature(data, signature, publicKey) {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(data);
      verify.end();
      return verify.verify(publicKey, signature, 'base64');
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }

  // ============================================
  // Double Ratchet Algorithm (Signal Protocol)
  // ============================================

  async initializeDoubleRatchet(theirPublicKey, ourKeyPair) {
    // Perform X25519 key agreement
    const sharedSecret = this.performX25519(ourKeyPair.privateKey, theirPublicKey);
    
    // Derive root key and chain key
    const rootKey = this.hkdf(sharedSecret, 'WhisperText', 32);
    const chainKey = this.hkdf(rootKey, 'WhisperMessageKeys', 32);
    
    return {
      rootKey: rootKey,
      chainKey: chainKey,
      sendingChainKey: null,
      receivingChainKey: chainKey,
      previousCounter: 0,
      messageKeys: {}
    };
  }

  performX25519(privateKey, publicKey) {
    // Simplified X25519 key agreement
    // In production, use proper crypto library with X25519 support
    const hash = crypto.createHash('sha256');
    hash.update(privateKey + publicKey);
    return hash.digest();
  }

  hkdf(inputKeyMaterial, info, length) {
    // HKDF (HMAC-based Key Derivation Function)
    const salt = crypto.randomBytes(32);
    const prk = crypto.createHmac('sha256', salt)
      .update(inputKeyMaterial)
      .digest();
    
    const okm = crypto.createHmac('sha256', prk)
      .update(Buffer.concat([Buffer.from(info), Buffer.from([0x01])]))
      .digest();
    
    return okm.slice(0, length);
  }

  ratchetChainKey(chainKey) {
    // Derive next chain key and message key
    const messageKey = crypto.createHmac('sha256', chainKey)
      .update(Buffer.from([0x01]))
      .digest();
    
    const nextChainKey = crypto.createHmac('sha256', chainKey)
      .update(Buffer.from([0x02]))
      .digest();
    
    return {
      messageKey: messageKey,
      chainKey: nextChainKey
    };
  }

  // ============================================
  // Message Encryption/Decryption
  // ============================================

  encryptMessage(message, sessionState) {
    try {
      // Ratchet the chain key
      const ratchet = this.ratchetChainKey(sessionState.chainKey);
      
      // Encrypt message with message key
      const encrypted = this.encryptAES(message, ratchet.messageKey);
      
      // Update session state
      sessionState.chainKey = ratchet.chainKey;
      sessionState.previousCounter += 1;
      
      return {
        ciphertext: encrypted,
        counter: sessionState.previousCounter,
        sessionState: sessionState
      };
    } catch (error) {
      console.error('Message encryption error:', error);
      throw error;
    }
  }

  decryptMessage(encryptedMessage, sessionState) {
    try {
      // Ratchet the chain key to derive message key
      const ratchet = this.ratchetChainKey(sessionState.chainKey);
      
      // Decrypt message with message key
      const decrypted = this.decryptAES(encryptedMessage.ciphertext, ratchet.messageKey);
      
      // Update session state
      sessionState.chainKey = ratchet.chainKey;
      
      return {
        plaintext: decrypted,
        sessionState: sessionState
      };
    } catch (error) {
      console.error('Message decryption error:', error);
      throw error;
    }
  }

  // ============================================
  // Post-Quantum Cryptography (ML-KEM-768)
  // ============================================

  // Note: This is a placeholder for ML-KEM-768 (Kyber)
  // In production, use proper post-quantum crypto library
  async generateMLKEMKeyPair() {
    // Simulated ML-KEM-768 key generation
    // In production, integrate liboqs or similar
    const publicKey = crypto.randomBytes(1184); // ML-KEM-768 public key size
    const privateKey = crypto.randomBytes(2400); // ML-KEM-768 private key size
    
    return {
      publicKey: publicKey.toString('base64'),
      privateKey: privateKey.toString('base64')
    };
  }

  async encapsulateMLKEM(publicKey) {
    // Simulated ML-KEM encapsulation
    const sharedSecret = crypto.randomBytes(32);
    const ciphertext = crypto.randomBytes(1088); // ML-KEM-768 ciphertext size
    
    return {
      sharedSecret: sharedSecret,
      ciphertext: ciphertext.toString('base64')
    };
  }

  async decapsulateMLKEM(ciphertext, privateKey) {
    // Simulated ML-KEM decapsulation
    const sharedSecret = crypto.randomBytes(32);
    return sharedSecret;
  }

  // ============================================
  // Utility Functions
  // ============================================

  hashPassword(password, salt = null) {
    const useSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, useSalt, 100000, 64, 'sha512');
    
    return {
      hash: hash.toString('hex'),
      salt: useSalt
    };
  }

  verifyPassword(password, hash, salt) {
    const newHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return newHash.toString('hex') === hash;
  }

  generateRandomBytes(length) {
    return crypto.randomBytes(length);
  }

  secureRandom(min, max) {
    const range = max - min;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const randomBytes = crypto.randomBytes(bytesNeeded);
    const randomValue = parseInt(randomBytes.toString('hex'), 16);
    return min + (randomValue % range);
  }

  generateMessageId() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateSessionId() {
    return crypto.randomUUID();
  }

  // Secure memory wipe
  secureWipe(buffer) {
    if (Buffer.isBuffer(buffer)) {
      crypto.randomFillSync(buffer);
      buffer.fill(0);
    }
  }

  // Key derivation
  deriveKey(password, salt, keyLength = 32) {
    return crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');
  }

  // Generate registration ID for Signal Protocol
  generateRegistrationId() {
    return this.secureRandom(1, 16380);
  }
}

module.exports = new CryptographyService();
