import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

// Crypto utilities for VAULT

export interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export interface EncryptedData {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
}

export interface SignedPreKey {
  keyId: number;
  publicKey: Uint8Array;
  secretKey: Uint8Array;
  signature: Uint8Array;
}

// Generate identity key pair (Ed25519 for signing)
export function generateIdentityKeyPair(): KeyPair {
  return nacl.sign.keyPair();
}

// Generate key exchange key pair (X25519 for encryption)
export function generateKeyExchangeKeyPair(): KeyPair {
  return nacl.box.keyPair();
}

// Generate device ID
export function generateDeviceId(): string {
  const bytes = nacl.randomBytes(16);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate signed pre-key
export function generateSignedPreKey(
  identityKeyPair: KeyPair,
  keyId: number
): SignedPreKey {
  const preKeyPair = generateKeyExchangeKeyPair();
  const signature = nacl.sign.detached(preKeyPair.publicKey, identityKeyPair.secretKey);
  
  return {
    keyId,
    publicKey: preKeyPair.publicKey,
    secretKey: preKeyPair.secretKey,
    signature
  };
}

// Verify signed pre-key
export function verifySignedPreKey(
  signedPreKey: SignedPreKey,
  identityPublicKey: Uint8Array
): boolean {
  return nacl.sign.detached.verify(
    signedPreKey.publicKey,
    signedPreKey.signature,
    identityPublicKey
  );
}

// Derive shared secret using X25519 key agreement
export function deriveSharedSecret(
  privateKey: Uint8Array,
  publicKey: Uint8Array
): Uint8Array {
  return nacl.scalarMult(privateKey, publicKey);
}

// Key Derivation Function (simple HKDF-like)
export function deriveKeys(
  secret: Uint8Array,
  salt: Uint8Array,
  info: string
): {
  rootKey: Uint8Array;
  chainKey: Uint8Array;
} {
  const combined = new Uint8Array(secret.length + salt.length + info.length);
  combined.set(secret);
  combined.set(salt, secret.length);
  combined.set(encodeUTF8(info), secret.length + salt.length);
  
  const hash = nacl.hash(combined);
  
  return {
    rootKey: hash.slice(0, 32),
    chainKey: hash.slice(32, 64)
  };
}

// Ratchet chain key
export function ratchetChainKey(chainKey: Uint8Array): {
  newChainKey: Uint8Array;
  messageKey: Uint8Array;
} {
  const hash = nacl.hash(chainKey);
  return {
    newChainKey: hash.slice(0, 32),
    messageKey: hash.slice(32, 64)
  };
}

// Encrypt message with key
export function encryptMessage(
  message: string,
  key: Uint8Array
): EncryptedData {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageBytes = encodeUTF8(message);
  const ciphertext = nacl.secretbox(messageBytes, nonce, key);
  
  return { ciphertext, nonce };
}

// Decrypt message with key
export function decryptMessage(
  encrypted: EncryptedData,
  key: Uint8Array
): string | null {
  const decrypted = nacl.secretbox.open(encrypted.ciphertext, encrypted.nonce, key);
  if (!decrypted) return null;
  return decodeUTF8(decrypted);
}

// Encrypt file data
export function encryptFile(
  data: ArrayBuffer,
  key: Uint8Array
): EncryptedData {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const dataBytes = new Uint8Array(data);
  const ciphertext = nacl.secretbox(dataBytes, nonce, key);
  
  return { ciphertext, nonce };
}

// Decrypt file data
export function decryptFile(
  encrypted: EncryptedData,
  key: Uint8Array
): Uint8Array | null {
  return nacl.secretbox.open(encrypted.ciphertext, encrypted.nonce, key);
}

// Create sealed box (anonymous encryption)
export function sealedBoxEncrypt(
  message: Uint8Array,
  recipientPublicKey: Uint8Array
): Uint8Array {
  return nacl.box.seal(message, recipientPublicKey);
}

// Open sealed box
export function sealedBoxDecrypt(
  ciphertext: Uint8Array,
  publicKey: Uint8Array,
  secretKey: Uint8Array
): Uint8Array | null {
  return nacl.box.seal.open(ciphertext, publicKey, secretKey);
}

// Generate QR code data for device verification
export function generateDeviceVerificationData(
  deviceId: string,
  identityPublicKey: Uint8Array
): string {
  return JSON.stringify({
    deviceId,
    identityKey: encodeBase64(identityPublicKey),
    timestamp: Date.now()
  });
}

// Verify device verification data
export function verifyDeviceVerificationData(
  data: string
): { deviceId: string; identityKey: Uint8Array; timestamp: number } | null {
  try {
    const parsed = JSON.parse(data);
    return {
      deviceId: parsed.deviceId,
      identityKey: decodeBase64(parsed.identityKey),
      timestamp: parsed.timestamp
    };
  } catch {
    return null;
  }
}

// Hash function for fingerprinting
export function hashIdentityKey(publicKey: Uint8Array): string {
  const hash = nacl.hash(publicKey);
  return Array.from(hash.slice(0, 8))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .match(/.{1,4}/g)!
    .join('-');
}

// Secure random token generation
export function generateSecureToken(length: number = 32): string {
  const bytes = nacl.randomBytes(length);
  return encodeBase64(bytes);
}

// Password-based key derivation (simple version)
export function deriveKeyFromPassword(password: string, salt: Uint8Array): Uint8Array {
  const passwordBytes = encodeUTF8(password);
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);
  
  let hash = nacl.hash(combined);
  
  // Multiple rounds for additional security
  for (let i = 0; i < 10000; i++) {
    hash = nacl.hash(hash);
  }
  
  return hash.slice(0, 32);
}

