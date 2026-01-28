'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Shield,
  Lock,
  Users,
  MessageSquare,
  Video,
  Calendar,
  FileText,
  Settings,
  Key,
  Server,
  Globe,
  Eye,
  Clock,
  Archive,
  Zap,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Network,
  HardDrive,
  Fingerprint,
  Vote,
  Bell,
  Mic,
  Crown,
  Sparkles,
  ShieldAlert,
  Infinity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ImmersiveScene } from '@/components/3d/ImmersiveScene'
import { CursorFollower } from '@/components/ui/cursor-follower'
import { MysteriousCard, MysteriousReveal } from '@/components/ui/mysterious-reveal'
import { BackButton } from '@/components/ui/back-button'
import Link from 'next/link'

export default function FeaturesPage() {
  const [activePhase, setActivePhase] = useState('phase1')

  const phases = [
    { id: 'phase1', title: 'Secure Foundation', description: 'Core security features', color: 'from-emerald-500 to-cyan-500' },
    { id: 'phase2', title: 'Organization Ready', description: 'Enterprise features', color: 'from-violet-500 to-purple-500' },
    { id: 'phase3', title: 'Government Grade', description: 'Advanced security', color: 'from-amber-500 to-orange-500' },
    { id: 'phase4', title: 'AI Smartness', description: 'Local intelligence', color: 'from-rose-500 to-pink-500' },
  ]

  const features = {
    phase1: [
      {
        icon: Lock,
        title: 'Signal Protocol E2E Encryption',
        description: 'Proven, audited Double Ratchet algorithm for unbreakable end-to-end encryption',
        details: [
          'Double Ratchet provides forward and future secrecy',
          'Perfect Forward Secrecy - compromised keys don\'t expose past messages',
          'Regularly audited by third-party cryptographers',
          'Open source implementation for transparency',
        ],
        gradient: 'from-emerald-400 to-cyan-400',
      },
      {
        icon: Users,
        title: 'Group Chats with MLS Protocol',
        description: 'RFC 9420 compliant Messaging Layer Security for scalable group encryption',
        details: [
          'Supports groups of 1000+ members',
          'Efficient member addition/removal',
          'Post-compromise security for groups',
          'IETF standard protocol',
        ],
        gradient: 'from-violet-400 to-purple-400',
      },
      {
        icon: FileText,
        title: 'Encrypted File Sharing',
        description: 'Securely share files up to 100MB with automatic encryption',
        details: [
          'Client-side encryption before upload',
          'Zero-knowledge file storage',
          'Preview encrypted files in-chat',
          'Multiple file formats supported',
        ],
        gradient: 'from-blue-400 to-indigo-400',
      },
      {
        icon: Clock,
        title: '30-Day Auto-Delete',
        description: 'Messages automatically delete after 30 days by default',
        details: [
          'Configurable retention periods',
          'Customizable by organization policy',
          'Secure deletion with forensic countermeasures',
          'Instant wipe with panic feature',
        ],
        gradient: 'from-amber-400 to-orange-400',
      },
      {
        icon: Archive,
        title: 'Client-Side Encrypted Backup',
        description: 'Back up to your personal cloud with keys you control',
        details: [
          'Supports Dropbox, Google Drive, OneDrive',
          'Military-grade AES-256-GCM encryption',
          'Argon2id key derivation',
          'Only you can access your backups',
        ],
        gradient: 'from-rose-400 to-pink-400',
      },
      {
        icon: Calendar,
        title: 'Message Scheduling',
        description: 'Schedule messages to be sent later with secure delivery',
        details: [
          'Schedule messages hours or days ahead',
          'Local storage until delivery time',
          'Recipient never sees scheduled status',
          'Recurring message support',
        ],
        gradient: 'from-green-400 to-emerald-400',
      },
    ],
    phase2: [
      {
        icon: Network,
        title: 'Department Hierarchy',
        description: 'Organize teams by department with org chart sync',
        details: [
          'Visual organization chart',
          'LDAP/Active Directory integration',
          'Department-based channels',
          'Role-based access control',
        ],
        gradient: 'from-emerald-400 to-cyan-400',
      },
      {
        icon: Settings,
        title: 'Admin Controls',
        description: 'Comprehensive admin dashboard for message and user management',
        details: [
          'Message recall capability',
          'User management and permissions',
          'Audit logs for compliance',
          'Bulk user operations',
        ],
        gradient: 'from-violet-400 to-purple-400',
      },
      {
        icon: Bell,
        title: 'Priority Messaging',
        description: 'Override mute for urgent communications and emergencies',
        details: [
          'Break through Do Not Disturb',
          'Emergency broadcast system',
          'Escalation protocols',
          'Read receipts for priority',
        ],
        gradient: 'from-amber-400 to-orange-400',
      },
      {
        icon: Video,
        title: 'Encrypted Voice/Video Calls',
        description: 'Secure real-time communication with WebRTC encryption',
        details: [
          'End-to-end encrypted calls',
          'Screen sharing support',
          'Group video calls up to 50',
          'Recording with encryption',
        ],
        gradient: 'from-blue-400 to-indigo-400',
      },
      {
        icon: Mic,
        title: 'Meeting Mode',
        description: 'Structured meetings with agenda and encrypted recordings',
        details: [
          'Pre-meeting agenda sharing',
          'Live transcription (local)',
          'Encrypted meeting recordings',
          'Action item tracking',
        ],
        gradient: 'from-rose-400 to-pink-400',
      },
      {
        icon: MessageSquare,
        title: 'Task Assignment',
        description: 'Convert @mentions into actionable tasks with due dates',
        details: [
          '@mention creates tasks automatically',
          'Assign to team members',
          'Track task completion',
          'Integrate with project tools',
        ],
        gradient: 'from-green-400 to-emerald-400',
      },
    ],
    phase3: [
      {
        icon: Key,
        title: 'Hardware Key Authentication',
        description: 'YubiKey and other FIDO2/U2F hardware key support',
        details: [
          'Multi-factor authentication',
          'Hardware-based key storage',
          'Phishing-resistant login',
          'Audit trail for key usage',
        ],
        gradient: 'from-emerald-400 to-cyan-400',
      },
      {
        icon: Server,
        title: 'Air-Gapped Deployment',
        description: 'Fully offline deployment for maximum security',
        details: [
          'Zero external network dependencies',
          'QR code data transfer',
          'Physical key exchange',
          'Isolated encryption operations',
        ],
        gradient: 'from-violet-400 to-purple-400',
      },
      {
        icon: Vote,
        title: 'Secure Voting Module',
        description: 'Anonymous, verifiable voting for governance decisions',
        details: [
          'Cryptographically secure voting',
          'Anonymous ballots',
          'Verifiable results',
          'Tamper-evident system',
        ],
        gradient: 'from-amber-400 to-orange-400',
      },
      {
        icon: Eye,
        title: 'Whistleblower Channels',
        description: 'Ultra-anonymous reporting channels with protection',
        details: [
          'No user metadata stored',
          'Tor-like onion routing',
          'Self-destructing reports',
          'Multiple recipient support',
        ],
        gradient: 'from-blue-400 to-indigo-400',
      },
      {
        icon: Globe,
        title: 'Discreet Mode',
        description: 'App appears as calculator or utility when activated',
        details: [
          'Fake app interface',
          'Gesture-based unlock',
          'No suspicious icon',
          'Quick panic close',
        ],
        gradient: 'from-rose-400 to-pink-400',
      },
      {
        icon: Fingerprint,
        title: 'Multi-Person Authorization',
        description: 'Require multiple approvals for sensitive operations',
        details: [
          'M-of-N approval scheme',
          'Time-based auth windows',
          'Audit trail for approvals',
          'Emergency override procedures',
        ],
        gradient: 'from-green-400 to-emerald-400',
      },
    ],
    phase4: [
      {
        icon: Zap,
        title: 'On-Device Message Categorization',
        description: 'AI categorizes messages without sending data to servers',
        details: [
          'Automatic folder organization',
          'Smart label assignment',
          'Priority message detection',
          'Spam filtering (local)',
        ],
        gradient: 'from-emerald-400 to-cyan-400',
      },
      {
        icon: MessageSquare,
        title: 'Smart Reply Suggestions',
        description: 'Context-aware reply suggestions using local ML models',
        details: [
          'Quick response generation',
          'Contextual suggestions',
          'Learns your writing style',
          'Fully offline processing',
        ],
        gradient: 'from-violet-400 to-purple-400',
      },
      {
        icon: Video,
        title: 'Meeting Transcription & Summary',
        description: 'Automatic transcription and AI-powered meeting summaries',
        details: [
          'Real-time transcription',
          'Speaker identification',
          'Auto-generated summaries',
          'Action item extraction',
        ],
        gradient: 'from-amber-400 to-orange-400',
      },
      {
        icon: FileText,
        title: 'Document OCR',
        description: 'Client-side optical character recognition for images',
        details: [
          'Text extraction from images',
          'Searchable image content',
          'Multiple language support',
          'Privacy-preserving processing',
        ],
        gradient: 'from-blue-400 to-indigo-400',
      },
      {
        icon: Globe,
        title: 'Cross-Language Translation',
        description: 'Local machine translation for international teams',
        details: [
          '100+ language pairs',
          'Real-time translation',
          'No cloud required',
          'Conversation history preservation',
        ],
        gradient: 'from-rose-400 to-pink-400',
      },
    ],
  }

  const additionalFeatures = [
    { icon: Shield, title: 'Decoy Mode', description: 'Fake chat interface with innocent conversations', gradient: 'from-rose-400 to-red-400' },
    { icon: Zap, title: 'Panic Wipe', description: 'Triple-tap power button to erase everything instantly', gradient: 'from-orange-400 to-red-400' },
    { icon: Lock, title: 'Duress Password', description: 'Shows different data if forced to login', gradient: 'from-amber-400 to-orange-400' },
    { icon: Eye, title: 'Forensic Countermeasures', description: 'Prevents device imaging and recovery', gradient: 'from-violet-400 to-purple-400' },
    { icon: Bell, title: 'Signal Jamming Detection', description: 'Alerts if communication is being blocked', gradient: 'from-blue-400 to-indigo-400' },
    { icon: Globe, title: 'Multi-Language Support', description: '40+ languages with full localization', gradient: 'from-emerald-400 to-cyan-400' },
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
              <BackButton href="/" />
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
              <Link href="/">
                <Button variant="ghost" className="text-gray-400 hover:text-white font-semibold hover:bg-white/5">
                  Home
                </Button>
              </Link>
              <Link href="/product">
                <Button variant="ghost" className="text-gray-400 hover:text-white font-semibold hover:bg-white/5">
                  Product
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
                  Complete Feature Set
                </Badge>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                  <span className="text-white">Every Feature You</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    Need, Nothing More
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                  From military-grade encryption to AI-powered productivity, FortiComm delivers
                  complete package for secure organizational communication.
                </p>

                <div className="flex gap-5">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg px-10 py-7 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-white/20 hover:scale-105 transition-transform"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 hover:bg-white/5 text-white font-semibold text-lg px-10 py-7 hover:scale-105 transition-transform backdrop-blur-sm"
                  >
                    View Demo
                  </Button>
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
                      rotate: [0, -0.5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-center p-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <ShieldAlert className="w-20 h-20 text-rose-400/70" />
                    </motion.div>
                    <p className="text-2xl font-bold text-white mb-3">Complete Security</p>
                    <p className="text-gray-400 text-lg">Hover to unlock secrets</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-rose-400">
                      <Infinity className="w-6 h-6 animate-pulse" />
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-200" />
                    </div>
                  </motion.div>
                </MysteriousCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Phase Tabs */}
        <section className="py-16 sticky top-[88px] z-40 backdrop-blur-2xl bg-[#050506]/80 border-b border-white/5">
          <div className="container mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-5">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex items-center gap-4 px-7 py-4 rounded-2xl font-bold transition-all duration-500 ${
                    activePhase === phase.id
                      ? `bg-gradient-to-r ${phase.color} text-white shadow-2xl shadow-emerald-500/30 scale-105`
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{phase.title}</span>
                  <span className="text-sm font-normal opacity-80">{phase.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-8">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {features[activePhase as keyof typeof features].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <MysteriousReveal
                    secretContent={
                      <div className="text-center p-8">
                        <Fingerprint className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <p className="text-2xl font-bold text-white mb-2">{feature.title}</p>
                        <p className="text-gray-400">{feature.details[0]}</p>
                      </div>
                    }
                  >
                    <div className="p-8 backdrop-blur-sm">
                      <div className="flex items-start gap-6 mb-6">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-xl`}
                        >
                          <feature.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                          <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value={`details-${index}`} className="border-white/10">
                          <AccordionTrigger className="text-base text-gray-500 hover:text-gray-300 font-semibold">
                            View Details
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-4 mt-6">
                              {feature.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-base text-gray-400">
                                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="leading-relaxed">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </MysteriousReveal>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Special Features */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-gradient-to-br from-red-600/10 to-orange-600/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500/30 text-red-300 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm">
                <ShieldAlert className="w-4 h-4 mr-2" />
                🚨 Emergency Features
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                The "Oh Sh*t" Features
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                What makes us bulletproof in critical situations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MysteriousCard className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm rounded-3xl group">
                    <div className="flex items-start gap-5">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-xl`}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-base">{feature.description}</p>
                      </div>
                    </div>
                  </MysteriousCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Built with Security in Mind
              </h2>
              <p className="text-2xl text-gray-400">
                Audited cryptographic implementations and open standards
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: Lock,
                  title: 'Cryptographic Core',
                  desc: 'Rust for memory safety with WebAssembly for web security',
                  gradient: 'from-emerald-400 to-cyan-400',
                  tags: ['Rust', 'WASM', 'libsignal'],
                },
                {
                  icon: Network,
                  title: 'Protocols',
                  desc: 'Industry-standard, audited cryptographic protocols',
                  gradient: 'from-violet-400 to-purple-400',
                  tags: ['Signal', 'MLS (RFC 9420)', 'ML-KEM'],
                },
                {
                  icon: HardDrive,
                  title: 'Infrastructure',
                  desc: 'Minimal attack surface with ephemeral messaging',
                  gradient: 'from-amber-400 to-orange-400',
                  tags: ['Go', 'Docker', 'K8s'],
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <MysteriousCard className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 backdrop-blur-sm rounded-3xl">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-8 shadow-2xl`}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">{item.desc}</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {item.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl bg-white/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </MysteriousCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
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
                  Ready to Experience Complete Security?
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
