import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Users, 
  Fingerprint, 
  Settings, 
  Home,
  Shield
} from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageSquare, label: 'Messages' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/identity', icon: Fingerprint, label: 'Identity' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-20 md:w-64 bg-black-hole-800 border-r border-black-hole-600 flex flex-col">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-black-hole-600">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-event-horizon to-singularity flex items-center justify-center animate-event-horizon">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-event-horizon/20 animate-ping" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg gradient-text">Black Hole</h1>
            <p className="text-xs text-gray-500">Unbreakable Messaging</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-event-horizon/20 text-event-horizon-glow border border-event-horizon/30' 
                : 'text-gray-400 hover:bg-black-hole-700 hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="hidden md:block font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-event-horizon rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-black-hole-600">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="hidden md:inline">Secure Connection</span>
        </div>
      </div>
    </aside>
  )
}
