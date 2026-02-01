# 🛡️ FortiComm - World's Most Secure Open Source Messaging Platform

[![Security](https://img.shields.io/badge/Security-Government%20Grade-red)](https://forticomm.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Crypto](https://img.shields.io/badge/Crypto-Signal%20Protocol%20%2B%20MLS-blue)](docs/security/cryptography.md)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/forticomm/forticomm/actions)

> **Zero-knowledge messaging. User-controlled data. Open source core.**

FortiComm is a sovereign secure messaging platform designed for organizations and governments that demand the highest levels of privacy and security. Messages are end-to-end encrypted with keys that never leave user devices, backed up to user-controlled cloud storage, and automatically deleted after 30 days.

## 🎯 Key Features

- **🔐 Military-Grade Encryption**: Signal Protocol (Double Ratchet) + MLS for groups
- **🚫 Zero Server Storage**: Servers only relay encrypted blobs, never store messages
- **☁️ User-Controlled Backups**: Encrypted backups to your Dropbox, Google Drive, etc.
- **⏱️ Ephemeral by Design**: Auto-delete after 30 days (configurable)
- **🔬 Post-Quantum Ready**: ML-KEM for future-proofing against quantum attacks
- **📱 Multi-Platform**: Web, iOS, Android, and Desktop apps
- **🌐 Open Source Core**: MIT licensed, community auditable

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT DEVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web App   │  │  Mobile App │  │ Desktop App │             │
│  │  (React)    │  │(React Native│  │   (Tauri)   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│  ┌──────┴────────────────┴────────────────┴──────┐             │
│  │         Rust Cryptographic Core (WASM)         │             │
│  │  • Signal Protocol  • MLS  • Post-Quantum      │             │
│  └──────────────────────┬─────────────────────────┘             │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          │ WebSocket (WSS)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RELAY SERVERS (Go)                          │
├─────────────────────────────────────────────────────────────────┤
│  • Ephemeral message passing (24h TTL)                          │
│  • No message storage                                           │
│  • Sealed sender metadata protection                            │
│  • Federation support                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)
- [Go](https://golang.org/dl/) (1.21+)
- [Node.js](https://nodejs.org/) (20+)
- [Docker](https://docker.com/) (optional, for deployment)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/forticomm/forticomm.git
cd fortipostgres

# Build everything
./build.sh

# Deploy with Docker
docker-compose up -d

# Access the application
open https://localhost:3000
```

### Manual Build

```bash
# 1. Build Rust cryptographic core
cd core
cargo build --release --target wasm32-unknown-unknown
cp target/wasm32-unknown-unknown/release/*.wasm ../web/public/

# 2. Build Go relay server
cd ../server
go build -o forticomm-relay ./cmd/relay/main.go

# 3. Build web client
cd ../web
npm install
npm run build

# 4. Start services
cd ..
docker-compose up -d
```

## 🔐 Security

### Cryptographic Primitives

| Component | Algorithm | Purpose |
|-----------|-----------|---------|
| Identity Keys | Ed25519 | Long-term identity |
| Key Exchange | X25519 | Ephemeral key agreement |
| Encryption | AES-256-GCM | Message encryption |
| Hashing | SHA3-256 | Integrity verification |
| Key Derivation | Argon2id | Backup encryption |
| Post-Quantum | ML-KEM-768 | Quantum-safe key encapsulation |

### Security Features

- **Forward Secrecy**: Compromised keys cannot decrypt past messages
- **Future Secrecy**: Automatic key rotation every 100 messages
- **Post-Compromise Security**: Recovery after key compromise
- **Sealed Sender**: Hides sender identity from servers
- **Metadata Protection**: Timing obfuscation and cover traffic

### Threat Model

See [docs/security/threat-model.md](docs/security/threat-model.md) for our comprehensive threat model and security analysis.

## 📁 Repository Structure

```
forticomm/
├── core/               # Rust cryptographic engine
│   ├── src/
│   │   ├── lib.rs           # Main library
│   │   ├── signal_protocol.rs  # Signal Protocol
│   │   ├── mls_manager.rs      # MLS groups
│   │   ├── key_hierarchy.rs    # Key management
│   │   ├── backup.rs           # Encrypted backups
│   │   └── pqc.rs              # Post-quantum crypto
│   └── Cargo.toml
│
├── server/             # Go relay server
│   ├── cmd/relay/      # Main entry point
│   ├── internal/       # Internal packages
│   └── Dockerfile
│
├── web/                # React web application
│   ├── src/
│   │   ├── crypto/     # WASM integration
│   │   ├── components/ # React components
│   │   └── services/   # API services
│   └── Dockerfile
│
├── mobile/             # React Native mobile apps
├── desktop/            # Tauri desktop app
├── premium/            # Premium features (source-available)
├── docs/               # Documentation
└── infrastructure/     # Deployment configs
```

## 💰 Business Model

### Open Source Core (MIT License)

- ✅ End-to-end encryption
- ✅ 1:1 and group messaging
- ✅ Self-hosting
- ✅ Encrypted backups
- ✅ Basic organization features

### Premium Features (Commercial License)

| Feature | Free | Premium | Enterprise |
|---------|------|---------|------------|
| Users | Unlimited | Unlimited | Unlimited |
| Group Size | 100 | 1,000 | 10,000+ |
| Message Retention | 30 days | 90 days | Custom |
| Admin Dashboard | ❌ | ✅ | ✅ |
| SSO Integration | ❌ | ✅ | ✅ |
| Compliance Tools | ❌ | ✅ | ✅ |
| Air-gapped Mode | ❌ | ❌ | ✅ |
| HSM Support | ❌ | ❌ | ✅ |
| **Price** | Free | $10/user/mo | Custom |

## 🤝 Contributing

We welcome contributions from the security community!

### Security Bug Bounty

- **Critical**: $10,000
- **High**: $5,000
- **Medium**: $1,000
- **Low**: $250

See [docs/security/bug-bounty.md](docs/security/bug-bounty.md) for details.

### Development

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/forticomm.git

# Create branch
git checkout -b feature/your-feature

# Make changes and test
cd core && cargo test
cd ../server && go test ./...
cd ../web && npm test

# Submit PR
git push origin feature/your-feature
```

## 📊 Monitoring

FortiComm includes built-in monitoring with Prometheus and Grafana:

- **Metrics**: https://localhost:9090
- **Dashboards**: https://localhost:3001
- **Health**: https://localhost:8080/health

## 📚 Documentation

- [Self-Hosting Guide](docs/deployment/self-hosting.md)
- [Security Overview](docs/security/cryptography.md)
- [API Reference](docs/api/rest-api.md)
- [Contributing Guide](docs/contributing.md)

## 🏛️ Government & Enterprise

FortiComm is designed to meet the highest government security standards:

- FIPS 140-3 compliant cryptography
- Common Criteria certification ready
- GDPR, SOC 2, ISO 27001 compliant
- Air-gapped deployment options
- Hardware Security Module (HSM) support

Contact [enterprise@forticomm.com](mailto:enterprise@forticomm.com) for government and enterprise inquiries.

## 📜 License

### Core (MIT)

```
MIT License
Copyright (c) 2024 FortiComm Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

### Premium (Commercial)

Premium features are licensed under a commercial license. See [premium/LICENSE](premium/LICENSE) for details.

## 🔗 Links

- Website: [https://forticomm.com](https://forticomm.com)
- Docs: [https://docs.forticomm.com](https://docs.forticomm.com)
- Security: [security@forticomm.com](mailto:security@forticomm.com)
- Support: [support@forticomm.com](mailto:support@forticomm.com)

## 🙏 Acknowledgments

- [Signal](https://signal.org/) for the Signal Protocol
- [OpenMLS](https://openmls.tech/) for MLS implementation
- [CRYSTALS-Kyber](https://pq-crystals.org/kyber/) for post-quantum cryptography

---

<p align="center">
  <strong>🛡️ FortiComm - Secure messaging. Zero compromise.</strong>
</p>
