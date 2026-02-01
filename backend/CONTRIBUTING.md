# 🤝 Contributing to VAULT

Thank you for your interest in contributing to VAULT! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Security](#security)
- [Review Process](#review-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to:

- **Privacy First**: User privacy is paramount. All contributions must respect and enhance user privacy.
- **Security**: Security is not optional. All code must follow security best practices.
- **Inclusivity**: We welcome contributors from all backgrounds and experience levels.
- **Transparency**: All cryptographic implementations must be auditable and well-documented.

## 🚀 Getting Started

### Prerequisites

- **Rust** (1.75+) for the crypto core
- **Go** (1.21+) for the relay server
- **Node.js** (20+) for the web client
- **Docker** and **Docker Compose** for deployment

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/vault.git
cd vault

# Add upstream remote
git remote add upstream https://github.com/webspoilt/vault.git
```

## 🛠️ Development Setup

### 1. Rust Core

```bash
cd core

# Install dependencies
cargo build

# Run tests
cargo test --all-features

# Build WASM target
wasm-pack build --target web
```

### 2. Go Server

```bash
cd server

# Download dependencies
go mod download

# Run tests
go test -v ./...

# Build binary
go build -o vault-relay ./cmd/relay
```

### 3. Web Client

```bash
cd web

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

### 4. Full Stack (Docker)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Contributing Guidelines

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `security/description` - Security fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/process changes
- `security`: Security-related changes

Examples:
```
feat(crypto): add ML-KEM-768 key generation

fix(relay): handle websocket reconnection gracefully

security(core): fix timing attack in scalar multiplication
```

### Code Standards

#### Rust

- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- All public functions must be documented
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Maintain test coverage above 80%

```rust
/// Encrypts a message using the vault encryption
///
/// # Arguments
///
/// * `recipient` - The recipient's public key fingerprint
/// * `plaintext` - The message to encrypt
///
/// # Returns
///
/// Returns the encrypted message envelope
///
/// # Errors
///
/// Returns an error if encryption fails
pub fn encrypt(&mut self, recipient: &str, plaintext: &[u8]) -> Result<EncryptedMessage, JsValue> {
    // Implementation
}
```

#### Go

- Follow [Effective Go](https://golang.org/doc/effective_go)
- All exported functions must be documented
- Use `gofmt` for formatting
- Use `go vet` for static analysis

#### TypeScript/React

- Follow the project's ESLint configuration
- Use functional components with hooks
- Maintain type safety with TypeScript

### Testing Requirements

All contributions must include tests:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encryption_roundtrip() {
        let key = generate_key();
        let plaintext = b"test message";
        let ciphertext = encrypt(&key, plaintext);
        let decrypted = decrypt(&key, &ciphertext);
        assert_eq!(plaintext.to_vec(), decrypted);
    }
}
```

### Documentation

- Update README.md if adding new features
- Add inline documentation for complex algorithms
- Update CHANGELOG.md with your changes

## 🔒 Security

### Cryptographic Code

All cryptographic code must:

1. **Be written in Rust** - No JavaScript/crypto in JS
2. **Use constant-time operations** - Prevent timing attacks
3. **Zeroize secrets** - Clear sensitive data from memory
4. **Be formally verified** where possible
5. **Have 100% test coverage**

### Security Review Process

1. All crypto changes require review from a cryptographer
2. Security-critical changes require a security audit
3. Vulnerabilities are handled according to our [Security Policy](SECURITY.md)

### Reporting Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

Instead:
- Email: security@vault.messaging
- Include detailed reproduction steps
- Allow 90 days for disclosure

## 🔍 Review Process

### Pull Request Checklist

Before submitting:

- [ ] Tests pass locally
- [ ] Code is formatted correctly
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts
- [ ] Security implications considered

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing performed

## Security
- [ ] No new security vulnerabilities introduced
- [ ] Crypto code reviewed (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Criteria

Maintainers will review for:

1. **Correctness** - Does it work as intended?
2. **Security** - Are there security implications?
3. **Performance** - Is it efficient?
4. **Maintainability** - Is the code clean and documented?
5. **Testing** - Are there adequate tests?

## 🎯 Areas Needing Contribution

### High Priority

- [ ] Formal verification of crypto primitives
- [ ] Additional platform support (iOS, Android)
- [ ] Federation protocol implementation
- [ ] Hardware security module (HSM) support

### Medium Priority

- [ ] UI/UX improvements
- [ ] Additional language translations
- [ ] Documentation improvements
- [ ] Performance optimizations

### Good First Issues

Look for issues labeled `good-first-issue` or `help-wanted`.

## 📞 Getting Help

- **Discord**: [Join our server](https://discord.gg/vault)
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check [docs.vault.messaging](https://docs.vault.messaging)

## 🙏 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for the bug bounty program (security contributions)

Thank you for helping make secure messaging accessible to everyone! 🔐
