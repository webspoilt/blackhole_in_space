'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Globe, Zap, Server, Code, Users, MessageSquare, Bell, Star, Activity, Filter, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'governance', label: 'Governance & Audit' },
    { id: 'security', label: 'Core Security' },
    { id: 'control', label: 'Admin Control' }
  ]

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verifiable Integrity',
      description: 'Cryptographically verifiable operations. Every state change generates a signed audit log entry that administrators can inspect.',
      category: 'governance',
      color: 'from-blue-500/20 to-blue-600/10'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Zero Unauthorized Traces',
      description: 'System architecture ensures service providers (us) have zero visibility. Data remains accessible only to authorized agency administrators with keys.',
      category: 'security',
      color: 'from-red-500/20 to-red-600/10'
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Sovereign Deployment',
      description: 'Deploy on-premise, in GovCloud, or air-gapped environments. You own the infrastructure, the keys, and the data.',
      category: 'control',
      color: 'from-indigo-500/20 to-indigo-600/10'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Granular Audit Logging',
      description: 'Tamper-evident logs for all user access, message metadata, and administrative actions. Exportable to SIEM systems (Splunk, Elastic).',
      category: 'governance',
      color: 'from-amber-500/20 to-amber-600/10'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Role-Based Access Control',
      description: 'Define precise permissions for users, auditors, and administrators. Enforce least-privilege principles across your organization.',
      category: 'control',
      color: 'from-purple-500/20 to-purple-600/10'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Data Residency Compliance',
      description: 'Pin data to specific geographic regions or servers to meet GDPR, CCPA, and federal data residency requirements.',
      category: 'governance',
      color: 'from-teal-500/20 to-teal-600/10'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Low-Bandwidth Mode',
      description: 'Optimized for tactical environments with intermittent connectivity. Message queuing and varying compression rates for field operations.',
      category: 'security',
      color: 'from-yellow-500/20 to-yellow-600/10'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Open Source Core',
      description: 'MIT licensed protocol core allows for independent security verification. No black boxes. Trust through transparency.',
      category: 'security',
      color: 'from-emerald-500/20 to-emerald-600/10'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'System Health Monitoring',
      description: 'Real-time dashboard for server health, message throughput, and connection status. Integrate with Prometheus/Grafana.',
      category: 'control',
      color: 'from-cyan-500/20 to-cyan-600/10'
    }
  ]

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter(f => f.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a] text-gray-100 font-sans">

      {/* Navigation */}


      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-[#0a0f1a]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-900/10 mb-8">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium tracking-wide text-blue-400 uppercase">Platform Capabilities</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Verifiable Operations.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Integrity Defense.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              A comprehensive suite of controls designed to meet the rigorous standards of government and regulated enterprise sectors.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl border border-white/10 bg-[#111827] hover:border-blue-500/30 transition-all hover:bg-[#161e2e]"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} border border-white/5 flex items-center justify-center mb-6`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                      {categories.find(c => c.id === feature.category)?.label}
                    </span>
                    <CheckCircle className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#0d121f] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Audit the Architecture?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Schedule a technical deep-dive with our solutions engineering team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-sales" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                Contact Sales
              </Link>
              <Link href="/security" className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                Security Architecture
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05080f] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 VAULT Enterprise. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
            <Link href="/bounty" className="hover:text-white">Vulnerability Program</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
