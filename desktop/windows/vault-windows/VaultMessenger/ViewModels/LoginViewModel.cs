using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using VaultMessenger.Core.Services;

namespace VaultMessenger.ViewModels;

public partial class LoginViewModel : ObservableObject
{
    private readonly IAuthenticationService _authService;
    
    [ObservableProperty] private string _username = string.Empty;
    [ObservableProperty] private string _password = string.Empty;
    [ObservableProperty] private string _errorMessage = string.Empty;
    [ObservableProperty] private bool _isLoading;

    public LoginViewModel(IAuthenticationService authService)
    {
        _authService = authService;
    }

    [RelayCommand]
    private async Task LoginAsync()
    {
        IsLoading = true;
        ErrorMessage = string.Empty;
        
        var (success, token, user) = await _authService.LoginAsync(Username, Password);
        
        if (success)
        {
            // Navigate to main window
        }
        else
        {
            ErrorMessage = "Invalid username or password";
        }
        
        IsLoading = false;
    }
}
