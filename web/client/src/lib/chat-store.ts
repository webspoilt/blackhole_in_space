import { create } from 'zustand';
import { Message, Conversation, Contact } from './database';

interface TypingUser {
  deviceId: string;
  conversationId: string;
  timestamp: number;
}

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  contacts: Contact[];
  activeConversationId: string | null;
  typingUsers: TypingUser[];
  searchQuery: string;
  
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  setActiveConversation: (id: string | null) => void;
  addTypingUser: (deviceId: string, conversationId: string) => void;
  removeTypingUser: (deviceId: string, conversationId: string) => void;
  setSearchQuery: (query: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  messages: {},
  contacts: [],
  activeConversationId: null,
  typingUsers: [],
  searchQuery: '',

  setConversations: (conversations) => set({ conversations }),

  setMessages: (conversationId, messages) => 
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages }
    })),

  addMessage: (message) => 
    set((state) => {
      const existing = state.messages[message.conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [message.conversationId]: [...existing, message]
        }
      };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => {
      const newMessages = { ...state.messages };
      for (const conversationId in newMessages) {
        const messages = newMessages[conversationId];
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
          newMessages[conversationId] = [
            ...messages.slice(0, index),
            { ...messages[index], ...updates },
            ...messages.slice(index + 1)
          ];
          break;
        }
      }
      return { messages: newMessages };
    }),

  setContacts: (contacts) => set({ contacts }),

  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts.filter(c => c.id !== contact.id), contact]
    })),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addTypingUser: (deviceId, conversationId) =>
    set((state) => ({
      typingUsers: [
        ...state.typingUsers.filter(u => u.deviceId !== deviceId || u.conversationId !== conversationId),
        { deviceId, conversationId, timestamp: Date.now() }
      ]
    })),

  removeTypingUser: (deviceId, conversationId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        u => u.deviceId !== deviceId || u.conversationId !== conversationId
      )
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }))
}));

// Clean up old typing indicators
setInterval(() => {
  const store = useChatStore.getState();
  const now = Date.now();
  const filtered = store.typingUsers.filter(u => now - u.timestamp < 5000);
  if (filtered.length !== store.typingUsers.length) {
    useChatStore.setState({ typingUsers: filtered });
  }
}, 1000);
