import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOID - Sovereign Secure Messaging",
  description: "Military-grade encryption for mission-critical operations. FedRAMP authorized (in progress), FIPS 140-2 validated. Deploy on-premise or in the cloud.",
  keywords: ["secure messaging", "government communications", "FIPS 140-2", "FedRAMP", "on-premise", "zero trust"],
  authors: [{ name: "VOID Enterprise" }],
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
        className={`${inter.variable} antialiased bg-[#0a0f1a] text-gray-100 font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
