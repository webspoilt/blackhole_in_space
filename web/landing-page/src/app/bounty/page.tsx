'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Trophy, Zap, Target, ExternalLink, Award, Code, Send, Flag } from 'lucide-react'
import Link from 'next/link'

export default function BountyPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0f1a] text-gray-100 font-sans">


            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-900/10 mb-8">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium tracking-wide text-green-400 uppercase">Active Program</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Vulnerability Disclosure Program
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                            We are committed to security research and safe harbor for ethical researchers.
                            Help us maintain the integrity of our sovereign messaging platform.
                        </p>
                    </div>
                </section>

                {/* Safe Harbor Policy */}
                <section className="px-6 pb-16">
                    <div className="max-w-4xl mx-auto bg-[#111827] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Flag className="w-6 h-6 text-blue-500" /> Safe Harbor Policy
                        </h2>
                        <div className="prose prose-invert text-gray-300 max-w-none">
                            <p className="mb-4">
                                If you conduct security research and disclose vulnerabilities to us in accordance with this policy, we consider your research to be:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Authorized with respect to any applicable anti-hacking laws (CFAA).</li>
                                <li>Authorized with respect to any relevant anti-circumvention laws (DMCA).</li>
                                <li>Exempt from restrictions in our Terms of Service that would interfere with security research.</li>
                                <li>Lawful, and we will not initiate or support legal action against you.</li>
                            </ul>
                            <p>
                                We prioritize the security of our government and enterprise customers above all else.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tiers */}
                <section className="px-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Critical", reward: "$5,000 - $10,000", desc: "RCE, Key Exfiltration", color: "border-red-500/50 text-red-400" },
                                { label: "High", reward: "$1,000 - $5,000", desc: "SQLi, Auth Bypass", color: "border-orange-500/50 text-orange-400" },
                                { label: "Medium", reward: "$500 - $1,000", desc: "XSS, CSRF", color: "border-yellow-500/50 text-yellow-400" },
                                { label: "Low", reward: "$100 - $500", desc: "Info Disclosure", color: "border-blue-500/50 text-blue-400" },
                            ].map((tier) => (
                                <div key={tier.label} className={`p-6 rounded-xl border bg-[#111827]/50 ${tier.color} border-opacity-30`}>
                                    <h3 className="text-lg font-bold mb-2">{tier.label}</h3>
                                    <div className="text-2xl font-bold text-white mb-2">{tier.reward}</div>
                                    <p className="text-gray-400 text-sm">{tier.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Responsible Disclosure Form */}
                <section className="px-6 pb-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-8">Submit a Report</h2>

                            {isSubmitted ? (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-green-400">Report encrypted and submitted securely. Thank you.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Vulnerability Class</label>
                                        <select className="w-full px-4 py-2 bg-[#0a0f1a] border border-white/10 rounded-lg text-white">
                                            <option>Remote Code Execution (RCE)</option>
                                            <option>Authentication / Authorization</option>
                                            <option>Cryptographic Flaw</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <textarea rows={4} className="w-full px-4 py-2 bg-[#0a0f1a] border border-white/10 rounded-lg text-white" placeholder="Describe the vulnerability impact..."></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Proof of Concept</label>
                                        <textarea rows={4} className="w-full px-4 py-2 bg-[#0a0f1a] border border-white/10 rounded-lg text-white font-mono text-sm" placeholder="Steps to reproduce..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Encrypt & Submit Report
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#05080f] py-8 text-center text-sm text-gray-500">
                <p>© 2024 VAULT Enterprise. Secure connection established.</p>
            </footer>
        </div>
    )
}
