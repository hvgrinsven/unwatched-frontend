import Image from "next/image";
import Link from "next/link";
import type { Artikel } from "@/lib/supabase";
import StarRating from "@/components/StarRating";

const categorieLabels: Record<string, string> = {
  film: "Film",
  serie: "Series",
  streaming: "Streaming",
  trailer: "Trailer",
  review: "Review",
  nieuws: "Nieuws",
};

function formatDatum(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  artikel: Artikel;
}

export default function ArtikelRij({ artikel }: Props) {
  const thumbnailUrl = artikel.thumbnail_url ?? "/placeholder.jpg";
  const href = artikel.slug ? `/${artikel.slug}` : `/artikel/${artikel.id}`;

  return (
    <Link
      href={href}
      className="group flex gap-3 py-3 items-start hover:bg-gray-50 transition-colors"
    >
      {/* Thumbnail — vierkant ~80x80 */}
      <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded bg-border">
        <Image
          src={thumbnailUrl}
          alt={artikel.titel}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Tekst */}
      <div className="flex-1 min-w-0">
        <h3 className="font-sora font-semibold text-sm leading-snug text-text-primary group-hover:text-brand transition-colors line-clamp-3">
          {artikel.titel}
        </h3>
        <div className="mt-1">
          {artikel.categorie === "review" && artikel.score !== null ? (
            <StarRating score={artikel.score} />
          ) : (
            <span className="text-xs font-semibold font-sans uppercase tracking-wide text-tag-text">
              {categorieLabels[artikel.categorie] ?? artikel.categorie}
            </span>
          )}
        </div>
        <time
          dateTime={artikel.published_at}
          className="block mt-1 text-xs text-text-muted font-sans"
        >
          {formatDatum(artikel.published_at)}
        </time>
      </div>
    </Link>
  );
}
