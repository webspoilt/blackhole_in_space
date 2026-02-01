import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Shield, Lock, MessageSquare, Users, AlertTriangle, 
  CheckCircle, ChevronDown, Menu, X, Zap, Key, 
  Fingerprint, Clock, ExternalLink, Mail, Phone, ChevronRight
} from 'lucide-react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Section refs for GSAP
  const heroRef = useRef<HTMLDivElement>(null)
  const zeroKnowledgeRef = useRef<HTMLDivElement>(null)
  const encryptedMessagingRef = useRef<HTMLDivElement>(null)
  const identityRef = useRef<HTMLDivElement>(null)
  const threatRef = useRef<HTMLDivElement>(null)
  const complianceRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const deploymentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation (auto-play on load)
      const heroTl = gsap.timeline()
      heroTl
        .fromTo('.hero-card', 
          { opacity: 0, scale: 0.98, y: 24 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        )
        .fromTo('.hero-dot', 
          { opacity: 0, scale: 0.6 }, 
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.7)' }, 
          '-=0.4'
        )
        .fromTo('.hero-headline span', 
          { opacity: 0, y: 18 }, 
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, 
          '-=0.2'
        )
        .fromTo('.hero-subheadline', 
          { opacity: 0, y: 14 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-cta', 
          { opacity: 0, y: 14 }, 
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-image', 
          { opacity: 0, x: 60, scale: 0.985 }, 
          { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power2.out' }, 
          '-=0.6'
        )
        .fromTo('.scan-line', 
          { x: '-110%' }, 
          { x: '120%', duration: 1, ease: 'power2.inOut' }, 
          '-=0.5'
        )

      // Hero scroll-driven exit animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set('.hero-card', { 
              y: -18 * exitProgress + 'vh', 
              opacity: 1 - exitProgress * 0.75 
            })
            gsap.set('.hero-image', { 
              x: -10 * exitProgress + 'vw', 
              opacity: 1 - exitProgress * 0.65 
            })
          }
        }
      })

      // Section 2: Zero-Knowledge Architecture
      ScrollTrigger.create({
        trigger: zeroKnowledgeRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          const lock = document.querySelector('.zk-lock')
          const headline = document.querySelector('.zk-headline')
          const paragraph = document.querySelector('.zk-paragraph')
          const chips = document.querySelectorAll('.zk-chip')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(lock, { 
              scale: 0.65 + 0.35 * entranceProgress, 
              opacity: entranceProgress,
              rotate: -8 + 8 * entranceProgress
            })
            gsap.set(headline, { y: -10 + 10 * entranceProgress + 'vh', opacity: entranceProgress })
            gsap.set(paragraph, { y: 8 - 8 * entranceProgress + 'vh', opacity: entranceProgress })
            chips.forEach((chip, i) => {
              gsap.set(chip, { 
                y: 6 - 6 * entranceProgress + 'vh', 
                opacity: entranceProgress,
                delay: i * 0.02
              })
            })
          } else if (progress <= 0.7) {
            gsap.set(lock, { scale: 1, opacity: 1, rotate: 0 })
            gsap.set(headline, { y: 0, opacity: 1 })
            gsap.set(paragraph, { y: 0, opacity: 1 })
            chips.forEach(chip => gsap.set(chip, { y: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(lock, { scale: 1 - 0.15 * exitProgress, opacity: 1 - exitProgress * 0.75, y: -10 * exitProgress + 'vh' })
            gsap.set(headline, { y: -6 * exitProgress + 'vh', opacity: 1 - exitProgress * 0.8 })
            gsap.set(paragraph, { y: 6 * exitProgress + 'vh', opacity: 1 - exitProgress * 0.8 })
            gsap.set(chips, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Section 3: Encrypted Messaging
      ScrollTrigger.create({
        trigger: encryptedMessagingRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress
          const textBlock = document.querySelector('.em-text')
          const card = document.querySelector('.em-card')
          const bubbles = document.querySelectorAll('.em-bubble')
          const composer = document.querySelector('.em-composer')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(textBlock, { x: -18 + 18 * entranceProgress + 'vw', opacity: entranceProgress })
            gsap.set(card, { x: 18 - 18 * entranceProgress + 'vw', opacity: entranceProgress, scale: 0.98 + 0.02 * entranceProgress })
            bubbles.forEach((bubble, i) => {
              gsap.set(bubble, { y: 6 - 6 * entranceProgress + 'vh', opacity: entranceProgress, delay: i * 0.015 })
            })
            gsap.set(composer, { y: 4 - 4 * entranceProgress + 'vh', opacity: entranceProgress })
          } else if (progress <= 0.7) {
            gsap.set(textBlock, { x: 0, opacity: 1 })
            gsap.set(card, { x: 0, opacity: 1, scale: 1 })
            bubbles.forEach(bubble => gsap.set(bubble, { y: 0, opacity: 1 }))
            gsap.set(composer, { y: 0, opacity: 1 })
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(textBlock, { x: -10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(card, { x: 10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(bubbles, { opacity: 1 - exitProgress * 0.7 })
            gsap.set(composer, { y: 3 * exitProgress + 'vh', opacity: 1 - exitProgress * 0.8 })
          }
        }
      })

      // Section 4: Identity & Access
      ScrollTrigger.create({
        trigger: identityRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          const card = document.querySelector('.id-card')
          const text = document.querySelector('.id-text')
          const rows = document.querySelectorAll('.id-row')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(card, { x: -22 + 22 * entranceProgress + 'vw', opacity: entranceProgress, rotateY: -10 + 10 * entranceProgress })
            gsap.set(text, { x: 18 - 18 * entranceProgress + 'vw', opacity: entranceProgress })
            rows.forEach((row, i) => {
              gsap.set(row, { y: 3 - 3 * entranceProgress + 'vh', opacity: entranceProgress, delay: i * 0.02 })
            })
          } else if (progress <= 0.7) {
            gsap.set(card, { x: 0, opacity: 1, rotateY: 0 })
            gsap.set(text, { x: 0, opacity: 1 })
            rows.forEach(row => gsap.set(row, { y: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(card, { x: -12 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(text, { x: 10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.8 })
            gsap.set(rows, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Section 5: Threat Detection
      ScrollTrigger.create({
        trigger: threatRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress
          const textBlock = document.querySelector('.threat-text')
          const card = document.querySelector('.threat-card')
          const rows = document.querySelectorAll('.threat-row')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(textBlock, { x: -18 + 18 * entranceProgress + 'vw', opacity: entranceProgress })
            gsap.set(card, { x: 18 - 18 * entranceProgress + 'vw', opacity: entranceProgress })
            rows.forEach((row, i) => {
              gsap.set(row, { x: 6 - 6 * entranceProgress + 'vw', opacity: entranceProgress, delay: i * 0.015 })
            })
          } else if (progress <= 0.7) {
            gsap.set(textBlock, { x: 0, opacity: 1 })
            gsap.set(card, { x: 0, opacity: 1 })
            rows.forEach(row => gsap.set(row, { x: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(textBlock, { x: -10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(card, { x: 10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(rows, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Section 6: Compliance
      ScrollTrigger.create({
        trigger: complianceRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          const headline = document.querySelector('.comp-headline')
          const dots = document.querySelectorAll('.comp-dot')
          const badges = document.querySelectorAll('.comp-badge')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(headline, { y: -8 + 8 * entranceProgress + 'vh', opacity: entranceProgress })
            dots.forEach((dot, i) => {
              gsap.set(dot, { scale: entranceProgress, opacity: entranceProgress, delay: i * 0.01 })
            })
            badges.forEach((badge, i) => {
              gsap.set(badge, { y: 6 - 6 * entranceProgress + 'vh', opacity: entranceProgress, delay: i * 0.015 })
            })
          } else if (progress <= 0.7) {
            gsap.set(headline, { y: 0, opacity: 1 })
            dots.forEach(dot => gsap.set(dot, { scale: 1, opacity: 1 }))
            badges.forEach(badge => gsap.set(badge, { y: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(headline, { y: -6 * exitProgress + 'vh', opacity: 1 - exitProgress * 0.8 })
            gsap.set(dots, { opacity: 1 - exitProgress * 0.7 })
            gsap.set(badges, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Section 7: Security Dashboard
      ScrollTrigger.create({
        trigger: dashboardRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress
          const textBlock = document.querySelector('.dash-text')
          const card = document.querySelector('.dash-card')
          const score = document.querySelector('.dash-score')
          const ring = document.querySelector('.dash-ring')
          const tiles = document.querySelectorAll('.dash-tile')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(textBlock, { x: -18 + 18 * entranceProgress + 'vw', opacity: entranceProgress })
            gsap.set(card, { x: 18 - 18 * entranceProgress + 'vw', opacity: entranceProgress, scale: 0.98 + 0.02 * entranceProgress })
            gsap.set(score, { scale: 0.85 + 0.15 * entranceProgress, opacity: entranceProgress })
            gsap.set(ring, { strokeDashoffset: 283 - 283 * entranceProgress })
            tiles.forEach((tile, i) => {
              gsap.set(tile, { y: 3 - 3 * entranceProgress + 'vh', opacity: entranceProgress, delay: i * 0.02 })
            })
          } else if (progress <= 0.7) {
            gsap.set(textBlock, { x: 0, opacity: 1 })
            gsap.set(card, { x: 0, opacity: 1, scale: 1 })
            gsap.set(score, { scale: 1, opacity: 1 })
            gsap.set(ring, { strokeDashoffset: 0 })
            tiles.forEach(tile => gsap.set(tile, { y: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(textBlock, { x: -10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(card, { x: 10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(score, { opacity: 1 - exitProgress * 0.7 })
            gsap.set(tiles, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Section 8: Deployment Options
      ScrollTrigger.create({
        trigger: deploymentRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          const card = document.querySelector('.dep-card')
          const text = document.querySelector('.dep-text')
          const rows = document.querySelectorAll('.dep-row')
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set(card, { x: -22 + 22 * entranceProgress + 'vw', opacity: entranceProgress })
            gsap.set(text, { x: 18 - 18 * entranceProgress + 'vw', opacity: entranceProgress })
            rows.forEach((row, i) => {
              gsap.set(row, { y: 3 - 3 * entranceProgress + 'vh', opacity: entranceProgress, delay: i * 0.02 })
            })
          } else if (progress <= 0.7) {
            gsap.set(card, { x: 0, opacity: 1 })
            gsap.set(text, { x: 0, opacity: 1 })
            rows.forEach(row => gsap.set(row, { y: 0, opacity: 1 }))
          } else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set(card, { x: -12 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.75 })
            gsap.set(text, { x: 10 * exitProgress + 'vw', opacity: 1 - exitProgress * 0.8 })
            gsap.set(rows, { opacity: 1 - exitProgress * 0.7 })
          }
        }
      })

      // Flowing sections animation
      gsap.utils.toArray<HTMLElement>('.flowing-section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.flow-item'),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  const faqData = [
    { q: 'Can FortiComm access our messages?', a: 'No. FortiComm uses end-to-end encryption with keys generated and stored only on your devices. We only route encrypted packets—no plaintext ever touches our infrastructure.' },
    { q: 'What happens if a device is lost?', a: 'You can instantly revoke device access from any authenticated device. All messages remain secure, and the lost device cannot decrypt new messages. You can also remotely wipe app data.' },
    { q: 'How does key rotation work?', a: 'Keys rotate automatically every 100 messages or weekly, whichever comes first. The Double Ratchet algorithm ensures forward secrecy—compromised keys cannot decrypt past or future messages.' },
    { q: 'Is metadata encrypted?', a: 'Yes. We use sealed sender technology to hide sender identity, and timing obfuscation to prevent traffic analysis. Even we cannot see who is messaging whom.' },
    { q: 'Do you support compliance exports?', a: 'Yes. Organization admins can export encrypted message archives for compliance purposes. These exports remain encrypted and can only be decrypted by authorized organization keys.' },
    { q: 'What browsers are supported?', a: 'FortiComm supports all modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend keeping your browser updated for the latest security patches.' },
  ]

  const pricingPlans = [
    { name: 'Starter', price: '$6', period: '/user/month', features: ['End-to-end encryption', 'Up to 50 users', '10GB file storage', '30-day message retention', 'Email support'], cta: 'Start free trial', highlighted: false },
    { name: 'Business', price: '$12', period: '/user/month', features: ['Everything in Starter', 'Unlimited users', '100GB file storage', '90-day message retention', 'SSO integration', 'Priority support', 'Admin dashboard'], cta: 'Start free trial', highlighted: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Business', 'Unlimited storage', 'Custom retention', 'Self-hosted option', 'Dedicated support', 'SLA guarantee', 'Custom integrations'], cta: 'Contact sales', highlighted: false },
  ]

  return (
    <div className="relative bg-forti-bg min-h-screen overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-forti-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-forti-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-forti-bg" />
            </div>
            <span className="font-display font-bold text-lg text-forti-text">FortiComm</span>
            <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-forti-accent/10 border border-forti-accent/20">
              <div className="w-2 h-2 rounded-full bg-forti-accent security-pulse" />
              <span className="text-xs font-mono text-forti-accent">Systems operational</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-sm text-forti-text-secondary hover:text-forti-text transition-colors">Product</a>
            <a href="#security" className="text-sm text-forti-text-secondary hover:text-forti-text transition-colors">Security</a>
            <a href="#pricing" className="text-sm text-forti-text-secondary hover:text-forti-text transition-colors">Pricing</a>
            <a href="#docs" className="text-sm text-forti-text-secondary hover:text-forti-text transition-colors">Docs</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden md:block fortiomm-button-primary text-sm">
              Request demo
            </button>
            <button 
              className="md:hidden text-forti-text"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-forti-bg-secondary border-t border-white/5 px-6 py-4">
            <div className="flex flex-col gap-4">
              <a href="#product" className="text-forti-text-secondary hover:text-forti-text">Product</a>
              <a href="#security" className="text-forti-text-secondary hover:text-forti-text">Security</a>
              <a href="#pricing" className="text-forti-text-secondary hover:text-forti-text">Pricing</a>
              <a href="#docs" className="text-forti-text-secondary hover:text-forti-text">Docs</a>
              <button className="fortiomm-button-primary text-sm w-full">Request demo</button>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center pt-20 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(30,64,175,0.10),transparent_70%)]" />
        
        <div className="hero-card relative w-[92vw] lg:w-[84vw] h-[80vh] lg:h-[64vh] fortiomm-card overflow-hidden">
          {/* Scan line */}
          <div className="scan-line absolute top-1/3 left-0 w-full z-20" />
          
          {/* Card header dots */}
          <div className="absolute left-6 top-6 flex gap-2">
            <div className="hero-dot w-3 h-3 rounded-full bg-forti-accent" />
            <div className="hero-dot w-3 h-3 rounded-full bg-forti-text-secondary/50" />
            <div className="hero-dot w-3 h-3 rounded-full bg-forti-text-secondary/50" />
          </div>
          
          {/* Content */}
          <div className="absolute left-6 lg:left-[6vw] top-20 lg:top-[14vh] max-w-xl">
            <h1 className="hero-headline font-display font-bold text-4xl md:text-5xl lg:text-6xl text-forti-text leading-tight mb-6">
              {'Secure messaging'.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">{word}</span>
              ))}
            </h1>
            <p className="hero-subheadline text-forti-text-secondary text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              FortiComm is a zero-knowledge team platform: messages, files, and metadata stay private—even from us.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="hero-cta fortiomm-button-primary flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Request demo
              </button>
              <button className="hero-cta fortiomm-button-secondary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View security whitepaper
              </button>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="hero-image absolute right-4 lg:right-[4vw] top-24 lg:top-[12vh] w-[45vw] lg:w-[38vw] h-auto rounded-2xl overflow-hidden shadow-card hidden md:block">
            <img src="/images/hero_chat_ui.jpg" alt="Secure chat interface" className="w-full h-auto object-cover" />
          </div>
          
          {/* Bottom status bar */}
          <div className="absolute left-6 lg:left-[6vw] bottom-8 lg:bottom-[6vh] flex flex-wrap gap-3 lg:gap-6">
            {['End-to-end encryption', 'Zero-knowledge', 'SOC 2 Type II', 'GDPR-ready'].map((label, i) => (
              <div key={i} className="flex items-center gap-2 text-xs lg:text-sm text-forti-text-secondary">
                <CheckCircle className="w-4 h-4 text-forti-accent" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Zero-Knowledge Architecture */}
      <section ref={zeroKnowledgeRef} className="relative h-screen w-full flex items-center justify-center z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(30,64,175,0.08),transparent_70%)]" />
        
        <div className="relative text-center px-6">
          <h2 className="zk-headline font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
            Zero-knowledge architecture
          </h2>
          
          <div className="zk-lock mx-auto mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-forti-accent/10 border-2 border-forti-accent/30 flex items-center justify-center">
              <Lock className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-forti-accent" />
            </div>
          </div>
          
          <p className="zk-paragraph text-forti-text-secondary text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Keys are generated on your devices. We only route encrypted packets—no plaintext ever touches our infrastructure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['AES-256-GCM', 'TLS 1.3', 'SHA-3', 'ML-KEM'].map((chip, i) => (
              <div key={i} className="zk-chip fortiomm-badge font-mono text-xs">
                <Key className="w-3 h-3" />
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Encrypted Messaging */}
      <section ref={encryptedMessagingRef} id="product" className="relative h-screen w-full flex items-center justify-center z-30">
        <div className="absolute inset-0 bg-forti-bg" />
        
        <div className="relative w-full px-6 lg:px-[8vw] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Text block */}
          <div className="em-text max-w-md lg:max-w-lg">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
              Encrypted messaging
            </h2>
            <p className="text-forti-text-secondary text-base lg:text-lg leading-relaxed">
              Channels, threads, and DMs protected by device-held keys. Forward secrecy with every message.
            </p>
          </div>
          
          {/* Chat card */}
          <div className="em-card w-full max-w-md lg:w-[40vw] lg:max-w-none fortiomm-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-medium text-forti-text">Product Design</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-forti-text-secondary/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-forti-text-secondary/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-forti-text-secondary/50" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`em-bubble flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    i % 2 === 0 
                      ? 'bg-forti-bg-secondary text-forti-text rounded-tl-sm' 
                      : 'bg-forti-accent/20 text-forti-text rounded-tr-sm border border-forti-accent/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-3 h-3 text-forti-accent" />
                      <span className="text-xs text-forti-accent font-mono">Encrypted</span>
                    </div>
                    {i === 0 ? 'Hey team, the new designs are ready for review.' : i === 1 ? 'Looking great! The encryption indicators are perfect.' : 'Thanks! Pushing to production now.'}
                  </div>
                </div>
              ))}
            </div>
            <div className="em-composer p-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-forti-bg-secondary border border-white/5">
                <span className="text-forti-text-secondary text-sm flex-1">Type a message...</span>
                <div className="w-8 h-8 rounded-lg bg-forti-accent flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-forti-bg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Identity & Access */}
      <section ref={identityRef} className="relative h-screen w-full flex items-center justify-center z-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,rgba(30,64,175,0.08),transparent_70%)]" />
        
        <div className="relative w-full px-6 lg:px-[8vw] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Identity card */}
          <div className="id-card w-full max-w-md lg:w-[40vw] lg:max-w-none fortiomm-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-forti-accent/20 border-2 border-forti-accent/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-forti-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-forti-text">Alice Chen</h3>
                <p className="text-forti-text-secondary text-sm">alice@company.com</p>
              </div>
              <div className="ml-auto fortiomm-badge">
                <CheckCircle className="w-3 h-3" />
                Verified
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="id-row flex items-center justify-between p-4 rounded-xl bg-forti-bg-secondary border border-white/5">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-forti-accent" />
                  <span className="text-forti-text text-sm">Security key</span>
                </div>
                <span className="text-forti-accent text-xs font-mono">Active</span>
              </div>
              
              <div className="id-row flex items-center justify-between p-4 rounded-xl bg-forti-bg-secondary border border-white/5">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-forti-text-secondary" />
                  <span className="text-forti-text text-sm">SSO provider</span>
                </div>
                <span className="text-forti-text-secondary text-xs font-mono">Okta</span>
              </div>
              
              <div className="id-row flex items-center justify-between p-4 rounded-xl bg-forti-bg-secondary border border-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-forti-text-secondary" />
                  <span className="text-forti-text text-sm">Last active</span>
                </div>
                <span className="text-forti-text-secondary text-xs font-mono">2 min ago</span>
              </div>
            </div>
          </div>
          
          {/* Text block */}
          <div className="id-text max-w-md lg:max-w-lg lg:text-right">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
              Identity & access
            </h2>
            <p className="text-forti-text-secondary text-base lg:text-lg leading-relaxed">
              SSO, SCIM, and device trust—tied to cryptographic identity. Add MFA, revoke sessions, and rotate keys instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Threat Detection */}
      <section ref={threatRef} id="security" className="relative h-screen w-full flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-forti-bg" />
        
        <div className="relative w-full px-6 lg:px-[8vw] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Text block */}
          <div className="threat-text max-w-md lg:max-w-lg">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
              Threat detection
            </h2>
            <p className="text-forti-text-secondary text-base lg:text-lg leading-relaxed">
              Real-time monitoring for phishing, leaked credentials, and anomalous access—without reading your content.
            </p>
          </div>
          
          {/* Threat card */}
          <div className="threat-card w-full max-w-md lg:w-[40vw] lg:max-w-none fortiomm-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-medium text-forti-text">Threat feed</span>
              <div className="px-2 py-1 rounded-lg bg-forti-accent/20 text-forti-accent text-xs font-mono">
                12
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: AlertTriangle, text: 'Phishing link blocked', time: '2 min ago', highlight: true },
                { icon: Key, text: 'New device login', time: '15 min ago', highlight: false },
                { icon: Shield, text: 'Policy violation detected', time: '1 hour ago', highlight: false },
                { icon: Lock, text: 'Suspicious file download blocked', time: '3 hours ago', highlight: false },
              ].map((threat, i) => (
                <div 
                  key={i} 
                  className={`threat-row flex items-center justify-between p-3 rounded-xl ${
                    threat.highlight 
                      ? 'bg-forti-accent/10 border border-forti-accent/30' 
                      : 'bg-forti-bg-secondary border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <threat.icon className={`w-5 h-5 ${threat.highlight ? 'text-forti-accent' : 'text-forti-text-secondary'}`} />
                    <span className="text-forti-text text-sm">{threat.text}</span>
                  </div>
                  <span className="text-forti-text-secondary text-xs font-mono">{threat.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Compliance & Data Residency */}
      <section ref={complianceRef} className="relative h-screen w-full flex items-center justify-center z-[60]">
        <div className="absolute inset-0 bg-forti-bg" />
        
        <div className="relative text-center px-6">
          <h2 className="comp-headline font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-4">
            Compliance & data residency
          </h2>
          <p className="text-forti-text-secondary text-base lg:text-lg max-w-xl mx-auto mb-10">
            Choose regions. Define retention. Export audits in one click.
          </p>
          
          {/* World map */}
          <div className="relative w-[90vw] lg:w-[84vw] h-[30vh] lg:h-[44vh] mb-10 rounded-2xl overflow-hidden">
            <img src="/images/world_map_dots.jpg" alt="Global data centers" className="w-full h-full object-cover" />
            {/* Animated dots overlay */}
            <div className="absolute inset-0">
              {[
                { left: '25%', top: '35%' },
                { left: '48%', top: '30%' },
                { left: '72%', top: '40%' },
                { left: '85%', top: '55%' },
              ].map((pos, i) => (
                <div 
                  key={i}
                  className="comp-dot absolute w-3 h-3 rounded-full bg-forti-accent security-pulse"
                  style={{ left: pos.left, top: pos.top }}
                />
              ))}
            </div>
          </div>
          
          {/* Compliance badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {['GDPR', 'SOC 2 Type II', 'ISO 27001', 'FedRAMP'].map((badge, i) => (
              <div key={i} className="comp-badge fortiomm-badge-secondary font-mono text-xs">
                <Shield className="w-3 h-3" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Security Dashboard */}
      <section ref={dashboardRef} className="relative h-screen w-full flex items-center justify-center z-[70]">
        <div className="absolute inset-0 bg-forti-bg" />
        
        <div className="relative w-full px-6 lg:px-[8vw] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Text block */}
          <div className="dash-text max-w-md lg:max-w-lg">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
              Security dashboard
            </h2>
            <p className="text-forti-text-secondary text-base lg:text-lg leading-relaxed">
              See encryption coverage, device health, and policy compliance—without exposing message content.
            </p>
          </div>
          
          {/* Dashboard card */}
          <div className="dash-card w-full max-w-md lg:w-[40vw] lg:max-w-none fortiomm-card p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(167,177,198,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    className="dash-ring progress-ring-circle"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                  />
                </svg>
                <div className="dash-score absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-4xl text-forti-accent">92</span>
                </div>
              </div>
              <span className="text-forti-text-secondary text-sm">Security score</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="dash-tile p-4 rounded-xl bg-forti-bg-secondary border border-white/5 text-center">
                <div className="font-display font-bold text-2xl text-forti-accent mb-1">2.4M</div>
                <div className="text-forti-text-secondary text-xs">Encrypted messages</div>
              </div>
              <div className="dash-tile p-4 rounded-xl bg-forti-bg-secondary border border-white/5 text-center">
                <div className="font-display font-bold text-2xl text-forti-accent mb-1">47</div>
                <div className="text-forti-text-secondary text-xs">Active sessions</div>
              </div>
            </div>
            
            <div className="dash-tile flex items-end justify-center gap-3 h-20">
              {[40, 65, 85, 55, 70].map((h, i) => (
                <div 
                  key={i}
                  className="w-8 rounded-t-lg bg-forti-accent/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Deployment Options */}
      <section ref={deploymentRef} className="relative h-screen w-full flex items-center justify-center z-[80]">
        <div className="absolute inset-0 bg-forti-bg" />
        
        <div className="relative w-full px-6 lg:px-[8vw] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Deployment card */}
          <div className="dep-card w-full max-w-md lg:w-[40vw] lg:max-w-none fortiomm-card p-6">
            <h3 className="font-display font-semibold text-lg text-forti-text mb-4">Deployment</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Cloud', desc: 'Fully managed, instant setup', selected: true },
                { name: 'Dedicated', desc: 'Isolated infrastructure', selected: false },
                { name: 'Self-hosted', desc: 'Complete control, air-gapped', selected: false },
              ].map((option, i) => (
                <div 
                  key={i}
                  className={`dep-row flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    option.selected 
                      ? 'bg-forti-accent/10 border-forti-accent/50' 
                      : 'bg-forti-bg-secondary border-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="font-medium text-forti-text text-sm">{option.name}</div>
                    <div className="text-forti-text-secondary text-xs">{option.desc}</div>
                  </div>
                  {option.selected && <CheckCircle className="w-5 h-5 text-forti-accent" />}
                </div>
              ))}
            </div>
          </div>
          
          {/* Text block */}
          <div className="dep-text max-w-md lg:max-w-lg lg:text-right">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-6">
              Deployment options
            </h2>
            <p className="text-forti-text-secondary text-base lg:text-lg leading-relaxed">
              Start in minutes on our cloud, or keep everything inside your network with air-gapped options.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Customer Proof */}
      <section className="flowing-section relative py-20 lg:py-32 z-[90] bg-forti-bg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="flow-item font-mono text-xs text-forti-accent uppercase tracking-widest mb-6 block">
            Customers
          </span>
          
          <blockquote className="flow-item font-display text-2xl md:text-3xl lg:text-4xl text-forti-text leading-relaxed mb-8">
            "We switched to FortiComm because we needed confidentiality without usability tradeoffs."
          </blockquote>
          
          <div className="flow-item flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-forti-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-forti-accent" />
            </div>
            <div className="text-left">
              <div className="text-forti-text text-sm font-medium">Sarah Mitchell</div>
              <div className="text-forti-text-secondary text-xs">CISO, Fintech Company</div>
            </div>
          </div>
          
          <div className="flow-item grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: '99.99%', label: 'Uptime' },
              { value: '<2s', label: 'Delivery' },
              { value: '10M+', label: 'Messages/day' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl lg:text-3xl text-forti-accent mb-1">{stat.value}</div>
                <div className="text-forti-text-secondary text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Pricing */}
      <section id="pricing" className="flowing-section relative py-20 lg:py-32 z-[100] bg-forti-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="flow-item font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-4">
              Pricing
            </h2>
            <p className="flow-item text-forti-text-secondary text-base lg:text-lg">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`flow-item fortiomm-card p-6 ${plan.highlighted ? 'border-forti-accent/50 ring-1 ring-forti-accent/30' : ''}`}
              >
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-lg text-forti-text mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold text-3xl text-forti-text">{plan.price}</span>
                    <span className="text-forti-text-secondary text-sm">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-forti-text-secondary">
                      <CheckCircle className="w-4 h-4 text-forti-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-full font-medium text-sm transition-all ${
                  plan.highlighted 
                    ? 'bg-forti-accent text-forti-bg hover:bg-forti-accent/90' 
                    : 'border border-white/20 text-forti-text hover:border-forti-accent hover:text-forti-accent'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: FAQ */}
      <section className="flowing-section relative py-20 lg:py-32 z-[110] bg-forti-bg">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="flow-item font-display font-bold text-3xl md:text-4xl lg:text-5xl text-forti-text mb-12 text-center">
            FAQ
          </h2>
          
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="flow-item fortiomm-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-forti-text pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-forti-text-secondary flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-forti-text-secondary text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Footer */}
      <footer className="relative py-16 z-[120] bg-forti-bg-secondary border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-forti-accent flex items-center justify-center">
                  <Shield className="w-5 h-5 text-forti-bg" />
                </div>
                <span className="font-display font-bold text-lg text-forti-text">FortiComm</span>
              </div>
              <p className="text-forti-text-secondary text-sm max-w-sm mb-6">
                Secure messaging. Zero compromise. The zero-knowledge team platform that keeps your conversations private.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-forti-bg border border-white/10 flex items-center justify-center text-forti-text-secondary hover:text-forti-accent hover:border-forti-accent/30 transition-all">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-forti-bg border border-white/10 flex items-center justify-center text-forti-text-secondary hover:text-forti-accent hover:border-forti-accent/30 transition-all">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-forti-text mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Security', 'Pricing', 'Changelog'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-forti-text-secondary text-sm hover:text-forti-text transition-colors flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-forti-text mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-forti-text-secondary text-sm hover:text-forti-text transition-colors flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-forti-text-secondary text-xs">
              © 2026 FortiComm. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-forti-text-secondary text-xs hover:text-forti-text transition-colors">Privacy</a>
              <a href="#" className="text-forti-text-secondary text-xs hover:text-forti-text transition-colors">Terms</a>
              <a href="#" className="text-forti-text-secondary text-xs hover:text-forti-text transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
