//
//  RustBridge.h
//  VaultMessenger
//
//  C bridge to Rust crypto core
//

#ifndef RustBridge_h
#define RustBridge_h

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Initialization
int32_t vault_crypto_init(void);
void vault_crypto_cleanup(void);

// Identity Key Generation
int32_t vault_generate_identity_keypair(
    uint8_t *public_key_out,    // 32 bytes
    uint8_t *private_key_out    // 32 bytes
);

// Pre-Key Generation
int32_t vault_generate_signed_prekey(
    uint8_t *public_key_out,    // 32 bytes
    uint8_t *private_key_out,   // 32 bytes
    uint8_t *signature_out,     // 64 bytes
    const uint8_t *identity_private_key  // 32 bytes
);

int32_t vault_generate_onetime_prekey(
    uint8_t *public_key_out,    // 32 bytes
    uint8_t *private_key_out    // 32 bytes
);

// Encryption/Decryption (Signal Protocol)
int32_t vault_encrypt_message(
    const uint8_t *plaintext,
    int32_t plaintext_len,
    const uint8_t *recipient_public_key,  // 32 bytes
    uint8_t *ciphertext_out,
    int32_t *ciphertext_len_out
);

int32_t vault_decrypt_message(
    const uint8_t *ciphertext,
    int32_t ciphertext_len,
    const uint8_t *sender_public_key,     // 32 bytes
    const uint8_t *receiver_private_key,  // 32 bytes
    uint8_t *plaintext_out,
    int32_t *plaintext_len_out
);

// Post-Quantum Crypto (ML-KEM-768)
int32_t vault_pq_keygen(
    uint8_t *public_key_out,    // 1184 bytes
    uint8_t *private_key_out    // 2400 bytes
);

int32_t vault_pq_encapsulate(
    const uint8_t *public_key,  // 1184 bytes
    uint8_t *ciphertext_out,    // 1088 bytes
    uint8_t *shared_secret_out  // 32 bytes
);

int32_t vault_pq_decapsulate(
    const uint8_t *ciphertext,  // 1088 bytes
    const uint8_t *private_key, // 2400 bytes
    uint8_t *shared_secret_out  // 32 bytes
);

// Zero-Knowledge Proofs
int32_t vault_zk_generate_proof(
    const uint8_t *identity_key,
    const uint8_t *secret,
    uint8_t *proof_out,
    int32_t *proof_len_out
);

int32_t vault_zk_verify_proof(
    const uint8_t *proof,
    int32_t proof_len,
    const uint8_t *public_input,
    bool *valid_out
);

// Key Derivation
int32_t vault_derive_key(
    const uint8_t *master_key,  // 32 bytes
    const char *context,
    uint8_t *derived_key_out    // 32 bytes
);

// Hashing
int32_t vault_hash_sha3_256(
    const uint8_t *data,
    int32_t data_len,
    uint8_t *hash_out           // 32 bytes
);

int32_t vault_hash_blake3(
    const uint8_t *data,
    int32_t data_len,
    uint8_t *hash_out           // 32 bytes
);

// Utilities
int32_t vault_secure_random(
    uint8_t *buffer_out,
    int32_t buffer_len
);

void vault_secure_zero(
    uint8_t *buffer,
    int32_t buffer_len
);

const char* vault_get_version(void);

#ifdef __cplusplus
}
#endif

#endif /* RustBridge_h */
