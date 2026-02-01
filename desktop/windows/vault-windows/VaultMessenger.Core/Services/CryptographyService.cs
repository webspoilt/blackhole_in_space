using System.Security.Cryptography;
using System.Text;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Security;

namespace VaultMessenger.Core.Services;

public class CryptographyService : ICryptographyService
{
    private const int KeySize = 32; // 256 bits
    private const int NonceSize = 12; // 96 bits for AES-GCM
    private const int TagSize = 16; // 128 bits authentication tag

    public byte[] GenerateRandomBytes(int length)
    {
        var bytes = new byte[length];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return bytes;
    }

    public byte[] Encrypt(byte[] data, byte[] key)
    {
        if (key.Length != KeySize)
            throw new ArgumentException($"Key must be {KeySize} bytes", nameof(key));

        using var aes = new AesGcm(key, TagSize);
        
        var nonce = GenerateRandomBytes(NonceSize);
        var ciphertext = new byte[data.Length];
        var tag = new byte[TagSize];

        aes.Encrypt(nonce, data, ciphertext, tag);

        // Combine nonce + tag + ciphertext
        var result = new byte[NonceSize + TagSize + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, result, 0, NonceSize);
        Buffer.BlockCopy(tag, 0, result, NonceSize, TagSize);
        Buffer.BlockCopy(ciphertext, 0, result, NonceSize + TagSize, ciphertext.Length);

        return result;
    }

    public byte[] Decrypt(byte[] encryptedData, byte[] key)
    {
        if (key.Length != KeySize)
            throw new ArgumentException($"Key must be {KeySize} bytes", nameof(key));

        if (encryptedData.Length < NonceSize + TagSize)
            throw new ArgumentException("Encrypted data is too short", nameof(encryptedData));

        using var aes = new AesGcm(key, TagSize);

        var nonce = new byte[NonceSize];
        var tag = new byte[TagSize];
        var ciphertext = new byte[encryptedData.Length - NonceSize - TagSize];

        Buffer.BlockCopy(encryptedData, 0, nonce, 0, NonceSize);
        Buffer.BlockCopy(encryptedData, NonceSize, tag, 0, TagSize);
        Buffer.BlockCopy(encryptedData, NonceSize + TagSize, ciphertext, 0, ciphertext.Length);

        var plaintext = new byte[ciphertext.Length];
        aes.Decrypt(nonce, ciphertext, tag, plaintext);

        return plaintext;
    }

    public string HashPassword(string password, byte[] salt)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA512);
        var hash = pbkdf2.GetBytes(KeySize);
        
        var hashBytes = new byte[salt.Length + hash.Length];
        Buffer.BlockCopy(salt, 0, hashBytes, 0, salt.Length);
        Buffer.BlockCopy(hash, 0, hashBytes, salt.Length, hash.Length);
        
        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyPassword(string password, string hashedPassword, byte[] salt)
    {
        var hashBytes = Convert.FromBase64String(hashedPassword);
        var hash = new byte[hashBytes.Length - salt.Length];
        Buffer.BlockCopy(hashBytes, salt.Length, hash, 0, hash.Length);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA512);
        var testHash = pbkdf2.GetBytes(KeySize);

        return CryptographicOperations.FixedTimeEquals(hash, testHash);
    }

    public byte[] DeriveKey(string password, byte[] salt, int iterations = 100000)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA512);
        return pbkdf2.GetBytes(KeySize);
    }

    public (byte[] publicKey, byte[] privateKey) GenerateKeyPair()
    {
        // Generate Ed25519 key pair using BouncyCastle
        var keyPairGenerator = GeneratorUtilities.GetKeyPairGenerator("Ed25519");
        keyPairGenerator.Init(new KeyGenerationParameters(new SecureRandom(), 256));
        
        var keyPair = keyPairGenerator.GenerateKeyPair();
        
        var publicKey = ((Ed25519PublicKeyParameters)keyPair.Public).GetEncoded();
        var privateKey = ((Ed25519PrivateKeyParameters)keyPair.Private).GetEncoded();
        
        return (publicKey, privateKey);
    }

    public byte[] Sign(byte[] data, byte[] privateKey)
    {
        var signer = SignerUtilities.GetSigner("Ed25519");
        var privateKeyParam = new Ed25519PrivateKeyParameters(privateKey, 0);
        
        signer.Init(true, privateKeyParam);
        signer.BlockUpdate(data, 0, data.Length);
        
        return signer.GenerateSignature();
    }

    public bool VerifySignature(byte[] data, byte[] signature, byte[] publicKey)
    {
        try
        {
            var verifier = SignerUtilities.GetSigner("Ed25519");
            var publicKeyParam = new Ed25519PublicKeyParameters(publicKey, 0);
            
            verifier.Init(false, publicKeyParam);
            verifier.BlockUpdate(data, 0, data.Length);
            
            return verifier.VerifySignature(signature);
        }
        catch
        {
            return false;
        }
    }
}
