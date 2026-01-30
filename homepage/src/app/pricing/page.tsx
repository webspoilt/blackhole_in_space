import { Check, Shield, Zap, Globe, MessageSquare, Building, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    const tiers = [
        {
            name: 'Self-Hosted',
            description: 'For organizations requiring complete data sovereignty and air-gapped deployment.',
            price: 'Custom',
            features: [
                'Full Source Code Access',
                'Air-Gapped Deployment Capable',
                'Custom Encryption Key Management',
                'White Labeling Available',
                'Priority Engineering Support',
                'Unlimited Users'
            ],
            cta: 'Contact Sales',
            href: '/contact-sales',
            highlight: false
        },
        {
            name: 'Government Cloud',
            description: 'FedRAMP Authorized (High) environment for US Government agencies.',
            price: 'Contact Us',
            features: [
                'FedRAMP High Authorization (In Progress)',
                'FIPS 140-2 Validated Encryption',
                'US Persons Only Support',
                'Data Residency (CONUS)',
                '24/7/365 US-Based Support',
                'Uptime SLA 99.999%'
            ],
            cta: 'Request Quote',
            href: '/contact-sales',
            highlight: true
        },
        {
            name: 'Enterprise',
            description: 'Secure cloud messaging for regulated industries and large enterprises.',
            price: '$15',
            unit: '/user/month',
            features: [
                'SOC 2 Type II Certified',
                'SSO / SAML Integration',
                'Data Retention Policies',
                'eDiscovery & Archiving',
                'Admin Dashboard',
                '99.99% Uptime SLA'
            ],
            cta: 'Start Free Trial',
            href: '/contact-sales',
            highlight: false
        }
    ]

    return (
        <div className="min-h-screen bg-[#0a0f1a] pt-24 pb-12 font-inter">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Secure Pricing for Mission-Critical Ops
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transparent pricing models designed for government compliance, enterprise scale, and absolute data sovereignty.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl p-8 border ${tier.highlight
                                    ? 'bg-gradient-to-b from-blue-900/20 to-blue-900/10 border-blue-500/50 shadow-2xl shadow-blue-500/10'
                                    : 'bg-[#111827] border-white/10'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-gray-400 text-sm h-10">{tier.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1 text-white">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.unit && <span className="text-gray-400">{tier.unit}</span>}
                                </div>
                            </div>

                            <Link
                                href={tier.href}
                                className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all mb-8 ${tier.highlight
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {tier.cta}
                            </Link>

                            <ul className="space-y-4">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-gray-300 text-sm">
                                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Enterprise Features Grid */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Standard Enterprise Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Shield, title: 'Zero Trust', desc: 'Never trust, always verify architecture.' },
                            { icon: Lock, title: 'E2E Encryption', desc: 'Signal Protocol with MLS support.' },
                            { icon: Building, title: 'Data Residency', desc: 'Keep data within your borders.' },
                            { icon: Globe, title: 'Compliance', desc: 'GDPR, HIPAA, and CCPA ready.' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <item.icon className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
