import Link from "next/link";
import Image from "next/image";
import type { Categorie } from "@/lib/supabase";

const categorieën: { label: string; slug: Categorie }[] = [
  { label: "Nieuws", slug: "nieuws" },
  { label: "Films", slug: "film" },
  { label: "Series", slug: "serie" },
  { label: "Reviews", slug: "review" },
  { label: "Streaming", slug: "streaming" },
];

export default function Navigatie() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-site mx-auto">
        {/* Logo balk */}
        <div className="flex items-center h-12 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-sora font-bold text-lg text-brand tracking-tight"
          >
            <Image src="/favicon.png" alt="UnWatched logo" width={24} height={24} />
            UnWatched
            <span className="text-text-primary font-normal"> films & series</span>
          </Link>
        </div>

        {/* Categoriefilters — scrollbaar op mobiel */}
        <nav
          className="flex items-center overflow-x-auto border-t border-border px-4 gap-0"
          style={{ scrollbarWidth: "none" }}
        >
          {categorieën.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/categorie/${slug}`}
              className="flex-shrink-0 px-3 py-2 text-xs font-semibold font-sans text-text-muted hover:text-brand transition-colors border-b-2 border-transparent hover:border-brand whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
