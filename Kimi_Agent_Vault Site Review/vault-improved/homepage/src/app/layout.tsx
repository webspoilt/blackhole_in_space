import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import DemoBanner from "@/components/DemoBanner";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VAULT - Secure Messaging Platform for Government & Enterprise",
    template: "%s | VAULT",
  },
  description: "VAULT is a secure messaging platform designed for government agencies and enterprises. Built with compliance-first architecture, end-to-end encryption, and sovereign deployment options.",
  keywords: [
    "secure messaging",
    "government communications",
    "enterprise messaging",
    "compliance",
    "encryption",
    "on-premise deployment",
    "zero trust",
    "audit logging",
  ],
  authors: [{ name: "VAULT Technologies" }],
  creator: "VAULT Technologies",
  publisher: "VAULT Technologies",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { url: "/safari-pinned-tab.svg", rel: "mask-icon", color: "#3b82f6" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VAULT",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://b2g-vault.vercel.app",
    siteName: "VAULT",
    title: "VAULT - Secure Messaging Platform for Government & Enterprise",
    description: "Secure messaging platform designed for government agencies and enterprises with compliance-first architecture.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VAULT - Secure Messaging Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VAULT - Secure Messaging Platform for Government & Enterprise",
    description: "Secure messaging platform designed for government agencies and enterprises with compliance-first architecture.",
    images: ["/og-image.png"],
    creator: "@vaultsecure",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://b2g-vault.vercel.app",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-vault-navy text-slate-100 font-sans`}
      >
        <StructuredData />
        <DemoBanner />
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}