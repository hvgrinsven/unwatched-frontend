import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArtikel, getAllSlugs } from "@/lib/supabase";
import RichTextRenderer from "@/components/RichTextRenderer";

export const revalidate = 1800;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artikel = await getArtikel(params.slug);

  if (!artikel) {
    return { title: "Artikel niet gevonden" };
  }

  return {
    title: artikel.titel,
    description: artikel.samenvatting,
    openGraph: {
      title: artikel.titel,
      description: artikel.samenvatting,
      images: artikel.thumbnail_url ? [{ url: artikel.thumbnail_url }] : [],
      type: "article",
      publishedTime: artikel.published_at,
    },
  };
}

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArtikelPagina({ params }: Props) {
  const artikel = await getArtikel(params.slug);

  if (!artikel) {
    notFound();
  }

  const thumbnailUrl = artikel.thumbnail_url ?? "/placeholder.jpg";

  return (
    <article className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-text-muted mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/categorie/${artikel.categorie}`}
          className="hover:text-brand transition-colors"
        >
          {categorieLabels[artikel.categorie] ?? artikel.categorie}
        </Link>
        <span>/</span>
        <span className="text-text-primary truncate max-w-xs">
          {artikel.titel}
        </span>
      </nav>

      {/* Categorie tag */}
      <span className="inline-block text-xs font-semibold font-sans uppercase tracking-wide px-2 py-0.5 rounded bg-tag-bg text-tag-text mb-3">
        {categorieLabels[artikel.categorie] ?? artikel.categorie}
      </span>

      {/* Titel */}
      <h1 className="font-sora font-bold text-2xl sm:text-3xl leading-tight text-text-primary mb-3">
        {artikel.titel}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-text-muted font-sans mb-5">
        <time dateTime={artikel.published_at}>
          {formatDatum(artikel.published_at)}
        </time>
        {artikel.bron_url && (
          <>
            <span>·</span>
            <a
              href={artikel.bron_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              Bron
            </a>
          </>
        )}
      </div>

      {/* Thumbnail */}
      {artikel.thumbnail_url && (
        <div className="relative aspect-video w-full rounded overflow-hidden mb-6">
          <Image
            src={thumbnailUrl}
            alt={artikel.titel}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      )}

      {/* Samenvatting */}
      <p className="font-sans text-base font-medium text-text-primary bg-surface border-l-4 border-brand pl-4 py-2 mb-6 rounded-r">
        {artikel.samenvatting}
      </p>

      {/* Inhoud */}
      <div className="font-serif text-text-primary space-y-4 leading-relaxed">
        <RichTextRenderer inhoud={artikel.inhoud} />
      </div>
    </article>
  );
}
