import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  QrCode, 
  Copy, 
  Check,
  UserPlus,
  MoreVertical,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useChatStore, Contact } from '../stores/chatStore'
import { useCryptoStore } from '../stores/cryptoStore'

export default function Contacts() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [newContactFingerprint, setNewContactFingerprint] = useState('')
  const [newContactName, setNewContactName] = useState('')
  
  const { contacts, addContact, removeContact } = useChatStore()
  const { fingerprint } = useCryptoStore()

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fingerprint.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyFingerprint = () => {
    if (fingerprint) {
      navigator.clipboard.writeText(fingerprint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddContact = () => {
    if (newContactFingerprint && newContactName) {
      const newContact: Contact = {
        id: `contact-${Date.now()}`,
        name: newContactName,
        fingerprint: newContactFingerprint,
        lastSeen: Date.now(),
        status: 'offline',
      }
      addContact(newContact)
      setNewContactFingerprint('')
      setNewContactName('')
      setShowAddModal(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-gray-500">Manage your secure connections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* My Identity Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <QrCode className="w-5 h-5 text-event-horizon" />
            Your Identity
          </h2>
          <span className="text-xs text-gray-500">Share to add contacts</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-black-hole-900/50 rounded-lg">
          <div className="w-24 h-24 bg-white rounded-lg p-2">
            {/* QR Code placeholder */}
            <div className="w-full h-full bg-black-hole-900 rounded flex items-center justify-center">
              <QrCode className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">Your Fingerprint</p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <code className="text-lg font-mono text-event-horizon-glow">
                {fingerprint || 'Not initialized'}
              </code>
              {fingerprint && (
                <button
                  onClick={copyFingerprint}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  title="Copy fingerprint"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              This is your public identity. Share it with others to receive messages.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-black-hole-700 flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-500">No contacts found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-event-horizon hover:text-event-horizon-glow mt-2"
            >
              Add your first contact
            </button>
          </div>
        ) : (
          filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="card flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-event-horizon to-singularity flex items-center justify-center text-white font-bold">
                    {contact.name[0]}
                  </div>
                  {contact.status === 'online' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black-hole-800" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <code className="text-xs text-gray-500">{contact.fingerprint.slice(0, 24)}...</code>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/chat/${contact.id}`)}
                  className="p-2 text-gray-400 hover:text-event-horizon transition-colors"
                  title="Message"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Add Contact</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Contact name"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Fingerprint</label>
                <input
                  type="text"
                  value={newContactFingerprint}
                  onChange={(e) => setNewContactFingerprint(e.target.value)}
                  placeholder="Paste their fingerprint..."
                  className="input-field font-mono text-sm"
                />
              </div>

              <div className="p-3 bg-black-hole-900/50 rounded-lg">
                <p className="text-xs text-gray-500">
                  Ask your contact to share their fingerprint from their Identity page.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!newContactName || !newContactFingerprint}
                className="btn-primary flex-1"
              >
                Add Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
