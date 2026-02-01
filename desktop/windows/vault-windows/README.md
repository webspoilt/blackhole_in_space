# VAULT Messenger - Windows Desktop Application

![VAULT Logo](docs/images/vault-banner.png)

**Military-Grade Secure Messaging Platform for Windows**

Version 1.0.0 | Production Ready | MIT License

---

## 🔐 Overview

VAULT Messenger is a Windows desktop application providing military-grade, end-to-end encrypted messaging with a "zero-knowledge" architecture. Built with .NET 8 and WPF, it implements the Signal Protocol with post-quantum cryptography (ML-KEM-768) for future-proof security.

### Key Features

- ✅ **End-to-End Encryption** - Signal Protocol with Double Ratchet
- ✅ **Post-Quantum Security** - ML-KEM-768 lattice-based cryptography
- ✅ **Multi-Device Support** - Up to 5 devices per account
- ✅ **Zero-Knowledge Architecture** - No server-side message storage
- ✅ **Disappearing Messages** - Configurable message TTL
- ✅ **Voice & Video Calls** - WebRTC with SRTP encryption
- ✅ **Encrypted Local Storage** - SQLCipher database encryption
- ✅ **Screen Security** - Screenshot prevention
- ✅ **Free Email Service** - Mailgun integration (100 emails/day)

---

## 📋 System Requirements

- **OS**: Windows 10 (1809+) or Windows 11
- **RAM**: 4 GB minimum, 8 GB recommended
- **Storage**: 500 MB free space
- **Network**: Internet connection required
- **.NET Runtime**: Included (self-contained deployment)

---

## 🚀 Quick Start

### For End Users (Pre-built Executable)

1. Download `VaultMessenger-Setup-v1.0.0.exe` from releases
2. Run the installer (no admin rights required)
3. Launch VAULT Messenger from Start Menu or Desktop
4. Create your account and start messaging securely!

### For Developers (Build from Source)

#### Prerequisites

- Visual Studio 2022 (17.8+) or Rider 2023.3+
- .NET 8 SDK
- Windows 10 SDK (10.0.19041.0+)

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/webspoilt/vault-windows.git
cd vault-windows

# Restore dependencies
dotnet restore VaultMessenger.sln

# Build Release version
dotnet build VaultMessenger.sln -c Release

# Run the application
dotnet run --project VaultMessenger/VaultMessenger.csproj
```

#### Create Self-Contained Executable

```bash
# Publish as single-file executable
dotnet publish VaultMessenger/VaultMessenger.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true

