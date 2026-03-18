import type { Metadata } from "next";
import { getArtikelen } from "@/lib/supabase";
import HeroArtikel from "@/components/HeroArtikel";
import ArtikelRij from "@/components/ArtikelRij";
import ArtikelKaart from "@/components/ArtikelKaart";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "UnWatched Nieuws — Film & Series",
  description:
    "Het laatste nieuws over film, series en streaming. Overzichtelijk, snel en nieuwsgedreven.",
};

export default async function HomePage() {
  const artikelen = await getArtikelen(20);

  if (artikelen.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-sora font-bold text-2xl text-text-primary mb-2">
          Geen artikelen beschikbaar
        </h1>
        <p className="text-text-muted font-sans text-sm">
          Probeer het later opnieuw of controleer de Supabase verbinding.
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
