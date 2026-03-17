import Image from "next/image";
import Link from "next/link";
import type { Artikel } from "@/lib/strapi";
import { getThumbnailUrl } from "@/lib/strapi";

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
  const thumbnailUrl = getThumbnailUrl(artikel.thumbnail);
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
          alt={artikel.thumbnail?.alternativeText ?? artikel.titel}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Titel + datum */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="font-sora font-semibold text-sm leading-snug text-text-primary group-hover:text-brand transition-colors line-clamp-3">
          {artikel.titel}
        </h3>
        <time
          dateTime={artikel.publishedAt}
          className="text-xs text-text-muted font-sans mt-auto pt-1"
        >
          {formatDatum(artikel.publishedAt)}
        </time>
      </div>
    </Link>
  );
}
