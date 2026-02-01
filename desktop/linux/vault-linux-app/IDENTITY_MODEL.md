# VAULT Messenger - Identity Model

## Overview

VAULT Messenger uses a **hybrid identity model** that supports both:
1. **One Identity Per Account** (Primary - Recommended)
2. **Multi-Device Identities** (Optional)

This provides flexibility while maintaining the highest security standards.

---

## Identity Model 1: One Identity Per Account (Default)

### How It Works

- **One account = One identity key pair**
- All devices use the same identity
- Messages encrypted to your identity can be read on any linked device
- Simpler key management

### Architecture

```
User Account
    ├── Identity Key Pair (X25519)
    │   ├── Public Key (shared with contacts)
    │   └── Private Key (encrypted with password)
    ├── Registration ID (unique identifier)
    └── Linked Devices
        ├── Device 1 (Desktop Linux)
        ├── Device 2 (Laptop)
        └── Device 3 (Tablet)
           (Max 5 devices)
```

### Security Features

- **Password-Protected Private Key**: Your identity private key is encrypted with your master password
- **Device Authentication**: Each device has its own session key
- **Revocation**: Can revoke access to specific devices
- **Backup**: Single identity makes backup/restore easier

### Implementation

```javascript
// When registering
const identityKeyPair = crypto.generateIdentityKeyPair();
const registrationId = crypto.generateRegistrationId();

// Store identity
await database.createUser({
  id: userId,
  identityKey: identityKeyPair.publicKey,
  privateKeyEncrypted: encryptWithPassword(identityKeyPair.privateKey, password),
  registrationId: registrationId
});

// When linking new device
const deviceId = generateDeviceId();
const deviceSession = createDeviceSession(identityKeyPair, deviceId);
await syncMessagesTo(deviceId);
```

### Pros

✅ Simpler key management  
✅ Easier device linking  
✅ Unified message history  
✅ Single backup needed  
✅ Better for most users  

### Cons

❌ If identity key compromised, all devices affected  
❌ Less isolation between devices  

---

## Identity Model 2: Multi-Device Identities (Optional)

### How It Works

- **Each device has its own identity key pair**
- Messages encrypted separately for each device
- More complex but higher isolation
- Used for high-security scenarios

### Architecture

```
User Account
    ├── Master Key (for authentication)
    └── Device Identities
        ├── Desktop Identity
        │   ├── Identity Key Pair
        │   ├── Registration ID
        │   └── Pre-Keys (100)
        ├── Laptop Identity
        │   ├── Identity Key Pair
        │   ├── Registration ID
        │   └── Pre-Keys (100)
        └── Tablet Identity
            ├── Identity Key Pair
            ├── Registration ID
            └── Pre-Keys (100)
```

### Security Features

- **Device Isolation**: Compromise of one device doesn't affect others
- **Separate Sessions**: Each device maintains its own Signal Protocol sessions
- **Independent Key Rotation**: Keys rotated per device
- **Granular Control**: Different security levels per device

### Implementation

```javascript
// When registering new device
const deviceId = generateDeviceId();
const deviceIdentity = crypto.generateIdentityKeyPair();
const deviceRegistrationId = crypto.generateRegistrationId();

// Store device identity
await database.createDeviceIdentity({
  userId: userId,
  deviceId: deviceId,
  identityKey: deviceIdentity.publicKey,
  privateKeyEncrypted: encryptWithPassword(deviceIdentity.privateKey, password),
  registrationId: deviceRegistrationId
});

// Generate pre-keys for this device
const preKeys = crypto.generatePreKeys(100);
await database.storePreKeys(deviceId, preKeys);

// When sending message
const devices = await getRecipientDevices(recipientId);
for (const device of devices) {
  const encryptedMessage = await encryptForDevice(message, device.identityKey);
  await sendMessage(recipientId, device.deviceId, encryptedMessage);
}
```

### Pros

✅ Higher device isolation  
✅ Granular security control  
✅ Better for high-security scenarios  
✅ Compromised device doesn't affect others  

### Cons

❌ More complex key management  
❌ Higher bandwidth (multiple encryption)  
❌ Longer message sync time  
❌ More storage required  

---

## Choosing Your Identity Model

### Use **One Identity Per Account** if:

- You're a typical user wanting convenience
- You trust all your devices equally
- You want simpler setup and backup
- You prioritize ease of use

### Use **Multi-Device Identities** if:

- You need maximum security isolation
- You use shared/untrusted devices
- You're in a high-threat environment
- You prioritize security over convenience

---

## Implementation in VAULT

### Configuration

Edit `config.js`:

