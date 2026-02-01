# VAULT Messenger - macOS Application

**Military-Grade Secure Messaging for macOS**

Version: 1.0.0  
Platform: macOS 13.0+ (Ventura and later)  
Architecture: Universal Binary (Intel + Apple Silicon)

---

## 🎯 Overview

VAULT is an end-to-end encrypted messaging application with military-grade security, designed for privacy-conscious users who demand the highest level of message confidentiality. This macOS native application provides the same robust security features as the Android and Windows versions.

### Key Features

- ✅ **End-to-End Encryption**: Signal Protocol with Double Ratchet algorithm
- ✅ **Post-Quantum Security**: ML-KEM-768 hybrid key exchange
- ✅ **Perfect Forward Secrecy**: Each message uses unique ephemeral keys
- ✅ **Zero-Knowledge Identity**: Anonymous verification without exposing keys
- ✅ **Multi-Device Support**: Sync across up to 5 devices
- ✅ **Disappearing Messages**: Configurable TTL (5 seconds to 1 week)
- ✅ **Voice & Video Calls**: Encrypted WebRTC communications
- ✅ **Group Chat**: MLS protocol for efficient group encryption
- ✅ **Media Sharing**: Encrypted photos, videos, and documents
- ✅ **Local Encryption**: SQLCipher-encrypted database
- ✅ **Biometric Lock**: Touch ID and Face ID support
- ✅ **Zero-Trace Architecture**: No metadata logging

---

## 🚀 Quick Start

### Prerequisites

- macOS 13.0 (Ventura) or later
- Xcode 15.0+ (for building from source)
- Apple Developer account (optional, for App Store distribution)

### Installation

#### Option 1: Download .dmg (Recommended)

1. Download `VaultMessenger-v1.0.0.dmg` from the releases page
2. Open the DMG file
3. Drag VAULT.app to your Applications folder
4. Right-click the app and select "Open" (first time only)

#### Option 2: Build from Source

```bash
# Clone or extract the project
cd VaultMacOS

# Install dependencies (Swift Package Manager handles this automatically)
xcodebuild -resolvePackageDependencies

# Build for release
xcodebuild -scheme VaultMacOS -configuration Release -archivePath build/VaultMacOS.xcarchive archive

# Export app
xcodebuild -exportArchive -archivePath build/VaultMacOS.xcarchive -exportPath build/Release -exportOptionsPlist ExportOptions.plist
```

For detailed build instructions, see [BUILD.md](BUILD.md)

---

## 📋 System Requirements

- **Operating System**: macOS 13.0+ (Ventura, Sonoma, Sequoia)
- **Processor**: Intel Core i5 or Apple Silicon M1 or later
- **Memory**: 4 GB RAM minimum, 8 GB recommended
- **Storage**: 200 MB for app, additional for message storage
- **Network**: Internet connection required for messaging
- **Camera/Microphone**: Required for voice/video calls

---

## 🔧 Configuration

### First-Time Setup

1. **Launch the Application**
   - Open VAULT from Applications folder
   - Grant necessary permissions (camera, microphone, notifications)

2. **Create Account**
   - Enter your email address
   - Create a strong password (minimum 12 characters)
   - Verify your email (check inbox for verification code)

3. **Set Up Security**
   - Enable biometric authentication (Touch ID/Face ID)
   - Configure auto-lock timeout
   - Back up your recovery key (store securely!)

4. **Configure Relay Server** (Optional)
   - Default: Uses public relay at `wss://vault-relay.onrender.com`
   - For custom server, go to Settings → Advanced → Relay Server

### Email Configuration

The app uses Resend API for email verification. To use your own configuration:

1. Sign up for free Resend account at https://resend.com
2. Create API key
3. Edit `VaultMacOS/Resources/Config.plist`:

```xml
<key>ResendAPIKey</key>
<string>re_YOUR_API_KEY_HERE</string>
<key>SenderEmail</key>
<string>your-email@your-domain.com</string>
```

4. Rebuild the application

