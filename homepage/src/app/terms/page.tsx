import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the Terms of Service for using VAULT's website and services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#0a0f1a]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="py-12 sm:py-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Last updated: February 2, 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-slate max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            By accessing or using the VAULT website and services (collectively, the &quot;Services&quot;),
                            you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
                            these Terms, you may not access or use the Services.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            These Terms constitute a legally binding agreement between you and VAULT Technologies
                            (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) regarding your use of the Services.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Description of Services</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            VAULT provides a secure messaging platform designed for government agencies and
                            enterprises. Our Services include:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>Secure messaging and communication tools</li>
                            <li>End-to-end encryption services</li>
                            <li>Compliance and audit logging features</li>
                            <li>Administrative and management tools</li>
                            <li>Documentation and support resources</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Beta Status Notice</h2>
                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
                            <p className="text-yellow-400 text-sm leading-relaxed">
                                <strong>Important:</strong> VAULT is currently in active development (Beta).
                                This website demonstrates our platform capabilities. Some features described
                                may be on our roadmap and not yet available for production use.
                            </p>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            By using this site, you acknowledge that:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>Some features may be in development</li>
                            <li>The platform is evolving based on user feedback</li>
                            <li>Enterprise features require contacting our sales team</li>
                            <li>We are transparent about our current capabilities</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            The Services and their original content, features, and functionality are owned by
                            VAULT Technologies and are protected by international copyright, trademark, patent,
                            trade secret, and other intellectual property laws.
                        </p>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Our open-source components are licensed under their respective licenses. Please
                            refer to our GitHub repository for specific licensing information.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer of Warranties</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF
                            ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
                            DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>Merchantability and fitness for a particular purpose</li>
                            <li>Non-infringement of third-party rights</li>
                            <li>Accuracy, reliability, or completeness of content</li>
                            <li>Security or freedom from viruses or malware</li>
                            <li>Uninterrupted or error-free operation</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of
                            India, without regard to its conflict of law provisions. Any disputes shall be
                            subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="text-slate-400">
                            Email:{" "}
                            <a
                                href="mailto:legal@vault.in"
                                className="text-blue-400 hover:text-white transition-colors"
                            >
                                legal@vault.in
                            </a>
                        </p>
                        <p className="text-slate-400 mt-2">
                            Address: Embassy Tech Village, Block B, Bengaluru 560103, Karnataka, India
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
