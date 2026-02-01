# VAULT macOS - Complete Build Guide

This guide provides comprehensive instructions for building the VAULT macOS application from source.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Build (5 Minutes)](#quick-build-5-minutes)
3. [Detailed Build Process](#detailed-build-process)
4. [Configuration](#configuration)
5. [Building for Distribution](#building-for-distribution)
6. [Creating .dmg Installer](#creating-dmg-installer)
7. [Code Signing](#code-signing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **macOS**: 13.0 (Ventura) or later
- **Xcode**: 15.0 or later ([Download](https://developer.apple.com/xcode/))
- **Command Line Tools**: Install via `xcode-select --install`
- **Git**: For cloning repository (usually pre-installed)

### Optional Tools

- **Homebrew**: Package manager for additional dependencies
- **xcpretty**: Prettier xcodebuild output (`gem install xcpretty`)
- **create-dmg**: DMG creation tool (`brew install create-dmg`)

### Verification

```bash
# Check Xcode version
xcodebuild -version
# Should show: Xcode 15.0 or later

# Check macOS version
sw_vers
# ProductVersion should be 13.0 or later

# Check Swift version
swift --version
# Should show: Swift 5.9 or later
```

---

## Quick Build (5 Minutes)

### One-Command Build

```bash
# Navigate to project directory
cd VaultMacOS

# Build and run
xcodebuild -scheme VaultMacOS -configuration Debug -derivedDataPath build | xcpretty && open build/Build/Products/Debug/VAULT.app
```

### Using Xcode GUI

1. Open `VaultMacOS.xcodeproj` in Xcode
2. Select "VaultMacOS" scheme
3. Choose "My Mac" as destination
4. Press `⌘R` to build and run

**Output**: App launches in Debug mode with full logging enabled.

---

## Detailed Build Process

### Step 1: Clone/Extract Project

```bash
# If from GitHub
git clone https://github.com/webspoilt/vault.git
cd vault/macos

# If from ZIP archive
unzip VaultMacOS-Source-v1.0.0.zip
cd VaultMacOS-Source-v1.0.0
```

### Step 2: Install Dependencies

Swift Package Manager (SPM) handles dependencies automatically, but you can manually resolve them:

```bash
# Resolve package dependencies
xcodebuild -resolvePackageDependencies -project VaultMacOS.xcodeproj

# Or using swift package manager directly
swift package resolve
```

**Dependencies** (auto-installed):
- GRDB.swift v6.24.0 - SQLite wrapper
- Sodium v0.9.1 - libsodium cryptography bindings
- Starscream v4.0.6 - WebSocket client
- KeychainAccess v4.2.2 - Keychain management

### Step 3: Configure Settings

#### Edit Config.plist

```bash
# Copy template
cp VaultMacOS/Resources/Config.template.plist VaultMacOS/Resources/Config.plist

# Edit with your values
open -a Xcode VaultMacOS/Resources/Config.plist
```

**Required Configuration**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ResendAPIKey</key>
    <string>re_YOUR_API_KEY_HERE</string>
    
    <key>SenderEmail</key>
    <string>noreply@b2g-vault</string>
    
    <key>RelayServerWebSocket</key>
    <string>wss://vault-relay.onrender.com/v1/stream</string>
    
    <key>RelayServerAPI</key>
    <string>https://vault-relay.onrender.com/v1</string>
    
    <key>Environment</key>
    <string>production</string>
</dict>
</plist>
```

#### Get Resend API Key (Free)

1. Visit https://resend.com/signup
2. Create account (no credit card required)
3. Go to Dashboard → API Keys
4. Create new key with "Sending access"
5. Copy key (starts with `re_`)
6. Paste into Config.plist

**Free Tier Limits**: 3,000 emails/month, 100/day

### Step 4: Build the Project

#### Debug Build (Development)

```bash
# Clean build folder
xcodebuild clean -project VaultMacOS.xcodeproj -scheme VaultMacOS

# Build for debug
xcodebuild build \
  -project VaultMacOS.xcodeproj \
  -scheme VaultMacOS \
  -configuration Debug \
  -derivedDataPath build
  
# Output: build/Build/Products/Debug/VAULT.app
```

#### Release Build (Production)

```bash
# Build for release (optimized)
xcodebuild build \
  -project VaultMacOS.xcodeproj \
  -scheme VaultMacOS \
  -configuration Release \
  -derivedDataPath build
  
# Output: build/Build/Products/Release/VAULT.app
```

#### Universal Binary (Intel + Apple Silicon)

```bash
# Build for both architectures
xcodebuild build \
  -project VaultMacOS.xcodeproj \
  -scheme VaultMacOS \
  -configuration Release \
  -derivedDataPath build \
  -arch x86_64 -arch arm64 \
  ONLY_ACTIVE_ARCH=NO
```

### Step 5: Run the Application

```bash
# Run debug build
open build/Build/Products/Debug/VAULT.app

# Or run with console logs
open -a Console && open build/Build/Products/Debug/VAULT.app
```

---

## Configuration

### Build Configurations

The project includes two build configurations:

#### Debug Configuration

- **Optimization**: None
- **Symbols**: Included
- **Logging**: Verbose
- **Assertions**: Enabled
- **Code Signing**: Development

**File**: `Configuration/Debug.xcconfig`

#### Release Configuration

- **Optimization**: -O (speed)
- **Symbols**: Stripped
- **Logging**: Errors only
- **Assertions**: Disabled
- **Code Signing**: Distribution

**File**: `Configuration/Release.xcconfig`

### Environment Variables

Set in Xcode scheme or via command line:

```bash
# Development mode
VAULT_ENVIRONMENT=development

# Production mode
VAULT_ENVIRONMENT=production

# Enable debug logging
VAULT_DEBUG_LOGGING=YES

# Custom relay server
VAULT_RELAY_SERVER=wss://custom-server.com/v1/stream
```

### Compiler Flags

#### Swift Flags (Release)

```
-whole-module-optimization
-enforce-exclusivity=checked
-Osize (for smaller binary)
```

#### Swift Flags (Debug)

```
-Onone
-enable-testing
-D DEBUG
```

### Info.plist Configuration

Key settings in `VaultMacOS/Resources/Info.plist`:

```xml
<key>CFBundleVersion</key>
<string>1.0.0</string>

<key>NSCameraUsageDescription</key>
<string>VAULT needs camera access for video calls and QR code scanning.</string>

<key>NSMicrophoneUsageDescription</key>
<string>VAULT needs microphone access for voice messages and calls.</string>

<key>LSMinimumSystemVersion</key>
<string>13.0</string>

<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>
```

---

## Building for Distribution

### Step 1: Archive for Distribution

```bash
# Create archive
xcodebuild archive \
  -project VaultMacOS.xcodeproj \
  -scheme VaultMacOS \
  -configuration Release \
  -archivePath build/VaultMacOS.xcarchive \
  CODE_SIGN_IDENTITY="-" \
  CODE_SIGNING_REQUIRED=NO
```

### Step 2: Export Application

Create `ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>mac-application</string>
    
    <key>destination</key>
    <string>export</string>
    
    <key>compileBitcode</key>
    <false/>
    
    <key>stripSwiftSymbols</key>
    <true/>
    
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
```

Export the archive:

```bash
xcodebuild -exportArchive \
  -archivePath build/VaultMacOS.xcarchive \
  -exportPath build/Release \
  -exportOptionsPlist ExportOptions.plist

# Output: build/Release/VAULT.app
```

### Step 3: Verify Binary

```bash
# Check architectures
lipo -info build/Release/VAULT.app/Contents/MacOS/VAULT
# Should show: x86_64 arm64

# Check code signature
codesign -dv --verbose=4 build/Release/VAULT.app

# Check dependencies
otool -L build/Release/VAULT.app/Contents/MacOS/VAULT
```

---

## Creating .dmg Installer

### Method 1: Using create-dmg (Recommended)

```bash
# Install create-dmg
brew install create-dmg

# Create DMG
create-dmg \
  --volname "VAULT Installer" \
  --volicon "VaultMacOS/Resources/Assets.xcassets/AppIcon.appiconset/icon_512x512@2x.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "VAULT.app" 200 190 \
  --hide-extension "VAULT.app" \
  --app-drop-link 600 185 \
  --background "VaultMacOS/Resources/dmg-background.png" \
  "build/VAULT-v1.0.0.dmg" \
  "build/Release/"
```

### Method 2: Using Disk Utility (Manual)

1. Open Disk Utility
2. File → New Image → Blank Image
3. Name: VAULT Installer
4. Size: 200 MB
5. Format: Mac OS Extended (Journaled)
6. Encryption: None
7. Partitions: Single partition
8. Image Format: read/write disk image
9. Click Create

Then:

```bash
# Mount the image
hdiutil attach build/VaultInstaller.dmg

# Copy app
cp -R build/Release/VAULT.app "/Volumes/VAULT Installer/"

# Create Applications symlink
ln -s /Applications "/Volumes/VAULT Installer/Applications"

# Unmount
hdiutil detach "/Volumes/VAULT Installer"

# Convert to read-only compressed
hdiutil convert build/VaultInstaller.dmg \
  -format UDZO \
  -o build/VAULT-v1.0.0.dmg
```

### Method 3: Automated Script

Create `Scripts/create-dmg.sh`:

```bash
#!/bin/bash

VERSION="1.0.0"
APP_NAME="VAULT"
DMG_NAME="${APP_NAME}-v${VERSION}.dmg"
BUILD_DIR="build/Release"
DMG_DIR="build/dmg"

# Clean
rm -rf "$DMG_DIR"
mkdir -p "$DMG_DIR"

# Copy app
cp -R "$BUILD_DIR/$APP_NAME.app" "$DMG_DIR/"

# Create Applications symlink
ln -s /Applications "$DMG_DIR/Applications"

# Create DMG
hdiutil create -volname "$APP_NAME Installer" \
  -srcfolder "$DMG_DIR" \
  -ov -format UDZO \
  "build/$DMG_NAME"

echo "✅ DMG created: build/$DMG_NAME"
```

Make executable and run:

```bash
chmod +x Scripts/create-dmg.sh
./Scripts/create-dmg.sh
```

---

## Code Signing

### Ad-hoc Signing (No Developer Account)

For personal use or distribution outside Mac App Store:

```bash
# Sign the application
codesign --force --deep --sign - build/Release/VAULT.app

# Verify signature
codesign --verify --deep --strict --verbose=2 build/Release/VAULT.app
```

### Developer ID Signing (Recommended)

For distribution outside Mac App Store with verified developer identity:

#### Prerequisites

1. Enroll in Apple Developer Program ($99/year)
2. Request Developer ID Application certificate in Xcode
3. Download and install certificate

#### Signing Process

```bash
# List available identities
security find-identity -v -p codesigning

# Sign with Developer ID
codesign --force --deep \
  --options runtime \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  --timestamp \
  build/Release/VAULT.app

# Verify
codesign --verify --deep --strict --verbose=2 build/Release/VAULT.app
spctl --assess --type exec --verbose build/Release/VAULT.app
```

#### Notarization (Required for macOS 10.15+)

```bash
# Create app-specific password in Apple ID account
# Visit: https://appleid.apple.com/account/manage

# Store credentials
xcrun notarytool store-credentials "vault-notarize" \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password"

# Create zip for notarization
ditto -c -k --keepParent build/Release/VAULT.app build/VAULT.zip

# Submit for notarization
xcrun notarytool submit build/VAULT.zip \
  --keychain-profile "vault-notarize" \
  --wait

# Staple ticket to app
xcrun stapler staple build/Release/VAULT.app

# Verify
spctl --assess -vv --type install build/Release/VAULT.app
```

### App Store Signing

For Mac App Store distribution:

1. Create App Store Connect listing
2. Request App Store distribution certificate
3. Create provisioning profile
4. Configure in Xcode signing settings
5. Archive and upload via Xcode Organizer

---

## Troubleshooting

### Build Errors

#### "No such module 'GRDB'"

**Solution**: Resolve package dependencies

```bash
xcodebuild -resolvePackageDependencies
# Or in Xcode: File → Packages → Resolve Package Versions
```

#### "Code signing error"

**Solution**: Disable code signing for debug builds

```bash
xcodebuild build \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO
```

#### "Cannot find 'Config.plist'"

**Solution**: Copy template and configure

```bash
cp VaultMacOS/Resources/Config.template.plist VaultMacOS/Resources/Config.plist
```

### Runtime Errors

#### "App crashes on launch"

**Solutions**:
1. Check Console.app for crash logs
2. Verify all permissions granted
3. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
4. Clean and rebuild

#### "Cannot connect to relay server"

**Solutions**:
1. Verify relay server is running
2. Check Config.plist has correct URL
3. Verify internet connection
4. Check firewall settings

#### "Email sending fails"

**Solutions**:
1. Verify Resend API key is valid
2. Check sender email is verified in Resend dashboard
3. Verify daily limit not exceeded (100 emails/day on free tier)
4. Check Console.app logs for API errors

### Performance Issues

#### "Build takes too long"

**Solutions**:
1. Enable build parallelization: Xcode → Preferences → Build → Parallel builds
2. Increase build system cache: `defaults write com.apple.dt.XCBuild EnableBuildDebugging -bool YES`
3. Use incremental builds: avoid "Clean Build Folder"

#### "Large binary size"

**Solutions**:
1. Enable Link-Time Optimization (LTO)
2. Strip debug symbols in Release configuration
3. Enable Dead Code Stripping

```bash
# Check binary size
ls -lh build/Release/VAULT.app/Contents/MacOS/VAULT

# Analyze size breakdown
du -sh build/Release/VAULT.app/*
```

---

## Build Optimization

### Compiler Optimizations

#### For Smaller Binary Size

```bash
# Add to Other Swift Flags in Release configuration
-Osize
-whole-module-optimization
-enforce-exclusivity=unchecked
```

#### For Faster Execution

```bash
# Add to Other Swift Flags
-O
-whole-module-optimization
```

### Link-Time Optimization

Enable in Build Settings:
- **Link-Time Optimization**: Yes
- **Strip Debug Symbols**: Yes (Release only)
- **Dead Code Stripping**: Yes

### Asset Catalog Optimization

```bash
# Compress assets
xcrun actool VaultMacOS/Resources/Assets.xcassets \
  --compile build/Assets \
  --platform macosx \
  --minimum-deployment-target 13.0 \
  --compress-pngs
```

---

## Automated Build Scripts

### Complete Build Script

Create `Scripts/build-all.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 VAULT macOS - Complete Build Script"
echo "======================================"

# Configuration
VERSION="1.0.0"
PROJECT="VaultMacOS.xcodeproj"
SCHEME="VaultMacOS"
BUILD_DIR="build"

# Clean
echo "🧹 Cleaning..."
rm -rf "$BUILD_DIR"
xcodebuild clean -project "$PROJECT" -scheme "$SCHEME"

# Resolve dependencies
echo "📦 Resolving dependencies..."
xcodebuild -resolvePackageDependencies -project "$PROJECT"

# Build Release
echo "🔨 Building Release..."
xcodebuild archive \
  -project "$PROJECT" \
  -scheme "$SCHEME" \
  -configuration Release \
  -archivePath "$BUILD_DIR/VaultMacOS.xcarchive" \
  CODE_SIGN_IDENTITY="-" \
  CODE_SIGNING_REQUIRED=NO

# Export
echo "📤 Exporting application..."
xcodebuild -exportArchive \
  -archivePath "$BUILD_DIR/VaultMacOS.xcarchive" \
  -exportPath "$BUILD_DIR/Release" \
  -exportOptionsPlist ExportOptions.plist

# Create DMG
echo "💿 Creating DMG..."
./Scripts/create-dmg.sh

echo "✅ Build complete!"
echo "📁 Output: $BUILD_DIR/VAULT-v$VERSION.dmg"
```

Make executable:

```bash
chmod +x Scripts/build-all.sh
./Scripts/build-all.sh
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build macOS App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-13
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Select Xcode version
      run: sudo xcode-select -s /Applications/Xcode_15.0.app
    
    - name: Show Xcode version
      run: xcodebuild -version
    
    - name: Resolve dependencies
      run: xcodebuild -resolvePackageDependencies -project VaultMacOS.xcodeproj
    
    - name: Build
      run: |
        xcodebuild build \
          -project VaultMacOS.xcodeproj \
          -scheme VaultMacOS \
          -configuration Release \
          CODE_SIGN_IDENTITY="" \
          CODE_SIGNING_REQUIRED=NO
    
    - name: Run tests
      run: |
        xcodebuild test \
          -project VaultMacOS.xcodeproj \
          -scheme VaultMacOS \
          -destination 'platform=macOS'
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: VAULT.app
        path: build/Build/Products/Release/VAULT.app
```

---

## Next Steps

1. **Test Build**: Run on clean macOS to verify functionality
2. **Code Sign**: Set up Developer ID for distribution
3. **Notarize**: Submit to Apple for notarization
4. **Create DMG**: Package for easy installation
5. **Distribute**: Upload to GitHub Releases or website

---

## Support

Need help building? Contact us:

- **GitHub Issues**: https://github.com/webspoilt/vault/issues
- **Email**: dev@vault-messaging.com
- **Documentation**: https://docs.vault-messaging.com

---

**Happy Building!** 🚀
