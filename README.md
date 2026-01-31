# 🔒 VAULT - Secure Messaging Platform

**VAULT** is a military-grade, end-to-end encrypted messaging platform designed for absolute privacy. This monorepo contains the source code for the entire ecosystem, including the iOS application, Android application, and the Web/Relay server.

## 📂 Repository Structure

This repository is organized into the following key components:

- **[`/ios`](./ios)**: Native iOS application built with Swift and SwiftUI.
- **[`/android`](./android)**: Native Android application (Kotlin/Java).
- **[`/web`](./web)**: The Web Application and Relay Server (React + Node.js).

## 🚀 Quick Start

### iOS App
To build the iOS application:
1.  Navigate to `ios/`.
2.  Run `./Scripts/build_rust_crypto.sh` to compile the cryptographic core.
3.  Open `VaultMessenger.xcodeproj` in Xcode.

### Android App
To build the Android application:
1.  Open the `android/` directory in Android Studio.
2.  Allow Gradle to sync.
3.  Build and Run on your emulator/device.

### Web App & Server
To run the Web client and Relay server:
1.  Navigate to `web/`.
2.  Install dependencies: `npm install` (in both `client/` and `server/`).
3.  Start development environment: `npm run dev`.

## 🔐 Security Features

-   **End-to-End Encryption**: Signal Protocol implementation.
-   **Post-Quantum Cryptography**: ML-KEM-768 support.
-   **Zero Knowledge Proofs**: Identity verification without exposing keys.
-   **No Metadata Logging**: The relay server stores nothing.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**VAULT** - *Where messages go to never be found.*
