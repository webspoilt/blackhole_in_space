const crypto = require('./cryptography');
const database = require('./database');
const email = require('./email');
const { ipcRenderer } = require('electron');

class AuthService {
  constructor() {
    this.currentUser = null;
    this.verificationCodes = new Map();
    this.resetCodes = new Map();
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(username, email, password) {
    try {
      // Validate input
      if (!this.validateUsername(username)) {
        return { success: false, error: 'Invalid username format' };
      }

      if (!this.validateEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (!this.validatePassword(password)) {
        return { 
          success: false, 
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
        };
      }

      // Check if user exists
      const existingUser = await database.getUserByUsername(username);
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      const existingEmail = await database.getUserByEmail(email);
      if (existingEmail) {
        return { success: false, error: 'Email already registered' };
      }

      // Generate verification code
      const verificationCode = this.generateVerificationCode();
      this.verificationCodes.set(email, {
        code: verificationCode,
        username: username,
        password: password,
        expires: Date.now() + (15 * 60 * 1000) // 15 minutes
      });

      // Send verification email
      const emailResult = await email.sendVerificationEmail(email, username, verificationCode);
      
      if (!emailResult.success) {
        return { success: false, error: 'Failed to send verification email' };
      }

      return { 
        success: true, 
        message: 'Verification code sent to your email',
        requiresVerification: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyEmail(email, code) {
    try {
      const verification = this.verificationCodes.get(email);
      
      if (!verification) {
        return { success: false, error: 'No verification code found' };
      }

      if (Date.now() > verification.expires) {
        this.verificationCodes.delete(email);
        return { success: false, error: 'Verification code expired' };
      }

      if (verification.code !== code) {
        return { success: false, error: 'Invalid verification code' };
      }

      // Create user account
      const userId = crypto.generateSessionId();
      const passwordData = crypto.hashPassword(verification.password);
      
      // Generate identity key pair
      const identityKeyPair = crypto.generateIdentityKeyPair();
      const registrationId = crypto.generateRegistrationId();
      
      // Generate RSA key pair for general encryption
      const rsaKeyPair = crypto.generateRSAKeyPair();
      
      // Encrypt private keys with password
      const privateKeyEncrypted = crypto.encryptAES(
        identityKeyPair.privateKey,
        Buffer.from(passwordData.hash.slice(0, 64), 'hex')
      );

      // Create user in database
      await database.createUser({
        id: userId,
        username: verification.username,
        email: email,
        passwordHash: passwordData.hash,
        publicKey: rsaKeyPair.publicKey,
        privateKeyEncrypted: JSON.stringify(privateKeyEncrypted),
        identityKey: identityKeyPair.publicKey,
        registrationId: registrationId
      });

      // Generate pre-keys
      const preKeys = crypto.generatePreKeys(100);
      for (const preKey of preKeys) {
        const preKeyEncrypted = crypto.encryptAES(
          preKey.privateKey,
          Buffer.from(passwordData.hash.slice(0, 64), 'hex')
        );

        await database.run(
          `INSERT INTO prekeys (id, user_id, key_id, public_key, private_key_encrypted, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            crypto.generateSessionId(),
            userId,
            preKey.keyId,
            preKey.publicKey,
            JSON.stringify(preKeyEncrypted),
            Date.now()
          ]
        );
      }

      // Clean up verification code
      this.verificationCodes.delete(email);

      // Send welcome email
      await email.sendWelcomeEmail(email, verification.username);

      // Store credentials securely
      await ipcRenderer.invoke('keychain-set', 'vault-messenger', userId, verification.password);

      return { 
        success: true, 
        message: 'Account created successfully',
        userId: userId
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async login(username, password) {
    try {
      // Get user from database
      const user = await database.getUserByUsername(username);
      
      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Verify password (extract salt from stored hash)
      // Assuming format: hash:salt
      const [storedHash, salt] = user.password_hash.split(':');
      const passwordData = crypto.hashPassword(password, salt);
      
      if (passwordData.hash !== storedHash) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Decrypt private key
      const passwordKey = Buffer.from(passwordData.hash.slice(0, 64), 'hex');
      const privateKeyData = JSON.parse(user.private_key_encrypted);
      const privateKey = crypto.decryptAES(privateKeyData, passwordKey);

      // Store current user
      this.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        publicKey: user.public_key,
        privateKey: privateKey,
        identityKey: user.identity_key,
        registrationId: user.registration_id
      };

      // Store credentials securely
      await ipcRenderer.invoke('keychain-set', 'vault-messenger', user.id, password);

      // Generate auth token
      const authToken = this.generateAuthToken(user.id);

      return { 
        success: true, 
        user: this.currentUser,
        authToken: authToken
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async requestPasswordReset(email) {
    try {
      const user = await database.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists for security
        return { 
          success: true, 
          message: 'If this email is registered, you will receive a reset code' 
        };
      }

      const resetCode = this.generateVerificationCode();
      this.resetCodes.set(email, {
        code: resetCode,
        userId: user.id,
        expires: Date.now() + (15 * 60 * 1000) // 15 minutes
      });

      await email.sendPasswordResetEmail(email, user.username, resetCode);

      return { 
        success: true, 
        message: 'Password reset code sent to your email' 
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email, code, newPassword) {
    try {
      const reset = this.resetCodes.get(email);
      
      if (!reset) {
        return { success: false, error: 'No reset code found' };
      }

      if (Date.now() > reset.expires) {
        this.resetCodes.delete(email);
        return { success: false, error: 'Reset code expired' };
      }

      if (reset.code !== code) {
        return { success: false, error: 'Invalid reset code' };
      }

      if (!this.validatePassword(newPassword)) {
        return { 
          success: false, 
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
        };
      }

      // Update password
      const passwordData = crypto.hashPassword(newPassword);
      await database.run(
        'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
        [`${passwordData.hash}:${passwordData.salt}`, Date.now(), reset.userId]
      );

      // Clean up reset code
      this.resetCodes.delete(email);

      return { 
        success: true, 
        message: 'Password reset successfully' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  generateAuthToken(userId) {
    const timestamp = Date.now();
    const random = crypto.generateRandomBytes(16).toString('hex');
    const data = `${userId}:${timestamp}:${random}`;
    
    return Buffer.from(data).toString('base64');
  }

  validateUsername(username) {
    // Username: 3-20 characters, alphanumeric and underscore
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false; // Uppercase
    if (!/[a-z]/.test(password)) return false; // Lowercase
    if (!/[0-9]/.test(password)) return false; // Number
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false; // Special
    return true;
  }
}

module.exports = new AuthService();
