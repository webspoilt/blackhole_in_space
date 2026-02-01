/**
 * Secure WebAssembly Loader for FortiComm
 * 
 * This module loads the Rust cryptographic core in a Web Worker
 * for isolation. Keys never touch the JavaScript heap.
 */

// WASM module type declarations
declare module '*.wasm' {
  const content: ArrayBuffer;
  export default content;
}

// Crypto worker message types
interface CryptoWorkerMessage {
  id: string;
  type: 'INIT_WASM' | 'ENCRYPT' | 'DECRYPT' | 'SIGN' | 'VERIFY' | 'CREATE_BACKUP' | 'RESTORE_BACKUP';
  payload?: unknown;
}

interface CryptoWorkerResponse {
  id: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

/**
 * Secure Crypto Loader
 * Manages the Web Worker and WASM module
 */
export class SecureCryptoLoader {
  private static worker: Worker | null = null;
  private static isInitialized = false;
  private static messageId = 0;
  private static pendingMessages = new Map<string, {
    resolve: (value: unknown) => void;
    reject: (reason: Error) => void;
  }>();

  /**
   * Initialize the cryptographic engine
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create the crypto worker
      this.worker = new Worker(
        new URL('./crypto.worker.ts', import.meta.url),
        { type: 'module', name: 'forticomm-crypto' }
      );

      // Set up message handler
      this.worker.onmessage = (event: MessageEvent<CryptoWorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error('Crypto worker error:', error);
        this.rejectAllPending(new Error('Crypto worker failed'));
      };

      // Load WASM with Subresource Integrity
      const wasmResponse = await fetch('/crypto-core.wasm', {
        credentials: 'same-origin',
        // SRI hash will be injected by build script
        integrity: (window as unknown as { WASM_SRI_HASH?: string }).WASM_SRI_HASH || undefined,
      });

      if (!wasmResponse.ok) {
        throw new Error(`Failed to load WASM: ${wasmResponse.status}`);
      }

      const wasmBuffer = await wasmResponse.arrayBuffer();

      // Initialize WASM in worker
      await this.sendMessage('INIT_WASM', { wasmBuffer });

      this.isInitialized = true;
      console.log('🔐 FortiComm crypto engine initialized');
    } catch (error) {
      console.error('Failed to initialize crypto:', error);
      throw error;
    }
  }

  /**
   * Encrypt a message
   */
  static async encryptMessage(recipientId: string, plaintext: string): Promise<Uint8Array> {
    this.ensureInitialized();
    const result = await this.sendMessage('ENCRYPT', { recipientId, plaintext });
    return result as Uint8Array;
  }

  /**
   * Decrypt a message
   */
  static async decryptMessage(senderId: string, ciphertext: Uint8Array): Promise<string> {
    this.ensureInitialized();
    const result = await this.sendMessage('DECRYPT', { senderId, ciphertext });
    return result as string;
  }

  /**
   * Sign a message
   */
  static async signMessage(message: Uint8Array): Promise<Uint8Array> {
    this.ensureInitialized();
    const result = await this.sendMessage('SIGN', { message });
    return result as Uint8Array;
  }

  /**
   * Verify a signature
   */
  static async verifySignature(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: string
  ): Promise<boolean> {
    this.ensureInitialized();
    const result = await this.sendMessage('VERIFY', { message, signature, publicKey });
    return result as boolean;
  }

  /**
   * Create an encrypted backup
   */
  static async createBackup(password: string): Promise<string> {
    this.ensureInitialized();
    const result = await this.sendMessage('CREATE_BACKUP', { password });
    return result as string;
  }

  /**
   * Restore from an encrypted backup
   */
  static async restoreBackup(backupJson: string, password: string): Promise<void> {
    this.ensureInitialized();
    await this.sendMessage('RESTORE_BACKUP', { backupJson, password });
  }

  /**
   * Get the identity key fingerprint
   */
  static async getFingerprint(): Promise<string> {
    this.ensureInitialized();
    const result = await this.sendMessage('GET_FINGERPRINT', {});
    return result as string;
  }

  /**
   * Check if the crypto engine is initialized
   */
  static get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Terminate the crypto worker
   */
  static terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.rejectAllPending(new Error('Crypto worker terminated'));
    }
  }

  /**
   * Send a message to the worker and wait for response
   */
  private static sendMessage(type: string, payload: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Crypto worker not initialized'));
        return;
      }

      const id = `${++this.messageId}-${Date.now()}`;
      this.pendingMessages.set(id, { resolve, reject });

      const message: CryptoWorkerMessage = {
        id,
        type: type as CryptoWorkerMessage['type'],
        payload,
      };

      this.worker.postMessage(message, []);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id);
          reject(new Error('Crypto operation timed out'));
        }
      }, 30000);
    });
  }

  /**
   * Handle messages from the worker
   */
  private static handleWorkerMessage(response: CryptoWorkerResponse): void {
    const pending = this.pendingMessages.get(response.id);
    if (!pending) {
      console.warn('Received unexpected message from worker:', response);
      return;
    }

    this.pendingMessages.delete(response.id);

    if (response.success) {
      pending.resolve(response.result);
    } else {
      pending.reject(new Error(response.error || 'Unknown crypto error'));
    }
  }

  /**
   * Reject all pending messages
   */
  private static rejectAllPending(error: Error): void {
    for (const [, pending] of this.pendingMessages) {
      pending.reject(error);
    }
    this.pendingMessages.clear();
  }

  /**
   * Ensure the crypto engine is initialized
   */
  private static ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Crypto engine not initialized. Call initialize() first.');
    }
  }
}

// Export singleton instance
export const cryptoLoader = SecureCryptoLoader;

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Don't auto-initialize - let the app control when to init
  // This allows for proper error handling and user consent
}
