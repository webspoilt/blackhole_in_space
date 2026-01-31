import { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Clock, Shield } from 'lucide-react';
import { useChatStore } from '../lib/chat-store';
import { useAuthStore } from '../lib/auth-store';
import { useWebSocketStore } from '../lib/websocket';
import { dbUtils } from '../lib/database';
import { createEncryptedPayload } from '../lib/crypto';
import { format } from 'date-fns';

export default function ChatWindow() {
  const { user } = useAuthStore();
  const { 
    activeConversationId, 
    conversations, 
    messages, 
    setMessages,
    addMessage,
    typingUsers 
  } = useChatStore();
  const { sendMessage, sendTypingIndicator } = useWebSocketStore();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const loadMessages = async () => {
        const msgs = await dbUtils.getMessages(activeConversationId);
        setMessages(activeConversationId, msgs);
        await dbUtils.markConversationAsRead(activeConversationId);
      };
      loadMessages();
    }
  }, [activeConversationId, setMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConversationId || !user) return;

    const device = await dbUtils.getCurrentDevice();
    if (!device) return;

    // For demo: recipient would be determined from conversation
    const recipientDeviceId = activeConversation?.participantIds.find(id => id !== user.deviceId);
    if (!recipientDeviceId) return;

    const messageId = crypto.randomUUID();
    const message = {
      id: messageId,
      conversationId: activeConversationId,
      senderDeviceId: user.deviceId,
      recipientDeviceId,
      content: inputMessage,
      type: 'text' as const,
      status: 'sending' as const,
      timestamp: Date.now(),
      expiresAt: undefined // Would be set based on settings
    };

    // Add to local DB
    await dbUtils.addMessage(message);
    addMessage(message);

    // Send via WebSocket (encrypted)
    sendMessage({
      messageId,
      recipientDeviceId,
      encryptedPayload: {
        content: inputMessage,
        timestamp: message.timestamp
      }
    });

    setInputMessage('');
    setIsTyping(false);
  };

  const handleTyping = () => {
    if (!isTyping && activeConversation) {
      setIsTyping(true);
      const recipientDeviceId = activeConversation.participantIds.find(id => id !== user?.deviceId);
      if (recipientDeviceId) {
        sendTypingIndicator(recipientDeviceId, activeConversationId!, true);
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeConversation) {
        const recipientDeviceId = activeConversation.participantIds.find(id => id !== user?.deviceId);
        if (recipientDeviceId) {
          sendTypingIndicator(recipientDeviceId, activeConversationId!, false);
        }
      }
    }, 2000);
  };

  const activeTypingUsers = typingUsers.filter(u => u.conversationId === activeConversationId);

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VAULT</h2>
          <p className="text-gray-600">Select a conversation or start a new chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{activeConversation?.name || 'Chat'}</h2>
          <p className="text-sm text-gray-500 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>End-to-end encrypted</span>
          </p>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversationMessages.map((msg) => {
          const isSent = msg.senderDeviceId === user?.deviceId;
          
          return (
            <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`message-bubble ${isSent ? 'message-sent' : 'message-received'}`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <div className="flex items-center space-x-2 mt-1 px-2">
                  <span className="text-xs text-gray-500">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {isSent && (
                    <span className="text-xs text-gray-500">
                      {msg.status === 'sending' && '⏳'}
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'delivered' && '✓✓'}
                      {msg.status === 'read' && <span className="text-blue-500">✓✓</span>}
                    </span>
                  )}
                  {msg.expiresAt && (
                    <Clock className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {activeTypingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="message-bubble message-received flex items-center space-x-1">
              <div className="typing-dot w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="typing-dot w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="typing-dot w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ minHeight: '42px', maxHeight: '120px' }}
            />
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="btn btn-primary"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
