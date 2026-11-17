import type { Metadata } from "next";
import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = { title: "Marketplace", description: "Buy and sell near you" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Suspense><Header /></Suspense>
        {children}
      </body>
    </html>
  );
}
