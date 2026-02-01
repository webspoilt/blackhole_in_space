using VaultMessenger.Core.Services;

namespace VaultMessenger.Core.Services;

public class SignalProtocolService : ISignalProtocolService
{
    public Task InitializeAsync(string userId) => Task.CompletedTask;
    public Task<byte[]> EncryptMessageAsync(string recipientId, int deviceId, byte[] plaintext) => Task.FromResult(new byte[0]);
    public Task<byte[]> DecryptMessageAsync(string senderId, int deviceId, byte[] ciphertext) => Task.FromResult(new byte[0]);
    public Task<byte[]> GetIdentityKeyAsync() => Task.FromResult(new byte[32]);
    public Task<bool> TrustIdentityKeyAsync(string userId, byte[] identityKey) => Task.FromResult(true);
    public Task GeneratePreKeysAsync(int count = 100) => Task.CompletedTask;
    public Task<List<(int keyId, byte[] publicKey)>> GetPreKeysAsync() => Task.FromResult(new List<(int, byte[])>());
}
