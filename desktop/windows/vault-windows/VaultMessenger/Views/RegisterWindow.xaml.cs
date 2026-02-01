using System.Windows;
using VaultMessenger.ViewModels;

namespace VaultMessenger.Views;

public partial class RegisterWindow : Window
{
    public RegisterWindow(RegisterViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
