'use client'

import { useState } from 'react'
import { Download, Monitor, Shield, Server, FileText, Terminal, HardDrive } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState('deployment')

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-800/50 bg-blue-900/20 mb-8">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium tracking-wide text-blue-400 uppercase">Employment Integration</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Deployment Center
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Access installation packages, admin guides, and compliance documentation for your environment.
            </p>
          </div>
        </section>

        {/* Requirements & Downloads */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Column 1: Installers */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Download className="w-6 h-6 text-blue-500" /> Administrative Installers
                </h3>

                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      <div>
                        <div className="font-bold text-white">Windows MSI Package</div>
                        <div className="text-xs text-slate-400">v4.2.0 | x64 | 145MB</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-600">GPO Ready</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Signed MSI for mass deployment via Active Directory Group Policy.</p>
                  <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 flex items-center gap-1">Download .msi <Download className="w-3 h-3" /></button>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-8 h-8 text-slate-300 group-hover:text-amber-400 transition-colors" />
                      <div>
                        <div className="font-bold text-white">Linux Server Bundle</div>
                        <div className="text-xs text-slate-400">RHEL/CentOS 8+ | Docker | 420MB</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-600">Air-Gap Ready</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Container images and orchestration scripts for on-premise hosting.</p>
                  <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 flex items-center gap-1">Download .tar.gz <Download className="w-3 h-3" /></button>
                </div>
              </div>

              {/* Column 2: Documentation & Requirements */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-500" /> Admin Resources
                </h3>

                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2"><HardDrive className="w-4 h-4 text-slate-400" /> System Requirements</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span>Client OS</span>
                      <span className="text-slate-200">Windows 10 Enterprise LTSC (1809+)</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span>Server OS</span>
                      <span className="text-slate-200">RHEL 8.4+, Ubuntu 20.04 LTS</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-700/50 pb-2">
                      <span>RAM (Server)</span>
                      <span className="text-slate-200">16GB ECC Minimum</span>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span>Network</span>
                      <span className="text-slate-200">TLS 1.3 Outbound (Port 443)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-4">Guides</h4>
                  <ul className="space-y-3">
                    <li><Link href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"><FileText className="w-4 h-4" /> Deployment Architecture Whitepaper (PDF)</Link></li>
                    <li><Link href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"><FileText className="w-4 h-4" /> Hardening Guide - CIS Benchmark (PDF)</Link></li>
                    <li><Link href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"><FileText className="w-4 h-4" /> Firewall & Proxy Configuration (Wiki)</Link></li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-[#020617] py-8 text-center text-sm text-slate-500">
        <p>© 2024 VAULT Enterprise. Authorized Personnel Only.</p>
      </footer>
    </div>
  )
}
