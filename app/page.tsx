import { getArtikelen } from "@/lib/supabase";
import HeroArtikel from "@/components/HeroArtikel";
import LoadMoreArtikelen from "@/components/LoadMoreArtikelen";

export const revalidate = 60;

export default async function HomePage() {
  // 1 hero + 15 initiële rij-/gridartikelen = 16 totaal
  const artikelen = await getArtikelen(16);

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

      {/* Rest + laad meer (client component) */}
      <LoadMoreArtikelen initialArtikelen={rest} initialOffset={16} />
    </div>
  );
}
