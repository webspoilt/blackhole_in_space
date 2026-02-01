# FortiComm Security Documentation

## 🔐 Security Architecture Overview

FortiComm implements a defense-in-depth security architecture with multiple layers of protection:

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  • Content Security Policy (CSP)                                │
│  • Subresource Integrity (SRI)                                  │
│  • Strict Transport Security (HSTS)                             │
├─────────────────────────────────────────────────────────────────┤
│                    CRYPTOGRAPHIC LAYER                           │
│  • Signal Protocol (Double Ratchet)                             │
│  • MLS (Messaging Layer Security) for groups                    │
│  • Post-Quantum Cryptography (ML-KEM)                           │
│  • AES-256-GCM encryption                                       │
├─────────────────────────────────────────────────────────────────┤
│                    KEY MANAGEMENT LAYER                          │
│  • Ed25519 identity keys (never rotate)                         │
│  • X25519 pre-keys (weekly rotation)                            │
│  • One-time pre-keys (batch of 1000)                            │
│  • Session keys (per-conversation)                              │
├─────────────────────────────────────────────────────────────────┤
│                    NETWORK LAYER                                 │
│  • TLS 1.3 for all connections                                  │
│  • WebSocket with secure upgrade                                │
│  • Sealed sender metadata protection                            │
├─────────────────────────────────────────────────────────────────┤
│                    SERVER LAYER                                  │
│  • Zero message storage                                         │
│  • Ephemeral relay (24h TTL)                                    │
│  • No plaintext access                                          │
└─────────────────────────────────────────────────────────────────┘
```

## 🛡️ Cryptographic Primitives

### Identity Keys (Level 1)
- **Algorithm**: Ed25519
- **Purpose**: Long-term identity verification
- **Rotation**: Never (except on key compromise)
- **Storage**: Client device only

### Signed Pre-Keys (Level 2)
- **Algorithm**: X25519
- **Purpose**: Medium-term key exchange
- **Rotation**: Weekly automatic rotation
- **Signature**: Signed by identity key

### One-Time Pre-Keys (Level 3)
- **Algorithm**: X25519
- **Purpose**: Initial key exchange
- **Quantity**: Batch of 1000
- **Usage**: Single use, then discarded

### Session Keys (Level 4)
- **Algorithm**: AES-256-GCM
- **Purpose**: Per-conversation encryption
- **Rotation**: Every 100 messages or on ratchet

### Message Keys (Level 5)
- **Algorithm**: AES-256-GCM
- **Purpose**: Single message encryption
- **Lifecycle**: Generated per message, immediately discarded

## 🔒 Security Properties

### Forward Secrecy
Compromised session keys cannot decrypt past messages because:
- Chain keys are destroyed after use
- Root key is updated on each DH ratchet
- Message keys are never stored

### Future Secrecy
Compromised keys cannot decrypt future messages because:
- Automatic key rotation every 100 messages
- DH ratchet on every reply
- Break-in recovery after compromise

### Post-Compromise Security
After a key compromise, security is restored through:
- Immediate key rotation on detection
- New DH ratchet with fresh ephemeral keys
- Old session keys zeroized

## 🌐 Post-Quantum Cryptography

### ML-KEM-768 (CRYSTALS-Kyber)
- **Purpose**: Quantum-safe key encapsulation
- **Status**: Ready for deployment
- **Integration**: Hybrid with classical X25519
- **Security Level**: NIST Level 3 (AES-192 equivalent)

### Migration Strategy
1. **Phase 1**: Hybrid mode (classical + PQC)
2. **Phase 2**: PQC-only for high-security environments
3. **Phase 3**: Full PQC transition (post-2030)

## 📦 Backup Security

### Encryption
- **Algorithm**: AES-256-GCM
- **Key Derivation**: Argon2id
  - Memory: 64 MB
  - Iterations: 3
  - Parallelism: 4
- **Salt**: 16 bytes random
- **Nonce**: 12 bytes random

### Storage
- User-controlled cloud storage
- Server never sees backup content
- Encrypted at rest by cloud provider

## 🚨 Threat Model

### Attacker Capabilities

#### Passive Adversary
- **Capabilities**: Observes network traffic
- **Defense**: TLS 1.3 + Sealed sender
- **Result**: Cannot read message content or metadata

#### Active Adversary
- **Capabilities**: Modifies network traffic
- **Defense**: Authenticated encryption + signatures
- **Result**: Cannot forge or modify messages

#### Server Compromise
- **Capabilities**: Controls relay server
- **Defense**: End-to-end encryption
- **Result**: Cannot read message content

#### Client Compromise
- **Capabilities**: Controls user device
- **Defense**: Key rotation + forward secrecy
- **Result**: Limited to current session

### Attack Scenarios

#### Message Interception
```
Attacker: Intercepts ciphertext
Defense:  End-to-end encryption
Result:   Cannot decrypt without private keys
```

#### Metadata Analysis
```
Attacker: Analyzes traffic patterns
Defense:  Sealed sender + timing obfuscation
Result:   Cannot determine who talks to whom
```

#### Key Compromise
```
Attacker: Steals private key
Defense:  Forward secrecy + key rotation
Result:   Cannot decrypt past messages
```

#### Quantum Computing
```
Attacker: Has quantum computer
Defense:  ML-KEM post-quantum crypto
Result:   Still secure (hybrid mode)
```

## 🔍 Security Audit Checklist

### Code Review
- [ ] All crypto operations in Rust/WASM
- [ ] No secrets in JavaScript heap
- [ ] Constant-time comparisons
- [ ] Proper error handling

### Cryptography
- [ ] Signal Protocol implementation verified
- [ ] MLS implementation tested
- [ ] Random number generation secure
- [ ] Key derivation parameters correct

### Network
- [ ] TLS 1.3 enforced
- [ ] Certificate pinning implemented
- [ ] WebSocket secure upgrade
- [ ] No plaintext fallback

### Storage
- [ ] Keys encrypted at rest
- [ ] Secure enclave used (where available)
- [ ] Auto-lock after inactivity
- [ ] Secure deletion on logout

## 📋 Incident Response

### Key Compromise Procedure
1. **Detect**: Monitor for unusual activity
2. **Contain**: Revoke compromised keys
3. **Rotate**: Generate new identity key
4. **Notify**: Alert affected users
5. **Recover**: Re-establish secure sessions

### Security Breach Response
1. **Assess**: Determine scope of breach
2. **Isolate**: Disconnect affected systems
3. **Preserve**: Maintain forensic evidence
4. **Remediate**: Patch vulnerabilities
5. **Communicate**: Transparent disclosure

## 🏛️ Compliance

### Certifications
- **FIPS 140-3**: Cryptographic module certification
- **Common Criteria**: EAL4+ evaluation
- **SOC 2 Type II**: Security controls audit

### Regulations
- **GDPR**: Data protection compliance
- **CCPA**: California privacy rights
- **HIPAA**: Healthcare data protection

## 📞 Security Contact

- **Email**: security@forticomm.com
- **PGP Key**: [0x12345678](https://forticomm.com/security/pgp)
- **Bug Bounty**: [HackerOne](https://hackerone.com/forticomm)

## 📚 References

- [Signal Protocol Specification](https://signal.org/docs/)
- [MLS Protocol (RFC 9420)](https://tools.ietf.org/html/rfc9420)
- [NIST Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)

---

**Last Updated**: 2024-01-29  
**Version**: 1.0.0  
**Classification**: Public
