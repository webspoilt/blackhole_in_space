import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Shield } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Sales",
  description: "Get in touch with the VAULT team to schedule a demo or learn more about our secure messaging platform.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blue/10 border border-vault-blue/20 mb-6">
              <Shield className="w-4 h-4 text-vault-blue-light" />
              <span className="text-sm font-medium text-vault-blue-light">
                Secure Communication
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-400">
              Have questions about VAULT? We'd love to hear from you. 
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Let's Start a Conversation
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Whether you're interested in a demo, have technical questions, or 
                want to learn more about our compliance roadmap, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vault-blue/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-vault-blue-light" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-slate-400 text-sm mb-1">
                      For general inquiries:
                    </p>
                    <a
                      href="mailto:hello@vault-demo.dev"
                      className="text-vault-blue-light hover:text-white transition-colors"
                    >
                      hello@vault-demo.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vault-blue/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-vault-blue-light" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Response Time</h3>
                    <p className="text-slate-400 text-sm">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vault-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-vault-blue-light" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Location</h3>
                    <p className="text-slate-400 text-sm">
                      Remote-first team with members across 12 countries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-8 p-4 rounded-lg bg-vault-warning/10 border border-vault-warning/20">
                <p className="text-sm text-vault-warning">
                  <strong>Note:</strong> This is a demonstration site. For production 
                  deployments, we recommend contacting us to discuss your specific 
                  requirements and compliance needs.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-vault-card/50 border border-slate-800/60 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Send us a Message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Can't find what you're looking for? Feel free to reach out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Is VAULT available for production use?",
                a: "VAULT is currently in beta. We're working with select partners for early access. Contact us to discuss your timeline.",
              },
              {
                q: "What compliance certifications are you pursuing?",
                a: "We're actively working toward SOC 2 Type II and FedRAMP authorization. Contact us for our detailed compliance roadmap.",
              },
              {
                q: "Can I self-host VAULT?",
                a: "Yes! Sovereign deployment is one of our core features. You can deploy on-premise or in your own cloud environment.",
              },
              {
                q: "Is the source code available?",
                a: "Our core protocol is open source and available on GitHub. Enterprise features are available under a commercial license.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-xl bg-vault-card/50 border border-slate-800/60"
              >
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}