# Output will be in: VaultMessenger/bin/Release/net8.0-windows/win-x64/publish/
```

---

## ⚙️ Configuration

### First-Time Setup

1. **Mailgun Email Configuration** (Required for registration)
   
   Edit `appsettings.json`:
   ```json
   {
     "Email": {
       "Provider": "Mailgun",
       "ApiKey": "YOUR_MAILGUN_API_KEY",
       "Domain": "YOUR_MAILGUN_DOMAIN",
       "FromEmail": "noreply@b2g-vault",
       "FromName": "VAULT Messenger"
     }
   }
   ```

   **Get Free Mailgun Account:**
   - Visit: https://signup.mailgun.com/new/signup
   - Sign up (no credit card required)
   - Get API Key from Settings → API Keys
   - Use sandbox domain (100 emails/day free)

2. **Relay Server Configuration**
   
   ```json
   {
     "RelayServer": {
       "WebSocketUrl": "wss://your-relay-server.com/v1/stream",
       "ApiUrl": "https://your-relay-server.com/v1"
     }
   }
   ```

   **Free Hosting Options:**
   - **Render.com**: Free tier with 750 hours/month
   - **Railway.app**: $5 free credit monthly
   - **Fly.io**: 3 shared VMs free

### Advanced Configuration

#### Security Settings

```json
{
  "Security": {
    "AutoLockTimeoutMinutes": 5,
    "MaxLoginAttempts": 5,
    "PasswordMinLength": 12,
    "RequireBiometric": false,
    "EnableScreenshotProtection": true
  }
}
```

#### Feature Flags

```json
{
  "Features": {
    "DisappearingMessages": true,
    "VoiceCalls": true,
    "VideoCalls": true,
    "MultiDevice": true,
    "MaxDevicesPerAccount": 5
  }
}
```

---

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | .NET 8 WPF | Native Windows desktop |
| **UI Library** | MaterialDesignInXaml | Modern Material Design |
| **Architecture** | MVVM + Clean Architecture | Separation of concerns |
| **Crypto** | Signal Protocol + BouncyCastle | E2E encryption |
| **Database** | SQLite + SQLCipher | Encrypted local storage |
| **Network** | WebSocket.Client | Real-time messaging |
| **Email** | Mailgun API | User verification |
| **Logging** | Serilog | Application logging |

### Project Structure

```
VaultMessenger/
├── VaultMessenger/              # WPF UI Layer
│   ├── Views/                   # XAML Views
│   │   ├── LoginWindow.xaml
│   │   ├── RegisterWindow.xaml
│   │   ├── MainWindow.xaml
│   │   └── ...
│   ├── ViewModels/              # View Models
│   ├── Services/                # UI Services
│   ├── Styles/                  # XAML Styles
│   ├── Assets/                  # Images, Icons
│   └── App.xaml                 # Application Entry
│
├── VaultMessenger.Core/         # Business Logic Layer
│   ├── Models/                  # Domain Models
│   ├── Services/                # Core Services
│   │   ├── CryptographyService.cs
│   │   ├── SignalProtocolService.cs
│   │   ├── MailgunEmailService.cs
│   │   └── ...
│   └── Data/                    # Data Access
│       └── VaultDbContext.cs
│
└── VaultMessenger.Tests/        # Unit & Integration Tests
```

### Security Implementation (9 Layers)

1. **Application Hardening** - Code obfuscation, tamper detection
2. **Transport Security** - TLS 1.3, certificate pinning
3. **Protocol Security** - Signal Protocol, Double Ratchet
4. **Post-Quantum** - ML-KEM-768 hybrid encryption
5. **Zero-Knowledge** - zk-SNARKs for identity verification
6. **Hardware Security** - Windows DPAPI for key storage
7. **Memory Security** - Secure memory allocation and wiping
8. **Storage Security** - SQLCipher AES-256 encryption
9. **Physical Security** - Auto-lock, biometric authentication

---

## 📧 Email Service Setup (Mailgun)

### Why Mailgun?

- **Free Tier**: 100 emails/day, no credit card required
- **Reliability**: 99.99% uptime SLA
- **Easy Integration**: Simple REST API
- **Best for small deployments**

### Setup Instructions

1. **Create Account**
   ```
   Visit: https://signup.mailgun.com/new/signup
   Fill in your details (no credit card needed)
   Verify your email address
   ```

2. **Get API Credentials**
   ```
   Login → Settings → API Keys
   Copy "Private API Key"
   Note your sandbox domain (starts with "sandbox...")
   ```

3. **Add Authorized Recipients** (Sandbox Mode)
   ```
   Domains → Sandbox Domain → Authorized Recipients
   Add your test email addresses
   Click verification link sent to each email
   ```

4. **Update Configuration**
   ```json
   {
     "Email": {
       "ApiKey": "key-abc123def456...",
       "Domain": "sandboxXXX.mailgun.org",
       "FromEmail": "noreply@b2g-vault"
     }
   }
   ```

5. **Production (Optional)**
   ```
   Add custom domain in Mailgun dashboard
   Verify DNS records (SPF, DKIM, MX)
   Upgrade to paid plan for higher limits
   ```

---

## 🌐 Backend Deployment (Free Tier)

### Option 1: Render.com (Recommended)

**Free Tier**: 750 hours/month, auto-sleep after 15 mins

```yaml
# render.yaml
services:
  - type: web
    name: vault-relay
    env: docker
    plan: free
    healthCheckPath: /health
    envVars:
      - key: PORT
        value: 3000
```

**Deploy Steps:**
1. Fork the vault repository
2. Create Render account
3. New Web Service → Connect GitHub
4. Select repository → Deploy

### Option 2: Railway.app

**Free Tier**: $5 credit monthly (~500 hours)

```
1. Install Railway CLI: npm i -g @railway/cli
2. Login: railway login
3. Deploy: railway up
```

### Option 3: Fly.io

**Free Tier**: 3 shared-cpu-1x VMs with 256MB RAM

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
flyctl launch
flyctl deploy
```

---

## 🔧 Building Installer

### Using Advanced Installer (Recommended)

1. Download Advanced Installer (Free Edition)
2. Create new project → Simple
3. Add files from `bin/Release/net8.0-windows/win-x64/publish/`
4. Configure:
   - Product Name: VAULT Messenger
   - Version: 1.0.0
   - Install folder: [ProgramFilesFolder]\VAULT Messenger
5. Build → Generate MSI/EXE

### Using Inno Setup (Open Source)

