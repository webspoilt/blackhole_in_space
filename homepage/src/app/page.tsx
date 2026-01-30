'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Lock, Globe, Zap, Server, Code, Check, Download, ArrowRight, Star, ChevronRight, Building, Activity, FileText } from 'lucide-react'
import Link from 'next/link'

// Optimization: Pause animation when off-screen
function BlackHoleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false }) // Optimization
    if (!ctx) return

    const particles: Array<{ x: number, y: number, vx: number, vy: number, size: number, opacity: number }> = []
    const particleCount = 100 // Reduced count for performance
    let animationFrame: number

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = 100 + Math.random() * 300
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4
      })
    }

    const animate = () => {
      // Clear with background color instead of clearRect for trail effect
      ctx.fillStyle = '#0a0f1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        const dx = centerX - particle.x
        const dy = centerY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = Math.max(50, 300 - distance) * 0.001
        const angle = Math.atan2(dy, dx)

        particle.vx += Math.cos(angle) * force
        particle.vy += Math.sin(angle) * force
        particle.x += particle.vx
        particle.y += particle.vy

        if (distance < 20) {
          particle.opacity -= 0.02
          particle.size *= 0.99
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isVisible])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080} // Fixed size for consistency
        className="w-full h-full opacity-60"
      />
    </div>
  )
}

