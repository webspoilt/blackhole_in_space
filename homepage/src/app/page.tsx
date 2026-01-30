'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Lock, Globe, Zap, Server, Code, Check, Download, ArrowRight, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Particle Component for Black Hole Effect
function BlackHoleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{ x: number, y: number, vx: number, vy: number, size: number, opacity: number }> = []
    const particleCount = 150
    let animationFrame: number

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 100 + Math.random() * 300
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 26, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        // Calculate distance to center
        const dx = centerX - particle.x
        const dy = centerY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Calculate velocity towards center (stronger as closer)
        const force = Math.max(50, 300 - distance) * 0.001
        const angle = Math.atan2(dy, dx)

        particle.vx += Math.cos(angle) * force
        particle.vy += Math.sin(angle) * force

        // Apply velocity
        particle.x += particle.vx
        particle.y += particle.vy

        // Fade out as it gets closer
        if (distance < 20) {
          particle.opacity -= 0.02
          particle.size *= 0.99
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(10, 15, 26, 0.3) 0%, transparent 70%)' }}
    />
  )
}

// Custom hook for 3D tilt effect
function use3DTilt() {
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Very subtle tilt - max 3 degrees
    const rotateX = (mouseY / rect.height) * -3
    const rotateY = (mouseX / rect.width) * 3

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  }

  return { transform, handleMouseMove, handleMouseLeave }
}

