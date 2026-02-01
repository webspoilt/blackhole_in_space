using VaultMessenger.Core.Services;
using VaultMessenger.Core.Models;

namespace VaultMessenger.Services;

public class AuthenticationService : IAuthenticationService
{
    private User? _currentUser;
    
    public User? CurrentUser => _currentUser;
    public bool IsAuthenticated => _currentUser != null;

    public Task<(bool success, string? token, User? user)> LoginAsync(string username, string password)
    {
        // TODO: Implement actual authentication
        return Task.FromResult((false, (string?)null, (User?)null));
    }

    public Task<(bool success, string? error)> RegisterAsync(string username, string email, string password)
    {
        // TODO: Implement registration
        return Task.FromResult((false, "Not implemented"));
    }

    public Task<bool> VerifyEmailAsync(string email, string code) => Task.FromResult(false);
    public Task<bool> RequestPasswordResetAsync(string email) => Task.FromResult(false);
    public Task<bool> ResetPasswordAsync(string token, string newPassword) => Task.FromResult(false);
    
    public Task LogoutAsync()
    {
        _currentUser = null;
        return Task.CompletedTask;
    }
}
