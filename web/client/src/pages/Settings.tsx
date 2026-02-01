import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Database,
  Trash2,
  ChevronRight,
  Lock,
  Eye,
  MessageSquare
} from 'lucide-react'

interface SettingSection {
  title: string
  icon: React.ElementType
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'select' | 'button'
  value?: boolean
  options?: string[]
}

const settings: SettingSection[] = [
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { id: 'push', label: 'Push Notifications', description: 'Receive notifications for new messages', type: 'toggle', value: true },
      { id: 'sound', label: 'Message Sound', description: 'Play sound when message arrives', type: 'toggle', value: true },
      { id: 'preview', label: 'Message Preview', description: 'Show message content in notifications', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      { id: 'read_receipts', label: 'Read Receipts', description: 'Let others know when you\'ve read their messages', type: 'toggle', value: true },
      { id: 'typing_indicator', label: 'Typing Indicator', description: 'Show when you\'re typing', type: 'toggle', value: true },
      { id: 'screenshot_alert', label: 'Screenshot Alert', description: 'Notify when someone screenshots', type: 'toggle', value: true },
      { id: 'auto_delete', label: 'Auto-Delete Messages', description: 'Delete messages after', type: 'select', options: ['24 hours', '7 days', '30 days', 'Never'] },
    ],
  },
  {
    title: 'Appearance',
    icon: Moon,
    items: [
      { id: 'theme', label: 'Theme', type: 'select', options: ['Dark', 'Light', 'System'] },
      { id: 'font_size', label: 'Font Size', type: 'select', options: ['Small', 'Medium', 'Large'] },
      { id: 'animations', label: 'Animations', description: 'Enable UI animations', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Data & Storage',
    icon: Database,
    items: [
      { id: 'cache', label: 'Clear Cache', description: 'Free up space by clearing cached data', type: 'button' },
      { id: 'export', label: 'Export Data', description: 'Download your data', type: 'button' },
      { id: 'storage_usage', label: 'Storage Usage', description: '2.4 MB used', type: 'button' },
    ],
  },
]

export default function Settings() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    push: true,
    sound: true,
    preview: false,
    read_receipts: true,
    typing_indicator: true,
    screenshot_alert: true,
    animations: true,
  })

  const handleToggle = (id: string) => {
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Customize your Black Hole experience</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settings.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-event-horizon/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-event-horizon" />
              </div>
              <h2 className="font-semibold text-lg">{section.title}</h2>
            </div>

            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg
                    ${itemIndex !== section.items.length - 1 ? 'border-b border-black-hole-600/50' : ''}
                    ${item.type === 'button' ? 'hover:bg-black-hole-700/50 cursor-pointer' : ''}
                  `}
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                  </div>

                  {item.type === 'toggle' && (
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`
                        w-12 h-6 rounded-full transition-colors relative
                        ${toggleStates[item.id] ? 'bg-event-horizon' : 'bg-black-hole-600'}
                      `}
                    >
                      <div
                        className={`
                          w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5
                          ${toggleStates[item.id] ? 'translate-x-6' : 'translate-x-0.5'}
                        `}
                      />
                    </button>
                  )}

                  {item.type === 'select' && (
                    <select className="bg-black-hole-700 border border-black-hole-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-event-horizon">
                      {item.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {item.type === 'button' && (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="card"
      >
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-400" />
          Security Information
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-black-hole-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <p className="font-medium">Encryption</p>
                <p className="text-sm text-gray-500">AES-256-GCM + ML-KEM-768</p>
              </div>
            </div>
            <span className="text-green-400 text-sm">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black-hole-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium">Zero-Knowledge</p>
                <p className="text-sm text-gray-500">zk-SNARK identity proofs</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-black-hole-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium">Protocol</p>
                <p className="text-sm text-gray-500">Signal Double Ratchet + MLS</p>
              </div>
            </div>
            <span className="text-purple-400 text-sm">v1.0</span>
          </div>
        </div>
      </motion.div>

      {/* Clear Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="card border-red-500/20"
      >
        <h2 className="font-semibold text-lg mb-4 text-red-400 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Clear Data
        </h2>
        
        <div className="space-y-3">
          <button className="w-full p-3 bg-black-hole-700 hover:bg-black-hole-600 rounded-lg transition-colors text-left">
            <p className="font-medium">Clear All Messages</p>
            <p className="text-sm text-gray-500">Delete all message history</p>
          </button>
          
          <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors text-left">
            <p className="font-medium text-red-400">Delete Account</p>
            <p className="text-sm text-red-400/70">Permanently delete your account and all data</p>
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 pt-4">
        <p>FortiComm Black Hole v0.1.0</p>
        <p className="mt-1">Built with Rust, Go, and React</p>
      </div>
    </div>
  )
}