// Custom hook for scroll reveal
function useScrollReveal(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

// Stat Card Component with 3D tilt and scroll reveal
function StatCard({ value, label }: { value: string; label: string }) {
  const { ref, isVisible } = useScrollReveal()
  const { transform, handleMouseMove, handleMouseLeave } = use3DTilt()

  return (
    <div
      ref={ref}
      className="relative group"
      style={{
        transform: `${transform} ${isVisible ? 'translateY(0)' : 'translateY(40px)'}`,
        opacity: isVisible ? 1 : 0,
        background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        padding: '3rem',
        borderRadius: '16px',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s cubic-bezier(0.4, 0, 0.2, 1), border-color 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-700">
        {value}
      </div>
      <div className="text-lg text-gray-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

// Feature Card Component with 3D tilt, scroll reveal, icon rotation & content reveal
function FeatureCard({ icon, title, description, hoverRevealContent, threshold }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  hoverRevealContent: string[];
  threshold?: number;
}) {
  const { ref, isVisible } = useScrollReveal(threshold)
  const { transform, handleMouseMove, handleMouseLeave } = use3DTilt()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="feature-card relative group"
      style={{
        transform: `${transform} ${isVisible ? 'translateY(0)' : 'translateY(40px)'}`,
        opacity: isVisible ? 1 : 0,
        background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        padding: '2rem',
        borderRadius: '16px',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1s cubic-bezier(0.4, 0, 0.2, 1), border-color 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        handleMouseLeave(e)
        setIsHovered(false)
      }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:border-blue-500/40 transition-colors duration-700">
        <div className="icon-3d-container text-blue-400">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-700">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed mb-4">
        {description}
      </p>

      {/* Hover Reveal Content */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isHovered ? '300px' : '0px',
          opacity: isHovered ? 1 : 0,
          transition: 'max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
        }}
      >
        <div className="pt-3 border-t border-white/10">
          <ul className="space-y-2">
            {hoverRevealContent.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Platform Card Component with 3D tilt and scroll reveal
function PlatformCard({ name, description, icon, threshold }: {
  name: string;
  description: string;
  icon: string;
  threshold?: number;
}) {
  const { ref, isVisible } = useScrollReveal(threshold)
  const { transform, handleMouseMove, handleMouseLeave } = use3DTilt()

  return (
    <button
      ref={ref}
      className="platform-card relative group"
      style={{
        transform: `${transform} ${isVisible ? 'translateY(0)' : 'translateY(40px)'}`,
        opacity: isVisible ? 1 : 0,
        background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        padding: '2rem',
        borderRadius: '16px',
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), background 1s cubic-bezier(0.4, 0, 0.2, 1), border-color 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)'
        e.currentTarget.style.background = 'linear-gradient(145deg, rgba(20, 30, 48, 0.8), rgba(36, 59, 85, 0.6))'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.background = 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))'
      }}
    >
      <span className="text-4xl platform-icon-3d">{icon}</span>
      <div className="flex-1">
        <div className="text-lg font-semibold text-white mb-1">{name}</div>
        <div className="text-sm text-gray-400">{description}</div>
      </div>
      <ArrowRight className="w-5 h-5 text-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </button>
  )
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Military-Grade Encryption',
      description: 'Signal Protocol + MLS for unbreakable end-to-end encryption. Your messages are mathematically protected.',
      hoverRevealContent: [
        'Double Ratchet Algorithm for perfect forward secrecy',
        'AES-256 & Curve25519 for cryptographic primitives',
        'Post-quantum ready with ML-KEM-768'
      ]
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: 'Zero Server Storage',
      description: 'Messages never stored on servers - only relayed. Ephemeral by design, secure by architecture.',
      hoverRevealContent: [
        '24-hour message TTL automatic deletion',
        'Sealed Sender routing protects metadata',
        'No message content ever touches disk'
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Self-Hosted Deployment',
      description: 'Deploy on your own infrastructure with full control. Complete sovereignty over your communications.',
      hoverRevealContent: [
        'Single-binary deployment with Docker support',
        'Custom domain and branding options',
        'Full data residency compliance'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Zero-Knowledge Proofs',
      description: 'Prove identity without revealing secrets. Advanced cryptographic protocols for maximum privacy.',
      hoverRevealContent: [
        'zk-SNARKs for anonymous authentication',
        'No password or secret stored on servers',
        'Privacy-preserving user verification'
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Delivery',
      description: 'Sub-2 second message delivery, even in large groups. Performance without compromise.',
      hoverRevealContent: [
        'Optimized WebSocket connections',
        'Push notifications for offline users',
        'Message queuing for unreliable networks'
      ]
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Open Source',
      description: 'Core protocol is MIT licensed and fully auditable. Transparency you can verify.',
      hoverRevealContent: [
        'Public GitHub repository',
        'Third-party security audits available',
        'Community-driven development'
      ]
    }
  ]

  const platforms = [
    { name: 'iOS', description: 'Native app for iPhone & iPad', icon: '📱' },
    { name: 'Android', description: 'Optimized for all Android devices', icon: '🤖' },
    { name: 'Desktop', description: 'Windows, macOS, and Linux', icon: '💻' },
    { name: 'Web', description: 'Browser-based secure messaging', icon: '🌐' }
  ]

  return (
    <div className="min-h-screen flex flex-col font-inter relative overflow-hidden bg-[#0a0f1a]">
      {/* Black Hole Particle Animation */}
      <BlackHoleParticles />

      {/* Event Horizon Glowing Ring */}
      <div className="event-horizon-ring pointer-events-none" />

      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Animated Background Gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-[3000ms]"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)`
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            VOID
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link>
            <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="/bounty" className="text-gray-400 hover:text-white transition-colors">Bounty</Link>
            <Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8 animate-[fadeInDown_1500ms_ease-out]">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="text-sm font-medium tracking-widest text-amber-400 uppercase">Military-Grade Security</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-[fadeInUp_1500ms_ease-out_200ms_both]">
              VOID
            </h1>

            {/* Subtitle */}
            <div className="text-xl md:text-2xl text-gray-400 mb-4 animate-[fadeInUp_1500ms_ease-out_400ms_both]">
              <span className="text-amber-400 font-semibold">Unbreakable Encryption</span>. Zero Traces.
            </div>

            <p className="text-3xl md:text-4xl font-light text-white mb-12 animate-[fadeInUp_1500ms_ease-out_600ms_both]">
              What enters the event horizon, never leaves
            </p>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 animate-[fadeInUp_1500ms_ease-out_800ms_both] leading-relaxed">
              Mathematically impossible to retrieve without proper keys. Not even light. Not even hackers.
              <span className="text-white"> Governments trust</span> and
              <span className="text-white"> teams actually want to use</span>.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1500ms_ease-out_1000ms_both]">
              <Link href="/download" className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Now
              </Link>
              <Link href="/demo" className="px-10 py-4 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                Try Encryption Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-gray-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section with 3D Tilt & Scroll Reveal */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard value="99.99%" label="Uptime" />
              <StatCard value="<2s" label="Delivery" />
              <StatCard value="10k+" label="Groups" />
            </div>
          </div>
        </section>

        {/* Simple Benefits Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center scroll-reveal-section" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Simple. Secure. Private.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Focus on your conversations, not encryption. We handle the security so you don't have to.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: 'Your Messages Stay Private',
                  description: 'End-to-end encryption means only you and your recipients can read your messages. Not even we can see them.'
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: 'Lightning Fast',
                  description: 'Send and receive messages instantly. No waiting, no delays. Just fast, secure communication.'
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: 'Works Everywhere',
                  description: 'Available on iOS, Android, Desktop, and Web. Use it on any device, anywhere in the world.'
                }
              ].map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="text-center p-8 rounded-2xl transition-all duration-700"
                  style={{
                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                    <div className="text-blue-400">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-sm bg-[#0a0f1a]/80 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">VOID</h3>
              <p className="text-gray-400 max-w-md">
                The messaging platform that swallows all traces. What enters the event horizon, never leaves.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="/demo" className="text-gray-400 hover:text-blue-400 transition-colors">Demo</Link></li>
                <li><Link href="/bounty" className="text-gray-400 hover:text-blue-400 transition-colors">Bounty</Link></li>
                <li><Link href="/download" className="text-gray-400 hover:text-blue-400 transition-colors">Download</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 VOID. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Animations & Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 40px 60px rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 60px 120px rgba(59, 130, 246, 0.3);
          }
        }

        .event-horizon-ring {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          border-radius: 50%;
          border: 2px solid rgba(59, 130, 246, 0.2);
          animation: pulse-glow 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        .icon-3d-container:hover {
          animation: iconRotate3D 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes iconRotate3D {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        .platform-icon-3d:hover {
          animation: iconFloat 2s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .scroll-reveal-section.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}
