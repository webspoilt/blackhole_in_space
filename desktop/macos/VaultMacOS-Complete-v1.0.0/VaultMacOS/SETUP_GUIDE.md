# VAULT macOS - Quick Setup Guide

Get up and running in 10 minutes!

---

## ⚡ Quick Start (For Developers)

### 1. Prerequisites

✅ macOS 13.0+ (Ventura or later)  
✅ Xcode 15.0+  
✅ Git (for cloning)  

**Check your setup:**
```bash
sw_vers  # Check macOS version
xcodebuild -version  # Check Xcode version
```

### 2. Get Free API Keys

#### Resend (Email Service)

1. Go to https://resend.com/signup
2. Sign up (no credit card)
3. Dashboard → API Keys → "Create API Key"
4. Copy the key (starts with `re_`)
5. Keep it handy!

**Free Tier:** 3,000 emails/month, 100/day

#### Relay Server (Optional - Use Default)

Default server is pre-configured: `wss://vault-relay.onrender.com`

To deploy your own:
1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Point to relay server repository
5. Copy your URL

---

## 🚀 Installation

### Step 1: Download Project

```bash
# Extract the ZIP file
unzip VaultMacOS-Complete-v1.0.0.zip
cd VaultMacOS
```

### Step 2: Configure API Keys

Open `VaultMacOS/Resources/Config.plist` and update:

```xml
<key>ResendAPIKey</key>
<string>re_YOUR_API_KEY_HERE</string>

<key>SenderEmail</key>
<string>noreply@b2g-vault</string>

<!-- Optional: Use default relay server -->
<key>RelayServerWebSocket</key>
<string>wss://vault-relay.onrender.com/v1/stream</string>
```

**⚠️ Important:** Replace `re_YOUR_API_KEY_HERE` with your actual Resend API key!

### Step 3: Open in Xcode

```bash
open VaultMacOS.xcodeproj
```

Or double-click `VaultMacOS.xcodeproj` in Finder.

### Step 4: Install Dependencies

Xcode will automatically resolve Swift Package dependencies.

If not:
- Xcode → File → Packages → Resolve Package Versions

Wait for dependencies to download (~1-2 minutes):
- GRDB.swift (SQLite wrapper)
- Sodium (crypto library)
- Starscream (WebSocket)
- KeychainAccess (secure storage)

### Step 5: Build & Run

1. Select "VaultMacOS" scheme (top left)
2. Choose "My Mac" as destination
3. Press `⌘R` or click Run button
4. Grant permissions when prompted (camera, microphone, notifications)

**First launch will take ~30 seconds to compile.**

---

## 🎯 First Time Setup (In-App)

### 1. Create Account

1. Click "Register"
2. Enter email address
3. Create password (min 12 characters)
4. Click "Register"

### 2. Verify Email

1. Check your inbox for verification code
2. Enter 6-digit code
3. Click "Verify"

**📧 Email not received?**
- Check spam folder
- Verify Resend API key in Config.plist
- Check Resend dashboard for errors

### 3. Enable Security

1. Settings → Security
2. Toggle "Enable Biometric Lock"
3. Set auto-lock timeout
4. Done!

---

## 🛠️ Troubleshooting

### Build Errors

#### "Cannot find 'GRDB' in scope"

**Solution:**
```bash
# In Xcode: File → Packages → Reset Package Caches
# Then: File → Packages → Resolve Package Versions
```

#### "Config.plist not found"

**Solution:**
```bash
cd VaultMacOS/Resources
cp Config.template.plist Config.plist
# Then edit Config.plist with your API key
```

#### Code Signing Error

**Solution:**
Xcode → Signing & Capabilities → Select your Team
Or: Build Settings → Code Signing Identity → "Sign to Run Locally"

### Runtime Errors

#### "Cannot connect to relay server"

**Solutions:**
1. Check internet connection
2. Verify relay server URL in Config.plist
3. Test server: `curl https://vault-relay.onrender.com/health`
4. Server may be sleeping (free tier) - wait 30 seconds and retry

#### "Email sending fails"

**Solutions:**
1. Verify API key: Log in to https://resend.com
2. Check sender email is verified
3. View logs: Resend Dashboard → Logs
4. Daily limit check (100 emails/day on free tier)

#### Database Error

**Solutions:**
1. Delete database: `rm ~/Library/Application\ Support/VAULT/vault.db`
2. Restart app
3. Fresh database will be created

---

## 📝 Configuration Options

### Minimal Configuration (Recommended)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ResendAPIKey</key>
    <string>re_YOUR_KEY_HERE</string>
    
    <key>SenderEmail</key>
    <string>noreply@b2g-vault</string>
    
    <key>RelayServerWebSocket</key>
    <string>wss://vault-relay.onrender.com/v1/stream</string>
    
    <key>RelayServerAPI</key>
    <string>https://vault-relay.onrender.com/v1</string>
