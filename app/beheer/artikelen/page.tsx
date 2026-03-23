import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/beheer-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatDatum(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const categorieLabels: Record<string, string> = {
  film: "Film",
  serie: "Series",
  streaming: "Streaming",
  trailer: "Trailer",
  review: "Review",
  nieuws: "Nieuws",
};

export default async function BeheerArtikelenPagina() {
  if (!isAuthenticated()) redirect("/beheer");

  const { data: artikelen, error } = await supabaseAdmin
    .from("artikelen")
    .select("id, titel, categorie, published_at, gepubliceerd, slug")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-sora font-bold text-2xl text-text-primary">
          Artikelen beheer
        </h1>
        <a
          href="/api/beheer/logout"
          className="text-sm font-sans text-text-muted hover:text-brand transition-colors"
        >
          Uitloggen
        </a>
      </div>

      {error && (
        <p className="text-sm text-brand font-sans mb-4">
          Fout bij ophalen: {error.message}
        </p>
      )}

      {/* Kaartjeslijst */}
      <div className="flex flex-col gap-3">
        {artikelen?.map((artikel) => (
          <div
            key={artikel.id}
            className="flex items-center justify-between gap-3 bg-white border border-border rounded p-4"
          >
            <div className="min-w-0">
              <p className="font-sans font-semibold text-sm text-text-primary truncate">
                {artikel.titel}
              </p>
              <p className="font-sans text-xs text-text-muted mt-0.5">
                {categorieLabels[artikel.categorie] ?? artikel.categorie}
                {" · "}
                {artikel.published_at ? formatDatum(artikel.published_at) : "geen datum"}
                {" · "}
                <span className={artikel.gepubliceerd ? "text-green-600" : "text-text-muted"}>
                  {artikel.gepubliceerd ? "Gepubliceerd" : "Concept"}
                </span>
              </p>
            </div>
            <Link
              href={`/beheer/artikelen/${artikel.id}`}
              className="flex-shrink-0 text-sm font-sans font-semibold text-brand hover:underline"
            >
              Bewerken
            </Link>
          </div>
        ))}

        {(!artikelen || artikelen.length === 0) && !error && (
          <p className="text-center text-text-muted font-sans text-sm py-8">
            Geen artikelen gevonden.
          </p>
        )}
      </div>
    </div>
  );
}
