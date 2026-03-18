import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Categorie } from "@/lib/supabase";
import { getArtikelenByCategorie } from "@/lib/supabase";
import ArtikelGrid from "@/components/ArtikelGrid";

export const revalidate = 60;

const GELDIGE_CATEGORIEËN: Categorie[] = [
  "film",
  "serie",
  "streaming",
  "trailer",
  "review",
  "nieuws",
];

const categorieLabels: Record<Categorie, string> = {
  film: "Film",
  serie: "Series",
  streaming: "Streaming",
  trailer: "Trailers",
  review: "Reviews",
  nieuws: "Nieuws",
};

interface Props {
  params: { naam: string };
}

export function generateStaticParams() {
  return GELDIGE_CATEGORIEËN.map((naam) => ({ naam }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!GELDIGE_CATEGORIEËN.includes(params.naam as Categorie)) {
    return { title: "Categorie niet gevonden" };
  }

  const label = categorieLabels[params.naam as Categorie];
  return {
    title: `${label} nieuws`,
    description: `Het laatste ${label.toLowerCase()} nieuws op UnWatched.`,
  };
}

export default async function CategoriePagina({ params }: Props) {
  if (!GELDIGE_CATEGORIEËN.includes(params.naam as Categorie)) {
    notFound();
  }

  const categorie = params.naam as Categorie;
  const artikelen = await getArtikelenByCategorie(categorie, 20);
  const label = categorieLabels[categorie];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-3">
        <span className="text-xs font-sans font-semibold uppercase tracking-wide text-brand">
          Categorie
        </span>
        <h1 className="font-sora font-bold text-2xl text-text-primary mt-0.5">
          {label}
        </h1>
        {artikelen.length > 0 && (
          <p className="text-sm text-text-muted font-sans mt-1">
            {artikelen.length} artikel{artikelen.length !== 1 ? "en" : ""}{" "}
            gevonden
          </p>
        )}
      </div>

      {artikelen.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-text-muted font-sans text-sm">
            Nog geen artikelen in de categorie &ldquo;{label}&rdquo;.
          </p>
        </div>
      ) : (
        <ArtikelGrid artikels={artikelen} />
      )}
    </div>
  );
}
