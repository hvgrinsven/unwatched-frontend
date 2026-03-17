import Link from "next/link";
import type { Categorie } from "@/lib/strapi";

const categorieën: { label: string; slug: Categorie }[] = [
  { label: "Film", slug: "film" },
  { label: "Series", slug: "serie" },
  { label: "Streaming", slug: "streaming" },
  { label: "Trailers", slug: "trailer" },
  { label: "Reviews", slug: "review" },
  { label: "Nieuws", slug: "nieuws" },
];

export default function Navigatie() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-site mx-auto">
        {/* Logo balk */}
        <div className="flex items-center h-12 px-4">
          <Link
            href="/"
            className="font-sora font-bold text-lg text-brand tracking-tight"
          >
            UnWatched
            <span className="text-text-primary font-normal"> nieuws</span>
          </Link>
        </div>

        {/* Categoriefilters — scrollbaar op mobiel */}
        <nav
          className="flex items-center overflow-x-auto border-t border-border px-4 gap-0"
          style={{ scrollbarWidth: "none" }}
        >
          <Link
            href="/"
            className="flex-shrink-0 px-3 py-2 text-xs font-semibold font-sans text-text-muted hover:text-brand transition-colors border-b-2 border-transparent hover:border-brand whitespace-nowrap"
          >
            Alles
          </Link>
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