// Encrypt data with password
export function encryptWithPassword(
  data: string,
  password: string
): { encrypted: string; salt: string } {
  const salt = nacl.randomBytes(32);
  const key = deriveKeyFromPassword(password, salt);
  const encrypted = encryptMessage(data, key);
  
  return {
    encrypted: JSON.stringify({
      ciphertext: encodeBase64(encrypted.ciphertext),
      nonce: encodeBase64(encrypted.nonce)
    }),
    salt: encodeBase64(salt)
  };
}

// Decrypt data with password
export function decryptWithPassword(
  encryptedData: string,
  salt: string,
  password: string
): string | null {
  try {
    const parsed = JSON.parse(encryptedData);
    const saltBytes = decodeBase64(salt);
    const key = deriveKeyFromPassword(password, saltBytes);
    
    const encrypted: EncryptedData = {
      ciphertext: decodeBase64(parsed.ciphertext),
      nonce: decodeBase64(parsed.nonce)
    };
    
    return decryptMessage(encrypted, key);
  } catch {
    return null;
  }
}

// Utility: Convert public key to base64 string
export function publicKeyToString(publicKey: Uint8Array): string {
  return encodeBase64(publicKey);
}

// Utility: Convert base64 string to public key
export function stringToPublicKey(str: string): Uint8Array {
  return decodeBase64(str);
}

// Memory wiping (best effort in JavaScript)
export function wipeMemory(array: Uint8Array): void {
  for (let i = 0; i < array.length; i++) {
    array[i] = 0;
  }
}

// Generate registration ID
export function generateRegistrationId(): number {
  const bytes = nacl.randomBytes(2);
  return (bytes[0] << 8) | bytes[1];
}

// Create encrypted payload for transmission
export interface EncryptedPayload {
  version: number;
  senderDeviceId: string;
  senderIdentityKey: string;
  ephemeralPublicKey: string;
  encryptedMessage: string;
  nonce: string;
  timestamp: number;
}

export function createEncryptedPayload(
  message: string,
  senderDeviceId: string,
  senderIdentityKeyPair: KeyPair,
  recipientPublicKey: Uint8Array
): EncryptedPayload {
  const ephemeralKeyPair = generateKeyExchangeKeyPair();
  const sharedSecret = deriveSharedSecret(ephemeralKeyPair.secretKey, recipientPublicKey);
  const encrypted = encryptMessage(message, sharedSecret);
  
  return {
    version: 1,
    senderDeviceId,
    senderIdentityKey: publicKeyToString(senderIdentityKeyPair.publicKey),
    ephemeralPublicKey: publicKeyToString(ephemeralKeyPair.publicKey),
    encryptedMessage: encodeBase64(encrypted.ciphertext),
    nonce: encodeBase64(encrypted.nonce),
    timestamp: Date.now()
  };
}

export function decryptPayload(
  payload: EncryptedPayload,
  recipientKeyPair: KeyPair
): string | null {
  try {
    const ephemeralPublicKey = stringToPublicKey(payload.ephemeralPublicKey);
    const sharedSecret = deriveSharedSecret(recipientKeyPair.secretKey, ephemeralPublicKey);
    
    const encrypted: EncryptedData = {
      ciphertext: decodeBase64(payload.encryptedMessage),
      nonce: decodeBase64(payload.nonce)
    };
    
    return decryptMessage(encrypted, sharedSecret);
  } catch {
    return null;
  }
}
