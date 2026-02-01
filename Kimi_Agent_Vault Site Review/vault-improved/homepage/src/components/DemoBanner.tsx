"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-vault-blue/20 via-vault-cyan/20 to-vault-blue/20 border-b border-vault-blue/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-vault-blue-light flex-shrink-0" />
            <span className="text-slate-200">
              <span className="font-semibold text-vault-blue-light">Demo Site:</span>{" "}
              This is a demonstration of the VAULT platform.{" "}
              <a
                href="https://github.com/webspoilt/vault"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-vault-blue-light transition-colors"
              >
                View the source code on GitHub
              </a>
              . For inquiries, contact{" "}
              <a
                href="mailto:hello@vault-demo.dev"
                className="underline hover:text-vault-blue-light transition-colors"
              >
                hello@vault-demo.dev
              </a>
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}