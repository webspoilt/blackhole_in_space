"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";

export default function DemoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 border-b border-blue-500/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-slate-200">
                            <span className="font-semibold text-blue-400">Beta Preview:</span>{" "}
                            VAULT is in active development.{" "}
                            <a
                                href="https://github.com/webspoilt/vault"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-400 transition-colors"
                            >
                                View source on GitHub
                            </a>
                            . Contact us at{" "}
                            <a
                                href="mailto:contact@vault.in"
                                className="underline hover:text-blue-400 transition-colors"
                            >
                                contact@vault.in
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