</dict>
</plist>
```

### Custom Domain Configuration

If you have your own domain:

```xml
<key>SenderEmail</key>
<string>noreply@yourdomain.com</string>
```

**Steps:**
1. Add domain in Resend dashboard
2. Configure DNS records (TXT, CNAME)
3. Wait for verification (~24 hours)
4. Update Config.plist

### Custom Relay Server

Deploy your own relay server:

```xml
<key>RelayServerWebSocket</key>
<string>wss://your-server.com/v1/stream</string>

<key>RelayServerAPI</key>
<string>https://your-server.com/v1</string>
```

See `DEPLOY.md` for relay server deployment instructions.

---

## 🎨 Customization

### App Icon

Replace icon in:
```
VaultMacOS/Resources/Assets.xcassets/AppIcon.appiconset/
```

Sizes needed:
- 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024

### App Name

Change display name:
1. Open `Info.plist`
2. Find `CFBundleName`
3. Change value

### Theme Colors

Edit `VaultMacOS/UI/Themes/Theme.swift`:

```swift
struct Theme {
    static let primaryColor = Color.blue  // Change to your color
    static let accentColor = Color.green
}
```

---

## 📦 Creating Distributable App

### 1. Build for Release

```bash
xcodebuild archive \
  -scheme VaultMacOS \
  -configuration Release \
  -archivePath build/VaultMacOS.xcarchive
```

### 2. Export Application

```bash
xcodebuild -exportArchive \
  -archivePath build/VaultMacOS.xcarchive \
  -exportPath build/Release \
  -exportOptionsPlist ExportOptions.plist
```

### 3. Create DMG Installer

```bash
./Scripts/create-dmg.sh
```

Output: `build/VAULT-v1.0.0.dmg`

### 4. Distribute

Upload to:
- GitHub Releases
- Your website
- Direct download link

---

## 🔐 Security Best Practices

### Development

✅ Never commit API keys to Git  
✅ Use `.gitignore` for Config.plist  
✅ Keep dependencies updated  
✅ Enable code signing  

### Production

✅ Use verified domain for emails  
✅ Enable HTTPS only  
✅ Set up monitoring  
✅ Regular security audits  

### User Education

✅ Encourage strong passwords  
✅ Enable biometric lock  
✅ Verify device connections  
✅ Regular backups  

---

## 🎓 Learning Resources

### Documentation

- **README.md** - Overview and features
- **BUILD.md** - Detailed build instructions
- **DEPLOY.md** - Production deployment guide
- **API Documentation** - Coming soon

### Code Structure

```
VaultMacOS/
├── App/           # Application entry point
├── Core/          # Core functionality (crypto, network, database)
├── Features/      # Feature modules (auth, chat, contacts)
├── Services/      # Business logic services
├── UI/            # Reusable UI components
└── Resources/     # Assets and configuration
```

### Key Technologies

- **SwiftUI** - Modern UI framework
- **CryptoKit** - Apple's crypto framework
- **GRDB** - SQLite wrapper
- **Signal Protocol** - E2E encryption
- **WebSockets** - Real-time communication

---

## 🆘 Getting Help

### Resources

1. **Documentation**: Check this guide and other .md files
2. **GitHub Issues**: https://github.com/webspoilt/vault/issues
3. **Email Support**: dev@vault-messaging.com
4. **Stack Overflow**: Tag with `vault-messenger`

### Common Questions

**Q: Do I need a paid developer account?**  
A: No, for personal use. Yes ($99/year) for App Store distribution.

**Q: Can I use a different email service?**  
A: Yes! Modify `EmailService.swift` to use any SMTP or API service.

**Q: Is the app really free to run?**  
A: Yes! Using free tiers of Resend and Render, total cost is $0/month.

**Q: Can I customize the crypto algorithm?**  
A: Yes, but not recommended. Current implementation uses industry-standard Signal Protocol.

**Q: How do I update the app?**  
A: Download new version, replace Config.plist with your values, rebuild.

---

## ✅ Checklist

Before running in production:

- [ ] Resend API key configured
- [ ] Sender email verified in Resend
- [ ] Relay server deployed and tested
- [ ] Config.plist updated
- [ ] App builds without errors
- [ ] Test registration flow
- [ ] Test message sending
- [ ] Test biometric lock
- [ ] Database encrypts properly
- [ ] All features working

---

## 🎉 You're Ready!

You now have:
✅ Fully configured VAULT macOS app  
✅ Free email service (Resend)  
✅ Free relay server (Render)  
✅ Military-grade encryption  
✅ Production-ready code  

**Next Steps:**
1. Test thoroughly on your machine
2. Invite friends to beta test
3. Deploy relay server to production
4. Create release and distribute
5. Gather feedback and iterate

---

**Need More Help?**

📧 Email: dev@vault-messaging.com  
💬 GitHub Discussions: [Link]  
📖 Full Docs: BUILD.md, DEPLOY.md  

**Happy Messaging!** 🚀🔒
