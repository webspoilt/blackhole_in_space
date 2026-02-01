// VAULT Messenger - Main Application Script
const { ipcRenderer } = require('electron');

class VaultApp {
  constructor() {
    this.currentScreen = 'login';
    this.currentUser = null;
    this.currentConversation = null;
    this.conversations = [];
    this.messages = [];
    
    this.initializeApp();
  }

  async initializeApp() {
    console.log('Initializing VAULT Messenger...');
    
    // Check for stored session
    const storedUser = await ipcRenderer.invoke('store-get', 'currentUser');
    if (storedUser) {
      this.currentUser = storedUser;
      this.showScreen('main');
      this.loadConversations();
    } else {
      this.showScreen('login');
    }

    this.setupEventListeners();
    this.setupAutoLock();
  }

  setupEventListeners() {
    // Login
    document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
    document.getElementById('login-password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });

    // Register
    document.getElementById('show-register').addEventListener('click', (e) => {
      e.preventDefault();
      this.showScreen('register');
    });
    
    document.getElementById('register-btn').addEventListener('click', () => this.handleRegister());
    
    document.getElementById('show-login').addEventListener('click', (e) => {
      e.preventDefault();
      this.showScreen('login');
    });

    // Verification
    document.getElementById('verify-btn').addEventListener('click', () => this.handleVerification());
    document.getElementById('resend-code').addEventListener('click', (e) => {
      e.preventDefault();
      this.resendVerificationCode();
    });

    // Messaging
    document.getElementById('send-message-btn').addEventListener('click', () => this.sendMessage());
    document.getElementById('message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // File attachment
    document.getElementById('attach-file-btn').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });
    
    document.getElementById('file-input').addEventListener('change', (e) => {
      this.handleFileAttachment(e.target.files);
    });

    // Settings
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.showToast('Settings feature coming soon!', 'info');
    });

    // Voice/Video calls
    document.getElementById('voice-call-btn').addEventListener('click', () => {
      this.showToast('Voice call feature coming soon!', 'info');
    });
    
    document.getElementById('video-call-btn').addEventListener('click', () => {
      this.showToast('Video call feature coming soon!', 'info');
    });

    // Auto-resize message input
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto';
      messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // Reset lock timer on user activity
    document.addEventListener('click', () => {
      ipcRenderer.send('reset-lock-timer');
    });
    
    document.addEventListener('keypress', () => {
      ipcRenderer.send('reset-lock-timer');
    });
  }

  showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    this.currentScreen = screenName;
  }

  showLoading(text = 'Loading...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  async handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
      this.showToast('Please enter username and password', 'error');
      return;
    }

    this.showLoading('Signing in...');

    // Simulate login (replace with actual authentication)
    setTimeout(() => {
      this.currentUser = {
        id: 'user-' + Date.now(),
        username: username
      };

      ipcRenderer.invoke('store-set', 'currentUser', this.currentUser);
      
      this.hideLoading();
      this.showScreen('main');
      this.showToast('Signed in successfully!', 'success');
      this.loadConversations();
      
      document.getElementById('current-user-name').textContent = username;
    }, 1500);
  }

  async handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (!username || !email || !password || !confirmPassword) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 8) {
      this.showToast('Password must be at least 8 characters', 'error');
      return;
    }

    this.showLoading('Creating account...');

    // Simulate registration
    setTimeout(() => {
      this.hideLoading();
      this.pendingEmail = email;
      this.showScreen('verification');
      this.showToast('Verification code sent to ' + email, 'success');
    }, 1500);
  }

  async handleVerification() {
    const code = document.getElementById('verification-code').value.trim();

    if (code.length !== 6) {
      this.showToast('Please enter the 6-digit code', 'error');
      return;
    }

    this.showLoading('Verifying...');

    // Simulate verification
    setTimeout(() => {
      this.hideLoading();
      this.showToast('Account verified successfully!', 'success');
      this.showScreen('login');
    }, 1500);
  }

  async resendVerificationCode() {
    this.showToast('Verification code resent!', 'success');
  }

  loadConversations() {
    // Simulated conversations
    this.conversations = [
      {
        id: '1',
        name: 'Alice Cooper',
        lastMessage: 'Hey, how are you?',
        timestamp: Date.now() - 3600000,
        unread: 2,
        avatar: '👩'
      },
      {
        id: '2',
        name: 'Bob Smith',
        lastMessage: 'Thanks for the update',
        timestamp: Date.now() - 7200000,
        unread: 0,
        avatar: '👨'
      },
      {
        id: '3',
        name: 'Secure Team',
        lastMessage: 'Meeting at 3 PM',
        timestamp: Date.now() - 86400000,
        unread: 5,
        avatar: '👥'
      }
    ];

    this.renderConversations();
  }

  renderConversations() {
    const container = document.getElementById('conversations-list');
    container.innerHTML = '';

    this.conversations.forEach(conv => {
      const item = document.createElement('div');
      item.className = 'conversation-item';
      if (this.currentConversation && this.currentConversation.id === conv.id) {
        item.classList.add('active');
      }

      const timeStr = this.formatTime(conv.timestamp);

      item.innerHTML = `
        <div class="conversation-avatar">${conv.avatar}</div>
        <div class="conversation-info">
          <div class="conversation-name">${conv.name}</div>
          <div class="conversation-last-message">${conv.lastMessage}</div>
        </div>
        <div class="conversation-meta">
          <div class="conversation-time">${timeStr}</div>
          ${conv.unread > 0 ? `<div class="unread-badge">${conv.unread}</div>` : ''}
        </div>
      `;

      item.addEventListener('click', () => {
        this.openConversation(conv);
      });

      container.appendChild(item);
    });
  }

  openConversation(conversation) {
    this.currentConversation = conversation;
    this.renderConversations();
    
    document.getElementById('chat-recipient-name').textContent = conversation.name;
    document.getElementById('chat-recipient-status').textContent = '🟢 Online';
    
    // Load messages for this conversation
    this.loadMessages(conversation.id);
  }

  loadMessages(conversationId) {
    // Simulated messages
    this.messages = [
      {
        id: '1',
        content: 'Hi there! How are you doing?',
        timestamp: Date.now() - 3600000,
        sent: false
      },
      {
        id: '2',
        content: "I'm doing great, thanks for asking!",
        timestamp: Date.now() - 3500000,
        sent: true
      },
      {
        id: '3',
        content: 'Would you like to grab coffee later?',
        timestamp: Date.now() - 3400000,
        sent: false
      },
      {
        id: '4',
        content: 'Sure! What time works for you?',
        timestamp: Date.now() - 3300000,
        sent: true
      }
    ];

    this.renderMessages();
  }

  renderMessages() {
    const container = document.getElementById('messages-container');
    container.innerHTML = '';

    this.messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
      
      messageDiv.innerHTML = `
        <div class="message-bubble">
          <div class="message-content">${this.escapeHtml(msg.content)}</div>
          <div class="message-timestamp">${this.formatTime(msg.timestamp)}</div>
        </div>
      `;

      container.appendChild(messageDiv);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();

    if (!content) return;

    if (!this.currentConversation) {
      this.showToast('Please select a conversation', 'error');
      return;
    }

    const message = {
      id: Date.now().toString(),
      content: content,
      timestamp: Date.now(),
      sent: true
    };

    this.messages.push(message);
    this.renderMessages();

    input.value = '';
    input.style.height = 'auto';

    this.showToast('Message sent (encrypted)', 'success');
  }

  handleFileAttachment(files) {
    if (files.length === 0) return;

    this.showToast(`${files.length} file(s) selected for encryption`, 'info');
    
    // Handle file encryption and upload
    // Implementation would go here
  }

  setupAutoLock() {
    ipcRenderer.on('app-locked', () => {
      this.showScreen('login');
      this.currentUser = null;
      this.showToast('App locked due to inactivity', 'info');
    });
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 86400000) { // Less than 24 hours
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.vaultApp = new VaultApp();
});
