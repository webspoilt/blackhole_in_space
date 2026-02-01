'use client'

import { useState } from 'react'
import { Mail, Phone, Building, MessageSquare, ArrowRight, ShieldCheck, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ContactSalesPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        role: '',
        sector: 'government',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would submit to an API
        alert('Thank you. A federal sales representative will contact you within 2 hours.')
    }

    return (
        <div className="min-h-screen bg-[#0a0f1a] font-inter">


            <div className="pt-12 pb-12 flex flex-col md:flex-row">
                {/* Left Column - Info */}
                <div className="w-full md:w-1/2 px-8 md:px-20 py-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit mb-6">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Secure Sales Channel</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Talk to our <br />
                        <span className="text-blue-500">Government Team</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-lg">
                        Discuss your mission requirements, request a classified briefing, or get a custom quote for your agency.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Building className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Headquarters</h3>
                                <p className="text-gray-400">123 Defense Way, Suite 400<br />Arlington, VA 22209</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Federal Sales Line</h3>
                                <p className="text-gray-400">+1 (888) 555-0199</p>
                                <p className="text-sm text-gray-500 mt-1">Available 24/7 for critical inquiries</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                                <p className="text-gray-400">sales@vault.messaging</p>
                                <p className="text-gray-400">gov@vault.messaging (SIPR/NIPR available on request)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="w-full md:w-1/2 bg-white/5 border-l border-white/10 px-8 md:px-20 py-12 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="John Doe"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Role / Rank</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="CTO / Colonel"
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Work Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="name@agency.gov"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Organization / Agency</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Department of Defense"
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Sector</label>
                            <select
                                className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                            >
                                <option value="government">Federal Government</option>
                                <option value="defense">Defense / Intelligence</option>
                                <option value="enterprise">Enterprise (500+ users)</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Message</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Tell us about your requirements..."
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Request Contact
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            By submitting this form, you agree to our Privacy Policy. All communications are encrypted.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
