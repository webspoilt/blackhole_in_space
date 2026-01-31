import { useEffect, useState } from 'react';
import { useChatStore } from '../lib/chat-store';
import { useAuthStore } from '../lib/auth-store';
import { useWebSocketStore } from '../lib/websocket';
import { dbUtils } from '../lib/database';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ContactModal from '../components/ContactModal';
import NewChatModal from '../components/NewChatModal';

export default function ChatPage() {
  const { user } = useAuthStore();
  const { setConversations, setContacts, setMessages, addMessage, updateMessage } = useChatStore();
  const { isConnected } = useWebSocketStore();
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const conversations = await dbUtils.getConversations();
      const contacts = await dbUtils.getContacts();
      
      setConversations(conversations);
      setContacts(contacts);
    };

    loadData();
  }, [setConversations, setContacts]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = async (event: CustomEvent) => {
      const data = event.detail;
      
      try {
        // Decrypt message
        const device = await dbUtils.getCurrentDevice();
        if (!device) return;

        // For now, store encrypted payload - full decryption would happen here
        const message = {
          id: data.messageId || crypto.randomUUID(),
          conversationId: data.groupId || data.senderDeviceId,
          senderDeviceId: data.senderDeviceId,
          content: '[Encrypted Message]', // Would decrypt here
          type: 'text' as const,
          status: 'delivered' as const,
          timestamp: data.timestamp,
          encryptedPayload: JSON.stringify(data.encryptedPayload)
        };

        await dbUtils.addMessage(message);
        addMessage(message);

        // Send delivery receipt
        useWebSocketStore.getState().markDelivered(message.id, data.senderDeviceId);
      } catch (error) {
        console.error('Failed to process message:', error);
      }
    };

    const handleSent = (event: CustomEvent) => {
      const { messageId } = event.detail;
      updateMessage(messageId, { status: 'sent' });
    };

    const handleDelivered = (event: CustomEvent) => {
      const { messageId } = event.detail;
      updateMessage(messageId, { status: 'delivered' });
    };

    const handleRead = (event: CustomEvent) => {
      const { messageId } = event.detail;
      updateMessage(messageId, { status: 'read' });
    };

    window.addEventListener('vault:message', handleMessage as EventListener);
    window.addEventListener('vault:sent', handleSent as EventListener);
    window.addEventListener('vault:delivered', handleDelivered as EventListener);
    window.addEventListener('vault:read', handleRead as EventListener);

    return () => {
      window.removeEventListener('vault:message', handleMessage as EventListener);
      window.removeEventListener('vault:sent', handleSent as EventListener);
      window.removeEventListener('vault:delivered', handleDelivered as EventListener);
      window.removeEventListener('vault:read', handleRead as EventListener);
    };
  }, [addMessage, updateMessage]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar 
        onNewChat={() => setShowNewChatModal(true)}
        onAddContact={() => setShowContactModal(true)}
      />
      
      <ChatWindow />

      {/* Connection status indicator */}
      {!isConnected && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>Reconnecting...</span>
        </div>
      )}

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}

      {showNewChatModal && (
        <NewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </div>
  );
}
