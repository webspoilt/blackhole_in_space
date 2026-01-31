import { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useChatStore } from '../lib/chat-store';
import { useAuthStore } from '../lib/auth-store';
import { dbUtils } from '../lib/database';

interface NewChatModalProps {
  onClose: () => void;
}

export default function NewChatModal({ onClose }: NewChatModalProps) {
  const { user } = useAuthStore();
  const { contacts, setActiveConversation } = useChatStore();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!selectedContact || !user) return;
    
    setIsLoading(true);
    try {
      const contact = contacts.find(c => c.id === selectedContact);
      if (!contact) return;

      // Check if conversation already exists
      const existingConvs = await dbUtils.getConversations();
      const existing = existingConvs.find(conv => 
        conv.type === 'direct' && 
        conv.participantIds.includes(contact.deviceId)
      );

      if (existing) {
        setActiveConversation(existing.id);
        onClose();
        return;
      }

      // Create new conversation
      const conversation = {
        id: crypto.randomUUID(),
        type: 'direct' as const,
        participantIds: [user.deviceId, contact.deviceId],
        name: contact.name || contact.email || 'Unknown',
        lastMessageAt: Date.now(),
        unreadCount: 0,
        createdAt: Date.now()
      };

      await dbUtils.createConversation(conversation);
      setActiveConversation(conversation.id);
      onClose();
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <span>New Chat</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No contacts yet</p>
            <p className="text-sm text-gray-500">Add contacts first to start chatting</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedContact === contact.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{contact.name || 'Unknown'}</div>
                  {contact.email && (
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">ID: {contact.deviceId.slice(0, 8)}...</div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleStartChat}
                disabled={!selectedContact || isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? 'Starting...' : 'Start Chat'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
