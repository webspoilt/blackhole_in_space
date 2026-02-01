using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using VaultMessenger.Core.Services;

namespace VaultMessenger.ViewModels;

public partial class RegisterViewModel : ObservableObject
{
    private readonly IAuthenticationService _authService;
    
    [ObservableProperty] private string _username = string.Empty;
    [ObservableProperty] private string _email = string.Empty;
    [ObservableProperty] private string _password = string.Empty;
    [ObservableProperty] private string _confirmPassword = string.Empty;
    [ObservableProperty] private string _errorMessage = string.Empty;

    public RegisterViewModel(IAuthenticationService authService)
    {
        _authService = authService;
    }

    [RelayCommand]
    private async Task RegisterAsync()
    {
        if (Password != ConfirmPassword)
        {
            ErrorMessage = "Passwords do not match";
            return;
        }
        
        var (success, error) = await _authService.RegisterAsync(Username, Email, Password);
        
        if (!success)
        {
            ErrorMessage = error ?? "Registration failed";
        }
    }
}
