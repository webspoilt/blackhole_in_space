using VaultMessenger.Core.Services;

namespace VaultMessenger.Services;

public class NotificationService : INotificationService
{
    public void ShowNotification(string title, string message)
    {
        // TODO: Implement Windows notifications
    }

    public void ShowMessageNotification(string senderName, string messagePreview, string conversationId)
    {
        ShowNotification(senderName, messagePreview);
    }

    public Task<bool> RequestPermissionAsync() => Task.FromResult(true);
}
