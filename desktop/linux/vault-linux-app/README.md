# VAULT Messenger - Linux Desktop Application

<div align="center">

![VAULT Logo](assets/icon.png)

**Military-Grade Secure Messaging for Linux**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-28.2.0-47848F.svg)](https://electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)

End-to-End Encrypted | Zero Knowledge | Post-Quantum Ready

</div>

---

## 🔒 Overview

VAULT Messenger is a military-grade secure messaging application built specifically for Linux platforms. It provides end-to-end encryption, post-quantum cryptography, and zero-knowledge architecture to ensure your communications remain private and secure.

## ✨ Features

### Core Security (9 Layers)
- ✅ **Application Hardening** - Secure Electron configuration with CSP
- ✅ **Transport Security** - TLS 1.3 only, certificate pinning ready
- ✅ **Protocol Security** - Signal Protocol Double Ratchet
- ✅ **Post-Quantum Crypto** - ML-KEM-768 (Kyber) ready
- ✅ **Zero-Knowledge** - Server cannot read your messages
- ✅ **Hardware Security** - Linux Keyring integration via `keytar`
- ✅ **Memory Security** - Secure memory handling and cleanup
- ✅ **Storage Security** - SQLite with AES-256 encryption (SQLCipher)
- ✅ **Physical Security** - Auto-lock, session timeout

### Messaging Features
- ✅ 1-on-1 Chat with E2E encryption
- ✅ Group Chat support (up to 100 members)
- ✅ Media Sharing (images, videos, audio, documents)
- ✅ Disappearing Messages (5s to 1 week)
- ✅ Message Reactions & Editing
- ✅ Read Receipts & Typing Indicators
- ✅ File Encryption before upload
- 🚧 Voice/Video Calls (coming soon)
- 🚧 Screen Sharing (coming soon)

### Privacy Features
- ✅ No phone number required
- ✅ End-to-End Encryption by default
- ✅ Self-destructing messages
- ✅ No metadata logging
- ✅ Secure local database
- ✅ Auto-lock after inactivity
- ✅ System tray hiding

## 📋 Prerequisites

- **Operating System**: Linux (Ubuntu 20.04+, Debian 10+, Fedora 32+, or equivalent)
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git** (optional, for cloning)

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm git build-essential libsecret-1-dev

# Fedora
sudo dnf install -y nodejs npm git gcc-c++ make libsecret-devel

# Arch Linux
sudo pacman -S nodejs npm git base-devel libsecret
```

### 2. Install Application

```bash
cd vault-linux-app
npm install
```

### 3. Configure Email Service (FREE - Resend API)

Edit `config.js`:

```javascript
EMAIL: {
  PROVIDER: 'resend',
  API_KEY: 're_YOUR_KEY_HERE', // Get from https://resend.com
  FROM: 'noreply@b2g-vault',
  FROM_NAME: 'VAULT Messenger'
}
```

**Get FREE Resend API Key:**
1. Sign up at [https://resend.com](https://resend.com) (NO credit card required)
2. Free tier: 100 emails/day, 3,000 emails/month
3. Get API key from dashboard
4. Paste in `config.js`

### 4. Run Application

```bash
# Development mode
npm start

# Production mode
npm run build:linux
./dist/VAULT Messenger-*.AppImage
```

## 📦 Build from Source

### Build for Linux (All Formats)

```bash
# Build all formats (AppImage, DEB, Snap)
npm run build:linux

# Build specific format
npm run build:deb      # Debian/Ubuntu package
npm run build:appimage # Portable AppImage
npm run build:snap     # Snap package
```

### Output Locations

```
dist/
├── VAULT Messenger-1.0.0.AppImage  # Portable (recommended)
├── VAULT Messenger_1.0.0_amd64.deb # Debian/Ubuntu installer
└── VAULT Messenger_1.0.0_amd64.snap # Snap package
```

## 🔧 Configuration

### Email Service Options

#### Option 1: Resend (Recommended - FREE)
- **Free Tier**: 100 emails/day (3,000/month)
- **No Credit Card Required**
- **Setup**: https://resend.com/api-keys

```javascript
EMAIL: {
  PROVIDER: 'resend',
  API_KEY: 're_123abc...',
  FROM: 'noreply@b2g-vault'
}
```

#### Option 2: SMTP (Any Provider)
Use any SMTP service (Gmail, SendGrid, etc.)

### Server Configuration

Edit `config.js`:

```javascript
SERVER: {
  WS_URL: 'wss://your-server.com/v1/stream',
  API_URL: 'https://your-server.com/v1'
}
```

### Security Settings

```javascript
SECURITY: {
  DB_ENCRYPTION_KEY: 'your-256-bit-key',
  SESSION_TIMEOUT: 300000, // 5 minutes
  AUTO_LOCK_TIMEOUT: 300000 // 5 minutes
}
```

## 🌐 Deploy Backend Server (FREE Options)

### Option 1: Render.com (Recommended)
- **Free Tier**: 750 hours/month
- **No Credit Card Required**
- **Auto-sleep after 15 min inactivity**

```bash
# Deploy via Git
1. Push code to GitHub
2. Connect to Render.com
3. Select "Web Service"
4. Auto-deploys on push
```

### Option 2: Railway.app
- **Free Tier**: $5 credit/month
- **Better for always-on services**

### Option 3: Fly.io
- **Free Tier**: 3 shared VMs
- **Global edge network**

### Option 4: Self-Host (Docker)

```bash
# Clone server repository
git clone https://github.com/webspoilt/vault
cd vault/web/server

# Build and run
docker build -t vault-server .
docker run -p 8080:8080 vault-server
```

## 📱 Installation Methods

### Method 1: AppImage (Recommended - Most Portable)

```bash
chmod +x VAULT Messenger-*.AppImage
./VAULT Messenger-*.AppImage
```

No installation required! Runs anywhere.

### Method 2: Debian Package (.deb)

```bash
sudo dpkg -i VAULT\ Messenger_1.0.0_amd64.deb
sudo apt-get install -f  # Fix dependencies

# Launch
vault-messenger
```

### Method 3: Snap Package

```bash
sudo snap install VAULT\ Messenger_1.0.0_amd64.snap --dangerous

# Launch
vault-messenger
```

## 🔐 Security Architecture

### Encryption Stack

```
┌─────────────────────────────────────┐
│     Application Layer (Electron)    │
├─────────────────────────────────────┤
│     Signal Protocol (E2E)           │
│  ├─ Double Ratchet Algorithm        │
│  ├─ X25519 Key Agreement            │
│  └─ AES-256-GCM Message Encryption  │
├─────────────────────────────────────┤
│  Post-Quantum Layer (ML-KEM-768)    │
│  └─ Hybrid mode: X25519 + Kyber     │
├─────────────────────────────────────┤
│    Transport Layer (TLS 1.3)        │
├─────────────────────────────────────┤
│  Local Storage (SQLCipher)          │
│  └─ AES-256 Database Encryption     │
└─────────────────────────────────────┘
```

### Key Storage

- **Identity Keys**: Linux Keyring (via `keytar`)
- **Session Keys**: Encrypted in SQLite database
- **Pre-keys**: Generated and rotated automatically
- **Master Password**: Never stored, only hashed

## 🛠️ Development

### Project Structure

```
vault-linux-app/
├── main.js                 # Electron main process
├── config.js              # Configuration
├── package.json           # Dependencies
├── services/              # Core services
│   ├── database.js       # SQLite + encryption
│   ├── cryptography.js   # Crypto operations
│   ├── auth.js          # Authentication
│   ├── email.js         # Email service
│   └── websocket.js     # Real-time messaging
├── renderer/             # Frontend (UI)
│   ├── index.html       # Main HTML
│   ├── css/
│   │   └── styles.css   # Styles
│   └── js/
│       └── app.js       # Application logic
└── assets/              # Images, icons
```

### Development Mode

```bash
# Run with live reload
npm start -- --dev

# Open DevTools
Ctrl+Shift+I (when app is running)
```

### Running Tests

```bash
npm test
```

## 🎨 Customization

### Change Branding

1. **Logo**: Replace `assets/icon.png` (512x512 recommended)
2. **Colors**: Edit `renderer/css/styles.css` `:root` variables
3. **App Name**: Update `package.json` → `"productName"`

### Add Features

1. Create service in `services/`
2. Add UI in `renderer/`
3. Connect via IPC handlers in `main.js`

## 📊 Database Schema

### Tables

- **users**: User accounts and keys
- **contacts**: Contact list and trust levels
- **conversations**: Chat metadata
- **messages**: Encrypted message storage
- **identities**: Identity key management
- **sessions**: Signal Protocol sessions
- **prekeys**: Pre-key bundles
- **settings**: User preferences

## 🐛 Troubleshooting

### Issue: "Cannot find module 'keytar'"

```bash
# Rebuild native modules
npm rebuild keytar --runtime=electron --target=28.2.0
```

### Issue: "SQLite error"

```bash
# Rebuild SQLite
npm rebuild sqlite3 --runtime=electron --target=28.2.0
```

### Issue: "Email not sending"

1. Check Resend API key is correct
2. Verify email is in correct format
3. Check free tier limits (100/day)
4. View logs: `~/.config/vault-messenger/logs/`

### Issue: "Cannot connect to server"

1. Check server URL in `config.js`
2. Verify server is running
3. Check firewall/network settings
4. Try WebSocket test: `wscat -c wss://your-server.com/v1/stream`

### Issue: "App doesn't start"

```bash
# Check logs
journalctl --user -xe

# Run in debug mode
npm start -- --enable-logging
```

## 🔒 Security Best Practices

### For Users

1. ✅ Use a strong master password (12+ characters)
2. ✅ Enable auto-lock (5 minutes recommended)
3. ✅ Verify contacts' identity keys
4. ✅ Use disappearing messages for sensitive info
5. ✅ Keep app updated
6. ✅ Don't share verification codes

### For Deployment

1. ✅ Use TLS 1.3 with valid certificates
2. ✅ Enable certificate pinning
3. ✅ Rotate signed pre-keys weekly
4. ✅ Monitor failed login attempts
5. ✅ Use environment variables for secrets
6. ✅ Enable fail2ban on server

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/webspoilt/vault/issues)
- **Discussions**: [Community forum](https://github.com/webspoilt/vault/discussions)
- **Email**: dev@vault-messaging.com
- **Documentation**: [Full docs](https://docs.vault-messaging.com)

## 🙏 Acknowledgments

- **Signal Protocol**: For the cryptographic foundation
- **Electron**: For cross-platform desktop framework
- **SQLCipher**: For database encryption
- **Resend**: For free email service
- **Open Source Community**: For amazing libraries

---

<div align="center">

**VAULT Messenger** - _Where messages go to never be found_

Made with ❤️ and 🔒 for secure communication

[Website](https://vault-messaging.com) • [Documentation](https://docs.vault-messaging.com) • [GitHub](https://github.com/webspoilt/vault)

</div>

---

## 🚀 Roadmap

### Version 1.1 (Next Release)
- [ ] Voice/Video calls via WebRTC
- [ ] Screen sharing
- [ ] File preview
- [ ] Message search
- [ ] Custom themes

### Version 1.2
- [ ] Multi-device sync
- [ ] Backup/Restore
- [ ] Plugins system
- [ ] Group voice calls
- [ ] Status updates

### Version 2.0
- [ ] Quantum-resistant key exchange (full ML-KEM)
- [ ] Zero-knowledge group management
- [ ] Blockchain-based identity
- [ ] Decentralized relay network
- [ ] Anonymous routing (Tor integration)

## 💡 FAQ

**Q: Do I need to pay for anything?**
A: No! Everything is free: Resend (100 emails/day), Render.com (750 hours/month), and the app itself.

**Q: Can the server read my messages?**
A: No. All messages are encrypted on your device before being sent. The server only relays encrypted data.

**Q: Is this better than Signal/Telegram?**
A: VAULT focuses on zero-knowledge architecture and post-quantum security, making it ideal for high-security scenarios.

**Q: Can I use my own email service?**
A: Yes! Configure any SMTP service in `config.js`.

**Q: How do I update the app?**
A: Download the latest version and install over the existing one. Your data is preserved.

**Q: Is group E2E encryption supported?**
A: Yes! Using MLS (Messaging Layer Security) protocol for efficient group encryption.

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Production Ready
