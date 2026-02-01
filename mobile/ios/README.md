# VAULT iOS App

<div align="center">
  <img src="https://img.shields.io/badge/iOS-17.0+-blue.svg" alt="iOS 17.0+"/>
  <img src="https://img.shields.io/badge/Swift-5.9-orange.svg" alt="Swift 5.9"/>
  <img src="https://img.shields.io/badge/Xcode-15.0+-blue.svg" alt="Xcode 15.0+"/>
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"/>
</div>

## Overview

**VAULT iOS** is a native iOS application for the VAULT secure messaging platform. It provides military-grade end-to-end encryption, post-quantum security, and zero-knowledge architecture for iOS devices.

### Key Features

- 🔒 **End-to-End Encryption**: Signal Protocol + MLS for groups
- 🛡️ **Post-Quantum Security**: ML-KEM-768 lattice-based cryptography
- 👁️ **Zero-Knowledge Proofs**: Verify identity without revealing secrets
- 💨 **Ephemeral Messages**: Auto-delete after configurable periods
- 🔐 **Biometric Security**: Face ID / Touch ID support
- 📱 **Native iOS**: Built with SwiftUI and modern iOS frameworks
- 🚀 **Real-time Messaging**: WebSocket-based instant communication
- 🌐 **Offline Support**: Messages stored encrypted locally

## Architecture

```
┌─────────────────────────────────────────────┐
│         SwiftUI User Interface              │
│  (Messages, Contacts, Settings)             │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│         Service Layer                       │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ CryptoService│  │NetworkService│         │
│  │(Encryption) │  │(WebSocket)   │          │
│  └──────┬──────┘  └──────┬───────┘          │
│         │                │                   │
│  ┌──────┴────────────────┴───────┐          │
│  │      SecureStorage             │          │
│  │  (Keychain + Encryption)       │          │
│  └────────────────────────────────┘          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────┴──────────────────────────────┐
│         Rust Crypto Core                    │
│  (C FFI Bridge to libvault_crypto.a)       │
│  - Signal Protocol                          │
│  - ML-KEM-768 (Post-Quantum)                │
│  - Zero-Knowledge Proofs                    │
│  - SHA3-256, Blake3                         │
└─────────────────────────────────────────────┘
```

## Requirements

### Development Environment
- **macOS**: 13.0 (Ventura) or later
- **Xcode**: 15.0 or later
- **iOS Deployment Target**: 17.0+
- **Swift**: 5.9+
- **Rust**: 1.70+ (for building crypto core)

### System Requirements
- **Device**: iPhone running iOS 17.0 or later
- **Storage**: 100+ MB free space
- **Network**: Internet connection for messaging

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/webspoilt/vault.git
cd vault
```

### 2. Set Up iOS Project

```bash
cd mobile/ios
./Scripts/setup_project.sh
```

This script will:
- Check prerequisites
- Clone the main VAULT repository
- Build Rust crypto core
- Install Swift dependencies
- Set up project structure

### 3. Build Rust Crypto Core

The crypto core needs to be built for iOS targets:

```bash
./Scripts/build_rust_crypto.sh
```

This creates `VaultCrypto.xcframework` with support for:
- iOS devices (arm64)
- iOS Simulator (arm64, x86_64)

### 4. Open in Xcode

```bash
open VaultMessenger.xcodeproj
```

### 5. Configure Signing

1. Select the **VaultMessenger** target
2. Go to **Signing & Capabilities**
3. Select your development team
4. Xcode will automatically manage provisioning profiles

### 6. Configure Server URL

Edit `Info.plist` and update:

```xml
<key>VAULT_SERVER_URL</key>
<string>wss://your-server-url/ws</string>
```

### 7. Build and Run

1. Select your target device or simulator
2. Press `⌘R` or click the Run button
3. The app will build and launch

## Project Structure

```
VaultMessenger/
├── App/
│   ├── VaultMessengerApp.swift      # App entry point
│   └── ContentView.swift             # Main navigation
│
├── Features/
│   ├── Authentication/
│   │   └── AuthenticationView.swift  # Login/signup
│   ├── Messaging/
│   │   ├── MessagesListView.swift   # Conversations list
│   │   └── ChatView.swift           # Individual chat
│   ├── Contacts/
│   │   └── ContactsView.swift       # Contacts management
│   └── Settings/
│       └── SettingsView.swift       # App settings
│
├── Core/
│   ├── Models/
│   │   ├── User.swift               # User model
│   │   └── Message.swift            # Message models
│   └── ViewModels/                   # Business logic
│
├── Services/
│   ├── Crypto/
│   │   └── CryptoService.swift      # Encryption service
│   ├── Networking/
│   │   └── NetworkService.swift     # WebSocket client
│   ├── Storage/
│   │   └── SecureStorage.swift      # Keychain wrapper
│   └── Notifications/                # Push notifications
│
├── Bridge/
│   ├── Headers/
│   │   └── RustBridge.h             # C headers for Rust FFI
│   └── VaultBridge.swift            # Swift wrapper
│
├── Resources/
│   ├── Assets.xcassets/             # Images, colors
│   └── Certificates/                # SSL pinning certs
│
└── Info.plist                        # App configuration

Scripts/
├── build_rust_crypto.sh              # Build Rust library
└── setup_project.sh                  # Initial setup

Frameworks/
└── VaultCrypto.xcframework/         # Compiled Rust library

Package.swift                         # Swift Package dependencies
```

## Key Components

### 1. Cryptography (CryptoService)

```swift
// Generate identity keys
await cryptoService.initialize()

