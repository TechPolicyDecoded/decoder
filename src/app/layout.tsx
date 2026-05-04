import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechPolicyDecoded",
  description:
    "U.S. tech policy in plain language — explained, sourced, and connected to the money behind it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-200">
          <nav className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold text-gray-900 hover:text-gray-600">
              TechPolicyDecoded
            </Link>
            <Link href="/organizations" className="text-gray-500 hover:text-gray-900">
              Organizations
            </Link>
            <Link href="/funders" className="text-gray-500 hover:text-gray-900">
              Funders
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
