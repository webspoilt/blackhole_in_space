"use client";

import Link from "next/link";
import { ArrowRight, Shield, Lock, Server, FileCheck, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-vault-blue/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-vault-blue/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vault-blue/10 border border-vault-blue/20 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-vault-success animate-pulse" />
              <span className="text-sm font-medium text-vault-blue-light">
                Now in Beta — Request Early Access
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
              <span className="text-white">Secure Messaging for</span>
              <br />
              <span className="text-gradient">Mission-Critical Teams</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              VAULT is a secure messaging platform built for organizations that prioritize 
              data sovereignty, compliance, and control. Designed with security-first architecture 
              for government and enterprise use.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact-sales"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Request Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-vault-card hover:bg-vault-card-hover border border-slate-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Frameworks */}
      <section className="py-12 sm:py-16 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-slate-500 uppercase tracking-wider mb-8">
            Built with Compliance in Mind
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "FedRAMP", status: "Aligned", description: "Federal requirements" },
              { name: "SOC 2", status: "Ready", description: "Type II prepared" },
              { name: "FIPS 140-2", status: "Compatible", description: "Cryptographic modules" },
              { name: "ISO 27001", status: "Aligned", description: "Security management" },
            ].map((item) => (
              <div
                key={item.name}
                className="text-center p-4 sm:p-6 rounded-xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.name}</h3>
                <p className="text-sm font-medium text-vault-blue-light mb-1">{item.status}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">
            * Compliance certifications in progress. Contact us for our compliance roadmap.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for Secure Operations
            </h2>
            <p className="text-lg text-slate-400">
              Every feature designed with security, compliance, and control at its core.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "End-to-End Encryption",
                description: "Messages encrypted from sender to recipient. No one else can read them—not even us.",
              },
              {
                icon: Server,
                title: "Sovereign Deployment",
                description: "Deploy on-premise, in your cloud, or air-gapped. You control your data and keys.",
              },
              {
                icon: FileCheck,
                title: "Comprehensive Audit Logs",
                description: "Tamper-evident logs for all actions. Export to your SIEM for analysis.",
              },
              {
                icon: Lock,
                title: "Zero-Trust Architecture",
                description: "Verify every request, every time. No implicit trust in any component.",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Granular permissions for users, admins, and auditors. Enforce least privilege.",
              },
              {
                icon: Zap,
                title: "Low-Bandwidth Mode",
                description: "Optimized for challenging network conditions. Works where others fail.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 sm:p-8 rounded-2xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 hover:bg-vault-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-vault-blue/10 flex items-center justify-center mb-5 group-hover:bg-vault-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-vault-blue-light" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Preview */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-success/10 border border-vault-success/20 mb-6">
                <span className="text-xs font-medium text-vault-success">Case Study</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Securing Cross-Agency Collaboration
              </h2>
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Learn how a joint task force replaced consumer messaging apps with a 
                secure, compliant communication platform—deployed in under 48 hours.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-vault-blue-light">0</p>
                  <p className="text-sm text-slate-500">Data Incidents</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-vault-blue-light">24h</p>
                  <p className="text-sm text-slate-500">Deployment</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-vault-blue-light">3</p>
                  <p className="text-sm text-slate-500">Agencies</p>
                </div>
              </div>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-vault-blue-light hover:text-white font-medium transition-colors"
              >
                Read the full story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-vault-blue/20 to-vault-cyan/20 rounded-2xl blur-2xl" />
              <div className="relative bg-vault-navy border border-slate-800 rounded-2xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-slate-500 ml-2">vault_secure_terminal v2.4</span>
                </div>
                <div className="space-y-2 text-slate-400">
                  <p>
                    <span className="text-vault-cyan">[14:02:11]</span>{" "}
                    <span className="text-vault-blue-light">@command_hq:</span>{" "}
                    Initiating handshake with Field_Unit_Alpha.
                  </p>
                  <p>
                    <span className="text-vault-cyan">[14:02:12]</span>{" "}
                    <span className="text-slate-500">System:</span>{" "}
                    <span className="text-vault-success">Double Ratchet Key Exchange Verified. Channel Secure.</span>
                  </p>
                  <p>
                    <span className="text-vault-cyan">[14:02:45]</span>{" "}
                    <span className="text-yellow-500">@field_alpha:</span>{" "}
                    Asset acquired. Uplink encrypted. Transmitting package...
                  </p>
                  <p>
                    <span className="text-vault-cyan">[14:02:50]</span>{" "}
                    <span className="text-slate-500">System:</span>{" "}
                    Transfer complete. Ephemeral key rotated. Trace deleted.
                  </p>
                  <p className="text-vault-success mt-4">● Encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vault-blue/20 via-vault-card to-vault-card border border-slate-800/60 p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vault-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Secure Your Communications?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Schedule a demo to see how VAULT can help your organization 
                achieve secure, compliant messaging.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact-sales"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Schedule Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/download"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-vault-card hover:bg-vault-card-hover border border-slate-700 px-8 py-4 rounded-lg transition-all"
                >
                  Download Whitepaper
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}