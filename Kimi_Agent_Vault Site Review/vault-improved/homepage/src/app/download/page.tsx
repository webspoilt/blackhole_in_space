import type { Metadata } from "next";
import { Download, FileText, Book, Shield, Monitor, Server, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download VAULT documentation, whitepapers, and access our deployment guides.",
};

export default function DownloadPage() {
  const resources = [
    {
      title: "Security Whitepaper",
      description: "Detailed overview of VAULT's security architecture and encryption standards.",
      icon: Shield,
      size: "2.4 MB",
      format: "PDF",
      href: "#",
    },
    {
      title: "Deployment Guide",
      description: "Step-by-step instructions for deploying VAULT in your environment.",
      icon: Server,
      size: "4.1 MB",
      format: "PDF",
      href: "#",
    },
    {
      title: "API Documentation",
      description: "Complete reference for the VAULT API and integration options.",
      icon: FileText,
      size: "1.8 MB",
      format: "PDF",
      href: "#",
    },
    {
      title: "Compliance Overview",
      description: "Summary of compliance standards and our roadmap to certification.",
      icon: Book,
      size: "1.2 MB",
      format: "PDF",
      href: "#",
    },
  ];

  const requirements = [
    {
      category: "Client Requirements",
      items: [
        "Modern web browser (Chrome, Firefox, Safari, Edge)",
        "Windows 10/11, macOS 12+, or Linux",
        "4GB RAM minimum, 8GB recommended",
        "Stable internet connection",
      ],
    },
    {
      category: "Server Requirements",
      items: [
        "Ubuntu 20.04 LTS or RHEL 8.4+",
        "16GB RAM minimum, 32GB recommended",
        "100GB storage (SSD recommended)",
        "TLS 1.3 support",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blue/10 border border-vault-blue/20 mb-6">
              <Download className="w-4 h-4 text-vault-blue-light" />
              <span className="text-sm font-medium text-vault-blue-light">Resources</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Documentation &
              <span className="text-gradient"> Resources</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Download whitepapers, deployment guides, and technical documentation 
              to learn more about VAULT.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                className="group p-6 rounded-2xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 hover:bg-vault-card transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-vault-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-vault-blue/20 transition-colors">
                    <resource.icon className="w-6 h-6 text-vault-blue-light" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-vault-blue-light transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="px-2 py-1 rounded bg-slate-800">{resource.format}</span>
                      <span>{resource.size}</span>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-500 group-hover:text-vault-blue-light transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              System Requirements
            </h2>
            <p className="text-slate-400">
              Ensure your environment meets these requirements for optimal performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {requirements.map((req) => (
              <div
                key={req.category}
                className="p-6 rounded-2xl bg-vault-card/50 border border-slate-800/60"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-vault-blue-light" />
                  {req.category}
                </h3>
                <ul className="space-y-3">
                  {req.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-vault-success flex-shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Notice */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vault-warning/10 via-vault-card to-vault-card border border-vault-warning/30 p-8 sm:p-12">
            <div className="relative text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-vault-warning/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-vault-warning" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Currently in Beta
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                VAULT is currently in beta and available for early access. 
                Contact us to join our beta program and get early access to the platform.
              </p>
              <a
                href="/contact-sales"
                className="inline-flex items-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Request Beta Access
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}