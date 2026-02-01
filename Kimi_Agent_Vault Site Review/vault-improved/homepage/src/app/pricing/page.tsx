import type { Metadata } from "next";
import { Check, HelpCircle, Building2, Users, Server } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Flexible licensing options for organizations of all sizes. Contact us for a custom quote.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "For small teams getting started with secure messaging",
      icon: Building2,
      price: "Custom",
      features: [
        "Up to 50 users",
        "Cloud deployment",
        "End-to-end encryption",
        "Basic audit logs",
        "Email support",
        "99.9% uptime SLA",
      ],
      cta: "Contact Sales",
      href: "/contact-sales",
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For growing organizations with compliance needs",
      icon: Users,
      price: "Custom",
      features: [
        "Up to 500 users",
        "Cloud or private deployment",
        "Advanced audit logging",
        "SSO integration",
        "Priority support",
        "99.95% uptime SLA",
        "API access",
      ],
      cta: "Contact Sales",
      href: "/contact-sales",
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced requirements",
      icon: Server,
      price: "Custom",
      features: [
        "Unlimited users",
        "On-premise or air-gapped",
        "Full source code access",
        "Custom integrations",
        "Dedicated support team",
        "99.99% uptime SLA",
        "Custom compliance support",
      ],
      cta: "Contact Sales",
      href: "/contact-sales",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "How is pricing determined?",
      answer: "Pricing is based on the number of users, deployment type (cloud vs. on-premise), and support level. Contact us for a custom quote tailored to your organization's needs.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 30-day trial for qualified organizations. Contact our sales team to get started.",
    },
    {
      question: "Can I switch plans later?",
      answer: "Absolutely. You can upgrade or downgrade your plan at any time as your needs change.",
    },
    {
      question: "What payment options are available?",
      answer: "We accept annual contracts with flexible payment terms. We also support government procurement vehicles.",
    },
    {
      question: "Is there a minimum commitment?",
      answer: "Our Starter and Professional plans require a 12-month commitment. Enterprise plans can be customized to your timeline.",
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="text-gradient"> Pricing</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Flexible licensing options designed for organizations of all sizes. 
              Contact us for a custom quote tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 sm:p-8 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-vault-blue/20 to-vault-card border-2 border-vault-blue/50"
                    : "bg-vault-card/50 border border-slate-800/60"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-vault-blue text-white text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.highlighted ? "bg-vault-blue/20" : "bg-slate-800"
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.highlighted ? "text-vault-blue-light" : "text-slate-400"
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400"> pricing</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-vault-blue-light" : "text-vault-success"
                      }`} />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-vault-blue hover:bg-vault-blue-light text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-vault-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Have more questions? Feel free to reach out.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-xl bg-vault-card/50 border border-slate-800/60"
              >
                <h3 className="text-white font-medium mb-2 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-vault-blue-light flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vault-blue/20 via-vault-card to-vault-card border border-slate-800/60 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vault-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                We work with organizations of all sizes to create tailored solutions 
                that meet their unique requirements.
              </p>
              <Link
                href="/contact-sales"
                className="inline-flex items-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}