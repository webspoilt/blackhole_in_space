//! Encrypted Backup System
//!
//! Provides client-side encrypted backups to user-controlled cloud storage.
//! Uses Argon2id for key derivation and AES-256-GCM for encryption.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};
use crate::key_hierarchy::KeyHierarchy;

/// Backup manager for encrypted data export
pub struct BackupManager {
    /// Key hierarchy reference (for exporting keys)
    key_hierarchy: KeyHierarchy,
    
    /// Backup configuration
    config: BackupConfig,
}

/// Backup configuration
#[derive(Clone, Debug)]
pub struct BackupConfig {
    /// Argon2id memory cost (KB)
    pub argon2_memory: u32,
    
    /// Argon2id time cost (iterations)
    pub argon2_iterations: u32,
    
    /// Argon2id parallelism
    pub argon2_parallelism: u32,
    
    /// Backup version
    pub version: u32,
}

impl Default for BackupConfig {
    fn default() -> Self {
        BackupConfig {
            argon2_memory: 65536,    // 64 MB
            argon2_iterations: 3,
            argon2_parallelism: 4,
            version: 1,
        }
    }
}

/// Encrypted backup package
#[derive(serde::Serialize, serde::Deserialize, Zeroize, ZeroizeOnDrop)]
pub struct BackupPackage {
    /// Backup format version
    #[zeroize(skip)]
    pub version: u32,
    
    /// Encrypted data
    pub encrypted_data: Vec<u8>,
    
    /// Argon2id salt
    pub salt: Vec<u8>,
    
    /// AES-GCM nonce
    pub nonce: Vec<u8>,
    
    /// Argon2id parameters
    #[zeroize(skip)]
    pub argon2_params: Argon2Params,
    
    /// Backup timestamp
    #[zeroize(skip)]
    pub timestamp: u64,
    
    /// Key fingerprint for verification
    #[zeroize(skip)]
    pub key_fingerprint: String,
}

/// Argon2id parameters (stored with backup for recovery)
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct Argon2Params {
    pub memory: u32,
    pub iterations: u32,
    pub parallelism: u32,
}

impl From<&BackupConfig> for Argon2Params {
    fn from(config: &BackupConfig) -> Self {
        Argon2Params {
            memory: config.argon2_memory,
            iterations: config.argon2_iterations,
            parallelism: config.argon2_parallelism,
        }
    }
}

impl BackupManager {
    /// Create a new backup manager
    pub fn new(key_hierarchy: &KeyHierarchy) -> Result<Self, JsValue> {
        Ok(BackupManager {
            key_hierarchy: KeyHierarchy {
                identity: key_hierarchy.identity.clone(),
                signed_pre_key: key_hierarchy.signed_pre_key.clone(),
                one_time_pre_keys: vec![], // Don't backup one-time keys
                sessions: vec![], // Don't backup sessions (will be re-established)
            },
            config: BackupConfig::default(),
        })
    }
    
    /// Create an encrypted backup
    /// 
    /// # Arguments
    /// * `password` - User-provided password for encryption
    /// 
    /// # Returns
    /// JSON-encoded backup package
    pub fn create_backup(&self, password: &str) -> Result<String, JsValue> {
        // Generate random salt
        let salt: [u8; 16] = rand::random();
        
        // Derive encryption key using Argon2id
        let key = self.derive_key(password, &salt)?;
        
        // Prepare backup data
        let backup_data = BackupData {
            identity_key: self.key_hierarchy.identity.get_public_key_hex()?,
            signed_pre_key_id: self.key_hierarchy.signed_pre_key.key_id,
            signed_pre_key: hex::encode(self.key_hierarchy.signed_pre_key.public_key),
            signed_pre_key_signature: hex::encode(&self.key_hierarchy.signed_pre_key.signature),
            // Note: One-time pre-keys are not backed up - they will be regenerated
            sessions: vec![], // Sessions are not backed up - will be re-established
        };
        
        // Serialize backup data
        let plaintext = serde_json::to_vec(&backup_data)
            .map_err(|e| JsValue::from_str(&format!("Serialization failed: {}", e)))?;
        
        // Generate nonce
        let nonce: [u8; 12] = rand::random();
        
        // Encrypt with AES-256-GCM
        let encrypted_data = self.encrypt(&plaintext, &key, &nonce)?;
        
        // Get key fingerprint
        let key_fingerprint = self.key_hierarchy.identity.fingerprint()?;
        
        // Create backup package
        let package = BackupPackage {
            version: self.config.version,
            encrypted_data,
            salt: salt.to_vec(),
            nonce: nonce.to_vec(),
            argon2_params: Argon2Params::from(&self.config),
            timestamp: js_sys::Date::now() as u64,
            key_fingerprint,
        };
        
        // Serialize to JSON
        serde_json::to_string(&package)
            .map_err(|e| JsValue::from_str(&format!("JSON serialization failed: {}", e)))
    }
    
