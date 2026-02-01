using VaultMessenger.Core.Services;
using VaultMessenger.Core.Models;

namespace VaultMessenger.Services;

public class MessageService : IMessageService
{
    public Task<bool> SendMessageAsync(string conversationId, string content, MessageType type) => Task.FromResult(true);
    public Task<bool> SendFileAsync(string conversationId, string filePath, MessageType type) => Task.FromResult(true);
    public Task<bool> EditMessageAsync(string messageId, string newContent) => Task.FromResult(true);
    public Task<bool> DeleteMessageAsync(string messageId, bool deleteForEveryone) => Task.FromResult(true);
    public Task<bool> MarkAsReadAsync(string messageId) => Task.FromResult(true);
    public Task<List<Message>> GetConversationMessagesAsync(string conversationId, int limit = 50) => Task.FromResult(new List<Message>());
    public Task<bool> SetDisappearingMessagesAsync(string conversationId, TimeSpan? duration) => Task.FromResult(true);
}
