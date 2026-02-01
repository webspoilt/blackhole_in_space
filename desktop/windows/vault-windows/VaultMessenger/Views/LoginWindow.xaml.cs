using System.Windows;
using VaultMessenger.ViewModels;

namespace VaultMessenger.Views;

public partial class LoginWindow : Window
{
    public LoginWindow(LoginViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }

    private async void LoginButton_Click(object sender, RoutedEventArgs e)
    {
        // Handle login
    }

    private void SignUp_Click(object sender, System.Windows.Input.MouseButtonEventArgs e)
    {
        var registerWindow = App.GetService<RegisterWindow>();
        registerWindow.Show();
        this.Close();
    }

    private void ForgotPassword_Click(object sender, System.Windows.Input.MouseButtonEventArgs e)
    {
        MessageBox.Show("Password reset feature coming soon!", "VAULT Messenger", MessageBoxButton.OK, MessageBoxImage.Information);
    }
}