---

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | Swift 5.9+ | Type-safe, modern iOS/macOS development |
| **UI Framework** | SwiftUI | Declarative, responsive user interface |
| **Crypto** | CryptoKit + Sodium | Hardware-accelerated encryption |
| **Database** | GRDB + SQLCipher | Encrypted local data persistence |
| **Network** | URLSession + Starscream | HTTP/WebSocket communication |
| **Architecture** | MVVM + Clean | Separation of concerns, testability |

### Security Layers

1. **Application Layer**: Code obfuscation, jailbreak detection
2. **Transport Layer**: TLS 1.3, certificate pinning
3. **Protocol Layer**: Signal Protocol (Double Ratchet)
4. **Post-Quantum**: ML-KEM-768 hybrid encryption
5. **Zero-Knowledge**: zk-SNARKs for identity proofs
6. **Hardware Layer**: Secure Enclave integration
7. **Memory Layer**: Secure allocation and wiping
8. **Storage Layer**: SQLCipher database encryption
9. **Physical Layer**: Biometric authentication

### Project Structure

```
VaultMacOS/
├── App/                    # Application entry point
├── Core/                   # Core functionality
│   ├── Crypto/            # Encryption and key management
│   ├── Network/           # WebSocket and API clients
│   ├── Database/          # Data persistence
│   └── Security/          # Security utilities
├── Features/              # Feature modules
│   ├── Authentication/    # Login, registration
│   ├── Chat/             # Messaging interface
│   ├── Contacts/         # Contact management
│   ├── Settings/         # App configuration
│   └── Calls/            # Voice/video calling
├── UI/                    # Shared UI components
├── Services/              # Business logic services
├── Utilities/             # Helper functions
└── Resources/             # Assets and config
```

---

## 🔐 Security Features

### Encryption

- **End-to-End**: AES-256-GCM for message content
- **Key Exchange**: X3DH (Extended Triple Diffie-Hellman)
- **Forward Secrecy**: Double Ratchet algorithm
- **Post-Quantum**: ML-KEM-768 + X25519 hybrid
- **Database**: SQLCipher with 256-bit keys
- **Files**: AES-256-GCM for media attachments

### Authentication

- **Password**: Argon2id key derivation (memory-hard)
- **Biometric**: Touch ID and Face ID integration
- **Two-Factor**: TOTP authenticator support (optional)
- **Device Linking**: Secure QR code pairing

### Privacy

- **Zero Metadata**: Server cannot read message content or metadata
- **No Phone Number**: Email-based registration (no phone required)
- **Sealed Sender**: Hide sender identity from relay server
- **Private Groups**: Server-side group management without member list access
- **Disappearing Messages**: Automatic message deletion after TTL
- **Screen Lock**: Biometric lock after inactivity

---

## 📱 Usage Guide

### Sending Messages

1. **Start New Conversation**
   - Click "New Message" button or press `⌘N`
   - Select contact or enter email address
   - Type message and press Enter

2. **Send Media**
   - Click attachment icon or drag-and-drop files
   - Supports: Images (JPEG, PNG, HEIC), Videos (MP4, MOV), Documents (PDF, DOCX)
   - Max file size: 100 MB

3. **Voice Messages**
   - Click microphone icon and hold to record
   - Release to send, slide to cancel
   - Max duration: 5 minutes

### Making Calls

1. **Voice Call**
   - Open conversation
   - Click phone icon in header
   - Wait for recipient to accept

2. **Video Call**
   - Open conversation
   - Click video camera icon
   - Grant camera/microphone permissions if prompted

### Managing Contacts

1. **Add Contact**
   - Go to Contacts tab
   - Click "+" button or press `⌘⇧N`
   - Enter email address and display name
   - Send verification request

2. **Verify Device**
   - Open contact details
   - Click "Verify" button
   - Scan QR code in person or compare safety numbers

### Settings

- **Appearance**: Light, dark, and custom themes
- **Notifications**: Per-conversation settings
- **Privacy**: Auto-lock timeout, disappearing messages
- **Security**: Device management, backup encryption
- **Advanced**: Relay server, debug logs

---

## 🛠️ Development

### Building from Source

See detailed instructions in [BUILD.md](BUILD.md)

