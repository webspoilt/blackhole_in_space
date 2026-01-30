'use client'

import { Shield, Lock, FileKey, Server, Eye, CheckCircle, FileText, Database, Globe } from 'lucide-react'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a] text-gray-100 font-sans">



      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-6 bg-[#0a0f1a]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-900/10 mb-8">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium tracking-wide text-blue-400 uppercase">Zero Trust Architecture</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Zero Unauthorized Traces.
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              We assume the network is compromised. We assume the server is compromised.
              Our architecture guarantees confidentiality even in the most hostile environments.
            </p>
          </div>
        </section>

        {/* Core Principles */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#111827] border border-white/10 rounded-2xl">
              <FileKey className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Client-Side Sovereignty</h3>
              <p className="text-gray-400 leading-relaxed">
                Private keys are generated on-device and never leave. They are stored in the device's Secure Enclave (iOS) or Keystore (Android). We cannot decrypt your messages, even under subpoena.
              </p>
            </div>
            <div className="p-8 bg-[#111827] border border-white/10 rounded-2xl">
              <Eye className="w-12 h-12 text-red-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Minimize Data Retention</h3>
              <p className="text-gray-400 leading-relaxed">
                Messages are ephemeral by default. Once delivered, they are deleted from our relay servers. Metadata is stripped to the bare minimum required for routing (Sealed Sender).
              </p>
            </div>
            <div className="p-8 bg-[#111827] border border-white/10 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Verifiable Integrity</h3>
              <p className="text-gray-400 leading-relaxed">
                All client code is source-available for audit. Cryptographic primitives are standard, open implementations (Signal Protocol, MLS). No proprietary "black box" crypto.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="py-24 bg-[#0d121f] border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Cryptographic Standards</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-blue-400 font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Double Ratchet Algorithm</h3>
                      <p className="text-gray-400">Provides Perfect Forward Secrecy (PFS) and Post-Compromise Security (PCS). Session keys rotate with every single message.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-blue-400 font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">X3DH Key Agreement</h3>
                      <p className="text-gray-400">Extended Triple Diffie-Hellman ensures mutual authentication and deniability. Pre-keys allow asynchronous messaging secure from the start.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-blue-400 font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">AES-256-GCM</h3>
                      <p className="text-gray-400">Authenticated Encryption with Associated Data (AEAD) ensures both confidentiality and integrity of the ciphertext.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 font-mono text-sm leading-relaxed overflow-hidden">
                <div className="text-gray-500 mb-4 ml-4 md:ml-60">
                     // Security primitive validation
                  <br />
                     /* FIPS 140-2 Level 2 Compliant */

                </div>
                <div className="text-blue-400">module<span className="text-white"> vault_crypto </span>{`{`}</div>
                <div className="pl-4 text-purple-400">use <span className="text-white">x25519_dalek::StaticSecret;</span></div>
                <div className="pl-4 text-purple-400">use <span className="text-white">aes_gcm::Aes256Gcm;</span></div>
                <div className="pl-4 text-purple-400">use <span className="text-white">sha2::Sha512;</span></div>
                <br />
                <div className="pl-4">
                  <span className="text-yellow-500">pub fn</span> <span className="text-blue-300">verify_ratchet</span>( root_key: &[u8], chain_key: &[u8] ) -&gt; Result&lt;(), CryptoError&gt; {`{`}
                </div>
                <div className="pl-8 text-gray-400">// Implementation follows Signal spec</div>
                <div className="pl-8 text-white">let hkdf = Hkdf::&lt;Sha512&gt;::new(Some(salt), root_key);</div>
                <div className="pl-8 text-white">hkdf.expand(&amp;info, &amp;mut output)?;</div>
                <div className="pl-4 text-white">{'}'}</div>
                <div className="text-white">{'}'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Compliance Architecture</h2>
            <p className="text-gray-400">Built to meet the specific requirements of Federal and Defense agencies.</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#111827] border border-white/10 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-white mb-2">FedRAMP</div>
              <div className="text-green-400 text-sm font-semibold">Ready</div>
            </div>
            <div className="bg-[#111827] border border-white/10 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-white mb-2">FIPS 140-2</div>
              <div className="text-green-400 text-sm font-semibold">Validated</div>
            </div>
            <div className="bg-[#111827] border border-white/10 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-white mb-2">SOC 2</div>
              <div className="text-green-400 text-sm font-semibold">Type II</div>
            </div>
            <div className="bg-[#111827] border border-white/10 p-6 rounded-xl text-center">
              <div className="text-2xl font-bold text-white mb-2">HIPAA</div>
              <div className="text-green-400 text-sm font-semibold">Compliant</div>
            </div>
          </div>
        </section>

        {/* Vulnerability Disclosure & Safe Harbor */}
        <section className="py-24 bg-[#05080f] px-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Vulnerability Disclosure (Bug Bounty)</h2>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 mb-12">
              <h3 className="text-xl font-bold text-white mb-4">Safe Harbor Policy</h3>
              <p className="text-gray-400 mb-4">
                If you conduct security research and disclose vulnerabilities to us in accordance with this policy, we consider your research to be authorized, lawful, and exempt from Terms of Service restrictions. We will not initiate or support legal action against you.
              </p>
              <Link href="/bounty" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
                View Full Bounty Program Details & Submit Report →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Critical", reward: "$10k+", color: "text-red-400 border-red-500/30" },
                { label: "High", reward: "$5k", color: "text-orange-400 border-orange-500/30" },
                { label: "Medium", reward: "$1k", color: "text-yellow-400 border-yellow-500/30" },
                { label: "Low", reward: "$500", color: "text-blue-400 border-blue-500/30" },
              ].map((tier) => (
                <div key={tier.label} className={`p-4 rounded-xl border bg-[#111827]/50 ${tier.color} text-center`}>
                  <div className="font-bold mb-1">{tier.label}</div>
                  <div className="text-white font-mono">{tier.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-blue-900/10 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-white mb-8">Request the Security Whitepaper</h2>
            <Link href="/contact-sales" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              <FileText className="w-5 h-5" /> Download Technical Documentation
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#05080f] py-8 text-center text-sm text-gray-500">
        <p>© 2024 VAULT Enterprise. Zero Unauthorized Traces.</p>
      </footer>
    </div >
  )
}
