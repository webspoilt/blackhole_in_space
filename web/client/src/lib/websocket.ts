import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { Message, Conversation, Contact } from './database';
import { EncryptedPayload } from './crypto';

interface TypingIndicator {
  conversationId: string;
  deviceId: string;
  isTyping: boolean;
}

interface WebSocketStore {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  
  connect: (token: string) => void;
  disconnect: () => void;
  sendMessage: (payload: any) => void;
  sendTypingIndicator: (recipientDeviceId: string, conversationId: string, isTyping: boolean) => void;
  markDelivered: (messageId: string, senderDeviceId: string) => void;
  markRead: (messageId: string, senderDeviceId: string) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  error: null,

  connect: (token: string) => {
    const socketUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      set({ isConnected: true, error: null });
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      set({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket error:', error);
      set({ error: error.message });
    });

    socket.on('message', (data) => {
      // Handle incoming message
      window.dispatchEvent(new CustomEvent('vault:message', { detail: data }));
    });

    socket.on('typing-indicator', (data) => {
      window.dispatchEvent(new CustomEvent('vault:typing', { detail: data }));
    });

    socket.on('delivery-receipt', (data) => {
      window.dispatchEvent(new CustomEvent('vault:delivered', { detail: data }));
    });

    socket.on('read-receipt', (data) => {
      window.dispatchEvent(new CustomEvent('vault:read', { detail: data }));
    });

    socket.on('message-sent', (data) => {
      window.dispatchEvent(new CustomEvent('vault:sent', { detail: data }));
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (payload) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('send-message', payload);
    }
  },

  sendTypingIndicator: (recipientDeviceId, conversationId, isTyping) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('typing', { recipientDeviceId, conversationId, isTyping });
    }
  },

  markDelivered: (messageId, senderDeviceId) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('message-delivered', { messageId, senderDeviceId });
    }
  },

  markRead: (messageId, senderDeviceId) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('message-read', { messageId, senderDeviceId });
    }
  }
}));
