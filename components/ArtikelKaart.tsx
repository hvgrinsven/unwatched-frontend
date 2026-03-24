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

export default function ArtikelKaart({ artikel }: Props) {
  const thumbnailUrl = artikel.thumbnail_url ?? "/placeholder.jpg";
  const href = artikel.slug ? `/${artikel.slug}` : `/artikel/${artikel.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-surface border border-border rounded overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-border">
        <Image
          src={thumbnailUrl}
          alt={artikel.titel}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Titel + categorie + datum */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="font-sora font-semibold text-sm leading-snug text-text-primary group-hover:text-brand transition-colors line-clamp-3">
          {artikel.titel}
        </h3>
        {artikel.categorie === "review" && artikel.score !== null ? (
          <StarRating score={artikel.score} />
        ) : (
          <span className="self-start text-xs font-semibold font-sans uppercase tracking-wide px-2 py-0.5 rounded bg-tag-bg text-tag-text">
            {categorieLabels[artikel.categorie] ?? artikel.categorie}
          </span>
        )}
        <time
          dateTime={artikel.published_at}
          className="text-xs text-text-muted font-sans mt-auto pt-1"
        >
          {formatDatum(artikel.published_at)}
        </time>
      </div>
    </Link>
  );
}
