'use client'

import { useState, useEffect } from 'react'
import { Download, Apple, Smartphone, Globe, Monitor, Shield, Zap, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const platforms = [
    {
      name: 'iOS',
      icon: <Apple className="w-8 h-8" />,
      description: 'iPhone & iPad',
      version: 'v2.4.1',
      size: '48.2 MB',
      release: 'Dec 15, 2024',
      rating: 4.9,
      color: 'from-blue-500/20 to-blue-600/10'
    },
    {
      name: 'Android',
      icon: <Smartphone className="w-8 h-8" />,
      description: 'All Android devices',
      version: 'v2.4.0',
      size: '52.8 MB',
      release: 'Dec 12, 2024',
      rating: 4.8,
      color: 'from-green-500/20 to-green-600/10'
    },
    {
      name: 'Desktop',
      icon: <Monitor className="w-8 h-8" />,
      description: 'Windows, macOS, and Linux',
      version: 'v2.4.1',
      size: '78.5 MB',
      release: 'Dec 15, 2024',
      rating: 5.0,
      color: 'from-purple-500/20 to-purple-600/10'
    },
    {
      name: 'Web',
      icon: <Globe className="w-8 h-8" />,
      description: 'Any modern browser',
      version: 'v2.4.1',
      size: 'No download',
      release: 'Always updated',
      rating: 4.7,
      color: 'from-amber-500/20 to-amber-600/10'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1a]">
      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Animated Background Gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.05) 0%, transparent 60%)`
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-amber-400 transition-colors">
            VOID
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link>
            <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="/bounty" className="text-gray-400 hover:text-white transition-colors">Bounty</Link>
            <Link href="/download" className="text-amber-400 font-semibold">Download</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="text-sm font-medium tracking-widest text-amber-400 uppercase">Multi-Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Download VOID
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Choose your platform and experience military-grade encryption that governments trust.
              Available on all major platforms.
            </p>
          </div>
        </section>

        {/* Platform Cards */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="relative group overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} border border-white/10 flex items-center justify-center`}>
                      <div className="text-white">
                        {platform.icon}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="text-lg font-semibold text-white mb-1">{platform.name}</div>
                      <div className="text-sm text-gray-400">{platform.description}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-white font-semibold">{platform.version}</div>
                      <div className="text-xs text-gray-500">Version</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{platform.size}</div>
                      <div className="text-xs text-gray-500">Size</div>
                    </div>
                    <div>
                      <div className="text-amber-400 font-semibold">★ {platform.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download for {platform.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="relative overflow-hidden rounded-2xl p-12"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(30, 58, 138, 0.15))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.3)'
              }}
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                System Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Minimum
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">Any modern browser (Chrome, Firefox, Safari, Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">iOS 14+ / Android 8+ / Windows 10+ / macOS 11+</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">2GB RAM minimum, 4GB recommended</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Recommended
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">Latest browser version for optimal security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">iOS 15+ / Android 10+ / Windows 11+ / macOS 12+</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">4GB+ RAM for best performance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Need Help?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Our support team is available 24/7 to assist with any installation or setup questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Contact Support
              </button>
              <button className="px-10 py-4 border border-blue-500/30 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2">
                View Documentation
              </button>
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
              <Link href="/" className="text-gray-500 hover:text-white transition-colors">Home</Link>
              <Link href="/features" className="text-gray-500 hover:text-white transition-colors">Features</Link>
              <Link href="/security" className="text-gray-500 hover:text-white transition-colors">Security</Link>
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
