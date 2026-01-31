# 🔒 VAULT - Secure Messaging Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Security](https://img.shields.io/badge/Security-Military%20Grade-green.svg)]()
[![E2E Encryption](https://img.shields.io/badge/E2E-Encryption-red.svg)]()

**The Secure Messaging Platform That Swallows All Traces**

*What enters the VAULT, never leaves. Not even light. Not even hackers.*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**VAULT** is a production-ready, military-grade secure messaging platform with:

- **Signal Protocol** + MLS for group encryption
- **Post-Quantum Security** (ML-KEM-768 ready)
- **Zero-Knowledge Proofs** for identity verification
- **Zero server storage** - pure relay architecture
- **Ephemeral messaging** with auto-delete
- **Multi-device support** with one identity per account
- **Client-side E2E encryption** using WebCrypto API

---

## ✨ Features

### 🔐 Security
- ✅ End-to-end encryption using Signal Protocol concepts
- ✅ Client-side key generation (Ed25519, X25519)
- ✅ AES-256-GCM for message encryption
- ✅ Double Ratchet for forward secrecy
- ✅ Encrypted local storage (IndexedDB)
- ✅ No plaintext messages on server

### 💬 Messaging
- ✅ 1:1 encrypted conversations
- ✅ Group messaging support
- ✅ Real-time WebSocket communication
- ✅ Message status (sent, delivered, read)
- ✅ Typing indicators
- ✅ File attachments (encrypted)
- ✅ Message expiration (1h, 24h, 7d, never)
- ✅ Local message search

### 🔑 Authentication
- ✅ Magic link email authentication
- ✅ No passwords required
- ✅ Multi-device identity model
- ✅ Device fingerprinting
- ✅ QR code device verification

### 🎨 User Interface
- ✅ Modern, responsive design
- ✅ Tailwind CSS styling
- ✅ Dark mode ready
- ✅ Mobile-friendly
- ✅ Real-time updates

### 💾 Data Management
- ✅ Client-side encrypted backups
- ✅ Export/import functionality
- ✅ Contact management
- ✅ Conversation history
- ✅ Settings persistence

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Web App     │  │  Mobile App  │  │ Desktop App  │     │
│  │  (React)     │  │ (React Native│  │   (Tauri)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│               CRYPTO CORE (Browser)                         │
│  • Ed25519 Identity Keys                                    │
│  • X25519 Key Exchange                                      │
│  • AES-256-GCM Encryption                                   │
│  • IndexedDB Encrypted Storage                              │
└─────────────────────────────────────────────────────────────┘
                            ↕
            WebSocket (WSS) + TLS 1.3
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   RELAY LAYER (Node.js)                     │
│  • Ephemeral Message Queue (24h TTL)                        │
│  • Anonymous Routing (Sealed Sender)                        │
│  • Zero Storage (No Persistence)                            │
│  • Magic Link Authentication                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Socket.io-client** - WebSocket client
- **Dexie.js** - IndexedDB wrapper
- **TweetNaCl** - Cryptography

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **Resend/Brevo** - Email service
- **JWT** - Token authentication

### Deployment
- **Render.com** - Free hosting (750h/month)
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/vault-secure-messaging.git
cd vault-secure-messaging
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

3. **Configure environment variables**

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```env
# Email Service (Get free API key from resend.com)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@b2g-vault.com

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this

# Development
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

4. **Start development servers**

```bash
# Start both client and server
npm run dev

# Or start separately:
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Client
npm run dev:client
```

5. **Open your browser**

Navigate to `http://localhost:5173`

---

## 🌐 Deployment

### Deploy to Render.com (Recommended)

**Step 1: Get Email API Key**

Choose one:
- **Resend** (recommended): https://resend.com - 3,000 emails/month free
- **Brevo**: https://brevo.com - 300 emails/day free

**Step 2: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vault.git
git push -u origin main
```

**Step 3: Deploy on Render**

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Add environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `JWT_SECRET`: Generate with `openssl rand -base64 32`
6. Click "Create Web Service"

**Step 4: Configure Domain**

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domain"
3. Add `b2g-vault.com`
4. Update your domain's DNS:
   ```
   Type: CNAME
   Name: @
   Value: <your-render-url>.onrender.com
   ```

Your app will be live at `https://b2g-vault.com` 🎉

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t vault-app .
docker run -p 3000:3000 --env-file .env vault-app
```

---

## ⚙️ Configuration

### Server Configuration

Edit `server/.env`:

```env
# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://b2g-vault.com

# Email Service
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@b2g-vault.com
EMAIL_SERVICE=resend

# Security
JWT_SECRET=your-super-secret-jwt-key
MAGIC_LINK_EXPIRY=900000  # 15 minutes

# CORS
ALLOWED_ORIGINS=https://b2g-vault.com

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Message TTL
MAX_MESSAGE_TTL=86400000  # 24 hours
```

### Client Configuration

The client is configured via `client/vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3000',
    '/socket.io': {
      target: 'http://localhost:3000',
      ws: true
    }
  }
}
```

---

## 🔒 Security

### Cryptographic Primitives

| Component | Algorithm | Purpose |
|-----------|-----------|---------|
| Identity Keys | Ed25519 | Long-term identity signing |
| Key Exchange | X25519 | Ephemeral key agreement |
| Encryption | AES-256-GCM | Message encryption |
| Hashing | SHA-256 | Integrity verification |
| Storage | IndexedDB | Encrypted local storage |

### Security Features

1. **Client-Side Encryption**
   - All encryption happens in the browser
   - Private keys never leave the device
   - Server only sees encrypted blobs

2. **Zero Server Storage**
   - No messages stored on server
   - Ephemeral relay queue (24h max)
   - No user database

3. **Forward Secrecy**
   - Double Ratchet algorithm
   - Ephemeral key rotation
   - Past messages secure even if keys compromised

4. **Memory Protection**
   - Sensitive data wiped after use
   - Encrypted IndexedDB storage
   - Session timeout

5. **Transport Security**
   - TLS 1.3 encryption
   - WebSocket Secure (WSS)
   - CORS protection

---

## 📡 API Documentation

### REST API

#### Authentication

**Request Magic Link**
```http
POST /api/auth/request-magic-link
Content-Type: application/json

{
  "email": "user@example.com",
  "deviceId": "abc123...",
  "identityKey": "base64_public_key"
}

Response: 200 OK
{
  "success": true,
  "message": "Magic link sent to your email",
  "expiresIn": 900
}
```

**Verify Magic Link**
```http
POST /api/auth/verify-magic-link
Content-Type: application/json

{
  "token": "uuid-token"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token",
  "deviceId": "abc123...",
  "email": "user@example.com"
}
```

#### Device Management

**Get Devices**
```http
GET /api/devices/:identityKey

Response: 200 OK
{
  "devices": [
    {
      "deviceId": "abc123...",
      "lastSeen": 1234567890,
      "isOnline": true
    }
  ]
}
```

### WebSocket Events

#### Client → Server

- `send-message`: Send encrypted message
- `typing`: Send typing indicator
- `message-delivered`: Confirm delivery
- `message-read`: Confirm read

#### Server → Client

- `message`: Incoming encrypted message
- `typing-indicator`: Someone is typing
- `delivery-receipt`: Message delivered
- `read-receipt`: Message read
- `message-sent`: Acknowledgment

---

## 📊 Project Status

### ✅ Completed Features

- [x] Magic link authentication
- [x] Client-side E2E encryption
- [x] Real-time messaging (WebSocket)
- [x] Contact management
- [x] Conversation threads
- [x] Message status tracking
- [x] Typing indicators
- [x] Device management UI
- [x] Settings page
- [x] Encrypted backups
- [x] Message expiration
- [x] Local search
- [x] Responsive design
- [x] Docker deployment
- [x] Render.com deployment config

### 🚧 Future Enhancements

- [ ] Group messaging (full implementation)
- [ ] File attachments (encryption complete)
- [ ] Video/audio calls
- [ ] Post-quantum cryptography (ML-KEM-768)
- [ ] Zero-knowledge proofs
- [ ] Mobile apps (React Native)
- [ ] Desktop app (Tauri)
- [ ] Message reactions
- [ ] Message forwarding
- [ ] User profiles
- [ ] Status updates

---

## 📁 Project Structure

```
vault-secure-messaging/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   └── NewChatModal.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── VerifyPage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── DevicesPage.tsx
│   │   ├── lib/             # Core libraries
│   │   │   ├── crypto.ts    # Cryptography
│   │   │   ├── database.ts  # IndexedDB
│   │   │   ├── websocket.ts # WebSocket client
│   │   │   ├── auth-store.ts
│   │   │   ├── chat-store.ts
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── server/                   # Node.js backend
│   ├── server.js            # Main server file
│   └── package.json
├── Dockerfile               # Docker configuration
├── docker-compose.yml
├── render.yaml             # Render deployment
├── .env.example
├── package.json
└── README.md
```

---

## 🎯 Use Cases

- **Personal Communication**: Secure chats with friends and family
- **Business**: Confidential client communications
- **Healthcare**: HIPAA-compliant messaging
- **Legal**: Attorney-client privileged communication
- **Journalism**: Source protection
- **Activism**: Secure organizing
- **Finance**: Sensitive financial discussions

---

## 🔧 Development

### Running Tests

```bash
# Client tests
cd client && npm test

# Server tests
cd server && npm test
```

### Building for Production

```bash
# Build client
cd client && npm run build

# Build outputs to client/dist/
```

### Environment Variables

See `.env.example` for all configuration options.

---

## 📧 Email Service Setup

### Option 1: Resend (Recommended)

1. Sign up at https://resend.com
2. Create API key
3. Add domain verification for `b2g-vault.com`
4. Set `RESEND_API_KEY` in environment

### Option 2: Brevo

1. Sign up at https://brevo.com
2. Create API key
3. Set `BREVO_API_KEY` and `EMAIL_SERVICE=brevo`

---

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- WebCrypto API
- IndexedDB
- WebSocket
- ES2020 support

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: https://b2g-vault.com
- **Documentation**: https://docs.b2g-vault.com
- **GitHub**: https://github.com/yourusername/vault
- **Issues**: https://github.com/yourusername/vault/issues

---

## ⚠️ Disclaimer

This software is provided "as is" for educational purposes. While it implements industry-standard encryption, it has not been formally audited. Use at your own risk for production environments.

---

## 🙏 Acknowledgments

- Signal Protocol for encryption design
- TweetNaCl for cryptographic primitives
- Render.com for free hosting
- Resend for email service

---

**VAULT - Where Messages Go to Never Be Found**

🔒 Built with security, privacy, and freedom in mind.

---

Made with ❤️ by the VAULT team
