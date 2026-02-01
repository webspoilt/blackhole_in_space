import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how VAULT handles your data and protects your privacy.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#0a0f1a]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="py-12 sm:py-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Last updated: February 2, 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-slate max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            VAULT Technologies (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your
                            information when you visit our website or use our services.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Please read this Privacy Policy carefully. By accessing or using our services,
                            you acknowledge that you have read, understood, and agree to be bound by this
                            Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>

                        <h3 className="text-xl font-medium text-white mb-3">Personal Information</h3>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            We may collect personal information that you voluntarily provide to us, including:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>Name and contact information (email address, phone number)</li>
                            <li>Organization and job title</li>
                            <li>Information you provide in contact forms or surveys</li>
                            <li>Communication preferences</li>
                        </ul>

                        <h3 className="text-xl font-medium text-white mb-3">Automatically Collected Information</h3>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            When you visit our website, we may automatically collect certain information, including:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on our site</li>
                            <li>Referring website or search terms</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            We use the information we collect for various purposes, including:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>Providing and maintaining our services</li>
                            <li>Responding to your inquiries and support requests</li>
                            <li>Sending you updates, marketing communications, and promotional materials</li>
                            <li>Improving our website and services</li>
                            <li>Analyzing usage patterns and trends</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            We implement appropriate technical and organizational measures to protect your
                            personal information against unauthorized access, alteration, disclosure, or
                            destruction. However, no method of transmission over the internet or electronic
                            storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal
                            information, including:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                            <li>The right to access your personal information</li>
                            <li>The right to correct inaccurate information</li>
                            <li>The right to request deletion of your information</li>
                            <li>The right to restrict or object to processing</li>
                            <li>The right to data portability</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-slate-400">
                            Email:{" "}
                            <a
                                href="mailto:privacy@vault.in"
                                className="text-blue-400 hover:text-white transition-colors"
                            >
                                privacy@vault.in
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
