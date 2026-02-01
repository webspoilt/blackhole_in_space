"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { label: "Solutions", href: "/features" },
            { label: "Security", href: "/security" },
            { label: "Downloads", href: "/download" },
            { label: "Pricing", href: "/pricing" },
        ],
        Company: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact-sales" },
            { label: "Careers", href: "#" },
        ],
        Resources: [
            { label: "Documentation", href: "#" },
            { label: "GitHub", href: "https://github.com/webspoilt/vault" },
            { label: "Issues", href: "https://github.com/webspoilt/vault/issues" },
        ],
        Legal: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    };

    return (
        <footer className="bg-[#0a0f1a] border-t border-slate-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/favicon.png"
                                    alt="VAULT Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">VAULT</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4 max-w-xs">
                            Secure messaging platform designed for government agencies and enterprises. Made in India 🇮🇳
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/webspoilt/vault"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@vault.in"
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 text-center sm:text-left">
                        © {currentYear} VAULT Technologies. Made with ❤️ in India.
                    </p>
                    <p className="text-sm text-slate-500">
                        Bengaluru, Karnataka 560103
                    </p>
                </div>
            </div>
        </footer>
    );
}
