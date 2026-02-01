const axios = require('axios');
const config = require('../config');

class EmailService {
  constructor() {
    this.apiKey = config.EMAIL.API_KEY;
    this.apiUrl = config.EMAIL.API_URL;
    this.from = config.EMAIL.FROM;
    this.fromName = config.EMAIL.FROM_NAME;
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          from: `${this.fromName} <${this.from}>`,
          to: [to],
          subject: subject,
          html: html,
          text: text || this.stripHtml(html)
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Email sent successfully:', response.data);
      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error('Email sending error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  async sendVerificationEmail(email, username, verificationCode) {
    const subject = 'Verify Your VAULT Account';
    const html = this.getVerificationEmailTemplate(username, verificationCode);
    
    return this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email, username, resetCode) {
    const subject = 'Reset Your VAULT Password';
    const html = this.getPasswordResetTemplate(username, resetCode);
    
    return this.sendEmail(email, subject, html);
  }

  async sendWelcomeEmail(email, username) {
    const subject = 'Welcome to VAULT Messenger';
    const html = this.getWelcomeEmailTemplate(username);
    
    return this.sendEmail(email, subject, html);
  }

  async sendSecurityAlertEmail(email, username, alertType, details) {
    const subject = `Security Alert: ${alertType}`;
    const html = this.getSecurityAlertTemplate(username, alertType, details);
    
    return this.sendEmail(email, subject, html);
  }

  getVerificationEmailTemplate(username, code) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #1a1a2e;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #16213e;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #6200EA;
      font-size: 32px;
      margin: 0;
      font-weight: bold;
    }
    .content {
      line-height: 1.6;
    }
    .code-box {
      background-color: #1a1a2e;
      border: 2px solid #6200EA;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #03DAC6;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      background-color: #6200EA;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
    .warning {
      background-color: rgba(207, 102, 121, 0.1);
      border-left: 4px solid #CF6679;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🔒 VAULT</h1>
      <p style="color: #888; margin: 0;">Military-Grade Secure Messaging</p>
    </div>
    
    <div class="content">
      <h2 style="color: #03DAC6;">Welcome, ${username}!</h2>
      <p>Thank you for joining VAULT Messenger. To complete your registration, please verify your email address using the code below:</p>
      
      <div class="code-box">
        <div class="code">${code}</div>
        <p style="color: #888; margin-top: 10px; font-size: 14px;">This code expires in 15 minutes</p>
      </div>
      
      <p>Enter this code in the VAULT application to activate your account.</p>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong> Never share this code with anyone. VAULT staff will never ask for your verification code.
      </div>
      
      <p style="margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
    </div>
    
    <div class="footer">
      <p><strong>VAULT Messenger</strong> - Where messages go to never be found</p>
      <p>End-to-End Encrypted | Zero Knowledge | Post-Quantum Ready</p>
      <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
  }

  getPasswordResetTemplate(username, code) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #1a1a2e;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #16213e;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #6200EA;
      font-size: 32px;
      margin: 0;
      font-weight: bold;
    }
    .content {
      line-height: 1.6;
    }
    .code-box {
      background-color: #1a1a2e;
      border: 2px solid #CF6679;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #03DAC6;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
    .warning {
      background-color: rgba(207, 102, 121, 0.1);
      border-left: 4px solid #CF6679;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🔒 VAULT</h1>
      <p style="color: #888; margin: 0;">Military-Grade Secure Messaging</p>
    </div>
    
    <div class="content">
      <h2 style="color: #CF6679;">Password Reset Request</h2>
      <p>Hello ${username},</p>
      <p>We received a request to reset your VAULT account password. Use the code below to reset your password:</p>
      
      <div class="code-box">
        <div class="code">${code}</div>
        <p style="color: #888; margin-top: 10px; font-size: 14px;">This code expires in 15 minutes</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Security Alert:</strong> If you didn't request this password reset, please secure your account immediately. Someone may be trying to access your account.
      </div>
      
      <p style="margin-top: 30px;">For your security, this code will expire in 15 minutes.</p>
    </div>
    
    <div class="footer">
      <p><strong>VAULT Messenger</strong> - Where messages go to never be found</p>
      <p>End-to-End Encrypted | Zero Knowledge | Post-Quantum Ready</p>
      <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
  }

  getWelcomeEmailTemplate(username) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #1a1a2e;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #16213e;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #6200EA;
      font-size: 32px;
      margin: 0;
      font-weight: bold;
    }
    .content {
      line-height: 1.6;
    }
    .feature-list {
      margin: 30px 0;
    }
    .feature {
      padding: 15px;
      margin: 10px 0;
      background-color: #1a1a2e;
      border-radius: 8px;
      border-left: 4px solid #03DAC6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🔒 VAULT</h1>
      <p style="color: #888; margin: 0;">Military-Grade Secure Messaging</p>
    </div>
    
    <div class="content">
      <h2 style="color: #03DAC6;">Welcome to VAULT, ${username}! 🎉</h2>
      <p>Your account has been successfully verified. You're now part of the most secure messaging platform on the planet.</p>
      
      <div class="feature-list">
        <div class="feature">
          <strong>🔐 End-to-End Encryption</strong>
          <p style="margin: 5px 0 0 0; color: #aaa; font-size: 14px;">Your messages are encrypted on your device and can only be read by you and your recipient.</p>
        </div>
        
        <div class="feature">
          <strong>🚀 Post-Quantum Security</strong>
          <p style="margin: 5px 0 0 0; color: #aaa; font-size: 14px;">Protected against future quantum computing threats with ML-KEM-768.</p>
        </div>
        
        <div class="feature">
          <strong>👻 Disappearing Messages</strong>
          <p style="margin: 5px 0 0 0; color: #aaa; font-size: 14px;">Set messages to automatically delete after a specified time.</p>
        </div>
        
        <div class="feature">
          <strong>🕵️ Zero Knowledge</strong>
          <p style="margin: 5px 0 0 0; color: #aaa; font-size: 14px;">We can't read your messages. Ever. That's a promise.</p>
        </div>
      </div>
      
      <p style="margin-top: 30px;">Start messaging securely today. Your privacy is our priority.</p>
    </div>
    
    <div class="footer">
      <p><strong>VAULT Messenger</strong> - Where messages go to never be found</p>
      <p>End-to-End Encrypted | Zero Knowledge | Post-Quantum Ready</p>
      <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
  }

