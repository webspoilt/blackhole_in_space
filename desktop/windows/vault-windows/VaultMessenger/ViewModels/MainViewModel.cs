using CommunityToolkit.Mvvm.ComponentModel;

namespace VaultMessenger.ViewModels;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty] private string _title = "VAULT Messenger";
}
