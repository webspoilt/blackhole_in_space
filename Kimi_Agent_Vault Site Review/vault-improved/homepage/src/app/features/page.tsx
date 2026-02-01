import type { Metadata } from "next";
import { Shield, Lock, Server, FileCheck, Users, Zap, Globe, Eye, Key, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Explore VAULT's comprehensive suite of secure messaging features designed for government and enterprise compliance.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Messages are encrypted on your device and can only be decrypted by the intended recipient. No one else can read them—not even us.",
      category: "Security",
    },
    {
      icon: Server,
      title: "Sovereign Deployment",
      description: "Deploy on-premise, in your private cloud, or air-gapped environments. You maintain complete control over your data and infrastructure.",
      category: "Deployment",
    },
    {
      icon: FileCheck,
      title: "Comprehensive Audit Logs",
      description: "Tamper-evident logs for all user actions, message metadata, and administrative changes. Export to your SIEM for unified monitoring.",
      category: "Compliance",
    },
    {
      icon: Lock,
      title: "Zero-Trust Architecture",
      description: "Verify every request, every time. No implicit trust in any component. Multi-factor authentication and hardware key support.",
      category: "Security",
    },
    {
      icon: Users,
      title: "Role-Based Access Control",
      description: "Define precise permissions for users, administrators, and auditors. Enforce least-privilege principles across your organization.",
      category: "Administration",
    },
    {
      icon: Zap,
      title: "Low-Bandwidth Mode",
      description: "Optimized for challenging network conditions. Message queuing, compression, and offline support for field operations.",
      category: "Performance",
    },
    {
      icon: Globe,
      title: "Data Residency Controls",
      description: "Pin data to specific geographic regions or servers to meet GDPR, CCPA, and federal data residency requirements.",
      category: "Compliance",
    },
    {
      icon: Eye,
      title: "Message Retention Policies",
      description: "Configurable retention periods with automatic deletion. Meet FOIA, legal hold, and regulatory requirements.",
      category: "Compliance",
    },
    {
      icon: Key,
      title: "Hardware Key Support",
      description: "Native support for YubiKey, CAC, and PIV cards. Enforce hardware-backed authentication for enhanced security.",
      category: "Security",
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Dashboard for server health, message throughput, and connection status. Integrate with Prometheus and Grafana.",
      category: "Administration",
    },
  ];

  const categories = ["All", "Security", "Compliance", "Deployment", "Administration", "Performance"];

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blue/10 border border-vault-blue/20 mb-6">
              <Shield className="w-4 h-4 text-vault-blue-light" />
              <span className="text-sm font-medium text-vault-blue-light">Platform Capabilities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Built for Secure
              <span className="text-gradient"> Operations</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              A comprehensive suite of features designed to meet the rigorous standards 
              of government and regulated enterprise sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category Filter (Visual Only) */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-vault-blue text-white"
                    : "bg-vault-card text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 hover:bg-vault-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-vault-blue/10 flex items-center justify-center mb-5 group-hover:bg-vault-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-vault-blue-light" />
                </div>
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400 mb-3">
                  {feature.category}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Compliance-First Design
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Every feature in VAULT is designed with compliance in mind. We're actively 
              working toward industry certifications to meet your regulatory requirements.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "SOC 2", status: "In Progress" },
                { name: "FedRAMP", status: "Roadmap" },
                { name: "ISO 27001", status: "In Progress" },
                { name: "FIPS 140-2", status: "Compatible" },
              ].map((cert) => (
                <div
                  key={cert.name}
                  className="p-4 rounded-xl bg-vault-card border border-slate-800/60"
                >
                  <p className="font-semibold text-white mb-1">{cert.name}</p>
                  <p className="text-xs text-vault-blue-light">{cert.status}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Contact us for our detailed compliance roadmap and timeline.
            </p>
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
                See VAULT in Action
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Schedule a personalized demo to see how VAULT can meet your organization's needs.
              </p>
              <a
                href="/contact-sales"
                className="inline-flex items-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}