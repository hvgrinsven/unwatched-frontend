import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigatie from "@/components/Navigatie";
import Footer from "@/components/Footer";

const siteDescription =
  "Het laatste film- en series nieuws + wat je écht moet kijken. Ontdek trending titels en aanbevelingen van vrienden op UnWatched.";

export const metadata: Metadata = {
  title: {
    default: "Film & Series Nieuws + Tips | UnWatched",
    template: "%s | UnWatched",
  },
  description: siteDescription,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://unwatched.nl"
  ),
  openGraph: {
    description: siteDescription,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://unwatched.nl/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen flex flex-col bg-white">
        <Navigatie />
        <main className="flex-1 w-full max-w-site mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="bf2bd296-8f40-46d3-90d5-efd66e266101"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
