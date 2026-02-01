using VaultMessenger.Core.Services;
using System.Security.Cryptography;

namespace VaultMessenger.Services;

public class SecureStorageService : ISecureStorageService
{
    private readonly Dictionary<string, string> _storage = new();

    public Task<bool> SetAsync(string key, string value)
    {
        var encrypted = ProtectedData.Protect(System.Text.Encoding.UTF8.GetBytes(value), null, DataProtectionScope.CurrentUser);
        _storage[key] = Convert.ToBase64String(encrypted);
        return Task.FromResult(true);
    }

    public Task<string?> GetAsync(string key)
    {
        if (!_storage.ContainsKey(key)) return Task.FromResult<string?>(null);
        var encrypted = Convert.FromBase64String(_storage[key]);
        var decrypted = ProtectedData.Unprotect(encrypted, null, DataProtectionScope.CurrentUser);
        return Task.FromResult<string?>(System.Text.Encoding.UTF8.GetString(decrypted));
    }

    public Task<bool> RemoveAsync(string key)
    {
        _storage.Remove(key);
        return Task.FromResult(true);
    }

    public Task<bool> ClearAsync()
    {
        _storage.Clear();
        return Task.FromResult(true);
    }
}
