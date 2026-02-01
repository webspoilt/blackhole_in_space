import type { Metadata } from "next";
import { Shield, Lock, FileCheck, Server, Key, Eye, Code, Fingerprint } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description: "Learn about VAULT's security architecture, encryption standards, and compliance roadmap.",
};

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All messages are encrypted using industry-standard algorithms. Only the intended recipient can decrypt and read messages.",
    },
    {
      icon: Server,
      title: "Zero-Knowledge Architecture",
      description: "We cannot access your messages or encryption keys. Your data remains under your control at all times.",
    },
    {
      icon: Key,
      title: "Secure Key Management",
      description: "Encryption keys are generated and stored on user devices. Optional hardware key integration for enhanced security.",
    },
    {
      icon: Eye,
      title: "Transparent Operations",
      description: "Our core protocol is open source. Security researchers can audit our code and verify our claims.",
    },
  ];

  const complianceItems = [
    {
      standard: "SOC 2 Type II",
      status: "In Progress",
      description: "Service Organization Control 2 certification for security, availability, and confidentiality.",
    },
    {
      standard: "FedRAMP",
      status: "Roadmap",
      description: "Federal Risk and Authorization Management Program for government cloud services.",
    },
    {
      standard: "ISO 27001",
      status: "In Progress",
      description: "International standard for information security management systems.",
    },
    {
      standard: "FIPS 140-2",
      status: "Compatible",
      description: "Federal Information Processing Standards for cryptographic modules.",
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blue/10 border border-vault-blue/20 mb-6">
              <Shield className="w-4 h-4 text-vault-blue-light" />
              <span className="text-sm font-medium text-vault-blue-light">Security First</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Built with Security at
              <span className="text-gradient"> Its Core</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Security isn't a feature—it's the foundation. Every design decision 
              prioritizes the protection of your data and communications.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Security Architecture
            </h2>
            <p className="text-slate-400">
              Multi-layered security designed to protect your communications at every level.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-vault-blue/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-vault-blue-light" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
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

      {/* Compliance */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Compliance Roadmap
            </h2>
            <p className="text-slate-400">
              We're actively working toward industry certifications to meet your regulatory requirements.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {complianceItems.map((item) => (
              <div
                key={item.standard}
                className="p-6 rounded-2xl bg-vault-card/50 border border-slate-800/60"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{item.standard}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Compatible"
                      ? "bg-vault-success/10 text-vault-success"
                      : item.status === "In Progress"
                      ? "bg-vault-warning/10 text-vault-warning"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-vault-blue/10 border border-vault-blue/20 text-center">
            <p className="text-slate-300">
              Want to learn more about our compliance roadmap?{" "}
              <a href="/contact-sales" className="text-vault-blue-light hover:text-white transition-colors">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-vault-blue/10 flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-vault-blue-light" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Open Source Transparency
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                We believe security through obscurity is not security at all. Our core 
                messaging protocol is open source, allowing independent security researchers 
                to audit our code and verify our claims.
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                This transparency builds trust and ensures that our security measures 
                stand up to scrutiny from the global security community.
              </p>
              <a
                href="https://github.com/webspoilt/vault"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-vault-blue-light hover:text-white font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-vault-blue/20 to-vault-cyan/20 rounded-2xl blur-2xl" />
              <div className="relative bg-vault-navy border border-slate-800 rounded-2xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-slate-500 ml-2">security-audit.log</span>
                </div>
                <div className="space-y-2 text-slate-400">
                  <p>
                    <span className="text-vault-cyan">[2026-02-02 14:32:11]</span>{" "}
                    <span className="text-vault-success">AUDIT:</span>{" "}
                    Cryptographic library initialized
                  </p>
                  <p>
                    <span className="text-vault-cyan">[2026-02-02 14:32:12]</span>{" "}
                    <span className="text-vault-success">AUDIT:</span>{" "}
                    Key exchange protocol verified
                  </p>
                  <p>
                    <span className="text-vault-cyan">[2026-02-02 14:32:15]</span>{" "}
                    <span className="text-vault-success">AUDIT:</span>{" "}
                    Message encryption: AES-256-GCM
                  </p>
                  <p>
                    <span className="text-vault-cyan">[2026-02-02 14:32:18]</span>{" "}
                    <span className="text-vault-success">AUDIT:</span>{" "}
                    Forward secrecy: Enabled
                  </p>
                  <p className="text-vault-success mt-4">✓ All security checks passed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vault-blue/20 via-vault-card to-vault-card border border-slate-800/60 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vault-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Have Security Questions?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Our security team is happy to discuss our architecture, answer questions, 
                or provide additional documentation.
              </p>
              <a
                href="/contact-sales"
                className="inline-flex items-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Contact Security Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}