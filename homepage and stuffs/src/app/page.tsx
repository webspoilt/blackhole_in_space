'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Shield, Lock, Eye, Zap, Globe, CheckCircle, ArrowRight, Sparkles, Crown, Fingerprint, Infinity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImmersiveScene } from '@/components/3d/ImmersiveScene'
import { CursorFollower } from '@/components/ui/cursor-follower'
import { MysteriousCard, MysteriousReveal } from '@/components/ui/mysterious-reveal'
import { BackButton } from '@/components/ui/back-button'
import Link from 'next/link'

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'features'>('home')

  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Encryption',
      description: 'Signal Protocol + MLS for unbreakable end-to-end encryption',
      color: 'from-emerald-400 to-cyan-400',
      secret: 'AES-256-GCM + Double Ratchet',
    },
    {
      icon: Lock,
      title: 'Zero Server Storage',
      description: 'Messages never stored on servers - only relayed',
      color: 'from-violet-400 to-purple-400',
      secret: 'Ephemeral relay only',
    },
    {
      icon: Eye,
      title: '30-Day Auto-Delete',
      description: 'Messages evaporate by default, configurable by organization',
      color: 'from-amber-400 to-orange-400',
      secret: 'Secure wipe + forensic countermeasures',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Sub-2 second message delivery, even in large groups',
      color: 'from-rose-400 to-pink-400',
      secret: '<200ms latency',
    },
    {
      icon: Globe,
      title: 'Self-Hosted',
      description: 'Deploy on your own infrastructure with full control',
      color: 'from-blue-400 to-indigo-400',
      secret: 'Air-gapped deployment available',
    },
    {
      icon: CheckCircle,
      title: 'Open Source',
      description: 'Core protocol is MIT licensed and fully auditable',
      color: 'from-green-400 to-emerald-400',
      secret: 'Third-party audited annually',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050506] text-white selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Full-Screen Immersive Universe Background */}
      <ImmersiveScene />

      {/* Custom Cursor */}
      <CursorFollower />

      {/* Main Content - Z-index above 3D background */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#050506]/20 border-b border-white/5">
          <div className="container mx-auto px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              >
                <Shield className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  FortiComm
                </span>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-gray-500 font-medium">PREMIUM</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <button
                onClick={() => setCurrentView('home')}
                className={`text-sm font-semibold transition-all ${
                  currentView === 'home'
                    ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'text-gray-400 hover:text-white hover:scale-105'
                }`}
              >
                Home
              </button>
              <Link href="/product">
                <button
                  className={`text-sm font-semibold transition-all ${
                    currentView === 'product'
                      ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'text-gray-400 hover:text-white hover:scale-105'
                  }`}
                >
                  Product
                </button>
              </Link>
              <Link href="/features">
                <button
                  className={`text-sm font-semibold transition-all ${
                    currentView === 'features'
                      ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'text-gray-400 hover:text-white hover:scale-105'
                  }`}
                >
                  Features
                </button>
              </Link>
            </div>

            <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold shadow-[0_0_40px_rgba(16,185,129,0.5)] border border-white/10">
              Get Started Free
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-28 pb-20 relative">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/30 mb-8 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <span className="text-sm font-semibold text-emerald-300">Government-Grade Security Certified</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight"
                >
                  <span className="text-white">The Fort Knox</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    of Messaging
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed"
                >
                  Unbreakable encryption meets seamless collaboration. Secure messaging
                  that governments trust and teams actually want to use.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-5"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg px-10 py-7 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/20 hover:scale-105 transition-transform"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 hover:bg-white/5 text-white font-semibold text-lg px-10 py-7 hover:scale-105 transition-transform backdrop-blur-sm"
                  >
                    Watch Demo
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-14 flex items-center gap-12"
                >
                  <div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">
                      99.99%
                    </div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-2">Uptime</div>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-400">
                      {'<2s'}
                    </div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-2">Delivery</div>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-400">
                      10k+
                    </div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-2">Groups</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Cosmic interactive element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="relative h-[650px]"
              >
                <MysteriousCard className="h-full rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <Fingerprint className="w-32 h-32 text-emerald-400/60" />
                    </motion.div>
                    <p className="mt-8 text-gray-400 text-lg font-medium">
                      Hover to unlock secrets
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
                      <Infinity className="w-6 h-6 animate-pulse" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200" />
                    </div>
                  </motion.div>
                </MysteriousCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Security Without Compromise
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
                Enterprise-grade protection with user experience teams love
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <MysteriousReveal
                    secretContent={
                      <div className="text-center p-8">
                        <Fingerprint className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <p className="text-2xl font-bold text-white mb-2">{feature.secret}</p>
                        <p className="text-gray-400">Advanced encryption technology</p>
                      </div>
                    }
                  >
                    <div className="p-8 backdrop-blur-sm">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </MysteriousReveal>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-violet-900/30 border border-emerald-500/20 rounded-[48px] p-16 md:p-24 overflow-hidden backdrop-blur-xl"
            >
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                >
                  Ready to Secure Your Communications?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl text-gray-300 mb-12 font-medium leading-relaxed"
                >
                  Join thousands of organizations that trust FortiComm for their most sensitive communications.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-6 justify-center"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xl px-12 py-8 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/20 hover:scale-105 transition-transform"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                  <Link href="/product">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/20 hover:bg-white/5 text-white font-bold text-xl px-12 py-8 hover:scale-105 transition-transform backdrop-blur-sm"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-16 backdrop-blur-xl bg-[#050506]/50 relative">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Back button in footer too */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FortiComm</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="text-base text-gray-500 font-medium">
                  © 2024 FortiComm. All rights reserved.
                </div>
                <a href="#" className="text-base text-gray-500 hover:text-white font-medium transition-colors">Privacy</a>
                <a href="#" className="text-base text-gray-500 hover:text-white font-medium transition-colors">Terms</a>
                <a href="#" className="text-base text-gray-500 hover:text-white font-medium transition-colors">Security</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