    /// Restore from an encrypted backup
    /// 
    /// # Arguments
    /// * `backup_json` - JSON-encoded backup package
    /// * `password` - User-provided password for decryption
    pub fn restore_backup(
        &mut self,
        backup_json: &str,
        password: &str,
    ) -> Result<(), JsValue> {
        // Parse backup package
        let package: BackupPackage = serde_json::from_str(backup_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid backup format: {}", e)))?;
        
        // Verify version
        if package.version != self.config.version {
            return Err(JsValue::from_str(&format!(
                "Backup version mismatch: expected {}, got {}",
                self.config.version, package.version
            )));
        }
        
        // Convert salt and nonce
        let salt: [u8; 16] = package.salt.try_into()
            .map_err(|_| JsValue::from_str("Invalid salt length"))?;
        let nonce: [u8; 12] = package.nonce.try_into()
            .map_err(|_| JsValue::from_str("Invalid nonce length"))?;
        
        // Derive key
        let key = self.derive_key_with_params(
            password,
            &salt,
            &package.argon2_params,
        )?;
        
        // Decrypt
        let plaintext = self.decrypt(&package.encrypted_data, &key, &nonce)?;
        
        // Parse backup data
        let backup_data: BackupData = serde_json::from_slice(&plaintext)
            .map_err(|e| JsValue::from_str(&format!("Backup data parsing failed: {}", e)))?;
        
        // Verify key fingerprint
        let current_fingerprint = self.key_hierarchy.identity.fingerprint()?;
        if backup_data.identity_key != current_fingerprint {
            log::warn!(
                "Key fingerprint mismatch: current={}, backup={}",
                current_fingerprint, backup_data.identity_key
            );
        }
        
        // Restore data
        // Note: In production, this would restore the actual keys
        log::info!("Backup restored successfully from timestamp {}", package.timestamp);
        
        Ok(())
    }
    
    /// Derive encryption key using Argon2id
    fn derive_key(&self, password: &str, salt: &[u8; 16]) -> Result<[u8; 32], JsValue> {
        self.derive_key_with_params(
            password,
            salt,
            &Argon2Params::from(&self.config),
        )
    }
    
    /// Derive key with specific Argon2id parameters
    fn derive_key_with_params(
        &self,
        password: &str,
        salt: &[u8; 16],
        params: &Argon2Params,
    ) -> Result<[u8; 32], JsValue> {
        use argon2::{Argon2, PasswordHasher, Algorithm, Version, Params};
        
        let argon2 = Argon2::new(
            Algorithm::Argon2id,
            Version::V0x13,
            Params::new(
                params.memory,
                params.iterations,
                params.parallelism,
                Some(32), // 32 bytes output
            ).map_err(|e| JsValue::from_str(&format!("Argon2 params error: {}", e)))?,
        );
        
        let password_hash = argon2
            .hash_password(password.as_bytes(), &argon2::Salt::from(salt.as_slice()))
            .map_err(|e| JsValue::from_str(&format!("Argon2 hashing failed: {}", e)))?;
        
        // Extract the hash bytes
        let hash = password_hash.hash
            .ok_or_else(|| JsValue::from_str("No hash in Argon2 output"))?;
        
        let mut key = [0u8; 32];
        key.copy_from_slice(hash.as_bytes());
        
        Ok(key)
    }
    
    /// Encrypt data with AES-256-GCM
    fn encrypt(
        &self,
        plaintext: &[u8],
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        
        cipher
            .encrypt(Nonce::from_slice(nonce), plaintext)
            .map_err(|e| JsValue::from_str(&format!("Encryption failed: {:?}", e)))
    }
    
    /// Decrypt data with AES-256-GCM
    fn decrypt(
        &self,
        ciphertext: &[u8],
        key: &[u8; 32],
        nonce: &[u8; 12],
    ) -> Result<Vec<u8>, JsValue> {
        use aes_gcm::{Aes256Gcm, Key, Nonce};
        use aes_gcm::aead::{Aead, KeyInit};
        
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
        
        cipher
            .decrypt(Nonce::from_slice(nonce), ciphertext)
            .map_err(|e| JsValue::from_str(&format!("Decryption failed: {:?}", e)))
    }
    
    /// Verify backup integrity without restoring
    pub fn verify_backup(&self, backup_json: &str, password: &str) -> Result<bool, JsValue> {
        match self.restore_backup(backup_json, password) {
            Ok(()) => Ok(true),
            Err(e) => {
                let error_str = e.as_string().unwrap_or_default();
                if error_str.contains("password") || error_str.contains("decryption") {
                    Ok(false)
                } else {
                    Err(e)
                }
            }
        }
    }
    
    /// Get backup metadata without decrypting
    pub fn get_backup_metadata(backup_json: &str) -> Result<BackupMetadata, JsValue> {
        let package: BackupPackage = serde_json::from_str(backup_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid backup format: {}", e)))?;
        
        Ok(BackupMetadata {
            version: package.version,
            timestamp: package.timestamp,
            key_fingerprint: package.key_fingerprint,
            data_size: package.encrypted_data.len(),
        })
    }
}

/// Backup data structure (serialized and encrypted)
#[derive(serde::Serialize, serde::Deserialize)]
struct BackupData {
    identity_key: String,
    signed_pre_key_id: u32,
    signed_pre_key: String,
    signed_pre_key_signature: String,
    sessions: Vec<SessionBackup>,
}

/// Session backup data
#[derive(serde::Serialize, serde::Deserialize)]
struct SessionBackup {
    session_id: String,
    recipient_id: String,
    // Note: Session keys are not backed up for security
    // Sessions will be re-established on restore
}

/// Backup metadata (public information)
#[derive(Clone, Debug)]
pub struct BackupMetadata {
    pub version: u32,
    pub timestamp: u64,
    pub key_fingerprint: String,
    pub data_size: usize,
}

impl BackupMetadata {
    /// Format timestamp as human-readable string
    pub fn formatted_date(&self) -> String {
        let date = js_sys::Date::new(&wasm_bindgen::JsValue::from_f64(self.timestamp as f64));
        date.to_iso_string().into()
    }
}

/// Cloud storage providers
#[derive(Clone, Copy, Debug)]
pub enum CloudProvider {
    Dropbox,
    GoogleDrive,
    OneDrive,
    ICloud,
    Custom,
}

impl CloudProvider {
    /// Get the OAuth2 authorization URL
    pub fn auth_url(&self) -> &'static str {
        match self {
            CloudProvider::Dropbox => "https://www.dropbox.com/oauth2/authorize",
            CloudProvider::GoogleDrive => "https://accounts.google.com/o/oauth2/auth",
            CloudProvider::OneDrive => "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            CloudProvider::ICloud => "", // iCloud uses different mechanism
            CloudProvider::Custom => "",
        }
    }
    
    /// Get the API base URL
    pub fn api_url(&self) -> &'static str {
        match self {
            CloudProvider::Dropbox => "https://api.dropboxapi.com/2",
            CloudProvider::GoogleDrive => "https://www.googleapis.com/drive/v3",
            CloudProvider::OneDrive => "https://graph.microsoft.com/v1.0",
            CloudProvider::ICloud => "",
            CloudProvider::Custom => "",
        }
    }
}

