import Image from "next/image";
import Link from "next/link";
import type { Artikel } from "@/lib/supabase";

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

export default function HeroArtikel({ artikel }: Props) {
  const thumbnailUrl = artikel.thumbnail_url ?? "/placeholder.jpg";
  const href = artikel.slug ? `/${artikel.slug}` : `/artikel/${artikel.id}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-video w-full overflow-hidden bg-border">
        <Image
          src={thumbnailUrl}
          alt={artikel.titel}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 860px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Tekst overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <span className="inline-block mb-2 text-xs font-semibold font-sans uppercase tracking-wide px-2 py-0.5 rounded bg-brand text-white">
            {categorieLabels[artikel.categorie] ?? artikel.categorie}
          </span>
          <h2 className="font-sora font-bold text-lg sm:text-2xl leading-snug text-white group-hover:text-white/90 line-clamp-3">
            {artikel.titel}
          </h2>
          <time
            dateTime={artikel.published_at}
            className="block mt-1.5 text-xs text-white/70 font-sans"
          >
            {formatDatum(artikel.published_at)}
          </time>
        </div>
      </div>
    </Link>
  );
}
