//
//  SignalProtocol.swift
//  VAULT - Signal Protocol Implementation
//

import Foundation
import CryptoKit

class SignalProtocolManager {
    static let shared = SignalProtocolManager()
    private init() {}
    
    // MARK: - Double Ratchet Algorithm
    
    struct RatchetState {
        var DHs: Curve25519.KeyAgreement.PrivateKey  // DH sending key
        var DHr: Curve25519.KeyAgreement.PublicKey?  // DH receiving key
        var RK: SymmetricKey  // Root key
        var CKs: SymmetricKey  // Sending chain key
        var CKr: SymmetricKey  // Receiving chain key
        var Ns: Int = 0  // Sending message number
        var Nr: Int = 0  // Receiving message number
        var PN: Int = 0  // Previous sending chain length
        var MKSKIPPED: [String: SymmetricKey] = [:]  // Skipped message keys
    }
    
    func initializeSession(theirIdentityKey: Data, theirSignedPreKey: Data, theirOneTimePreKey: Data?) -> RatchetState {
        // X3DH Key Agreement
        let sharedSecret = performX3DHKeyAgreement(
            theirIdentityKey: theirIdentityKey,
            theirSignedPreKey: theirSignedPreKey,
            theirOneTimePreKey: theirOneTimePreKey
        )
        
        // Initialize root key and chain keys
        let rootKey = KDF(sharedSecret, info: "RootKey")
        let chainKey = KDF(sharedSecret, info: "ChainKey")
        
        // Generate initial DH key pair
        let dhKeyPair = Curve25519.KeyAgreement.PrivateKey()
        
        return RatchetState(
            DHs: dhKeyPair,
            DHr: nil,
            RK: rootKey,
            CKs: chainKey,
            CKr: chainKey
        )
    }
    
    func ratchetEncrypt(message: Data, state: inout RatchetState) -> (ciphertext: Data, header: MessageHeader) {
        // Derive message key from chain key
        let (chainKey, messageKey) = KDFChain(state.CKs)
        state.CKs = chainKey
        
        // Encrypt message
        let header = MessageHeader(
            publicKey: state.DHs.publicKey.rawRepresentation,
            previousChainLength: state.PN,
            messageNumber: state.Ns
        )
        
        let ciphertext = encrypt(message, key: messageKey, associatedData: header.serialize())
        state.Ns += 1
        
        return (ciphertext, header)
    }
    
    func ratchetDecrypt(ciphertext: Data, header: MessageHeader, state: inout RatchetState) -> Data? {
        // Check if we need to perform DH ratchet
        if let receivedPublicKey = try? Curve25519.KeyAgreement.PublicKey(rawRepresentation: header.publicKey),
           state.DHr == nil || receivedPublicKey.rawRepresentation != state.DHr?.rawRepresentation {
            performDHRatchet(receivedPublicKey: receivedPublicKey, state: &state)
        }
        
        // Try to decrypt with skipped message keys
        let headerKey = header.serialize().base64EncodedString()
        if let skippedKey = state.MKSKIPPED[headerKey] {
            state.MKSKIPPED.removeValue(forKey: headerKey)
            return decrypt(ciphertext, key: skippedKey, associatedData: header.serialize())
        }
        
        // Skip messages if necessary
        if header.messageNumber > state.Nr {
            skipMessageKeys(until: header.messageNumber, state: &state)
        }
        
        // Derive message key
        let (chainKey, messageKey) = KDFChain(state.CKr)
        state.CKr = chainKey
        state.Nr += 1
        
        return decrypt(ciphertext, key: messageKey, associatedData: header.serialize())
    }
    
    // MARK: - Helper Functions
    
    private func performX3DHKeyAgreement(theirIdentityKey: Data, theirSignedPreKey: Data, theirOneTimePreKey: Data?) -> Data {
        // Simplified X3DH implementation
        var dh = Data()
        dh.append(theirIdentityKey)
        dh.append(theirSignedPreKey)
        if let oneTimeKey = theirOneTimePreKey {
            dh.append(oneTimeKey)
        }
        return SHA256.hash(data: dh).withUnsafeBytes { Data($0) }
    }
    
