/**
 * Crypto Web Worker
 * 
 * This worker runs the Rust cryptographic core in isolation.
 * All sensitive operations happen here, keys never leave this context.
 */

// Import the WASM module
// In production, this would be the compiled Rust WASM
import init, { FortiCommWasm } from './wasm/forticomm_core';

// Global crypto instance
let cryptoInstance: FortiCommWasm | null = null;

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data;

  try {
    let result: unknown;

    switch (type) {
      case 'INIT_WASM':
        result = await handleInit(payload);
        break;

      case 'ENCRYPT':
        result = await handleEncrypt(payload);
        break;

      case 'DECRYPT':
        result = await handleDecrypt(payload);
        break;

      case 'SIGN':
        result = await handleSign(payload);
        break;

      case 'VERIFY':
        result = await handleVerify(payload);
        break;

      case 'CREATE_BACKUP':
        result = await handleCreateBackup(payload);
        break;

      case 'RESTORE_BACKUP':
        result = await handleRestoreBackup(payload);
        break;

      case 'GET_FINGERPRINT':
        result = await handleGetFingerprint();
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    // Send success response
    self.postMessage({
      id,
      success: true,
      result,
    });
  } catch (error) {
    // Send error response
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Initialize the WASM module
 */
async function handleInit(payload: { wasmBuffer: ArrayBuffer }): Promise<void> {
  try {
    // Initialize WASM
    await init(payload.wasmBuffer);

    // Create crypto instance
    cryptoInstance = new FortiCommWasm();

    console.log('🔐 Crypto worker initialized');
  } catch (error) {
    console.error('Failed to initialize crypto:', error);
    throw error;
  }
}

/**
 * Encrypt a message
 */
async function handleEncrypt(payload: {
  recipientId: string;
  plaintext: string;
}): Promise<Uint8Array> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  const encrypted = cryptoInstance.encrypt(payload.recipientId, payload.plaintext);
  return new Uint8Array(encrypted);
}

/**
 * Decrypt a message
 */
async function handleDecrypt(payload: {
  senderId: string;
  ciphertext: Uint8Array;
}): Promise<string> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  return cryptoInstance.decrypt(payload.senderId, payload.ciphertext);
}

/**
 * Sign a message
 */
async function handleSign(payload: {
  message: Uint8Array;
}): Promise<Uint8Array> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  const signature = cryptoInstance.sign(payload.message);
  return new Uint8Array(signature);
}

/**
 * Verify a signature
 */
async function handleVerify(payload: {
  message: Uint8Array;
  signature: Uint8Array;
  publicKey: string;
}): Promise<boolean> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  return cryptoInstance.verify(
    payload.message,
    payload.signature,
    payload.publicKey
  );
}

/**
 * Create an encrypted backup
 */
async function handleCreateBackup(payload: {
  password: string;
}): Promise<string> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  return cryptoInstance.create_backup(payload.password);
}

/**
 * Restore from an encrypted backup
 */
async function handleRestoreBackup(payload: {
  backupJson: string;
  password: string;
}): Promise<void> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  cryptoInstance.restore_backup(payload.backupJson, payload.password);
}

/**
 * Get the identity key fingerprint
 */
async function handleGetFingerprint(): Promise<string> {
  if (!cryptoInstance) {
    throw new Error('Crypto not initialized');
  }

  return cryptoInstance.get_fingerprint();
}

// Handle worker errors
self.onerror = (error) => {
  console.error('Crypto worker error:', error);
};

// Log when worker starts
console.log('🚀 Crypto worker started');
