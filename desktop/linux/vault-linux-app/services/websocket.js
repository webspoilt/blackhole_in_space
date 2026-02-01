const WebSocket = require('ws');
const EventEmitter = require('events');
const config = require('../config');
const crypto = require('./cryptography');

class WebSocketService extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.SERVER.MAX_RECONNECT_ATTEMPTS;
    this.reconnectInterval = config.SERVER.RECONNECT_INTERVAL;
    this.isConnected = false;
    this.isConnecting = false;
    this.messageQueue = [];
    this.pingInterval = null;
    this.userId = null;
    this.authToken = null;
  }

  connect(userId, authToken) {
    if (this.isConnecting || this.isConnected) {
      console.log('Already connected or connecting');
      return;
    }

    this.userId = userId;
    this.authToken = authToken;
    this.isConnecting = true;

    try {
      const wsUrl = `${config.SERVER.WS_URL}?userId=${userId}&token=${authToken}`;
      this.ws = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        handshakeTimeout: config.SERVER.TIMEOUT
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.on('open', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      this.emit('connected');
      this.startPing();
      this.flushMessageQueue();
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleIncomingMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });

    this.ws.on('close', (code, reason) => {
      console.log(`WebSocket closed: ${code} - ${reason}`);
      this.isConnected = false;
      this.isConnecting = false;
      this.stopPing();
      
      this.emit('disconnected');
      this.handleReconnect();
    });

    this.ws.on('ping', () => {
      this.ws.pong();
    });
  }

  handleIncomingMessage(message) {
    console.log('Incoming message:', message.type);

    switch (message.type) {
      case 'message':
        this.emit('message', message.data);
        break;
      
      case 'message_status':
        this.emit('message-status', message.data);
        break;
      
      case 'typing':
        this.emit('typing', message.data);
        break;
      
      case 'presence':
        this.emit('presence', message.data);
        break;
      
      case 'read_receipt':
        this.emit('read-receipt', message.data);
        break;
      
      case 'delivered_receipt':
        this.emit('delivered-receipt', message.data);
        break;
      
      case 'contact_request':
        this.emit('contact-request', message.data);
        break;
      
      case 'call_signal':
        this.emit('call-signal', message.data);
        break;
      
      case 'keys_request':
        this.emit('keys-request', message.data);
        break;
      
      case 'keys_bundle':
        this.emit('keys-bundle', message.data);
        break;
      
      case 'error':
        this.emit('server-error', message.data);
        break;
      
      case 'pong':
        // Keep-alive response
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  sendMessage(conversationId, recipientId, encryptedContent, messageType = 'text') {
    const message = {
      type: 'message',
      data: {
        id: crypto.generateMessageId(),
        conversationId: conversationId,
        recipientId: recipientId,
        messageType: messageType,
        content: encryptedContent,
        timestamp: Date.now()
      }
    };

    this.send(message);
    return message.data.id;
  }

  sendTypingIndicator(conversationId, isTyping) {
    const message = {
      type: 'typing',
      data: {
        conversationId: conversationId,
        userId: this.userId,
        isTyping: isTyping,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  sendReadReceipt(messageId, conversationId) {
    const message = {
      type: 'read_receipt',
      data: {
        messageId: messageId,
        conversationId: conversationId,
        userId: this.userId,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  sendDeliveredReceipt(messageId, conversationId) {
    const message = {
      type: 'delivered_receipt',
      data: {
        messageId: messageId,
        conversationId: conversationId,
        userId: this.userId,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  sendPresence(status) {
    const message = {
      type: 'presence',
      data: {
        userId: this.userId,
        status: status, // 'online', 'away', 'busy', 'offline'
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  requestPreKeys(recipientId) {
    const message = {
      type: 'keys_request',
      data: {
        recipientId: recipientId,
        requesterId: this.userId,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  sendPreKeyBundle(recipientId, bundle) {
    const message = {
      type: 'keys_bundle',
      data: {
        recipientId: recipientId,
        senderId: this.userId,
        bundle: bundle,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  sendCallSignal(recipientId, signalData) {
    const message = {
      type: 'call_signal',
      data: {
        recipientId: recipientId,
        senderId: this.userId,
        signal: signalData,
        timestamp: Date.now()
      }
    };

    this.send(message);
  }

  send(message) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
        this.messageQueue.push(message);
      }
    } else {
      console.log('WebSocket not connected, queueing message');
      this.messageQueue.push(message);
    }
  }

  flushMessageQueue() {
    if (this.messageQueue.length === 0) return;

    console.log(`Flushing ${this.messageQueue.length} queued messages`);
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach(message => {
      this.send(message);
    });
  }

  startPing() {
    this.stopPing();
    
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max-reconnect-attempts');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.userId && this.authToken) {
        this.connect(this.userId, this.authToken);
      }
    }, delay);
  }

  disconnect() {
    this.stopPing();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.userId = null;
    this.authToken = null;
    this.messageQueue = [];
  }

  getConnectionState() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }
}

module.exports = new WebSocketService();