```javascript
CRYPTO: {
  // Set identity model
  IDENTITY_MODEL: 'single', // or 'multi'
  
  // For multi-device model
  MAX_DEVICES: 5,
  SEPARATE_DEVICE_KEYS: true
}
```

### Database Schema

#### Single Identity Model

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  identity_key TEXT NOT NULL,
  private_key_encrypted TEXT NOT NULL,
  registration_id INTEGER NOT NULL,
  -- Other fields...
);

CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  last_seen INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Multi-Device Identity Model

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  master_key_hash TEXT NOT NULL,
  -- Other fields...
);

CREATE TABLE device_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  identity_key TEXT NOT NULL,
  private_key_encrypted TEXT NOT NULL,
  registration_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, device_id)
);
```

---

## Key Rotation

### Single Identity Model

- **Signed Pre-Key**: Rotated every 7 days
- **One-Time Pre-Keys**: Consumed and regenerated
- **Identity Key**: Never rotated (unless compromised)

### Multi-Device Identity Model

- **Signed Pre-Key**: Rotated every 7 days per device
- **One-Time Pre-Keys**: Per device, consumed and regenerated
- **Identity Key**: Per device, never rotated

---

## Message Encryption Flow

### Single Identity Model

```
Sender                     Recipient
  ├─ Encrypt Message       ├─ Identity Key
  │  with Recipient's      │  (shared across devices)
  │  Identity Key          │
  └─ Send Once             └─ All devices can decrypt
```

### Multi-Device Identity Model

```
Sender                     Recipient Devices
  ├─ Get all device        ├─ Device 1: Identity Key 1
  │  identity keys         ├─ Device 2: Identity Key 2
  ├─ Encrypt message       └─ Device 3: Identity Key 3
  │  for each device       
  └─ Send to each device   Each device decrypts with
                           its own key
```

---

## Device Linking

### Single Identity Model

1. Generate QR code with identity key + session token
2. Scan QR code on new device
3. Transfer identity key (encrypted)
4. New device ready immediately

### Multi-Device Identity Model

1. Generate QR code with master key + session token
2. Scan QR code on new device
3. Generate new identity key pair on device
4. Upload public key to server
5. Synchronize messages for all device identities

---

## Security Considerations

### Both Models

- ✅ End-to-End Encryption (Signal Protocol)
- ✅ Forward Secrecy (Double Ratchet)
- ✅ Post-Quantum Ready (ML-KEM-768)
- ✅ Zero-Knowledge Server
- ✅ Encrypted Local Storage

### Single Identity Model

⚠️ **Risk**: If identity key is compromised, all device sessions are affected  
✅ **Mitigation**: Strong password protection, secure key storage, regular device audits

### Multi-Device Identity Model

⚠️ **Complexity**: More keys to manage, higher sync overhead  
✅ **Benefit**: Device compromise is isolated, doesn't affect other devices

---

## Recommendation

For **VAULT Messenger Linux**, we recommend:

**Default: One Identity Per Account**
- Simpler for users
- Adequate security for most scenarios
- Easier backup/restore
- Better UX

**Optional: Multi-Device Identities**
- Enable in settings for high-security users
- Requires understanding of trade-offs
- Recommended for enterprise/government use

---

## Migration

You can switch between identity models, but it requires:

1. **Backing up messages**
2. **Re-generating identity keys**
3. **Re-establishing sessions with contacts**
4. **Re-linking all devices**

**Warning**: This process will require contacts to re-verify your identity.

---

## Future Enhancements

### Version 2.0 Roadmap

- **Hybrid Model**: Combine benefits of both
- **Group Device Identities**: Share identity across trusted devices
- **Time-Limited Keys**: Temporary device access
- **Hierarchical Key Management**: Master key → Device keys
- **Hardware Token Support**: YubiKey, Nitrokey integration

---

## API Reference

### Single Identity

```javascript
// Initialize identity
await auth.register(username, email, password, {
  identityModel: 'single'
});

// Link device
await auth.linkDevice(qrCode);

// Revoke device
await auth.revokeDevice(deviceId);
```

### Multi-Device

```javascript
// Initialize identity
await auth.register(username, email, password, {
  identityModel: 'multi'
});

// Add device identity
await auth.addDeviceIdentity(deviceName);

// Revoke device identity
await auth.revokeDeviceIdentity(deviceId);
```

---

## Conclusion

VAULT Messenger's hybrid identity model provides:

✅ **Flexibility**: Choose what works for you  
✅ **Security**: Both models are cryptographically secure  
✅ **Scalability**: Supports 1-5 devices efficiently  
✅ **Privacy**: Your keys, your choice  

Choose the model that fits your threat model and usability needs.

---

**Last Updated**: February 2026  
**Version**: 1.0.0
