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
  title: "BlackHole In Space - Secure Messaging Platform",
  description: "The mathematically unbreakable messaging platform. Military-grade encryption with Signal Protocol, post-quantum cryptography, and zero server storage.",
  keywords: ["BlackHole", "Secure Messaging", "Encryption", "Signal Protocol", "Post-Quantum", "Privacy"],
  authors: [{ name: "zeroday" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BlackHole In Space",
    description: "Secure messaging that governments trust and teams love",
    url: "https://github.com/webspoilt/blackhole_in_space",
    siteName: "BlackHole In Space",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackHole In Space",
    description: "Secure messaging that governments trust and teams love",
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
