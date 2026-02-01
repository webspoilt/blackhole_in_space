import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Code, Users, Globe, Target, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about VAULT Technologies, our mission, and the team behind the secure messaging platform.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We believe security should never be an afterthought. Every decision we make prioritizes the safety of your data.",
    },
    {
      icon: Code,
      title: "Transparency",
      description: "Our core protocol is open source. We believe trust is earned through transparency, not marketing claims.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Security shouldn't come at the cost of usability. We build tools that people actually want to use.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We're building for organizations worldwide who need secure communication without compromise.",
    },
    {
      icon: Target,
      title: "Precision",
      description: "Every feature is carefully considered. We focus on doing fewer things exceptionally well.",
    },
    {
      icon: Heart,
      title: "Commitment",
      description: "We're in this for the long haul. Your trust is our most valuable asset.",
    },
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Former NSA security engineer with 15+ years in cryptographic systems.",
      initials: "AC",
    },
    {
      name: "Sarah Martinez",
      role: "Chief Technology Officer",
      bio: "Ex-Google security lead. PhD in distributed systems from MIT.",
      initials: "SM",
    },
    {
      name: "James Wilson",
      role: "Head of Engineering",
      bio: "Built messaging systems at Signal. Expert in end-to-end encryption.",
      initials: "JW",
    },
    {
      name: "Priya Patel",
      role: "Compliance Director",
      bio: "Former FedRAMP assessor. Deep expertise in government compliance.",
      initials: "PP",
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Building the Future of
              <span className="text-gradient"> Secure Communication</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              VAULT Technologies was founded with a simple mission: make secure, 
              compliant messaging accessible to every organization that needs it.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  In an era where data breaches make headlines weekly, we believe 
                  organizations deserve better. Better security. Better control. 
                  Better peace of mind.
                </p>
                <p>
                  VAULT was born from our founders' experiences working in government 
                  and enterprise security. We saw firsthand the challenges organizations 
                  face: consumer apps that don't meet compliance requirements, 
                  enterprise solutions that are clunky and expensive, and a general 
                  lack of transparency in how data is handled.
                </p>
                <p>
                  We're building the solution we wished existed—secure messaging 
                  that doesn't compromise on usability, compliance, or control.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-vault-blue/20 to-vault-cyan/20 rounded-2xl blur-2xl" />
              <div className="relative bg-vault-navy border border-slate-800 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-vault-blue-light mb-2">2023</p>
                    <p className="text-sm text-slate-500">Founded</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-vault-blue-light mb-2">25+</p>
                    <p className="text-sm text-slate-500">Team Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-vault-blue-light mb-2">12</p>
                    <p className="text-sm text-slate-500">Countries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-vault-blue-light mb-2">∞</p>
                    <p className="text-sm text-slate-500">Commitment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-400">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-xl bg-vault-card/50 border border-slate-800/60 hover:border-vault-blue/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-vault-blue/10 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-vault-blue-light" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-slate-400">
              Security experts, engineers, and compliance professionals dedicated to your privacy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center p-6 rounded-xl bg-vault-card/50 border border-slate-800/60"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vault-blue to-vault-cyan flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-vault-blue-light mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-slate-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500">
              Want to join our team?{" "}
              <a href="#" className="text-vault-blue-light hover:text-white transition-colors">
                View open positions
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vault-blue/20 via-vault-card to-vault-card border border-slate-800/60 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vault-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Open Source at Our Core
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                We believe in transparency. Our core messaging protocol is open source, 
                allowing for independent security audits and community contributions.
              </p>
              <a
                href="https://github.com/webspoilt/vault"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-vault-card hover:bg-vault-card-hover border border-slate-700 px-6 py-3 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}