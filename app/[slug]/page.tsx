import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArtikel, getAllSlugs, getGerelateerdeArtikelen } from "@/lib/supabase";
import ArtikelKaart from "@/components/ArtikelKaart";
import RichTextRenderer from "@/components/RichTextRenderer";
import StarRating from "@/components/StarRating";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 60;

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

function youtubeEmbedUrl(url: string): string | null {
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return null;
}

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

  const gerelateerd = await getGerelateerdeArtikelen(artikel.categorie, artikel.slug);

  const thumbnailUrl = artikel.thumbnail_url ?? "/placeholder.jpg";

  const reviewJsonLd =
    artikel.categorie === "review" && artikel.score !== null
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Review",
          name: artikel.titel,
          reviewBody: artikel.inhoud.replace(/\[.*?\]/g, "").trim().slice(0, 200),
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(artikel.score),
            bestRating: "5",
            worstRating: "1",
          },
          author: {
            "@type": "Organization",
            name: "UnWatched",
          },
          itemReviewed: {
            "@type": "Movie",
            name: artikel.titel,
          },
        })
      : null;

  return (
    <article className="max-w-2xl mx-auto">
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: reviewJsonLd }}
        />
      )}
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

      {/* Sterrenscore — alleen bij reviews met score */}
      {artikel.categorie === "review" && artikel.score !== null && (
        <div className="mb-4">
          <StarRating score={artikel.score} />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center flex-wrap gap-3 text-xs text-text-muted font-sans mb-5">
        <time dateTime={artikel.published_at}>
          {formatDatum(artikel.published_at)}
        </time>
        <span>|</span>
        <span>Door <strong className="text-text-primary">Kelvin Gryshavenn</strong></span>
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
        <div className="relative aspect-video w-full rounded overflow-hidden mb-4">
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

      {/* Social sharing */}
      <div className="mb-6">
        <ShareButtons slug={artikel.slug} titel={artikel.titel} />
      </div>

      {/* Samenvatting */}
      <p className="font-sans text-base font-medium text-text-primary bg-surface border-l-4 border-brand pl-4 py-2 mb-6 rounded-r">
        {artikel.samenvatting}
      </p>

      {/* Inhoud */}
      <div className="font-serif text-text-primary space-y-4 leading-relaxed">
        <RichTextRenderer inhoud={artikel.inhoud} />
      </div>

      {/* Scoreblok — alleen bij reviews met score > 0 */}
      {artikel.categorie === "review" && artikel.score !== null && artikel.score !== 0 && (
        <div className="mt-8 flex items-center gap-4 border border-brand/30 bg-orange-50 rounded-lg px-5 py-4">
          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-wide text-brand mb-1">
              Onze score
            </p>
            <StarRating score={artikel.score} />
          </div>
          <span className="ml-auto font-sora font-bold text-2xl text-brand">
            {artikel.score}/5
          </span>
        </div>
      )}

      {/* Trailer embed */}
      {artikel.trailer && (() => {
        const embedUrl = youtubeEmbedUrl(artikel.trailer);
        return embedUrl ? (
          <div className="mt-8">
            <h2 className="font-sora font-bold text-lg text-text-primary mb-3">Trailer</h2>
            <div className="relative aspect-video w-full rounded overflow-hidden">
              <iframe
                src={embedUrl}
                title={`Trailer — ${artikel.titel}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        ) : null;
      })()}

      {/* Gerelateerde artikelen */}
      {gerelateerd.length > 0 && (
        <aside className="mt-10 pt-6 border-t border-border">
          <h2 className="font-sora font-bold text-base text-text-primary mb-4">
            Meer {categorieLabels[artikel.categorie] ?? artikel.categorie}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gerelateerd.map((a) => (
              <ArtikelKaart key={a.id} artikel={a} />
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
