using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VaultMessenger.Core.Models;

public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string Email { get; set; } = string.Empty;
    
    public string? PhoneNumber { get; set; }
    
    [Required]
    public byte[] IdentityKeyPublic { get; set; } = Array.Empty<byte>();
    
    [Required]
    public byte[] IdentityKeyPrivate { get; set; } = Array.Empty<byte>();
    
    public byte[]? ProfilePicture { get; set; }
    
    public string? StatusMessage { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
    
    public bool IsOnline { get; set; }
    
    // Navigation properties
    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public virtual ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
}

public class Contact
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string ContactUserId { get; set; } = string.Empty;
    
    public string? DisplayName { get; set; }
    
    [Required]
    public byte[] IdentityKey { get; set; } = Array.Empty<byte>();
    
    public bool IsVerified { get; set; }
    
    public bool IsBlocked { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

public class Conversation
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public ConversationType Type { get; set; }
    
    public string? Name { get; set; }
    
    public byte[]? GroupImage { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;
    
    public bool IsMuted { get; set; }
    
    public bool IsPinned { get; set; }
    
    // Navigation properties
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
}

public enum ConversationType
{
    OneOnOne,
    Group
}

public class ConversationParticipant
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string ConversationId { get; set; } = string.Empty;
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public bool IsAdmin { get; set; }
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LeftAt { get; set; }
    
    // Navigation properties
    [ForeignKey("ConversationId")]
    public virtual Conversation? Conversation { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

public class Message
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string ConversationId { get; set; } = string.Empty;
    
    [Required]
    public string SenderId { get; set; } = string.Empty;
    
    [Required]
    public byte[] EncryptedContent { get; set; } = Array.Empty<byte>();
    
    [Required]
    public MessageType Type { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? DeliveredAt { get; set; }
    
    public DateTime? ReadAt { get; set; }
    
    public bool IsEdited { get; set; }
    
    public DateTime? EditedAt { get; set; }
    
    public bool IsDeleted { get; set; }
    
    public DateTime? ExpiresAt { get; set; }
    
    public string? ReplyToMessageId { get; set; }
    
    // Navigation properties
    [ForeignKey("ConversationId")]
    public virtual Conversation? Conversation { get; set; }
    
    [ForeignKey("SenderId")]
    public virtual User? Sender { get; set; }
}

public enum MessageType
{
    Text,
    Image,
    Video,
    Audio,
    Document,
    VoiceMessage,
    Location,
    Contact,
    System
}

public class Device
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public int DeviceId { get; set; }
    
    [Required]
    public string DeviceName { get; set; } = string.Empty;
    
    [Required]
    public byte[] RegistrationId { get; set; } = Array.Empty<byte>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime LastActiveAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

public class SessionState
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string RecipientId { get; set; } = string.Empty;
    
    [Required]
    public int DeviceId { get; set; }
    
    [Required]
    public byte[] SerializedState { get; set; } = Array.Empty<byte>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PreKey
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public int KeyId { get; set; }
    
    [Required]
    public byte[] PublicKey { get; set; } = Array.Empty<byte>();
    
    [Required]
    public byte[] PrivateKey { get; set; } = Array.Empty<byte>();
    
    public bool IsUsed { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
