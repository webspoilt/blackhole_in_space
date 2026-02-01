using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;

namespace VaultMessenger.Core.Services;

public class MailgunEmailService : IEmailService
{
    private readonly string _apiKey;
    private readonly string _domain;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly HttpClient _httpClient;

    public MailgunEmailService(IConfiguration configuration)
    {
        _apiKey = configuration["Email:ApiKey"] ?? throw new ArgumentException("Mailgun API key not configured");
        _domain = configuration["Email:Domain"] ?? throw new ArgumentException("Mailgun domain not configured");
        _fromEmail = configuration["Email:FromEmail"] ?? "noreply@b2g-vault";
        _fromName = configuration["Email:FromName"] ?? "VAULT Messenger";
        
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://api.mailgun.net/v3/")
        };
        
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{_apiKey}"));
        _httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", credentials);
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string verificationCode)
    {
        var subject = "Verify your VAULT account";
        var htmlBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #6200EA;'>Welcome to VAULT Messenger!</h2>
                    <p>Thank you for registering. Please verify your email address using the code below:</p>
                    <div style='background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;'>
                        <h1 style='color: #6200EA; font-size: 32px; letter-spacing: 5px;'>{verificationCode}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't create a VAULT account, please ignore this email.</p>
                    <hr style='margin: 30px 0;'>
                    <p style='color: #666; font-size: 12px;'>
                        VAULT - Military-Grade Secure Messaging<br>
                        Where messages go to never be found.
                    </p>
                </div>
            </body>
            </html>";
        
        var textBody = $"Welcome to VAULT Messenger!\n\nYour verification code is: {verificationCode}\n\nThis code will expire in 10 minutes.";
        
        return await SendEmailAsync(toEmail, subject, textBody, htmlBody);
    }

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken)
    {
        var subject = "Reset your VAULT password";
        var htmlBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #6200EA;'>Password Reset Request</h2>
                    <p>We received a request to reset your VAULT password.</p>
                    <p>Your password reset code is:</p>
                    <div style='background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;'>
                        <h1 style='color: #6200EA; font-size: 32px; letter-spacing: 5px;'>{resetToken}</h1>
                    </div>
                    <p>This code will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email and ensure your account is secure.</p>
                    <hr style='margin: 30px 0;'>
                    <p style='color: #666; font-size: 12px;'>
                        VAULT - Military-Grade Secure Messaging
                    </p>
                </div>
            </body>
            </html>";
        
        var textBody = $"Password Reset Request\n\nYour password reset code is: {resetToken}\n\nThis code will expire in 1 hour.";
        
        return await SendEmailAsync(toEmail, subject, textBody, htmlBody);
    }

    public async Task<bool> SendWelcomeEmailAsync(string toEmail, string username)
    {
        var subject = "Welcome to VAULT - Your Secure Messaging Journey Begins";
        var htmlBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #6200EA;'>Welcome {username}!</h2>
                    <p>Your VAULT account is now active and ready to use.</p>
                    <h3>Your Privacy, Guaranteed</h3>
                    <ul>
                        <li>🔒 End-to-end encrypted messages</li>
                        <li>🚫 No message storage on servers</li>
                        <li>🛡️ Military-grade security protocols</li>
                        <li>👁️ Zero-knowledge architecture</li>
                    </ul>
                    <p>Start messaging securely today!</p>
                    <hr style='margin: 30px 0;'>
                    <p style='color: #666; font-size: 12px;'>
                        VAULT - Where messages go to never be found.
                    </p>
                </div>
            </body>
            </html>";
        
        var textBody = $"Welcome {username}!\n\nYour VAULT account is now active.\n\nFeatures:\n- End-to-end encrypted messages\n- No message storage\n- Military-grade security\n- Zero-knowledge architecture";
        
        return await SendEmailAsync(toEmail, subject, textBody, htmlBody);
    }

    private async Task<bool> SendEmailAsync(string toEmail, string subject, string textBody, string htmlBody)
    {
        try
        {
            var content = new MultipartFormDataContent
            {
                { new StringContent($"{_fromName} <{_fromEmail}>"), "from" },
                { new StringContent(toEmail), "to" },
                { new StringContent(subject), "subject" },
                { new StringContent(textBody), "text" },
                { new StringContent(htmlBody), "html" }
            };

            var response = await _httpClient.PostAsync($"{_domain}/messages", content);
            return response.IsSuccessStatusCode;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