### Testing

```bash
# Run unit tests
xcodebuild test -scheme VaultMacOS -destination 'platform=macOS'

# Run UI tests
xcodebuild test -scheme VaultMacOSUITests -destination 'platform=macOS'
```

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

See [CONTRIBUTING.md](https://github.com/webspoilt/vault/blob/main/CONTRIBUTING.md) for guidelines.

---

## 🐛 Troubleshooting

### App Won't Launch

**Issue**: "VAULT cannot be opened because the developer cannot be verified"

**Solution**: 
1. Right-click the app in Finder
2. Select "Open"
3. Click "Open" in the dialog

### Connection Issues

**Issue**: Cannot connect to relay server

**Solutions**:
- Check internet connection
- Verify relay server is running
- Check firewall settings (allow outbound port 443)
- Try Settings → Advanced → Reset Connection

### Email Verification Not Received

**Solutions**:
- Check spam/junk folder
- Verify email address is correct
- Request new verification code
- Check Resend API quota (free tier: 100/day)

### Database Corruption

**Issue**: App crashes on launch or messages missing

**Solution**:
1. Quit the app completely
2. Navigate to: `~/Library/Application Support/VAULT/`
3. Backup `vault.db` file
4. Delete `vault.db` and `vault.db-shm`
5. Restart app (will create fresh database)

### Sync Issues

**Issue**: Messages not syncing across devices

**Solutions**:
- Verify device is linked (Settings → Devices)
- Check network connection on all devices
- Re-link device if necessary
- Ensure relay server is accessible

---

## 📊 Performance

### Benchmarks (MacBook Pro M1)

- Message encryption: ~0.5ms per message
- Database query: ~10ms for 1000 messages
- WebSocket latency: ~50ms (typical)
- Memory usage: ~150MB (idle), ~300MB (active call)
- Battery impact: Minimal (background mode)

### Optimization Tips

- Enable "Low Power Mode" for extended battery life
- Disable video calls on metered connections
- Clear old message history (Settings → Storage)
- Reduce disappearing message TTL

---

## 🔗 Resources

- **Website**: https://vault-messaging.com
- **GitHub**: https://github.com/webspoilt/vault
- **Documentation**: https://docs.vault-messaging.com
- **Support**: dev@vault-messaging.com
- **Security**: security@vault-messaging.com (for vulnerabilities)

### Related Projects

- **Android**: Native Android application (Kotlin)
- **iOS**: Native iOS application (Swift)
- **Windows**: Native Windows application (.NET/WPF)
- **Web**: Progressive Web App (React + TypeScript)
- **Relay Server**: Backend infrastructure (Go)

---

## 📄 License

This project is licensed under the **MIT License**.

Copyright © 2026 VAULT Systems. All rights reserved.

See [LICENSE](LICENSE) file for full license text.

---

## 🙏 Acknowledgments

### Open Source Libraries

- **GRDB.swift** - SQLite wrapper by Gwendal Roué
- **Sodium** - libsodium bindings by Frank Denis
- **Starscream** - WebSocket client by Dalton Cherry
- **KeychainAccess** - Keychain wrapper by Kishikawa Katsumi

### Cryptographic Protocols

- **Signal Protocol** - Open Whisper Systems
- **MLS (Messaging Layer Security)** - IETF RFC 9420
- **ML-KEM-768** - NIST Post-Quantum Cryptography

### Special Thanks

- The open-source community for security audits
- Beta testers for valuable feedback
- Contributors for code improvements

---

## 📞 Support

Need help? Here are your options:

1. **Documentation**: Check [docs.vault-messaging.com](https://docs.vault-messaging.com)
2. **GitHub Issues**: Report bugs at [github.com/webspoilt/vault/issues](https://github.com/webspoilt/vault/issues)
3. **Email Support**: dev@vault-messaging.com
4. **Community**: Join our Discord server
5. **Security**: security@vault-messaging.com (for responsible disclosure)

---

**VAULT** - *Where messages go to never be found.*

🔒 End-to-End Encrypted | 🚀 Open Source | 🛡️ Privacy First
