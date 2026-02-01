# Building and Deploying VAULT iOS App

## Complete Build Guide

### Prerequisites

1. **macOS System**
   - macOS 13.0 (Ventura) or later
   - At least 8GB RAM
   - 10GB free disk space

2. **Development Tools**
   ```bash
   # Install Xcode from App Store
   # or download from developer.apple.com
   
   # Install Xcode Command Line Tools
   xcode-select --install
   
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

3. **iOS Development Certificate**
   - Apple Developer account (free or paid)
   - Development certificate
   - Provisioning profile

### Step-by-Step Build Process

#### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/webspoilt/vault.git
cd vault

# Navigate to iOS directory
cd ios  # or create this directory

# Run setup script
chmod +x Scripts/setup_project.sh
./Scripts/setup_project.sh
```

#### 2. Build Rust Crypto Core

```bash
# Add iOS targets
rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios

# Build for all targets
chmod +x Scripts/build_rust_crypto.sh
./Scripts/build_rust_crypto.sh
```

This creates `Frameworks/VaultCrypto.xcframework` containing:
- `ios-arm64/` - For physical iOS devices
- `ios-arm64-simulator/` - For M1/M2 Mac simulators
- `ios-x86_64-simulator/` - For Intel Mac simulators

#### 3. Open in Xcode

```bash
open VaultMessenger.xcodeproj
```

#### 4. Configure Project Settings

In Xcode:

**A. General Tab**
- **Display Name**: VAULT
- **Bundle Identifier**: com.yourcompany.vault.messenger
- **Version**: 1.0.0
- **Build**: 1
- **Deployment Target**: iOS 17.0

**B. Signing & Capabilities**
- Select your Team
- Enable "Automatically manage signing"
- Or manually select provisioning profile

Required Capabilities:
- Push Notifications
- Background Modes (fetch, remote-notification)
- Keychain Sharing
- App Groups (group.com.vault.messenger)

**C. Build Settings**
- **Architectures**: arm64
- **Build Active Architecture Only**: NO (for Release)
- **Enable Bitcode**: NO
- **Other Linker Flags**: 
  ```
  -ObjC
  -lc++
  -framework Security
  -framework LocalAuthentication
  ```

#### 5. Configure Info.plist

Update server URL and permissions:

```xml
<key>VAULT_SERVER_URL</key>
<string>wss://your-server.com/ws</string>

<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>your-server.com</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSExceptionRequiresForwardSecrecy</key>
            <true/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.3</string>
        </dict>
    </dict>
</dict>
```

#### 6. Install Swift Dependencies

```bash
# Using Swift Package Manager (automatic in Xcode)
# Or manually:
swift package resolve
swift package update
```

#### 7. Build for Simulator

```bash
# Command line
xcodebuild \
  -scheme VaultMessenger \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  clean build

# Or in Xcode: ⌘B
```

#### 8. Build for Device

```bash
# Command line
xcodebuild \
  -scheme VaultMessenger \
  -sdk iphoneos \
  -configuration Release \
  clean build

# Or in Xcode:
# 1. Select your device
# 2. Product > Build (⌘B)
```

### Testing

#### Unit Tests

```bash
xcodebuild test \
  -scheme VaultMessenger \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:VaultMessengerTests
```

#### UI Tests

```bash
xcodebuild test \
  -scheme VaultMessenger \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:VaultMessengerUITests
```

### Distribution

#### 1. Create Archive

```bash
xcodebuild archive \
  -scheme VaultMessenger \
  -sdk iphoneos \
  -archivePath ./Build/VaultMessenger.xcarchive \
  -configuration Release
```

#### 2. Export for App Store

Create `ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
```

Export IPA:

```bash
xcodebuild -exportArchive \
  -archivePath ./Build/VaultMessenger.xcarchive \
  -exportPath ./Build \
  -exportOptionsPlist ExportOptions.plist
```

#### 3. Upload to App Store Connect

```bash
# Using Xcode
# Xcode > Product > Archive
# Organizer > Distribute App > App Store Connect

# Or using command line
xcrun altool --upload-app \
  --type ios \
  --file ./Build/VaultMessenger.ipa \
  --username "your@apple.id" \
  --password "@keychain:APP_SPECIFIC_PASSWORD"
```

#### 4. TestFlight Distribution

Create `ExportOptions-TestFlight.plist`:

```xml
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
```

Export and upload for TestFlight beta testing.

### Certificate Pinning Setup

1. **Export Server Certificate**

```bash
# Download certificate
openssl s_client -connect your-server.com:443 < /dev/null | \
  openssl x509 -outform DER > vault-server.cer

# Copy to project
cp vault-server.cer VaultMessenger/Resources/Certificates/
```

2. **Add to Xcode**
   - Drag certificate into Xcode
   - Target: VaultMessenger
   - Check "Copy items if needed"

### Continuous Integration

#### GitHub Actions

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        targets: aarch64-apple-ios
    
    - name: Build Rust Core
      run: ./Scripts/build_rust_crypto.sh
    
    - name: Build iOS App
      run: |
        xcodebuild \
          -scheme VaultMessenger \
          -sdk iphonesimulator \
          -destination 'platform=iOS Simulator,name=iPhone 15' \
          clean build
    
    - name: Run Tests
      run: |
        xcodebuild test \
          -scheme VaultMessenger \
          -destination 'platform=iOS Simulator,name=iPhone 15'
```

### Troubleshooting

#### Common Issues

1. **Rust Build Fails**
   ```bash
   # Clean and rebuild
   cargo clean
   ./Scripts/build_rust_crypto.sh
   ```

2. **Xcode Can't Find Framework**
   - Check Frameworks/ directory exists
   - Verify VaultCrypto.xcframework is present
   - Clean build folder (⇧⌘K)
   - Delete DerivedData

3. **Signing Errors**
   - Check Apple Developer portal
   - Regenerate certificates
   - Update provisioning profiles

4. **Simulator Crashes**
   - Check architecture matches (arm64 vs x86_64)
   - Rebuild Rust library for simulator

5. **Network Errors**
   - Verify server URL in Info.plist
   - Check App Transport Security settings
   - Test certificate pinning

### Performance Optimization

#### Build Time

```bash
# Use cached builds
xcodebuild \
  -scheme VaultMessenger \
  -derivedDataPath ./DerivedData \
  build
```

#### App Size

- Enable App Thinning
- Strip symbols in Release
- Use asset catalogs
- Compress images

### Monitoring

#### Crash Reporting

Integrate Firebase Crashlytics or similar:

```swift
// AppDelegate
import FirebaseCrashlytics

func application(_ application: UIApplication, 
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    return true
}
```

#### Analytics

```swift
// Track key events
Analytics.logEvent("message_sent", parameters: [
    "encryption_type": "signal_protocol"
])
```

---

## Quick Reference

```bash
# Full build pipeline
./Scripts/setup_project.sh
./Scripts/build_rust_crypto.sh
open VaultMessenger.xcodeproj
# Build in Xcode (⌘B)

# Clean build
xcodebuild clean
rm -rf Build DerivedData
./Scripts/build_rust_crypto.sh

# Run tests
xcodebuild test -scheme VaultMessenger

# Archive for distribution
xcodebuild archive -scheme VaultMessenger
```
