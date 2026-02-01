'use client'

import { useState } from 'react'
import { Shield, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-800/60 backdrop-blur-md bg-[#0f172a]/90">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    VAULT <span className="text-xs font-normal text-slate-400 ml-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">ENTERPRISE</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/features"
                        className={`text-sm font-medium transition-colors ${isActive('/features') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Solutions
                    </Link>
                    <Link
                        href="/security"
                        className={`text-sm font-medium transition-colors ${isActive('/security') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Security & Compliance
                    </Link>
                    <Link
                        href="/download"
                        className={`text-sm font-medium transition-colors ${isActive('/download') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                        Downloads
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/contact-sales"
                        className="hidden md:flex text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                        Contact Sales
                    </Link>
                    <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0f172a] border-t border-slate-800 px-6 py-4 space-y-4">
                    <Link href="/features" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Solutions</Link>
                    <Link href="/security" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Security & Compliance</Link>
                    <Link href="/download" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Downloads</Link>
                    <Link href="/contact-sales" className="block text-blue-400 font-semibold py-2" onClick={() => setIsMenuOpen(false)}>Contact Sales</Link>
                </div>
            )}
        </nav>
    )
}
