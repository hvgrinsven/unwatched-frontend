"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ThumbnailUpload from "@/components/beheer/ThumbnailUpload";
import MultiImageUpload from "@/components/beheer/MultiImageUpload";

const categorieOpties = ["film", "serie", "streaming", "trailer", "review", "nieuws"] as const;
const itemTypeOpties = ["film", "serie", "overig"] as const;
const genreOpties = [
  "", "actie", "animatie", "avontuur", "biografie", "cabaret", "documentaire",
  "drama", "erotiek", "familie", "fantasy", "historisch", "horror", "kerst",
  "komedie", "misdaad", "muziek", "mystery", "nieuws", "oorlog", "tv programma",
  "reality", "romantische komedie", "sciencefiction", "spelshow", "sport",
  "talkshow", "thriller", "western",
] as const;

const leegForm = {
  titel: "",
  samenvatting: "",
  inhoud: "",
  categorie: "nieuws" as string,
  slug: "",
  gepubliceerd: false,
  score: "",
  trailer: "",
  item_type: "overig" as string,
  thumbnail_url: "",
  genre: "",
};

export default function NieuwArtikelForm() {
  const router = useRouter();
  const inhoudRef = useRef<HTMLTextAreaElement>(null);
  const [laden, setLaden] = useState(false);
  const [melding, setMelding] = useState<{ type: "ok" | "fout"; tekst: string } | null>(null);
  const [form, setForm] = useState(leegForm);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  // Genereer slug automatisch vanuit titel als slug nog leeg is
  function handleTitelBlur() {
    if (!form.slug && form.titel) {
      const slug = form.titel
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  function handleInsert(tag: string) {
    const el = inhoudRef.current;
    if (!el) return;
    const start = el.selectionStart ?? form.inhoud.length;
    const end = el.selectionEnd ?? form.inhoud.length;
    const newValue = form.inhoud.slice(0, start) + "\n\n" + tag + "\n\n" + form.inhoud.slice(end);
    setForm((prev) => ({ ...prev, inhoud: newValue }));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + tag.length + 4;
      el.focus();
    });
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
      thumbnail_url: form.thumbnail_url || null,
      genre: form.genre || null,
    };

    const res = await fetch("/api/beheer/artikelen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = (await res.json()) as { id: number };
      router.push(`/beheer/artikelen/${data.id}`);
    } else {
      const data = (await res.json()) as { error?: string };
      setMelding({ type: "fout", tekst: data.error ?? "Aanmaken mislukt" });
      setLaden(false);
    }
  }

  return (
    <form onSubmit={handleOpslaan} className="flex flex-col gap-5">
      {melding && (
        <p
          className={`text-sm font-sans font-medium px-3 py-2 rounded ${
            melding.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-brand"
          }`}
        >
          {melding.tekst}
        </p>
      )}

      <Field label="Titel">
        <input
          name="titel"
          value={form.titel}
          onChange={handleChange}
          onBlur={handleTitelBlur}
          required
        />
      </Field>

      <Field label="Samenvatting">
        <textarea name="samenvatting" value={form.samenvatting} onChange={handleChange} rows={3} required />
      </Field>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-sans font-medium text-text-primary">Inhoud</label>
        <textarea
          ref={inhoudRef}
          name="inhoud"
          value={form.inhoud}
          onChange={handleChange}
          rows={12}
          required
          className="w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <MultiImageUpload slug={form.slug} onInsert={handleInsert} />

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

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-sans font-medium text-text-primary">Genre (optioneel)</label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">— geen genre —</option>
            {genreOpties.filter(Boolean).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {form.categorie === "review" && !form.genre && (
            <p className="text-xs text-amber-600 font-sans">⚠ Genre is aanbevolen voor reviews.</p>
          )}
        </div>

        <Field label="Slug">
          <input name="slug" value={form.slug} onChange={handleChange} required />
        </Field>

        <Field label="Score (optioneel, 1–5)">
          <input
            name="score"
            type="number"
            step="0.5"
            min="1"
            max="5"
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

      {/* Thumbnail */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-sans font-medium text-text-primary">Thumbnail</label>
        {!form.slug && (
          <p className="text-xs text-text-muted font-sans">Vul eerst een slug in om een afbeelding te uploaden.</p>
        )}
        {form.slug && (
          <ThumbnailUpload
            slug={form.slug}
            currentUrl={form.thumbnail_url}
            onUpload={(url) => setForm((prev) => ({ ...prev, thumbnail_url: url }))}
          />
        )}
        <input
          name="thumbnail_url"
          value={form.thumbnail_url}
          onChange={handleChange}
          placeholder="https://... (of upload hierboven)"
          className="w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand mt-1"
        />
      </div>

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

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={laden}
          className="bg-brand text-white font-sans font-semibold text-sm rounded px-5 py-2 hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {laden ? "Bezig…" : "Artikel aanmaken"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/beheer/artikelen")}
          className="border border-border text-text-muted font-sans text-sm rounded px-5 py-2 hover:text-text-primary transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  const inputClass =
    "w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand";
  const child = { ...children, props: { ...children.props, className: inputClass } };
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-sans font-medium text-text-primary">{label}</label>
      {child}
    </div>
  );
}