```iss
[Setup]
AppName=VAULT Messenger
AppVersion=1.0.0
DefaultDirName={autopf}\VAULT Messenger
DefaultGroupName=VAULT Messenger
OutputBaseFilename=VaultMessenger-Setup-v1.0.0
Compression=lzma2
SolidCompression=yes

[Files]
Source: "bin\Release\net8.0-windows\win-x64\publish\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\VAULT Messenger"; Filename: "{app}\VaultMessenger.exe"
Name: "{autodesktop}\VAULT Messenger"; Filename: "{app}\VaultMessenger.exe"
```

Compile with: `iscc installer.iss`

---

## 🧪 Testing

### Run Unit Tests

```bash
dotnet test VaultMessenger.Tests/VaultMessenger.Tests.csproj
```

### Run with Coverage

```bash
dotnet test VaultMessenger.Tests/VaultMessenger.Tests.csproj --collect:"XPlat Code Coverage"
```

### Integration Tests

```bash
dotnet test VaultMessenger.Tests/VaultMessenger.Tests.csproj --filter Category=Integration
```

---

## 📖 User Guide

### Creating an Account

1. Launch VAULT Messenger
2. Click "Sign Up"
3. Enter username, email, and password (min 12 characters)
4. Check email for verification code
5. Enter code to activate account
6. You're ready to message securely!

### Adding Contacts

1. Click Contacts → Add Contact
2. Enter username or email
3. Send contact request
4. Wait for acceptance
5. Optional: Verify identity with QR code scan

### Starting a Conversation

1. Select contact from list
2. Type your message
3. Press Enter or click Send
4. All messages are automatically encrypted!

### Voice/Video Calls

1. Open conversation
2. Click Call icon (🎙️ voice or 📹 video)
3. Wait for recipient to answer
4. Enjoy encrypted communication

### Disappearing Messages

1. Open conversation → Settings
2. Enable "Disappearing Messages"
3. Set timer (5 sec - 1 week)
4. Messages auto-delete after read

---

## 🛡️ Security Best Practices

### For Users

1. **Strong Password**: Use 12+ characters with mix of uppercase, lowercase, numbers, symbols
2. **Verify Contacts**: Always verify identity through QR code scan for sensitive communications
3. **Screen Lock**: Enable auto-lock after 5 minutes of inactivity
4. **Regular Updates**: Keep the application updated for latest security patches
5. **Backup**: Create encrypted backups of your account regularly

### For Developers

1. **Code Signing**: Sign the executable with a trusted certificate
2. **Dependency Updates**: Regularly update NuGet packages
3. **Security Audits**: Perform regular security audits and pen-testing
4. **Secure Storage**: Never commit API keys or secrets to source control
5. **Certificate Pinning**: Implement certificate pinning for relay server

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Cannot connect to relay server"
**Solution**:
- Check internet connection
- Verify relay server URL in `appsettings.json`
- Ensure firewall allows WebSocket connections

#### Issue: "Email verification not received"
**Solution**:
- Check spam/junk folder
- Verify Mailgun API key is correct
- Ensure email is authorized in Mailgun sandbox

#### Issue: "Database is encrypted or not a database"
**Solution**:
- Delete `vault.db` file (⚠️ loses all data)
- Restart application
- Create new account

#### Issue: "Application crashes on startup"
**Solution**:
- Check logs in `logs/` folder
- Ensure .NET 8 runtime is installed
- Run as administrator

---

## 📞 Support

- **Issues**: https://github.com/webspoilt/vault-windows/issues
- **Discussions**: https://github.com/webspoilt/vault-windows/discussions
- **Email**: support@vault-messaging.com
- **Documentation**: https://docs.vault-messaging.com

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 VAULT Systems

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **Signal Foundation** - Signal Protocol implementation
- **BouncyCastle** - Cryptography library
- **MaterialDesignInXaml** - UI components
- **Mailgun** - Email delivery service
- **Community Contributors** - Thank you all!

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2026)
- [ ] Desktop screen sharing
- [ ] Message scheduling
- [ ] Custom emoji reactions
- [ ] Dark/Light theme switcher

### Version 1.2 (Q3 2026)
- [ ] Group voice calls (up to 8 participants)
- [ ] Message search with full-text indexing
- [ ] Cloud backup with E2E encryption
- [ ] Multi-language support

### Version 2.0 (Q4 2026)
- [ ] P2P direct connections (no relay)
- [ ] Blockchain-based identity verification
- [ ] Anonymous messaging mode
- [ ] Plugin system for extensions

---

**VAULT - Where messages go to never be found. 🔒**

Built with ❤️ and 🔐 by the VAULT Team
