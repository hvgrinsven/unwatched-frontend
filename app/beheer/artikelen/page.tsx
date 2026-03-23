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

      {/* Tabel */}
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-border text-left">
              <th className="px-4 py-3 font-semibold text-text-primary">Titel</th>
              <th className="px-4 py-3 font-semibold text-text-primary hidden sm:table-cell">
                Categorie
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary hidden md:table-cell">
                Datum
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {artikelen?.map((artikel) => (
              <tr key={artikel.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-text-primary max-w-xs truncate">
                  {artikel.titel}
                </td>
                <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                  {categorieLabels[artikel.categorie] ?? artikel.categorie}
                </td>
                <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                  {artikel.published_at ? formatDatum(artikel.published_at) : "—"}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                      artikel.gepubliceerd
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-text-muted"
                    }`}
                  >
                    {artikel.gepubliceerd ? "Gepubliceerd" : "Concept"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/beheer/artikelen/${artikel.id}`}
                    className="text-brand font-semibold hover:underline"
                  >
                    Bewerken
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!artikelen || artikelen.length === 0) && !error && (
          <p className="text-center text-text-muted font-sans text-sm py-8">
            Geen artikelen gevonden.
          </p>
        )}
      </div>
    </div>
  );
}
