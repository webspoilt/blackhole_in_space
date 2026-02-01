# VAULT Messenger - Linux Desktop Application

## Quick Start Guide (5 Minutes)

### 1. Install Node.js (if not already installed)

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nodejs npm

# Fedora
sudo dnf install -y nodejs npm

# Arch Linux
sudo pacman -S nodejs npm

# Or download from: https://nodejs.org/ (LTS version)
```

### 2. Install Dependencies

```bash
# Install system dependencies
sudo apt install -y build-essential libsecret-1-dev  # Ubuntu/Debian
# OR
sudo dnf install -y gcc-c++ make libsecret-devel     # Fedora

# Install Node.js dependencies
cd vault-linux-app
npm install
```

### 3. Configure Email (FREE - Resend API)

1. Sign up at **https://resend.com** (no credit card needed)
2. Get your API key from the dashboard
3. Edit `config.js`:

```javascript
EMAIL: {
  API_KEY: 're_YOUR_KEY_HERE',  // Paste your key here
  FROM: 'noreply@b2g-vault'
}
```

**FREE TIER**: 100 emails/day, 3,000/month

### 4. Run the Application

```bash
# Development mode
npm start

# Build for production
npm run build:linux

# Install and run
sudo dpkg -i dist/VAULT\ Messenger_*.deb  # For Ubuntu/Debian
# OR
chmod +x dist/VAULT\ Messenger-*.AppImage
./dist/VAULT\ Messenger-*.AppImage        # Portable version
```

### 5. First Time Setup

1. **Create Account**
   - Click "Create Account"
   - Enter username, email, password
   - Check email for verification code
   - Enter 6-digit code

2. **Start Messaging**
   - Add contacts
   - Start chatting securely!

---

## Deploy Backend Server (FREE)

### Option 1: Render.com (Easiest)

1. Fork https://github.com/webspoilt/vault
2. Sign up at https://render.com
3. Create "Web Service" → Connect GitHub
4. Select `web/server` directory
5. Deploy (FREE 750 hours/month)

### Option 2: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd vault/web/server
railway up
```

**FREE**: $5 credit/month

### Option 3: Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
cd vault/web/server
fly launch
```

**FREE**: 3 VMs

### Update Server URL

Edit `config.js`:

```javascript
SERVER: {
  WS_URL: 'wss://your-app.render.com/v1/stream',
  API_URL: 'https://your-app.render.com/v1'
}
```

---

## Troubleshooting

### "npm install" fails

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find module 'keytar'"

```bash
# Rebuild native modules
npm rebuild keytar --runtime=electron --target=28.2.0
```

### "Email not sending"

1. Verify API key in `config.js`
2. Check free tier limit (100 emails/day)
3. Verify sender email format

### App won't start

```bash
# Run with debug logs
npm start -- --enable-logging

# Check Electron version
npx electron --version  # Should be 28.2.0 or higher
```

---

## Features Checklist

- ✅ End-to-End Encryption (AES-256-GCM)
- ✅ Signal Protocol (Double Ratchet)
- ✅ Post-Quantum Ready (ML-KEM-768)
- ✅ Encrypted Local Database (SQLCipher)
- ✅ Disappearing Messages
- ✅ File Encryption
- ✅ Auto-Lock
- ✅ System Tray
- ✅ Multi-Platform (AppImage, DEB, Snap)

---

## Support

- **Email**: dev@vault-messaging.com
- **GitHub Issues**: https://github.com/webspoilt/vault/issues
- **Documentation**: See README.md

---

## Security Notice

⚠️ **IMPORTANT**:
- Never share your verification codes
- Use a strong master password
- Enable auto-lock
- Verify contacts' identity keys
- Keep the app updated

---

**VAULT Messenger** - Military-Grade Secure Messaging

Made with ❤️ and 🔒 for Linux
