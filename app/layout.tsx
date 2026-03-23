import type { Metadata } from "next";
import "./globals.css";
import Navigatie from "@/components/Navigatie";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "UnWatched Nieuws — Film & Series",
    template: "%s | UnWatched Nieuws",
  },
  description:
    "Het laatste nieuws over film, series en streaming. Overzichtelijk, snel en nieuwsgedreven.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://unwatched.nl"
  ),
  icons: {
    icon: "/favicon.png",
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
      </body>
    </html>
  );
}