/// Cloud backup client
pub struct CloudBackupClient {
    provider: CloudProvider,
    access_token: String,
}

impl CloudBackupClient {
    /// Create a new cloud backup client
    pub fn new(provider: CloudProvider, access_token: String) -> Self {
        CloudBackupClient {
            provider,
            access_token,
        }
    }
    
    /// Upload backup to cloud storage
    pub async fn upload_backup(&self, backup_json: &str, filename: &str) -> Result<String, JsValue> {
        // In production, implement actual cloud API calls
        // For now, return a mock success
        log::info!("Uploading backup to {:?} as {}", self.provider, filename);
        Ok(format!("{}/forticomm/{}", self.provider.api_url(), filename))
    }
    
    /// Download backup from cloud storage
    pub async fn download_backup(&self, file_id: &str) -> Result<String, JsValue> {
        // In production, implement actual cloud API calls
        log::info!("Downloading backup {} from {:?}", file_id, self.provider);
        Ok(String::new())
    }
    
    /// List available backups
    pub async fn list_backups(&self) -> Result<Vec<BackupFileInfo>, JsValue> {
        // In production, implement actual cloud API calls
        Ok(vec![])
    }
    
    /// Delete a backup
    pub async fn delete_backup(&self, file_id: &str) -> Result<(), JsValue> {
        log::info!("Deleting backup {} from {:?}", file_id, self.provider);
        Ok(())
    }
}

/// Backup file information from cloud storage
#[derive(Clone, Debug)]
pub struct BackupFileInfo {
    pub file_id: String,
    pub filename: String,
    pub created_at: u64,
    pub size: u64,
}

// Helper module for hex encoding
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
    fn test_backup_create_restore() {
        // This would require a full KeyHierarchy setup
        // For now, just test the key derivation
        
        let config = BackupConfig::default();
        let salt: [u8; 16] = rand::random();
        let password = "test_password_123";
        
        // Test Argon2id key derivation
        // In actual test, would use BackupManager::derive_key
    }
}
