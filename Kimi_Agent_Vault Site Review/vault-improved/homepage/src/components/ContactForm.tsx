"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  organization: string;
  role: string;
  sector: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    organization: "",
    role: "",
    sector: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, always succeed
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-vault-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-vault-success" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Message Sent!
        </h3>
        <p className="text-slate-400 mb-6">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: "",
              email: "",
              organization: "",
              role: "",
              sector: "",
              message: "",
            });
          }}
          className="text-vault-blue-light hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Full Name <span className="text-vault-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white placeholder-slate-500 focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Work Email <span className="text-vault-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white placeholder-slate-500 focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
            Organization <span className="text-vault-error">*</span>
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            required
            value={formData.organization}
            onChange={handleChange}
            placeholder="Acme Inc."
            className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white placeholder-slate-500 focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="CTO, Security Lead, etc."
            className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white placeholder-slate-500 focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sector" className="block text-sm font-medium text-slate-300 mb-2">
          Sector
        </label>
        <select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors appearance-none cursor-pointer"
        >
          <option value="">Select a sector</option>
          <option value="government">Government / Public Sector</option>
          <option value="defense">Defense / Intelligence</option>
          <option value="enterprise">Enterprise (500+ employees)</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Financial Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
          Message <span className="text-vault-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your requirements, timeline, or questions..."
          className="w-full px-4 py-3 rounded-lg bg-vault-navy border border-slate-700 text-white placeholder-slate-500 focus:border-vault-blue focus:ring-1 focus:ring-vault-blue transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-vault-error/10 border border-vault-error/20">
          <p className="text-sm text-vault-error">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-vault-navy bg-white hover:bg-slate-100 px-6 py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        By submitting this form, you agree to our{" "}
        <a href="/privacy" className="text-vault-blue-light hover:text-white transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}