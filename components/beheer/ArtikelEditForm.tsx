"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Artikel } from "@/lib/supabase";

const categorieOpties = ["film", "serie", "streaming", "trailer", "review", "nieuws"] as const;
const itemTypeOpties = ["film", "serie", "overig"] as const;

interface Props {
  artikel: Artikel;
}

export default function ArtikelEditForm({ artikel }: Props) {
  const router = useRouter();
  const [laden, setLaden] = useState(false);
  const [melding, setMelding] = useState<{ type: "ok" | "fout"; tekst: string } | null>(null);

  const [form, setForm] = useState({
    titel: artikel.titel,
    samenvatting: artikel.samenvatting,
    inhoud: artikel.inhoud,
    categorie: artikel.categorie,
    slug: artikel.slug,
    gepubliceerd: artikel.gepubliceerd,
    score: artikel.score?.toString() ?? "",
    trailer: artikel.trailer ?? "",
    item_type: artikel.item_type ?? "overig",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleOpslaan(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setMelding(null);

    const payload: Record<string, unknown> = {
      titel: form.titel,
      samenvatting: form.samenvatting,
      inhoud: form.inhoud,
      categorie: form.categorie,
      slug: form.slug,
      gepubliceerd: form.gepubliceerd,
      score: form.score !== "" ? parseFloat(form.score) : null,
      trailer: form.trailer || null,
      item_type: form.item_type,
    };

    const res = await fetch(`/api/beheer/artikelen/${artikel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMelding({ type: "ok", tekst: "Opgeslagen!" });
    } else {
      const data = (await res.json()) as { error?: string };
      setMelding({ type: "fout", tekst: data.error ?? "Opslaan mislukt" });
    }
    setLaden(false);
  }

  async function handleVerwijderen() {
    if (!window.confirm(`Artikel "${artikel.titel}" definitief verwijderen?`)) return;

    setLaden(true);
    const res = await fetch(`/api/beheer/artikelen/${artikel.id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/beheer/artikelen");
    } else {
      const data = (await res.json()) as { error?: string };
      setMelding({ type: "fout", tekst: data.error ?? "Verwijderen mislukt" });
      setLaden(false);
    }
  }

  return (
    <form onSubmit={handleOpslaan} className="flex flex-col gap-5">
      {/* Melding */}
      {melding && (
        <p
          className={`text-sm font-sans font-medium px-3 py-2 rounded ${
            melding.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-brand"
          }`}
        >
          {melding.tekst}
        </p>
      )}

      <Field label="Titel">
        <input name="titel" value={form.titel} onChange={handleChange} required />
      </Field>

      <Field label="Samenvatting">
        <textarea name="samenvatting" value={form.samenvatting} onChange={handleChange} rows={3} required />
      </Field>

      <Field label="Inhoud">
        <textarea name="inhoud" value={form.inhoud} onChange={handleChange} rows={12} required />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Categorie">
          <select name="categorie" value={form.categorie} onChange={handleChange}>
            {categorieOpties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Item type">
          <select name="item_type" value={form.item_type} onChange={handleChange}>
            {itemTypeOpties.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Slug">
          <input name="slug" value={form.slug} onChange={handleChange} required />
        </Field>

        <Field label="Score (optioneel, 1–5)">
          <input
            name="score"
            type="number"
            step="0.5"
            value={form.score}
            onChange={handleChange}
            placeholder="bijv. 3.5"
          />
        </Field>
      </div>

      <Field label="Trailer URL (optioneel)">
        <input
          name="trailer"
          type="url"
          value={form.trailer}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </Field>

      <label className="flex items-center gap-2 text-sm font-sans text-text-primary cursor-pointer select-none">
        <input
          type="checkbox"
          name="gepubliceerd"
          checked={form.gepubliceerd}
          onChange={handleChange}
          className="w-4 h-4 accent-brand"
        />
        Gepubliceerd
      </label>

      {/* Knoppen */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={laden}
          className="bg-brand text-white font-sans font-semibold text-sm rounded px-5 py-2 hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {laden ? "Bezig…" : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={handleVerwijderen}
          disabled={laden}
          className="border border-red-300 text-red-600 font-sans font-semibold text-sm rounded px-5 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Verwijderen
        </button>
      </div>
    </form>
  );
}

// Herbruikbaar veld-wrapper
function Field({ label, children }: { label: string; children: React.ReactElement }) {
  const inputClass =
    "w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand";

  const child = {
    ...children,
    props: { ...children.props, className: inputClass },
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-sans font-medium text-text-primary">{label}</label>
      {child}
    </div>
  );
}
