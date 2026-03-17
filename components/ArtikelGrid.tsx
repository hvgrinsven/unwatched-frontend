import type { Artikel } from "@/lib/strapi";
import ArtikelKaart from "./ArtikelKaart";

interface Props {
  artikels: Artikel[];
}

export default function ArtikelGrid({ artikels }: Props) {
  if (artikels.length === 0) {
    return (
      <p className="text-text-muted font-sans text-sm py-8 text-center">
        Geen artikelen gevonden.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {artikels.map((artikel) => (
        <ArtikelKaart key={artikel.id} artikel={artikel} />
      ))}
    </div>
  );
}
