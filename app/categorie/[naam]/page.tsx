import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Categorie } from "@/lib/supabase";
import { getArtikelenByCategorie } from "@/lib/supabase";
import HeroArtikel from "@/components/HeroArtikel";
import ArtikelRij from "@/components/ArtikelRij";
import ArtikelKaart from "@/components/ArtikelKaart";

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

  if (artikelen.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted font-sans text-sm">
          Nog geen artikelen in deze categorie.
        </p>
      </div>
    );
  }

  const [hero, ...rest] = artikelen;

  return (
    <div>
      {/* Hero — edge-to-edge op mobiel */}
      <div className="-mx-4 -mt-6 lg:mx-0 lg:mt-0 lg:rounded lg:overflow-hidden">
        <HeroArtikel artikel={hero} />
      </div>

      {/* Mobiele artikellijst */}
      {rest.length > 0 && (
        <div className="lg:hidden mt-1 divide-y divide-border">
          {rest.map((artikel) => (
            <ArtikelRij key={artikel.id} artikel={artikel} />
          ))}
        </div>
      )}

      {/* Desktop grid */}
      {rest.length > 0 && (
        <div className="hidden lg:block mt-6">
          <div className="grid grid-cols-3 gap-4">
            {rest.map((artikel) => (
              <ArtikelKaart key={artikel.id} artikel={artikel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
