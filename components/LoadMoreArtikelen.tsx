"use client";

import { useState } from "react";
import type { Artikel } from "@/lib/supabase";
import ArtikelRij from "@/components/ArtikelRij";
import ArtikelKaart from "@/components/ArtikelKaart";

const PAGE_SIZE = 16;

interface Props {
  initialArtikelen: Artikel[];
  initialOffset: number;
}

export default function LoadMoreArtikelen({ initialArtikelen, initialOffset }: Props) {
  const [artikelen, setArtikelen] = useState<Artikel[]>(initialArtikelen);
  const [offset, setOffset] = useState(initialOffset);
  const [laden, setLaden] = useState(false);
  const [heeftMeer, setHeeftMeer] = useState(initialArtikelen.length >= PAGE_SIZE - 1);

  async function laadMeer() {
    setLaden(true);
    try {
      const res = await fetch(`/api/artikelen?offset=${offset}&limit=${PAGE_SIZE}`);
      const nieuweArtikelen: Artikel[] = await res.json() as Artikel[];
      setArtikelen((prev) => [...prev, ...nieuweArtikelen]);
      setOffset((prev) => prev + nieuweArtikelen.length);
      setHeeftMeer(nieuweArtikelen.length === PAGE_SIZE);
    } finally {
      setLaden(false);
    }
  }

  return (
    <>
      {/* Mobiele lijst */}
      {artikelen.length > 0 && (
        <div className="lg:hidden mt-1 divide-y divide-border">
          {artikelen.map((artikel) => (
            <ArtikelRij key={artikel.id} artikel={artikel} />
          ))}
        </div>
      )}

      {/* Desktop grid */}
      {artikelen.length > 0 && (
        <div className="hidden lg:block mt-6">
          <div className="grid grid-cols-3 gap-4">
            {artikelen.map((artikel) => (
              <ArtikelKaart key={artikel.id} artikel={artikel} />
            ))}
          </div>
        </div>
      )}

      {/* Laad meer knop */}
      {heeftMeer && (
        <div className="flex justify-center mt-6">
          <button
            onClick={laadMeer}
            disabled={laden}
            className="flex items-center gap-2 px-6 py-2.5 rounded font-sans font-semibold text-sm text-white bg-brand hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {laden ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Laden…
              </>
            ) : (
              "Laad meer"
            )}
          </button>
        </div>
      )}
    </>
  );
}
