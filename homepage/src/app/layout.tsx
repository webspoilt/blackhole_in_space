import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'VAULT - Secure Messaging for Government & Enterprise',
    template: '%s | VAULT',
  },
  description: 'Secure messaging platform designed for government agencies and enterprises. End-to-end encryption, compliance-first architecture, sovereign deployment. Made in India.',
  keywords: ["secure messaging", "government communications", "enterprise security", "end-to-end encryption", "on-premise", "zero trust", "India"],
  authors: [{ name: "VAULT Technologies" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/vault-icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VAULT",
  },
  openGraph: {
    title: 'VAULT - Secure Messaging for Government & Enterprise',
    description: 'End-to-end encrypted messaging platform designed for compliance. Made in India.',
    url: 'https://vault.in',
    siteName: 'VAULT',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VAULT - Secure Messaging Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAULT - Secure Messaging',
    description: 'Government-grade secure messaging. Made in India.',
    images: ['/og-image.png'],
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${inter.variable} antialiased bg-[#0f172a] text-slate-100 font-sans`}
      >
        <DemoBanner />
        <Navbar />
        <main className="pt-10">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

