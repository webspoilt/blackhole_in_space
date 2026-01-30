'use client'

import { useState } from 'react'
import { DollarSign, Shield, AlertTriangle, CheckCircle, Clock, Trophy, Zap, Target, ExternalLink, Award, Code, Send } from 'lucide-react'
import Link from 'next/link'

export default function BountyPage() {
    const [vulnerabilityType, setVulnerabilityType] = useState('critical')
    const [severity, setSeverity] = useState('high')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const bountyProgram = {
        critical: { min: 1000, max: 10000, label: 'Critical', color: 'text-red-400' },
        high: { min: 500, max: 5000, label: 'High', color: 'text-orange-400' },
        medium: { min: 100, max: 1000, label: 'Medium', color: 'text-yellow-400' },
        low: { min: 50, max: 500, label: 'Low', color: 'text-blue-400' }
    }

    const examples = {
        critical: [
            'Remote code execution in crypto core',
            'Authentication bypass in Signal Protocol',
            'Message replay attack vulnerability',
            'Private key extraction from memory'
        ],
        high: [
            'Denial of service vulnerability',
            'Timing attack on key exchange',
            'Side-channel information leak',
            'Weak random number generation'
        ],
        medium: [
            'UI/UX security vulnerability',
            'Cross-site scripting (XSS) in messaging',
            'Improper input sanitization',
            'Information disclosure in error messages'
        ],
        low: [
            'Typos and spelling errors in documentation',
            'Performance optimization opportunity',
            'Accessibility improvement needed',
            'Style inconsistency'
        ]
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
            {/* Navigation */}
            <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        VOID
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link>
                        <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                        <Link href="/bounty" className="text-amber-400 font-semibold">Bounty</Link>
                        <Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8">
                            <DollarSign className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium tracking-widest text-amber-400 uppercase">$1,000 - $10,000 Bounty</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Help Us Find & Fix Security Issues
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                            At VOID, we believe in radical transparency. Our code is open source and auditable.
                            Help us make it even more secure by reporting vulnerabilities.
                        </p>

                        {isSubmitted && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-semibold">Report Submitted Successfully!</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Bounty Tiers */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                            Reward Categories
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(bountyProgram).map(([key, tier]) => {
                                const colors: Record<string, string> = {
                                    critical: 'border-red-500/30',
                                    high: 'border-orange-500/30',
                                    medium: 'border-yellow-500/30',
                                    low: 'border-blue-500/30'
                                }

                                return (
                                    <div
                                        key={key}
                                        className={`p-6 rounded-2xl transition-all duration-500 hover:scale-105 ${colors[key]}`}
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        <div className={`text-2xl font-bold mb-3 ${tier.color}`}>
                                            {tier.label}
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            ${tier.min.toLocaleString()} - ${tier.max.toLocaleString()}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {tier.label === 'Critical' && 'Allows system compromise'}
                                            {tier.label === 'High' && 'Significant security impact'}
                                            {tier.label === 'Medium' && 'Moderate security concern'}
                                            {tier.label === 'Low' && 'Minor improvement opportunity'}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Examples Section */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                            Vulnerability Categories
                        </h2>
                        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                            These are the types of security issues we&apos;re looking for
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6" />
                                    Critical Vulnerabilities
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    {examples.critical.map((example, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Target className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                                            <span>{example}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                                    <Zap className="w-6 h-6" />
                                    High-Severity Issues
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    {examples.high.map((example, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Target className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                                            <span>{example}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    Medium Severity
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    {examples.medium.map((example, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                                            <span>{example}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                    <Code className="w-6 h-6" />
                                    Improvements
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    {examples.low.map((example, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <span>{example}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submission Form */}
                <section className="py-16 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="p-8 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.15))',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(251, 191, 36, 0.2)',
                                borderTop: '1px solid rgba(251, 191, 36, 0.3)',
                                boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">
                                Submit a Vulnerability Report
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Vulnerability Type</label>
                                        <select
                                            value={vulnerabilityType}
                                            onChange={(e) => setVulnerabilityType(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="critical">Critical</option>
                                            <option value="high">High Severity</option>
                                            <option value="medium">Medium Severity</option>
                                            <option value="low">Improvement</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Severity Level</label>
                                        <select
                                            value={severity}
                                            onChange={(e) => setSeverity(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                        >
                                            <option value="critical">Critical ($10,000)</option>
                                            <option value="high">High ($5,000)</option>
                                            <option value="medium">Medium ($1,000)</option>
                                            <option value="low">Low ($500)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Brief vulnerability title"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                                        <textarea
                                            placeholder="Detailed description of the vulnerability..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Your Contact Info</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitted}
                                        className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-500 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Trust Signals */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Why Trust Our Bounty Program?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Real Rewards</h3>
                                <p className="text-gray-400 text-sm">$10,000 - $1,000 for critical vulnerabilities</p>
                            </div>

                            <div
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Transparency</h3>
                                <p className="text-gray-400 text-sm">Public disclosure of all findings</p>
                            </div>

                            <div
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Fast Response</h3>
                                <p className="text-gray-400 text-sm">7-day SLA for P0/P1 issues</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Audits */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Third-Party Audits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(30, 58, 138, 0.1))',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                <Award className="w-12 h-12 text-white mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-4">Upcoming</h3>
                                <p className="text-gray-300 mb-2">Cure53</p>
                                <p className="text-blue-400 font-semibold mb-4">Q1 2025</p>
                                <p className="text-sm text-gray-400">Penetration testing of cryptographic implementation</p>
                            </div>

                            <div
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(30, 58, 138, 0.1))',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                <ExternalLink className="w-12 h-12 text-white mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-4">Planned</h3>
                                <p className="text-gray-300 mb-2">NCC Group</p>
                                <p className="text-green-400 font-semibold mb-4">Q2 2025</p>
                                <p className="text-sm text-gray-400">Full cryptographic audit of entire platform</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 backdrop-blur-sm bg-[#0a0f1a]/80 mt-auto">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2024 VOID. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">Home</Link>
                            <Link href="/demo" className="text-gray-500 hover:text-white transition-colors text-sm">Demo</Link>
                            <Link href="/bounty" className="text-amber-400 hover:text-white transition-colors text-sm">Bounty</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
