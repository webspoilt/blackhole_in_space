'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, Lock, Server, Smartphone, Users, Database, Clock, Globe2, Check, X, ArrowLeft, ArrowRight, Crown, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImmersiveScene } from '@/components/3d/ImmersiveScene'
import { CursorFollower } from '@/components/ui/cursor-follower'
import { MysteriousCard, MysteriousReveal } from '@/components/ui/mysterious-reveal'
import { BackButton } from '@/components/ui/back-button'
import Link from 'next/link'

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState('encryption')

  const tabs = [
    { id: 'encryption', label: 'Encryption', icon: Lock, color: 'from-emerald-500 to-cyan-500' },
    { id: 'architecture', label: 'Architecture', icon: Server, color: 'from-violet-500 to-purple-500' },
    { id: 'deployment', label: 'Deployment', icon: Globe2, color: 'from-amber-500 to-orange-500' },
  ]

  const features = {
    encryption: [
      { title: 'Signal Protocol', description: 'Proven, audited Double Ratchet algorithm', status: 'active', gradient: 'from-emerald-400 to-cyan-400' },
      { title: 'MLS Protocol', description: 'RFC 9420 compliant group messaging', status: 'active', gradient: 'from-violet-400 to-purple-400' },
      { title: 'Post-Quantum Ready', description: 'ML-KEM (CRYSTALS-Kyber) integration', status: 'active', gradient: 'from-blue-400 to-indigo-400' },
      { title: 'Zero Knowledge', description: 'Servers cannot read any message content', status: 'active', gradient: 'from-rose-400 to-pink-400' },
      { title: 'Perfect Forward Secrecy', description: 'Compromised keys don\'t expose past messages', status: 'active', gradient: 'from-amber-400 to-orange-400' },
      { title: 'Client-Side Encryption', description: 'All crypto operations on your device', status: 'active', gradient: 'from-green-400 to-emerald-400' },
    ],
    architecture: [
      { title: 'Zero Server Storage', description: 'Messages relayed, never stored', status: 'active', gradient: 'from-emerald-400 to-cyan-400' },
      { title: 'Client-First Design', description: 'User owns their data and keys', status: 'active', gradient: 'from-violet-400 to-purple-400' },
      { title: 'User-Controlled Backups', description: 'Encrypted backups to your cloud', status: 'active', gradient: 'from-amber-400 to-orange-400' },
      { title: 'WebAssembly Crypto', description: 'WASM-isolated encryption engine', status: 'active', gradient: 'from-blue-400 to-indigo-400' },
      { title: 'Federated Network', description: 'ActivityPub-inspired encryption layer', status: 'active', gradient: 'from-rose-400 to-pink-400' },
      { title: 'Minimal Attack Surface', description: 'Ephemeral relay servers only', status: 'active', gradient: 'from-green-400 to-emerald-400' },
    ],
    deployment: [
      { title: 'Self-Hosted', description: 'Full control over your infrastructure', status: 'active', gradient: 'from-emerald-400 to-cyan-400' },
      { title: 'Docker Ready', description: 'One-command deployment', status: 'active', gradient: 'from-violet-400 to-purple-400' },
      { title: 'Kubernetes', description: 'Helm charts for scalable deployments', status: 'active', gradient: 'from-amber-400 to-orange-400' },
      { title: 'Air-Gapped', description: 'Fully offline deployment option', status: 'active', gradient: 'from-blue-400 to-indigo-400' },
      { title: 'Multi-Cloud', description: 'Deploy anywhere - AWS, GCP, Azure, on-prem', status: 'active', gradient: 'from-rose-400 to-pink-400' },
      { title: 'Open Source', description: 'MIT licensed core protocol', status: 'active', gradient: 'from-green-400 to-emerald-400' },
    ],
  }

  const platforms = [
    { name: 'Web', icon: Globe2, description: 'Standalone web application', gradient: 'from-emerald-400 to-cyan-400' },
    { name: 'iOS', icon: Smartphone, description: 'Native iOS app with Rust FFI', gradient: 'from-violet-400 to-purple-400' },
    { name: 'Android', icon: Smartphone, description: 'Native Android app with Rust FFI', gradient: 'from-blue-400 to-indigo-400' },
    { name: 'Desktop', icon: Server, description: 'Tauri desktop application', gradient: 'from-amber-400 to-orange-400' },
  ]

  const comparisons = [
    { feature: 'End-to-End Encryption', fortiComm: true, whatsapp: true, slack: false, signal: true },
    { feature: 'Zero Server Storage', fortiComm: true, whatsapp: false, slack: false, signal: true },
    { feature: 'Auto-Delete Default', fortiComm: true, whatsapp: false, slack: false, signal: false },
    { feature: 'User-Owned Backups', fortiComm: true, whatsapp: false, slack: false, signal: false },
    { feature: 'Organization Features', fortiComm: true, whatsapp: false, slack: true, signal: false },
    { feature: 'Open Source Core', fortiComm: true, whatsapp: false, slack: false, signal: true },
    { feature: 'Self-Hosted', fortiComm: true, whatsapp: false, slack: true, signal: true },
    { feature: 'Hardware Key Support', fortiComm: true, whatsapp: false, slack: false, signal: false },
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
              <BackButton href="/" label="Home" />
              <Link href="/" className="flex items-center gap-4 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">FortiComm</span>
                  <Crown className="w-3 h-3 text-amber-400" />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/features">
                <Button variant="ghost" className="text-gray-400 hover:text-white font-semibold hover:bg-white/5">
                  Features
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 font-semibold shadow-lg shadow-emerald-500/25 border border-white/10">
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-28 pb-20">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <Badge className="mb-8 bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border-emerald-500/30 text-emerald-300 font-semibold px-5 py-3 rounded-xl backdrop-blur-sm">
                  Product Overview
                </Badge>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                  <span className="text-white">Sovereign</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    Secure Messaging
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                  A messaging platform where you control the keys, where messages disappear by design,
                  and where privacy isn't a feature—it's a foundation.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  {[
                    { title: 'Military-Grade', desc: 'Government certified', icon: Shield },
                    { title: 'Zero Trust', desc: 'Servers never see data', icon: Lock },
                    { title: 'Ephemeral', desc: '30-day auto-delete', icon: Clock },
                    { title: 'Open Source', desc: 'Fully auditable', icon: Users },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                        <item.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{item.title}</div>
                        <div className="text-base text-gray-500 font-medium">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-5">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg px-10 py-7 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/20 hover:scale-105 transition-transform"
                  >
                    Start Free Trial
                  </Button>
                  <Link href="/features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/20 hover:bg-white/5 text-white font-semibold text-lg px-10 py-7 hover:scale-105 transition-transform backdrop-blur-sm"
                    >
                      Explore Features
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Right: Mysterious Interactive Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="relative h-[650px]"
              >
                <MysteriousCard className="h-full rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      rotate: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-center p-8"
                  >
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                      <Lock className="w-20 h-20 text-violet-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-3">Sovereign Security</p>
                    <p className="text-gray-400 text-lg">Hover to reveal mysteries</p>
                  </motion.div>
                </MysteriousCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-500 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-emerald-500/30 scale-105`
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <tab.icon className="w-6 h-6" />
                  {tab.label}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features[activeTab as keyof typeof features].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <MysteriousReveal
                    secretContent={
                      <div className="text-center p-8">
                        <Fingerprint className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <p className="text-xl font-bold text-white mb-2">{feature.title}</p>
                        <p className="text-gray-400">Deep dive into {feature.title}</p>
                      </div>
                    }
                  >
                    <div className="p-8 backdrop-blur-sm">
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          {feature.status === 'active' ? (
                            <Check className="w-7 h-7 text-white" />
                          ) : (
                            <X className="w-7 h-7 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-400 text-base leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </MysteriousReveal>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Platform Support */}
        <section className="py-24 relative overflow-hidden z-10">
          <div className="container mx-auto px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Available Everywhere
              </h2>
              <p className="text-2xl text-gray-400">
                Native apps for all major platforms with identical security
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platforms.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MysteriousCard className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center hover:border-white/20 transition-all duration-500 backdrop-blur-sm rounded-3xl group">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mx-auto mb-6 shadow-xl`}
                    >
                      <platform.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">{platform.name}</h3>
                    <p className="text-gray-400 text-base">{platform.description}</p>
                  </MysteriousCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 z-10">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Why FortiComm?
              </h2>
              <p className="text-2xl text-gray-400">
                Compare with other messaging platforms
              </p>
            </motion.div>

            <Card className="overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm rounded-3xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-8 font-bold text-xl text-white">Feature</th>
                    <th className="text-center p-8 font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">FortiComm</th>
                    <th className="text-center p-8 font-bold text-xl text-gray-400">WhatsApp</th>
                    <th className="text-center p-8 font-bold text-xl text-gray-400">Slack</th>
                    <th className="text-center p-8 font-bold text-xl text-gray-400">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-8 font-semibold text-lg text-white">{row.feature}</td>
                      <td className="text-center p-8">
                        {row.fortiComm ? (
                          <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-gray-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-8">
                        {row.whatsapp ? (
                          <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-gray-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-8">
                        {row.slack ? (
                          <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-gray-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-8">
                        {row.signal ? (
                          <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-7 h-7 text-gray-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 z-10">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-violet-900/30 border border-emerald-500/20 rounded-[48px] p-16 md:p-24 text-center overflow-hidden backdrop-blur-xl"
            >
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                >
                  Ready to Experience True Security?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl text-gray-300 mb-12 font-medium leading-relaxed max-w-3xl mx-auto"
                >
                  Start your free trial today and discover why organizations trust FortiComm
                  with their most sensitive communications.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6 justify-center"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xl px-12 py-8 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/20 hover:scale-105 transition-transform"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-16 backdrop-blur-xl bg-[#050506]/50 relative z-10">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <BackButton href="/" />
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FortiComm</span>
              </div>
              <div className="text-base text-gray-500 font-medium">
                © 2024 FortiComm. All rights reserved.
              </div>
              <div className="flex items-center gap-8">
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
