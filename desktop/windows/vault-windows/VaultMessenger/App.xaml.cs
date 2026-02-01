using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using VaultMessenger.ViewModels;
using VaultMessenger.Views;
using VaultMessenger.Core.Services;
using VaultMessenger.Services;
using Serilog;
using System.IO;

namespace VaultMessenger;

public partial class App : Application
{
    private readonly IHost _host;

    public App()
    {
        // Configure Serilog
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.File("logs/vault-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 7)
            .CreateLogger();

        _host = Host.CreateDefaultBuilder()
            .ConfigureAppConfiguration((context, config) =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            })
            .ConfigureServices((context, services) =>
            {
                var configuration = context.Configuration;
                
                // Register Configuration
                services.AddSingleton<IConfiguration>(configuration);
                
                // Core Services
                services.AddSingleton<ICryptographyService, CryptographyService>();
                services.AddSingleton<ISignalProtocolService, SignalProtocolService>();
                services.AddSingleton<IDatabaseService, DatabaseService>();
                services.AddSingleton<IWebSocketService, WebSocketService>();
                services.AddSingleton<IEmailService, MailgunEmailService>();
                services.AddSingleton<IAuthenticationService, AuthenticationService>();
                services.AddSingleton<IMessageService, MessageService>();
                services.AddSingleton<IContactService, ContactService>();
                services.AddSingleton<INotificationService, NotificationService>();
                services.AddSingleton<IFileService, FileService>();
                services.AddSingleton<ISecureStorageService, SecureStorageService>();
                
                // ViewModels
                services.AddTransient<LoginViewModel>();
                services.AddTransient<RegisterViewModel>();
                services.AddTransient<MainViewModel>();
                services.AddTransient<ChatViewModel>();
                services.AddTransient<ContactsViewModel>();
                services.AddTransient<SettingsViewModel>();
                
                // Views
                services.AddTransient<LoginWindow>();
                services.AddTransient<RegisterWindow>();
                services.AddTransient<MainWindow>();
            })
            .UseSerilog()
            .Build();
    }

    protected override async void OnStartup(StartupEventArgs e)
    {
        await _host.StartAsync();

        try
        {
            var databaseService = _host.Services.GetRequiredService<IDatabaseService>();
            await databaseService.InitializeAsync();

            var loginWindow = _host.Services.GetRequiredService<LoginWindow>();
            loginWindow.Show();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application startup failed");
            MessageBox.Show($"Failed to start application: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            Shutdown();
        }

        base.OnStartup(e);
    }

    protected override async void OnExit(ExitEventArgs e)
    {
        using (_host)
        {
            await _host.StopAsync();
        }

        Log.CloseAndFlush();
        base.OnExit(e);
    }

    public static T GetService<T>() where T : class
    {
        var app = (App)Current;
        return app._host.Services.GetRequiredService<T>();
    }
}
