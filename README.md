# 🔐 VAULT

<p align="center">
  <img src="https://raw.githubusercontent.com/webspoilt/vault/main/assets/vault-logo.svg" width="200" alt="VAULT">
</p>

<p align="center">
  <b>The Secure Messaging Platform That Swallows All Traces</b><br>
  <b>(Verifiable Audit & Unified Ledger Technologies)</b><br>
  <i>What enters the VAULT, never leaves. Not even light. Not even hackers.</i>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Security-Military%20Grade-red?style=for-the-badge" alt="Security"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"></a>
  <a href="#cryptography"><img src="https://img.shields.io/badge/Crypto-Post%20Quantum-blue?style=for-the-badge" alt="Crypto"></a>
</p>

---

## 🌌 Overview

**VAULT** is a mathematically unbreakable messaging platform. Like an event horizon, once your message enters our encrypted core, it becomes **mathematically impossible** to retrieve without the proper keys.

### Key Features

- 🔐 **Military-Grade Encryption**: Signal Protocol + MLS for groups
- 🧮 **Post-Quantum Security**: ML-KEM-768 lattice-based cryptography
- 🔬 **Zero-Knowledge Proofs**: Prove identity without revealing secrets
- 🚫 **Zero Server Storage**: Servers only relay encrypted blobs
- ☁️ **User-Controlled Backups**: Encrypted backups to your cloud
- ⏱️ **Ephemeral by Design**: Auto-delete after configurable period

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Web App    │  │ Mobile App  │  │ Desktop App │            │
│  │  (React)    │  │(React Native│  │   (Tauri)   │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                   │
│  ╔══════╧════════════════╧════════════════╧══════╗            │
│  ║        RUST CRYPTO CORE (WASM + FFI)          ║            │
│  ║  • Elliptic Curve (Curve25519)               ║             │
│  ║  • Lattice (ML-KEM-768)                      ║             │
│  ║  • Zero-Knowledge (zk-SNARKs)                ║             │
│  ╚══════════════════════╤═══════════════════════╝             │
└─────────────────────────┼─────────────────────────────────────┘
                          │ WebSocket (WSS) + Noise Protocol
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                      RELAY LAYER (Go)                          │
│  • Ephemeral Message Queue (24h TTL)                           │
│  • Sealed Sender (Anonymous Routing)                           │
│  • Zero Storage (No Message Persistence)                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
vault/
├── backend/        # Core platform backend (Rust/Go)
│   ├── core/       # Rust cryptographic engine
│   ├── server/     # Go relay server
├── desktop/        # Native Desktop Apps
│   ├── macos/      # MacOS Build
│   ├── linux/      # Linux Build
│   ├── windows/    # Windows Build
├── mobile/         # Mobile Apps
│   ├── ios/        # iOS App (Swift/React Native)
│   ├── android/    # Android App
├── homepage/       # Next.js Marketing Site (Vercel)
├── web/            # React Web App (Vite)
├── .github/        # CI/CD workflows
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)
- [Go](https://golang.org/dl/) (1.21+)
- [Node.js](https://nodejs.org/) (20+) or [Bun](https://bun.sh/)
- [Docker](https://docker.com/) (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/webspoilt/vault.git
cd vault

# Build Rust crypto core
cd backend/core && cargo build --release && cd ../..

# Build Go relay server
cd backend/server && go build -o vault-relay ./cmd/relay && cd ../..

# Build web client
cd web && npm install && npm run build && cd ..

# Or use Docker
docker-compose up -d
```

### Access Points

- 🌐 **Web Interface**: [https://b2g-vault.vercel.app](https://b2g-vault.vercel.app)
- 🔌 **API Documentation**: [https://b2g-vault.vercel.app/api](https://b2g-vault.vercel.app/api)
- 📊 **Status**: [https://b2g-vault.vercel.app/status](https://b2g-vault.vercel.app/status)

---

## 🔐 Security

### Cryptographic Primitives

| Component | Algorithm | Purpose |
|-----------|-----------|---------|
| Identity Keys | Ed25519 | Long-term identity signing |
| Key Exchange | X25519 | Ephemeral key agreement |
| Encryption | AES-256-GCM | Message encryption |
| Hashing | SHA3-256 / Blake3 | Integrity verification |
| Post-Quantum | ML-KEM-768 | Quantum-safe key encapsulation |
| Zero-Knowledge | Groth16/BN254 | Identity proofs |

### Security Layers (9 Deep)

1. **Application**: CSP, SRI, HSTS
2. **Transport**: TLS 1.3, Certificate Pinning
3. **Protocol**: Signal Double Ratchet + MLS
4. **Post-Quantum**: ML-KEM-768 Hybrid
5. **Zero-Knowledge**: zk-SNARK Identity
6. **Homomorphic**: Encrypted Computation
7. **Hardware**: TPM/Secure Enclave
8. **Memory**: Encrypted RAM, Anti-Dump
9. **Physical**: Air-Gap Option, HSM

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork and clone
git clone https://github.com/webspoilt/vault.git

# Create feature branch
git checkout -b feature/amazing-feature

# Run tests
cd core && cargo test
cd ../server && go test ./...
cd ../web && npm test

# Submit PR
git push origin feature/amazing-feature
```

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>🔐 VAULT</b><br>
  <i>Where Messages Go to Never Be Found</i><br><br>
  Created by <b>zeroday</b> 🔐
</p>
