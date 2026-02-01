"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/features", label: "Solutions" },
    { href: "/security", label: "Security & Compliance" },
    { href: "/download", label: "Downloads" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-10 w-full z-50 border-b border-slate-800/60 backdrop-blur-xl bg-vault-navy/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 sm:gap-3 group"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-105">
            <Image
              src="/favicon.svg"
              alt="VAULT Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden sm:inline">VAULT</span>
          <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-0 sm:ml-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
            BETA
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive(link.href)
                  ? "text-white"
                  : "text-slate-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/contact-sales"
            className="hidden sm:flex text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-4 sm:px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Contact Sales
          </Link>
          <Link
            href="/contact-sales"
            className="sm:hidden text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-3 py-2 rounded-lg transition-all"
          >
            Contact
          </Link>
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-vault-navy border-t border-slate-800 px-4 sm:px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 px-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-white bg-white/5"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}