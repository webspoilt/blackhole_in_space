import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Shield,
  Check,
  CheckCheck,
  Clock,
  Trash2,
  Lock
} from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { formatDistanceToNow } from 'date-fns'

export default function Chat() {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    contacts, 
    messages, 
    activeChat, 
    setActiveChat, 
    sendMessage,
    clearChat 
  } = useChatStore()

  const activeContact = contacts.find(c => c.id === (contactId || activeChat))
  const chatMessages = activeContact ? messages[activeContact.id] || [] : []

  useEffect(() => {
    if (contactId) {
      setActiveChat(contactId)
    }
  }, [contactId, setActiveChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async () => {
    if (!message.trim() || !activeContact) return
    
    await sendMessage(activeContact.id, message)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!activeContact) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-event-horizon/10 flex items-center justify-center animate-pulse">
            <Shield className="w-10 h-10 text-event-horizon" />
          </div>
          <h2 className="text-xl font-semibold">Select a contact to start messaging</h2>
          <p className="text-gray-500">Your messages are end-to-end encrypted</p>
          <button
            onClick={() => navigate('/contacts')}
            className="btn-primary"
          >
            View Contacts
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-black-hole-800/50 border-b border-black-hole-600">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-event-horizon to-singularity flex items-center justify-center text-white font-bold">
              {activeContact.name[0]}
            </div>
            {activeContact.status === 'online' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black-hole-800" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{activeContact.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {activeContact.status === 'online' ? (
                <>
                  <span className="text-green-500">Online</span>
                </>
              ) : activeContact.status === 'typing' ? (
                <span className="text-event-horizon animate-pulse">typing...</span>
              ) : (
                <>Last seen {formatDistanceToNow(activeContact.lastSeen)} ago</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded text-xs text-green-500">
            <Lock className="w-3 h-3" />
            E2EE
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={() => clearChat(activeContact.id)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {chatMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-black-hole-700 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-600 mt-1">
                Your messages are end-to-end encrypted
              </p>
            </motion.div>
          ) : (
            chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'message-sent' : 'message-received'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.senderId === 'me' && (
                      <span className="text-gray-500">
                        {msg.status === 'sending' && <Clock className="w-3 h-3" />}
                        {msg.status === 'sent' && <Check className="w-3 h-3" />}
                        {(msg.status === 'delivered' || msg.status === 'read') && (
                          <CheckCheck className={`w-3 h-3 ${msg.status === 'read' ? 'text-blue-400' : ''}`} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black-hole-800/50 border-t border-black-hole-600">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an encrypted message..."
              className="input-field pr-4"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-event-horizon text-white rounded-lg hover:bg-event-horizon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Messages are encrypted with AES-256-GCM + ML-KEM-768
        </p>
      </div>
    </div>
  )
}
