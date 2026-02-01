import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'VAULT - Verifiable Audit & Unified Ledger Technologies',
  description: 'Military-grade secure messaging for Government and Enterprise. FIPS 140-2 Validated, FedRAMP Ready, Zero Unauthorized Traces.',
  keywords: ["secure messaging", "government communications", "FIPS 140-2", "FedRAMP", "on-premise", "zero trust"],
  authors: [{ name: "VAULT Enterprise" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-[#0f172a] text-slate-100 font-sans`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
