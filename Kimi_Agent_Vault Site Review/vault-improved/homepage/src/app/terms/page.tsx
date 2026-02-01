import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for using VAULT's website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-8 pb-16">
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
              By accessing or using the VAULT website and services (collectively, the "Services"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to 
              these Terms, you may not access or use the Services.
            </p>
            <p className="text-slate-400 leading-relaxed">
              These Terms constitute a legally binding agreement between you and VAULT Technologies 
              ("we", "our", or "us") regarding your use of the Services.
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
            <h2 className="text-2xl font-semibold text-white mb-4">Demo Site Disclaimer</h2>
            <div className="p-4 rounded-lg bg-vault-warning/10 border border-vault-warning/20 mb-6">
              <p className="text-vault-warning text-sm leading-relaxed">
                <strong>Important:</strong> This website is a demonstration of the VAULT platform. 
                It is provided for educational and evaluation purposes only. The Services described 
                herein may not be fully functional or available for production use.
              </p>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              By using this demo site, you acknowledge that:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
              <li>This is not a production service</li>
              <li>Data entered may not be permanently stored</li>
              <li>Features may be incomplete or non-functional</li>
              <li>No service level agreements (SLAs) apply</li>
              <li>The site may be modified or discontinued at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              To access certain features of the Services, you may need to create an account. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You agree not to use the Services to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful, threatening, or offensive content</li>
              <li>Attempt to gain unauthorized access to any systems</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Engage in any activity that could harm our reputation</li>
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
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF 
              ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE 
              DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
              <li>Merchantability and fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Accuracy, reliability, or completeness of content</li>
              <li>Security or freedom from viruses or malware</li>
              <li> uninterrupted or error-free operation</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, VAULT TECHNOLOGIES SHALL NOT BE LIABLE 
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
              OUT OF OR RELATING TO YOUR USE OF THE SERVICES.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Indemnification</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You agree to indemnify and hold harmless VAULT Technologies and its officers, 
              directors, employees, and agents from any claims, damages, losses, liabilities, 
              costs, or expenses arising out of or relating to your use of the Services or 
              violation of these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of 
              the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. We will notify 
              you of any changes by posting the new Terms on this page and updating the "Last 
              updated" date. Your continued use of the Services after any changes constitutes 
              acceptance of the new Terms.
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
                href="mailto:legal@vault-demo.dev"
                className="text-vault-blue-light hover:text-white transition-colors"
              >
                legal@vault-demo.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}