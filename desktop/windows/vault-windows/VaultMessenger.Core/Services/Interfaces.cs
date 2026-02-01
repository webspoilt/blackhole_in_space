using VaultMessenger.Core.Models;

namespace VaultMessenger.Core.Services;

public interface ICryptographyService
{
    byte[] GenerateRandomBytes(int length);
    byte[] Encrypt(byte[] data, byte[] key);
    byte[] Decrypt(byte[] encryptedData, byte[] key);
    string HashPassword(string password, byte[] salt);
    bool VerifyPassword(string password, string hashedPassword, byte[] salt);
    byte[] DeriveKey(string password, byte[] salt, int iterations = 100000);
    (byte[] publicKey, byte[] privateKey) GenerateKeyPair();
    byte[] Sign(byte[] data, byte[] privateKey);
    bool VerifySignature(byte[] data, byte[] signature, byte[] publicKey);
}

public interface ISignalProtocolService
{
    Task InitializeAsync(string userId);
    Task<byte[]> EncryptMessageAsync(string recipientId, int deviceId, byte[] plaintext);
    Task<byte[]> DecryptMessageAsync(string senderId, int deviceId, byte[] ciphertext);
    Task<byte[]> GetIdentityKeyAsync();
    Task<bool> TrustIdentityKeyAsync(string userId, byte[] identityKey);
    Task GeneratePreKeysAsync(int count = 100);
    Task<List<(int keyId, byte[] publicKey)>> GetPreKeysAsync();
}

public interface IDatabaseService
{
    Task InitializeAsync();
    Task<User?> GetUserAsync(string userId);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<bool> CreateUserAsync(User user);
    Task<bool> UpdateUserAsync(User user);
    Task<List<Contact>> GetContactsAsync(string userId);
    Task<bool> AddContactAsync(Contact contact);
    Task<bool> RemoveContactAsync(string contactId);
    Task<List<Conversation>> GetConversationsAsync(string userId);
    Task<Conversation?> GetConversationAsync(string conversationId);
    Task<bool> CreateConversationAsync(Conversation conversation);
    Task<List<Message>> GetMessagesAsync(string conversationId, int limit = 50, int offset = 0);
    Task<bool> SaveMessageAsync(Message message);
    Task<bool> UpdateMessageAsync(Message message);
    Task<bool> DeleteMessageAsync(string messageId);
    Task<List<Device>> GetDevicesAsync(string userId);
    Task<bool> RegisterDeviceAsync(Device device);
}

public interface IWebSocketService
{
    bool IsConnected { get; }
    event EventHandler<string>? MessageReceived;
    event EventHandler? Connected;
    event EventHandler? Disconnected;
    Task ConnectAsync(string url, string token);
    Task DisconnectAsync();
    Task SendAsync(string message);
}

public interface IEmailService
{
    Task<bool> SendVerificationEmailAsync(string toEmail, string verificationCode);
    Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken);
    Task<bool> SendWelcomeEmailAsync(string toEmail, string username);
}

public interface IAuthenticationService
{
    Task<(bool success, string? token, User? user)> LoginAsync(string username, string password);
    Task<(bool success, string? error)> RegisterAsync(string username, string email, string password);
    Task<bool> VerifyEmailAsync(string email, string code);
    Task<bool> RequestPasswordResetAsync(string email);
    Task<bool> ResetPasswordAsync(string token, string newPassword);
    Task LogoutAsync();
    User? CurrentUser { get; }
    bool IsAuthenticated { get; }
}

public interface IMessageService
{
    Task<bool> SendMessageAsync(string conversationId, string content, MessageType type);
    Task<bool> SendFileAsync(string conversationId, string filePath, MessageType type);
    Task<bool> EditMessageAsync(string messageId, string newContent);
    Task<bool> DeleteMessageAsync(string messageId, bool deleteForEveryone);
    Task<bool> MarkAsReadAsync(string messageId);
    Task<List<Message>> GetConversationMessagesAsync(string conversationId, int limit = 50);
    Task<bool> SetDisappearingMessagesAsync(string conversationId, TimeSpan? duration);
}

public interface IContactService
{
    Task<List<Contact>> GetAllContactsAsync();
    Task<Contact?> GetContactAsync(string contactId);
    Task<bool> AddContactAsync(string username);
    Task<bool> RemoveContactAsync(string contactId);
    Task<bool> BlockContactAsync(string contactId);
    Task<bool> UnblockContactAsync(string contactId);
    Task<bool> VerifyContactAsync(string contactId, byte[] identityKey);
}

public interface INotificationService
{
    void ShowNotification(string title, string message);
    void ShowMessageNotification(string senderName, string messagePreview, string conversationId);
    Task<bool> RequestPermissionAsync();
}

public interface IFileService
{
    Task<byte[]> ReadFileAsync(string filePath);
    Task<bool> WriteFileAsync(string filePath, byte[] data);
    Task<bool> DeleteFileAsync(string filePath);
    Task<string> SaveEncryptedFileAsync(byte[] data, string fileName);
    Task<byte[]> LoadEncryptedFileAsync(string filePath);
    string GetAppDataPath();
}

public interface ISecureStorageService
{
    Task<bool> SetAsync(string key, string value);
    Task<string?> GetAsync(string key);
    Task<bool> RemoveAsync(string key);
    Task<bool> ClearAsync();
}