  getSecurityAlertTemplate(username, alertType, details) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #1a1a2e;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #16213e;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #6200EA;
      font-size: 32px;
      margin: 0;
      font-weight: bold;
    }
    .content {
      line-height: 1.6;
    }
    .alert-box {
      background-color: rgba(207, 102, 121, 0.2);
      border: 2px solid #CF6679;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🔒 VAULT</h1>
      <p style="color: #888; margin: 0;">Military-Grade Secure Messaging</p>
    </div>
    
    <div class="content">
      <h2 style="color: #CF6679;">⚠️ Security Alert</h2>
      <p>Hello ${username},</p>
      
      <div class="alert-box">
        <h3 style="margin-top: 0; color: #CF6679;">${alertType}</h3>
        <p>${details}</p>
        <p style="color: #888; font-size: 14px; margin-bottom: 0;">Time: ${new Date().toLocaleString()}</p>
      </div>
      
      <p>If this was you, you can safely ignore this email. If you don't recognize this activity, please secure your account immediately.</p>
      
      <p style="margin-top: 30px;"><strong>Recommended actions:</strong></p>
      <ul>
        <li>Change your password immediately</li>
        <li>Review your active devices</li>
        <li>Enable two-factor authentication</li>
        <li>Check your recent activity</li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>VAULT Messenger</strong> - Where messages go to never be found</p>
      <p>End-to-End Encrypted | Zero Knowledge | Post-Quantum Ready</p>
      <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

module.exports = new EmailService();
