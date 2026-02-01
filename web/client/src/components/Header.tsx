import { useState } from 'react'
import { Search, Bell, Menu, Lock } from 'lucide-react'
import { useCryptoStore } from '../stores/cryptoStore'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const { fingerprint, isInitialized } = useCryptoStore()

  return (
    <header className="h-16 bg-black-hole-800/80 backdrop-blur-md border-b border-black-hole-600 flex items-center justify-between px-4 md:px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className={`
          flex items-center gap-2 bg-black-hole-700 rounded-lg px-3 py-2
          transition-all duration-300 ${showSearch ? 'ring-2 ring-event-horizon' : ''}
        `}>
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search messages, contacts..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
            onFocus={() => setShowSearch(true)}
            onBlur={() => setShowSearch(false)}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Security badge */}
        {isInitialized && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <Lock className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">
              {fingerprint?.slice(0, 8)}...
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-event-horizon rounded-full" />
        </button>

        {/* Mobile menu */}
        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
