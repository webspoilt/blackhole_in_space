using System.Windows;
using VaultMessenger.ViewModels;

namespace VaultMessenger.Views;

public partial class MainWindow : Window
{
    public MainWindow(MainViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
