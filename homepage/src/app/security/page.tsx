'use client'

import { useState } from 'react'
import { Shield, ArrowRight, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

const articles = [
  {
    category: 'Encryption',
    title: 'What is End-to-End Encryption?',
    description: 'Simple explanation of how your messages stay private',
    readTime: '5 min',
    tags: ['Beginner', 'Education', 'Core']
  },
  {
    category: 'Post-Quantum',
    title: 'Why Post-Quantum Cryptography Matters',
    description: 'What it is and why you should care now',
    readTime: '7 min',
    tags: ['Advanced', 'Future-proof', 'Quantum']
  },
  {
    category: 'Zero-Knowledge',
    title: 'The Magic of Zero-Knowledge Proofs',
    description: 'Proving identity without secrets, explained simply',
    readTime: '5 min',
    tags: ['Privacy', 'Authentication', 'Math']
  },
  {
    category: 'Key Management',
    title: 'How Signal Protocol Handles Keys',
    description: 'Visual explanation of key exchange process',
    readTime: '5 min',
    tags: ['Technical', 'Implementation', 'Security']
  },
  {
    category: 'Perfect Forward Secrecy',
    title: 'Why You Keep Past Messages Safe',
    description: 'The Double Ratchet Algorithm explained',
    readTime: '6 min',
    tags: ['History', 'Technical', 'Implementation']
  },
  {
    category: 'Metadata Protection',
    title: 'How We Protect Your Privacy',
    description: 'Sealed Sender routing keeps secrets hidden',
    readTime: '5 min',
    tags: ['Privacy', 'Routing', 'Metadata']
  },
  {
    category: 'Audit Trail',
    title: 'Why Third-Party Security Audits',
    description: 'Why external verification matters',
    readTime: '5 min',
    tags: ['Trust', 'Transparency', 'Security']
  }
]

export default function SecurityPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1a]">
      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.04) 0%, transparent 60%)'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
            VOID
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link>
            <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="/bounty" className="text-gray-400 hover:text-white transition-colors">Bounty</Link>
            <Link href="/security" className="text-green-400 font-semibold">Security</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 mb-8">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium tracking-widest text-green-400 uppercase">Security</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Security Deep Dives into Cryptography
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We believe in radical transparency. Understand how your messages are truly protected.
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'Encryption', label: 'Encryption' },
                { id: 'Post-Quantum', label: 'Post-Quantum' },
                { id: 'Zero-Knowledge', label: 'Zero-Knowledge' },
                { id: 'Key Management', label: 'Key Management' },
                { id: 'Perfect Forward Secrecy', label: 'Forward Secrecy' },
                { id: 'Metadata Protection', label: 'Metadata' },
                { id: 'Audit Trail', label: 'Audit Trail' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${activeCategory === cat.id
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span className="text-xs uppercase tracking-widest text-green-400">{article.category}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{article.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4 text-green-400" />
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-sm bg-[#0a0f1a]/80">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-green-400 transition-colors">Features</Link></li>
                <li><Link href="/demo" className="text-gray-400 hover:text-green-400 transition-colors">Interactive Demo</Link></li>
                <li><Link href="/bounty" className="text-gray-400 hover:text-green-400 transition-colors">Bug Bounty</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Security Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Compliance</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Transparency</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Audit Reports</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Security Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Open Source</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 VOID. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">Home</Link>
              <Link href="/features" className="text-gray-500 hover:text-white transition-colors text-sm">Features</Link>
              <Link href="/download" className="text-gray-500 hover:text-white transition-colors text-sm">Download</Link>
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