function TrustBadge({ name, status }: { name: string, status: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-12 flex items-center justify-center mb-2 px-4 py-2 border border-white/10 rounded bg-white/5 w-full min-w-[140px]">
        <span className="font-bold text-gray-300">{name}</span>
      </div>
      <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">{status}</span>
    </div>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-[#0a0f1a] text-gray-100 selection:bg-blue-500/30">

      {/* Navigation - B2B Structure */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-[#0a0f1a]/90">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            VOID <span className="text-xs font-normal text-gray-400 ml-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">ENTERPRISE</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="group relative">
              <button className="text-sm font-medium text-gray-300 hover:text-white py-2">Solutions</button>
              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-[#111827] border border-white/10 rounded-lg p-2 shadow-xl">
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded">Government</Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded">Enterprise</Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded">Healthcare</Link>
                </div>
              </div>
            </div>
            <Link href="/features" className="text-sm font-medium text-gray-300 hover:text-white">Product</Link>
            <Link href="/security" className="text-sm font-medium text-gray-300 hover:text-white">Security</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/contact-sales" className="hidden md:flex text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20">
              Contact Sales
            </Link>
            <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              Menu
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {/* Hero Section - B2G Focused */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <BlackHoleParticles />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/50 to-[#0a0f1a] z-0" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide text-blue-200">FEDERAL & DEFENSE READY</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
              Sovereign Data. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Absolute Control.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Military-grade secure messaging deployable on your infrastructure.
              Encryption keys belong to you, not us. Designed for <span className="text-white font-medium">FOIA Compliance</span> and <span className="text-white font-medium">Data Sovereignty</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
              <Link href="/contact-sales" className="px-8 py-4 bg-white text-[#0a0f1a] font-bold text-lg rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5">
                Request Enterprise Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-white/20 text-white font-semibold text-lg rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                View Pricing Logic
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="border-t border-white/10 pt-16">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Trusted Compliance Frameworks</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80">
                <TrustBadge name="FedRAMP High" status="In Progress" />
                <TrustBadge name="SOC 2 Type II" status="Certified" />
                <TrustBadge name="FIPS 140-2" status="Validated" />
                <TrustBadge name="ISO 27001" status="Certified" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Enterprise SLAs */}
        <section className="py-24 bg-[#0d121f] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Uptime SLA", value: "99.999%", desc: "Financially backed guarantee" },
                { label: "Deployment", value: "Air-Gapped", desc: "Or GovCloud (US-East/West)" },
                { label: "Security", value: "Zero Trust", desc: "No unauthorized traces" },
                { label: "Compliance", value: "100%", desc: "Audit-ready logs & archiving" }
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Mission-Critical Solutions</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Tailored security architectures for regulated industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Government */}
              <div className="bg-[#111827] rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all group">
                <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Building className="w-7 h-7 text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Government & Defense</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-blue-500" /> CMMC Level 3 Ready</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-blue-500" /> ITAR/EAR Compliant</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-blue-500" /> On-Premise / Tac-Mobile</li>
                </ul>
                <Link href="/contact-sales" className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-[#111827] rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all group">
                <div className="w-14 h-14 bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <Shield className="w-7 h-7 text-indigo-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Global Enterprise</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-indigo-500" /> Data Residency Controls</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-indigo-500" /> SSO / SAML / SCIM</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-indigo-500" /> Legal Hold & eDiscovery</li>
                </ul>
                <Link href="/contact-sales" className="text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Healthcare */}
              <div className="bg-[#111827] rounded-2xl p-8 border border-white/10 hover:border-emerald-500/50 transition-all group">
                <div className="w-14 h-14 bg-emerald-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                  <Activity className="w-7 h-7 text-emerald-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Healthcare</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-emerald-500" /> HIPAA Compliant</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-emerald-500" /> BAA Available</li>
                  <li className="flex gap-3 text-gray-300 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Secure PHI Transmission</li>
                </ul>
                <Link href="/contact-sales" className="text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-[#0d121f]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Protocol Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-6 text-gray-400 font-medium">Feature</th>
                    <th className="py-4 px-6 text-white font-bold bg-blue-900/20 rounded-t-lg">VOID Enterprise</th>
                    <th className="py-4 px-6 text-gray-500">Signal</th>
                    <th className="py-4 px-6 text-gray-500">Slack Ent.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-6 text-gray-300">FedRAMP Authorization</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/10">In Progress</td>
                    <td className="py-4 px-6 text-gray-500">No</td>
                    <td className="py-4 px-6 text-gray-500">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-300">Self-Hosted / Air-Gapped</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/10">Yes</td>
                    <td className="py-4 px-6 text-gray-500">No</td>
                    <td className="py-4 px-6 text-gray-500">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-300">Zero Trust Architecture</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/10">Yes</td>
                    <td className="py-4 px-6 text-gray-500">Yes</td>
                    <td className="py-4 px-6 text-gray-500">No</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-300">Metadata Protection</td>
                    <td className="py-4 px-6 text-blue-400 font-bold bg-blue-900/10">Sealed Sender</td>
                    <td className="py-4 px-6 text-gray-500">Sealed Sender</td>
                    <td className="py-4 px-6 text-gray-500">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Enterprise */}
      <footer className="bg-[#05080f] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-bold text-white mb-4 block">VOID</Link>
              <p className="text-gray-500 max-w-sm mb-6">
                The standard for high-assurance secure messaging. Protecting the world's most critical communications.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded bg-white/5" />
                <div className="w-8 h-8 rounded bg-white/5" />
                <div className="w-8 h-8 rounded bg-white/5" />
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-blue-400">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-blue-400">Security Architecture</Link></li>
                <li><Link href="/roadmap" className="hover:text-blue-400">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                <li><Link href="/contact-sales" className="hover:text-blue-400">Contact Sales</Link></li>
                <li><Link href="/careers" className="hover:text-blue-400">Careers</Link></li>
                <li><Link href="/brand" className="hover:text-blue-400">Brand Assets</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-blue-400">Documentation</Link></li>
                <li><Link href="#" className="hover:text-blue-400">API Reference</Link></li>
                <li><Link href="/bounty" className="hover:text-blue-400">Bug Bounty</Link></li>
                <li><Link href="/legal/transparency" className="hover:text-blue-400 py-1 px-2 rounded bg-white/5 inline-block">Transparency Report</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-transparent">
            <p className="text-gray-600 text-sm">
              © 2024 FortiComm Inc. dba VOID. All rights reserved. <br className="md:hidden" />
              <span className="opacity-50">Made in USA.</span>
            </p>
            <div className="flex gap-8 text-sm text-gray-500 mt-4 md:mt-0">
              <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/legal/sla" className="hover:text-white">SLA</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