    private func performDHRatchet(receivedPublicKey: Curve25519.KeyAgreement.PublicKey, state: inout RatchetState) {
        state.PN = state.Ns
        state.Ns = 0
        state.Nr = 0
        state.DHr = receivedPublicKey
        
        // Perform DH and derive new root and chain keys
        let sharedSecret = try! state.DHs.sharedSecretFromKeyAgreement(with: receivedPublicKey)
        let (newRK, newCKr) = KDFRoot(state.RK, dhOutput: sharedSecret.withUnsafeBytes { Data($0) })
        state.RK = newRK
        state.CKr = newCKr
        
        // Generate new DH key pair
        state.DHs = Curve25519.KeyAgreement.PrivateKey()
        let newSharedSecret = try! state.DHs.sharedSecretFromKeyAgreement(with: receivedPublicKey)
        let (newRK2, newCKs) = KDFRoot(state.RK, dhOutput: newSharedSecret.withUnsafeBytes { Data($0) })
        state.RK = newRK2
        state.CKs = newCKs
    }
    
    private func skipMessageKeys(until targetN: Int, state: inout RatchetState) {
        if state.Nr + 100 < targetN {
            // Too many skipped messages, potential DoS attack
            return
        }
        
        while state.Nr < targetN {
            let (chainKey, messageKey) = KDFChain(state.CKr)
            state.CKr = chainKey
            
            let header = MessageHeader(
                publicKey: state.DHr!.rawRepresentation,
                previousChainLength: state.PN,
                messageNumber: state.Nr
            )
            state.MKSKIPPED[header.serialize().base64EncodedString()] = messageKey
            state.Nr += 1
        }
    }
    
    private func KDF(_ input: Data, info: String) -> SymmetricKey {
        let hkdf = HKDF<SHA256>()
        return hkdf.deriveKey(
            inputKeyMaterial: SymmetricKey(data: input),
            salt: Data(),
            info: Data(info.utf8),
            outputByteCount: 32
        )
    }
    
    private func KDFRoot(_ rootKey: SymmetricKey, dhOutput: Data) -> (rootKey: SymmetricKey, chainKey: SymmetricKey) {
        let output = HKDF<SHA256>().deriveKey(
            inputKeyMaterial: SymmetricKey(data: dhOutput),
            salt: rootKey.withUnsafeBytes { Data($0) },
            info: Data("RootChainDerivation".utf8),
            outputByteCount: 64
        )
        
        return output.withUnsafeBytes { bytes in
            let rk = SymmetricKey(data: Data(bytes[0..<32]))
            let ck = SymmetricKey(data: Data(bytes[32..<64]))
            return (rk, ck)
        }
    }
    
    private func KDFChain(_ chainKey: SymmetricKey) -> (chainKey: SymmetricKey, messageKey: SymmetricKey) {
        let output = HMAC<SHA256>.authenticationCode(for: Data([0x01]), using: chainKey)
        let ck = SymmetricKey(data: Data(output))
        
        let output2 = HMAC<SHA256>.authenticationCode(for: Data([0x02]), using: chainKey)
        let mk = SymmetricKey(data: Data(output2))
        
        return (ck, mk)
    }
    
    private func encrypt(_ plaintext: Data, key: SymmetricKey, associatedData: Data) -> Data {
        do {
            let nonce = AES.GCM.Nonce()
            let sealedBox = try AES.GCM.seal(plaintext, using: key, nonce: nonce, authenticating: associatedData)
            
            var combined = Data()
            combined.append(Data(nonce))
            combined.append(sealedBox.ciphertext)
            combined.append(sealedBox.tag)
            return combined
        } catch {
            return Data()
        }
    }
    
    private func decrypt(_ ciphertext: Data, key: SymmetricKey, associatedData: Data) -> Data? {
        guard ciphertext.count >= 28 else { return nil }  // 12 (nonce) + 16 (tag)
        
        do {
            let nonce = try AES.GCM.Nonce(data: ciphertext.prefix(12))
            let ct = ciphertext.dropFirst(12).dropLast(16)
            let tag = ciphertext.suffix(16)
            
            let sealedBox = try AES.GCM.SealedBox(nonce: nonce, ciphertext: ct, tag: tag)
            return try AES.GCM.open(sealedBox, using: key, authenticating: associatedData)
        } catch {
            return nil
        }
    }
}

struct MessageHeader {
    let publicKey: Data
    let previousChainLength: Int
    let messageNumber: Int
    
    func serialize() -> Data {
        var data = Data()
        data.append(publicKey)
        data.append(contentsOf: withUnsafeBytes(of: previousChainLength.bigEndian) { Array($0) })
        data.append(contentsOf: withUnsafeBytes(of: messageNumber.bigEndian) { Array($0) })
        return data
    }
}
