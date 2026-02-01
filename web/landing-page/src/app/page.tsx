'use client'

import { useState } from 'react'
import { Shield, Lock, Globe, Server, Check, ArrowRight, Building, FileText, Activity, Users, LayoutGrid, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

function TrustBadge({ name, status }: { name: string, status: string }) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="h-12 flex items-center justify-center mb-2 px-6 py-2 border border-slate-700 rounded bg-slate-800/50 w-full min-w-[140px] group-hover:border-blue-500/50 transition-colors">
        <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{name}</span>
      </div>
      <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">{status}</span>
    </div>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-[#0f172a] text-slate-100 selection:bg-blue-900/50 selection:text-blue-100">



      <main className="flex-1 pt-20">
        {/* Hero Section - B2G Focused (No Particles, High Contrast, Clean) */}
        <section className="relative py-24 md:py-32 flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-800/50 bg-blue-900/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide text-blue-300">MISSION CRITICAL READY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              Secure Messaging for <br />
              <span className="text-blue-400">Mission-Critical Operations</span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Military-grade encryption trusted by government agencies and enterprises who cannot afford to leak. Deploy in 48 hours with full compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
              <Link href="/contact-sales" className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl">
                Contact Sales
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-slate-600/50 text-white font-semibold text-lg rounded-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2">
                View Pricing Logic
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="border-t border-slate-800 pt-16">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted Compliance Frameworks</p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-90">
                <TrustBadge name="FedRAMP High" status="Ready" />
                <TrustBadge name="SOC 2 Type II" status="Certified" />
                <TrustBadge name="FIPS 140-2" status="Validated" />
                <TrustBadge name="ISO 27001" status="Certified" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Granular Metrics */}
        <section className="py-24 bg-[#0f172a] border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Operational Efficiency</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Tangible impact on your organization's security posture and bottom line.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <LayoutGrid className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Inter-Departmental Speed</h3>
                <p className="text-slate-400">Streamline secure communication between siloed departments without risking data spillage on consumer apps.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Server className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Reduced TCO</h3>
                <p className="text-slate-400">Reduce server maintenance costs by 40% with our efficient, compiled-binary architecture (Go/Rust).</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Automated Compliance</h3>
                <p className="text-slate-400">Automate compliance reporting for FedRAMP and SOC 2 audits with built-in, immutable audit logs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study - "Project: Silent Shield" */}
        <section className="py-24 bg-[#1e293b]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/30 text-blue-300 text-xs font-bold uppercase tracking-wide mb-6">
                  Case Study
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Securing "Operation Silent Shield"
                </h2>
                <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                  <p>
                    <strong className="text-white">The Challenge:</strong> A joint task force needed to coordinate operations across three different agencies. Standard tools were not cleared for the classification level, leading personnel to risky "shadow IT" use of consumer apps like WhatsApp.
                  </p>
                  <p>
                    <strong className="text-white">The Solution:</strong> The task force deployed a self-hosted instance of VAULT Enterprise on a tactical edge server (air-gapped).
                  </p>
                  <p>
                    <strong className="text-white">The Outcome:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Zero data leaks over 18 months of operation.</li>
                      <li>Full audit trail satisfied Inspector General review.</li>
                      <li>Deployment completed in 24 hours by 2 engineers.</li>
                    </ul>
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-700 flex gap-12">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Leaks</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">24h</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Deployment</div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-[#0f172a] p-8">
                  {/* Decorative UI Mockup */}
                  <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">vault_secure_terminal v2.4</div>
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex gap-4">
                      <span className="text-green-500 min-w-[80px]">[14:02:11]</span>
                      <span className="text-blue-400">@command_hq:</span>
                      <span className="text-slate-300">Initiating handshake with Field_Unit_Alpha.</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-green-500 min-w-[80px]">[14:02:12]</span>
                      <span className="text-slate-500">System:</span>
                      <span className="text-green-400">Double Ratchet Key Exchange Verified. Channel Secure.</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-green-500 min-w-[80px]">[14:02:45]</span>
                      <span className="text-yellow-400">@field_alpha:</span>
                      <span className="text-slate-300">Asset acquired. Uplink encrypted. Transmitting package...</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-green-500 min-w-[80px]">[14:02:50]</span>
                      <span className="text-slate-500">System:</span>
                      <span className="text-slate-400">Transfer complete. Ephemeral key rotated. Trace deleted.</span>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <div className="px-3 py-1 bg-green-900/20 border border-green-500/30 text-green-400 text-xs rounded uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section (Simplified) */}
        <section className="py-24 bg-[#0f172a]">
          {/* Reusing the table structure from before but with simplified styles */}
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center text-slate-100">Capability Comparison</h2>
            <div className="overflow-x-auto border border-slate-700 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="py-4 px-6 text-slate-300 font-medium border-b border-slate-700">Feature</th>
                    <th className="py-4 px-6 text-white font-bold bg-blue-900/20 border-b border-blue-900/30">VAULT Enterprise</th>
                    <th className="py-4 px-6 text-slate-500 border-b border-slate-700">Consumer (Signal)</th>
                    <th className="py-4 px-6 text-slate-500 border-b border-slate-700">Workplace (Slack)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-[#0f172a]">
                  <tr>
                    <td className="py-4 px-6 text-slate-300">Deployment</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/5">On-Prem / Air-Gapped</td>
                    <td className="py-4 px-6 text-slate-500">Cloud Only</td>
                    <td className="py-4 px-6 text-slate-500">Cloud Only</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-slate-300">Data Sovereignty</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/5">100% Owned</td>
                    <td className="py-4 px-6 text-slate-500">US Jurisdiction</td>
                    <td className="py-4 px-6 text-slate-500">US Jurisdiction</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-slate-300">Metadata</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/5">Sealed Sender</td>
                    <td className="py-4 px-6 text-slate-500">Sealed Sender</td>
                    <td className="py-4 px-6 text-slate-500">Stored</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      {/* Footer - Enterprise */}
      <footer className="bg-[#020617] border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-bold text-white mb-4 block flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                VAULT
              </Link>
              <p className="text-slate-500 max-w-sm mb-6">
                The standard for high-assurance secure messaging. Protecting the world's most critical communications.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Solutions</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/features" className="hover:text-blue-400">Capabilities</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400">Licensing</Link></li>
                <li><Link href="/security" className="hover:text-blue-400">Security Architecture</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Government</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/contact-sales" className="hover:text-blue-400">Federal Sales</Link></li>
                <li><Link href="/download" className="hover:text-blue-400">Deployment Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Developers</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/demo" className="hover:text-blue-400">Live Demo</Link></li>
                <li><Link href="#" className="hover:text-blue-400">API Documentation</Link></li>
                <li><Link href="/bounty" className="hover:text-blue-400">Bug Bounty</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm">
              © 2024 FortiComm Inc. dba VAULT. All rights reserved. Made in USA.
            </p>
            <div className="flex gap-8 text-sm text-slate-500 mt-4 md:mt-0">
              <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
