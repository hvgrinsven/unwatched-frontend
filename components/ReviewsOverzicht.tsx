"use client";

import { useState, useMemo } from "react";
import type { Artikel } from "@/lib/supabase";
import ArtikelKaart from "@/components/ArtikelKaart";

type SorteerOptie = "score-hoog" | "score-laag" | "nieuwste" | "oudste" | "az" | "za";

const SORTEER_LABELS: Record<SorteerOptie, string> = {
  "score-hoog": "Hoogste score",
  "score-laag": "Laagste score",
  nieuwste: "Nieuwste artikel",
  oudste: "Oudste artikel",
  az: "Titel A–Z",
  za: "Titel Z–A",
};

interface Props {
  artikelen: Artikel[];
  genres: string[];
}

export default function ReviewsOverzicht({ artikelen, genres }: Props) {
  const [sorteer, setSorteer] = useState<SorteerOptie>("nieuwste");
  const [genre, setGenre] = useState<string>("");

  const gefilterd = useMemo(() => {
    let lijst = genre
      ? artikelen.filter((a) => a.genre === genre)
      : artikelen;

    lijst = [...lijst].sort((a, b) => {
      switch (sorteer) {
        case "score-hoog":
          return (b.score ?? -1) - (a.score ?? -1);
        case "score-laag":
          return (a.score ?? 99) - (b.score ?? 99);
        case "nieuwste":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oudste":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "az":
          return a.titel.localeCompare(b.titel, "nl");
        case "za":
          return b.titel.localeCompare(a.titel, "nl");
        default:
          return 0;
      }
    });

    return lijst;
  }, [artikelen, sorteer, genre]);

  return (
    <div>
      {/* Sorteer + genre naast elkaar */}
      <div className="flex flex-row gap-2 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-sans font-semibold text-text-muted whitespace-nowrap">
            Sorteren
          </label>
          <select
            value={sorteer}
            onChange={(e) => setSorteer(e.target.value as SorteerOptie)}
            className="border border-border rounded text-sm px-2 py-1 md:text-base md:px-3 md:py-2 font-sans text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {(Object.keys(SORTEER_LABELS) as SorteerOptie[]).map((opt) => (
              <option key={opt} value={opt}>{SORTEER_LABELS[opt]}</option>
            ))}
          </select>
        </div>

        {genres.length > 0 && (
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-sans font-semibold text-text-muted whitespace-nowrap">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="border border-border rounded text-sm px-2 py-1 md:text-base md:px-3 md:py-2 font-sans text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Alle genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid */}
      {gefilterd.length === 0 ? (
        <p className="py-12 text-center text-text-muted font-sans text-sm">
          Geen reviews gevonden voor dit genre.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gefilterd.map((artikel) => (
            <ArtikelKaart key={artikel.id} artikel={artikel} />
          ))}
        </div>
      )}
    </div>
  );
}