// Encrypt message
let ciphertext = try await cryptoService.encrypt(
    message: "Hello, secure world!",
    for: recipientPublicKey
)

// Decrypt message
let plaintext = try await cryptoService.decrypt(
    ciphertext: encryptedData,
    from: senderPublicKey
)
```

### 2. Networking (NetworkService)

```swift
// Connect to server
await networkService.connect()

// Send message
let message = OutgoingMessage(
    recipientId: "user123",
    recipientPublicKey: publicKey,
    content: encryptedContent
)
try await networkService.send(message)

// Receive messages
networkService.messagePublisher
    .sink { serverMessage in
        handleIncomingMessage(serverMessage)
    }
```

### 3. Secure Storage (SecureStorage)

```swift
// Save identity key (Keychain)
SecureStorage.saveIdentityKey(keyData)

// Retrieve identity key
if let key = SecureStorage.getIdentityKey() {
    // Use key
}

// Biometric authentication
BiometricAuth.authenticate(reason: "Access messages") { success, error in
    if success {
        // Authenticated
    }
}
```

## Security Features

### 1. End-to-End Encryption
- **Signal Protocol**: Double Ratchet algorithm
- **Perfect Forward Secrecy**: New keys for each message
- **Deniable Authentication**: No proof of sender

### 2. Post-Quantum Cryptography
- **ML-KEM-768**: NIST-standardized lattice-based encryption
- **Hybrid Mode**: Classical + post-quantum keys
- **Future-proof**: Resistant to quantum attacks

### 3. Zero-Knowledge Proofs
- **Identity Verification**: Prove identity without revealing keys
- **Privacy Preserving**: No metadata leakage
- **Trustless**: Verify without trusted third party

### 4. Local Security
- **Keychain**: Secure key storage with hardware protection
- **Secure Enclave**: Hardware-backed key generation
- **Biometric Lock**: Face ID / Touch ID
- **Memory Protection**: Secure memory wiping

### 5. Network Security
- **TLS 1.3**: Modern transport encryption
- **Certificate Pinning**: Prevent MITM attacks
- **Noise Protocol**: Encrypted WebSocket handshake

## Configuration

### Environment Variables

Create a `.xcconfig` file for different environments:

```ini
// Development.xcconfig
VAULT_SERVER_URL = wss://dev.vault.local/ws
VAULT_API_URL = https://dev.vault.local/api

// Production.xcconfig
VAULT_SERVER_URL = wss://b2g-vault.vercel.app/ws
VAULT_API_URL = https://b2g-vault.vercel.app/api
```

### Build Configurations

1. **Debug**: Development with logging
2. **Release**: Production-ready build
3. **TestFlight**: Beta distribution

## Testing

### Unit Tests

```bash
xcodebuild test \
  -scheme VaultMessenger \
  -destination 'platform=iOS Simulator,name=iPhone 15'
```

### UI Tests

```bash
xcodebuild test \
  -scheme VaultMessenger \
  -testPlan VaultMessengerUITests
```

### Crypto Tests

```bash
cd ../core
cargo test
```

## Building for Distribution

### 1. Archive

```bash
xcodebuild archive \
  -scheme VaultMessenger \
  -archivePath ./Build/VaultMessenger.xcarchive
```

### 2. Export IPA

```bash
xcodebuild -exportArchive \
  -archivePath ./Build/VaultMessenger.xcarchive \
  -exportPath ./Build \
  -exportOptionsPlist ExportOptions.plist
```

### 3. TestFlight

Upload to App Store Connect:

```bash
xcrun altool --upload-app \
  --type ios \
  --file ./Build/VaultMessenger.ipa \
  --username "your@apple.id" \
  --password "@keychain:APP_SPECIFIC_PASSWORD"
```

## Troubleshooting

### Rust Build Fails

```bash
# Update Rust
rustup update

# Add iOS targets
rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios

# Rebuild
./Scripts/build_rust_crypto.sh
```

### Keychain Access Issues

Reset keychain entries:

```swift
SecureStorage.clearAll()
```

### Network Connection Issues

Check server URL in Info.plist and verify network permissions.

### Certificate Pinning Errors

Ensure server certificate is in `Resources/Certificates/` directory.

## Performance Optimization

### 1. Lazy Loading
- Messages loaded on-demand
- Contacts cached locally
- Images loaded asynchronously

### 2. Background Tasks
- Message encryption in background
- Key generation off main thread
- Network operations async

### 3. Memory Management
- Automatic reference counting
- Weak references for delegates
- Secure memory wiping

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - See [LICENSE](../LICENSE) for details.

## Support

- **GitHub Issues**: [Report bugs](https://github.com/webspoilt/vault/issues)
- **Documentation**: [Full docs](https://github.com/webspoilt/vault/wiki)
- **Community**: [Discord server](https://discord.gg/vault)

## Roadmap

- [ ] Group messaging with MLS
- [ ] Voice messages
- [ ] Video calls
- [ ] File attachments
- [ ] Message search
- [ ] iCloud backup
- [ ] iPad optimization
- [ ] watchOS companion app
- [ ] Widget support
- [ ] Siri shortcuts
- [x] **MDM Support** (Managed App Configuration, deployment profiles)
- [x] **Volume Purchasing** (App Store Connect for Business/Education)

---

**VAULT iOS** - Where Messages Go to Never Be Found 🔒

Built with ❤️ for privacy and security
