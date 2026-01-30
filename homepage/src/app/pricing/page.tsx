'use client'

import { Check, Shield, Server, Building, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    const plans = [
        {
            name: 'Departmental',
            description: 'For single bureaus or secure task forces requiring rapid deployment.',
            features: [
                'Up to 500 Licensed Users',
                'Cloud or Private Instance',
                'Standard NIST Compliance',
                'Business Hour Support',
                '99.9% Uptime SLA'
            ],
            cta: 'Request Quote',
            href: '/contact-sales',
            highlight: false,
            icon: Building
        },
        {
            name: 'Inter-Agency',
            description: 'Federated messaging for cross-departmental collaboration.',
            features: [
                'Unlimited Users',
                'AD / SAML / SCIM Integration',
                'FedRAMP Moderate Ready',
                '24/7 US-Based Support',
                '99.99% Uptime SLA',
                'Legal Hold & eDiscovery'
            ],
            cta: 'Contact Sales',
            href: '/contact-sales',
            highlight: true,
            icon: Globe
        },
        {
            name: 'Sovereign / On-Premise',
            description: 'Air-gapped deployment for classified and defense environments.',
            features: [
                'Full Source Code Access',
                'Air-Gapped Deployment Support',
                'TS/SCI Cleared Support Staff',
                'Custom Crypto-Agility',
                'Dedicated Technical Account Manager',
                'FIPS 140-2 Level 3 Hardware Integration'
            ],
            cta: 'Contact Sales',
            href: '/contact-sales',
            highlight: false,
            icon: Server
        }
    ]

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-100">
            <div className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-800/50 bg-blue-900/20 mb-8">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium tracking-wide text-blue-400 uppercase">Government Procurement</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Flexible Licensing Models
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            VAULT is procured via annual or multi-year contracts. We support firm-fixed-price (FFP) and indefinite-delivery/indefinite-quantity (IDIQ) contract vehicles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <div key={idx} className={`relative rounded-2xl p-8 border ${plan.highlight ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700 bg-slate-800/30'} flex flex-col`}>
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Common
                                    </div>
                                )}
                                <div className="mb-8">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${plan.highlight ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                        <plan.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm h-10">{plan.description}</p>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-blue-400' : 'text-slate-500'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.href} className={`w-full py-4 rounded-lg font-bold text-center transition-all ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 border-t border-slate-800 pt-12 text-center text-slate-400">
                        <p>Need a capability statement or Cage Code? <Link href="/contact-sales" className="text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400">Contact our Sales Team.</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
