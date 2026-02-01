using VaultMessenger.Core.Services;
using VaultMessenger.Core.Models;
using VaultMessenger.Core.Data;
using Microsoft.Extensions.Configuration;

namespace VaultMessenger.Services;

public class DatabaseService : IDatabaseService
{
    private VaultDbContext? _context;
    private readonly IConfiguration _configuration;
    private readonly ICryptographyService _crypto;

    public DatabaseService(IConfiguration configuration, ICryptographyService crypto)
    {
        _configuration = configuration;
        _crypto = crypto;
    }

    public async Task InitializeAsync()
    {
        var appDataPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "VaultMessenger");
        Directory.CreateDirectory(appDataPath);
        
        var dbPath = Path.Combine(appDataPath, "vault.db");
        var encKey = "CHANGE_THIS_TO_USER_DERIVED_KEY"; // TODO: Derive from user password
        
        _context = new VaultDbContext(dbPath, encKey);
        await _context.InitializeAsync();
    }

    public Task<User?> GetUserAsync(string userId) => Task.FromResult<User?>(null);
    public Task<User?> GetUserByUsernameAsync(string username) => Task.FromResult<User?>(null);
    public Task<User?> GetUserByEmailAsync(string email) => Task.FromResult<User?>(null);
    public Task<bool> CreateUserAsync(User user) => Task.FromResult(true);
    public Task<bool> UpdateUserAsync(User user) => Task.FromResult(true);
    public Task<List<Contact>> GetContactsAsync(string userId) => Task.FromResult(new List<Contact>());
    public Task<bool> AddContactAsync(Contact contact) => Task.FromResult(true);
    public Task<bool> RemoveContactAsync(string contactId) => Task.FromResult(true);
    public Task<List<Conversation>> GetConversationsAsync(string userId) => Task.FromResult(new List<Conversation>());
    public Task<Conversation?> GetConversationAsync(string conversationId) => Task.FromResult<Conversation?>(null);
    public Task<bool> CreateConversationAsync(Conversation conversation) => Task.FromResult(true);
    public Task<List<Message>> GetMessagesAsync(string conversationId, int limit = 50, int offset = 0) => Task.FromResult(new List<Message>());
    public Task<bool> SaveMessageAsync(Message message) => Task.FromResult(true);
    public Task<bool> UpdateMessageAsync(Message message) => Task.FromResult(true);
    public Task<bool> DeleteMessageAsync(string messageId) => Task.FromResult(true);
    public Task<List<Device>> GetDevicesAsync(string userId) => Task.FromResult(new List<Device>());
    public Task<bool> RegisterDeviceAsync(Device device) => Task.FromResult(true);
}
