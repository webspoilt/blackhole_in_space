'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Lock, Globe, Zap, Server, Code, Users, MessageSquare, Bell, Star, ArrowRight, Search, Filter, Download } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'security', label: 'Security' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'enterprise', label: 'Enterprise' }
  ]

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Zero-Knowledge Encryption',
      description: 'Your messages are encrypted end-to-end. We never have access to your private keys or message content. Only you and your recipients can read them.',
      category: 'security',
      color: 'from-red-500/20 to-red-600/10'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Perfect Forward Secrecy',
      description: 'Even if we lose your private keys, past messages remain secure. Each message is encrypted with a unique key that is immediately destroyed.',
      category: 'security',
      color: 'from-blue-500/20 to-blue-600/10'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Real-Time Messaging',
      description: 'Send and receive messages instantly with sub-100ms latency. Optimized WebSocket connections ensure real-time delivery even across continents.',
      category: 'messaging',
      color: 'from-green-500/20 to-green-600/10'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Secure Groups',
      description: 'Create encrypted group chats with unlimited members. Our MLS (Messaging Layer Security) protocol ensures perfect forward secrecy for groups.',
      category: 'messaging',
      color: 'from-purple-500/20 to-purple-600/10'
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Zero Server Storage',
      description: 'Messages are relayed, never stored. Our servers only hold encrypted blobs for 24 hours, then automatically delete them.',
      category: 'security',
      color: 'from-orange-500/20 to-orange-600/10'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant File Sharing',
      description: 'Share files up to 2GB securely. Files are encrypted client-side before upload and can only be decrypted by recipients.',
      category: 'messaging',
      color: 'from-yellow-500/20 to-yellow-600/10'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Open Source Core',
      description: 'Our cryptographic core is fully open source. Independent researchers can verify our security claims and contribute improvements.',
      category: 'enterprise',
      color: 'from-cyan-500/20 to-cyan-600/10'
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Push Notifications',
      description: 'Receive secure push notifications without compromising privacy. Notification content is encrypted and only decrypted on your device.',
      category: 'messaging',
      color: 'from-pink-500/20 to-pink-600/10'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Self-Hosted Option',
      description: 'Deploy VOID on your own infrastructure. Full control over your data with compliance and data residency guarantees.',
      category: 'enterprise',
      color: 'from-indigo-500/20 to-indigo-600/10'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Encrypted Search',
      description: 'Search through your message history without compromising privacy. Our secure search algorithm indexes encrypted content locally.',
      category: 'messaging',
      color: 'from-teal-500/20 to-teal-600/10'
    },
    {
      icon: <Filter className="w-8 h-8" />,
      title: 'Message Filtering',
      description: 'Organize conversations with smart filters. Create custom labels, pin important messages, and automatically categorize chats.',
      category: 'enterprise',
      color: 'from-emerald-500/20 to-emerald-600/10'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Admin Controls',
      description: 'Comprehensive admin dashboard for organizations. Manage users, set policies, audit logs, and control access centrally.',
      category: 'enterprise',
      color: 'from-violet-500/20 to-violet-600/10'
    }
  ]

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1a]">
      {/* Animated Background Gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 191, 36, 0.04) 0%, transparent 60%)`
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-amber-400 transition-colors">
            VOID
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/features" className="text-amber-400 font-semibold">Features</Link>
            <Link href="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link>
            <Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium tracking-widest text-amber-400 uppercase">Comprehensive</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Powerful Features
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Everything you need for secure communication. Designed for governments and enterprises who demand the highest security standards.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)'
                    e.currentTarget.style.boxShadow = '0 20px 60px 0 rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Feature Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${feature.category === 'security' ? 'bg-red-500/20 text-red-400' :
                        feature.category === 'messaging' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                      }`}>
                      {feature.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl p-12 text-center" style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(217, 119, 6, 0.12))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderTop: '1px solid rgba(251, 191, 36, 0.3)',
              boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.3)'
            }}>
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Start using VOID today and experience the most secure messaging platform built for government and enterprise use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Now
                </Link>
                <Link href="/security" className="px-8 py-4 border border-blue-500/30 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2">
                  Learn About Security
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-sm bg-[#0a0f1a]/80">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 VOID. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">Home</Link>
              <Link href="/features" className="text-gray-500 hover:text-white transition-colors text-sm">Features</Link>
              <Link href="/security" className="text-gray-500 hover:text-white transition-colors text-sm">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  )
}
