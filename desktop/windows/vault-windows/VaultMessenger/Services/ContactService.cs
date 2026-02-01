using VaultMessenger.Core.Services;
using VaultMessenger.Core.Models;

namespace VaultMessenger.Services;

public class ContactService : IContactService
{
    public Task<List<Contact>> GetAllContactsAsync() => Task.FromResult(new List<Contact>());
    public Task<Contact?> GetContactAsync(string contactId) => Task.FromResult<Contact?>(null);
    public Task<bool> AddContactAsync(string username) => Task.FromResult(true);
    public Task<bool> RemoveContactAsync(string contactId) => Task.FromResult(true);
    public Task<bool> BlockContactAsync(string contactId) => Task.FromResult(true);
    public Task<bool> UnblockContactAsync(string contactId) => Task.FromResult(true);
    public Task<bool> VerifyContactAsync(string contactId, byte[] identityKey) => Task.FromResult(true);
}
