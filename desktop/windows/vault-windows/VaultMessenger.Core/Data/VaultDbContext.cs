using Microsoft.EntityFrameworkCore;
using VaultMessenger.Core.Models;

namespace VaultMessenger.Core.Data;

public class VaultDbContext : DbContext
{
    private readonly string _databasePath;
    private readonly string _encryptionKey;

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Contact> Contacts { get; set; } = null!;
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<Device> Devices { get; set; } = null!;
    public DbSet<SessionState> SessionStates { get; set; } = null!;
    public DbSet<PreKey> PreKeys { get; set; } = null!;

    public VaultDbContext(string databasePath, string encryptionKey)
    {
        _databasePath = databasePath;
        _encryptionKey = encryptionKey;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Use SQLCipher for encrypted database
        var connectionString = $"Data Source={_databasePath};Password={_encryptionKey}";
        optionsBuilder.UseSqlite(connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configure Contact
        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.ContactUserId }).IsUnique();
        });

        // Configure Conversation
        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasMany(e => e.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Message
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasIndex(e => e.ConversationId);
            entity.HasIndex(e => e.SenderId);
            entity.HasIndex(e => e.SentAt);
            entity.Property(e => e.SentAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configure Device
        modelBuilder.Entity<Device>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.DeviceId }).IsUnique();
        });

        // Configure SessionState
        modelBuilder.Entity<SessionState>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.RecipientId, e.DeviceId }).IsUnique();
        });

        // Configure PreKey
        modelBuilder.Entity<PreKey>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.KeyId }).IsUnique();
        });
    }

    public async Task InitializeAsync()
    {
        await Database.EnsureCreatedAsync();
        
        // Enable SQLCipher specific pragmas
        await Database.ExecuteSqlRawAsync("PRAGMA cipher_page_size = 4096");
        await Database.ExecuteSqlRawAsync("PRAGMA kdf_iter = 256000");
        await Database.ExecuteSqlRawAsync("PRAGMA cipher_hmac_algorithm = HMAC_SHA512");
        await Database.ExecuteSqlRawAsync("PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA512");
    }
}
