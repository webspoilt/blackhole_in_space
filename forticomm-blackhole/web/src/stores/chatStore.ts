import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  timestamp: number
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'file' | 'image'
}

export interface Contact {
  id: string
  name: string
  fingerprint: string
  lastSeen: number
  status: 'online' | 'offline' | 'typing'
  avatar?: string
}

interface ChatState {
  // State
  contacts: Contact[]
  messages: Record<string, Message[]>
  activeChat: string | null
  isConnected: boolean
  
  // Actions
  setActiveChat: (contactId: string | null) => void
  addContact: (contact: Contact) => void
  removeContact: (contactId: string) => void
  sendMessage: (recipientId: string, content: string) => Promise<void>
  receiveMessage: (message: Message) => void
  updateMessageStatus: (messageId: string, status: Message['status']) => void
  setContactStatus: (contactId: string, status: Contact['status']) => void
  clearChat: (contactId: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      contacts: [
        {
          id: 'demo-1',
          name: 'Alice (Demo)',
          fingerprint: 'a1b2c3d4e5f6789012345678',
          lastSeen: Date.now(),
          status: 'online',
        },
        {
          id: 'demo-2',
          name: 'Bob (Demo)',
          fingerprint: 'f1e2d3c4b5a6789012345678',
          lastSeen: Date.now() - 3600000,
          status: 'offline',
        },
      ],
      messages: {},
      activeChat: null,
      isConnected: false,

      // Set active chat
      setActiveChat: (contactId) => {
        set({ activeChat: contactId })
      },

      // Add contact
      addContact: (contact) => {
        set((state) => ({
          contacts: [...state.contacts.filter(c => c.id !== contact.id), contact],
        }))
      },

      // Remove contact
      removeContact: (contactId) => {
        set((state) => ({
          contacts: state.contacts.filter(c => c.id !== contactId),
        }))
      },

      // Send message
      sendMessage: async (recipientId, content) => {
        const message: Message = {
          id: crypto.randomUUID(),
          senderId: 'me',
          recipientId,
          content,
          timestamp: Date.now(),
          status: 'sending',
          type: 'text',
        }

        // Add to messages
        set((state) => ({
          messages: {
            ...state.messages,
            [recipientId]: [...(state.messages[recipientId] || []), message],
          },
        }))

        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 500))

        // Update status to sent
        set((state) => ({
          messages: {
            ...state.messages,
            [recipientId]: state.messages[recipientId]?.map(m =>
              m.id === message.id ? { ...m, status: 'sent' } : m
            ) || [],
          },
        }))

        // Simulate delivery
        setTimeout(() => {
          set((state) => ({
            messages: {
              ...state.messages,
              [recipientId]: state.messages[recipientId]?.map(m =>
                m.id === message.id ? { ...m, status: 'delivered' } : m
              ) || [],
            },
          }))
        }, 1000)
      },

      // Receive message
      receiveMessage: (message) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [message.senderId]: [...(state.messages[message.senderId] || []), message],
          },
        }))
      },

      // Update message status
      updateMessageStatus: (messageId, status) => {
        set((state) => ({
          messages: Object.fromEntries(
            Object.entries(state.messages).map(([contactId, messages]) => [
              contactId,
              messages.map(m => m.id === messageId ? { ...m, status } : m),
            ])
          ),
        }))
      },

      // Set contact status
      setContactStatus: (contactId, status) => {
        set((state) => ({
          contacts: state.contacts.map(c =>
            c.id === contactId ? { ...c, status, lastSeen: Date.now() } : c
          ),
        }))
      },

      // Clear chat
      clearChat: (contactId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [contactId]: [],
          },
        }))
      },
    }),
    {
      name: 'blackhole-chat',
      partialize: (state) => ({
        contacts: state.contacts,
        messages: state.messages,
      }),
    }
  )
)
