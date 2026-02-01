using Websocket.Client;
using System.Net.WebSockets;

namespace VaultMessenger.Core.Services;

public class WebSocketService : IWebSocketService, IDisposable
{
    private WebsocketClient? _client;
    private bool _isConnected;

    public bool IsConnected => _isConnected && _client?.IsRunning == true;

    public event EventHandler<string>? MessageReceived;
    public event EventHandler? Connected;
    public event EventHandler? Disconnected;

    public async Task ConnectAsync(string url, string token)
    {
        if (_client != null && _client.IsRunning)
        {
            await DisconnectAsync();
        }

        var uri = new Uri($"{url}?token={token}");
        _client = new WebsocketClient(uri);

        _client.ReconnectTimeout = TimeSpan.FromSeconds(30);
        _client.ErrorReconnectTimeout = TimeSpan.FromSeconds(30);
        
        _client.ReconnectionHappened.Subscribe(info =>
        {
            _isConnected = true;
            Connected?.Invoke(this, EventArgs.Empty);
        });

        _client.DisconnectionHappened.Subscribe(info =>
        {
            _isConnected = false;
            Disconnected?.Invoke(this, EventArgs.Empty);
        });

        _client.MessageReceived.Subscribe(msg =>
        {
            MessageReceived?.Invoke(this, msg.Text);
        });

        await _client.Start();
    }

    public async Task DisconnectAsync()
    {
        if (_client != null)
        {
            await _client.Stop(WebSocketCloseStatus.NormalClosure, "Client disconnecting");
            _client.Dispose();
            _client = null;
        }
        _isConnected = false;
    }

    public async Task SendAsync(string message)
    {
        if (_client != null && _client.IsRunning)
        {
            _client.Send(message);
            await Task.CompletedTask;
        }
        else
        {
            throw new InvalidOperationException("WebSocket is not connected");
        }
    }

    public void Dispose()
    {
        DisconnectAsync().Wait();
        GC.SuppressFinalize(this);
    }
}
