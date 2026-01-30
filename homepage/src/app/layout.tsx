import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOID - Military-Grade Encrypted Messaging",
  description: "The messaging platform that swallows all traces. What enters the event horizon, never leaves. Military-grade encryption that governments trust.",
  keywords: ["VOID", "encrypted messaging", "Signal Protocol", "end-to-end encryption", "secure communication", "privacy"],
  authors: [{ name: "VOID Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VOID - Military-Grade Encrypted Messaging",
    description: "The messaging platform that swallows all traces. Unbreakable encryption, zero traces.",
    siteName: "VOID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOID - Military-Grade Encrypted Messaging",
    description: "The messaging platform that swallows all traces. Unbreakable encryption, zero traces.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
