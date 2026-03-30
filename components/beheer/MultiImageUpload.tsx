"use client";

import { useRef, useState } from "react";
import { compressImage } from "@/lib/compress-image";

interface GeuploadAfbeelding {
  url: string;
  naam: string;
}

interface Props {
  slug: string;
  onInsert: (tag: string) => void;
}

export default function MultiImageUpload({ slug, onInsert }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [afbeeldingen, setAfbeeldingen] = useState<GeuploadAfbeelding[]>([]);
  const [bezig, setBezig] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  async function handleBestanden(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (!slug) {
      setFout("Vul eerst een slug in voordat je afbeeldingen uploadt.");
      return;
    }

    setFout(null);
    setBezig(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setStatus(`Bestand ${i + 1}/${files.length}: comprimeren…`);

      let blob: Blob;
      try {
        blob = await compressImage(file);
      } catch {
        setFout(`Comprimeren mislukt voor ${file.name}`);
        continue;
      }

      const bestandsnaam = `${slug}-${Date.now()}.jpg`;
      setStatus(`Bestand ${i + 1}/${files.length}: uploaden (${(blob.size / 1024).toFixed(0)} KB)…`);

      const form = new FormData();
      form.append("file", blob, bestandsnaam);
      form.append("slug", slug);
      form.append("filename", bestandsnaam);

      const res = await fetch("/api/beheer/upload", { method: "POST", body: form });

      if (res.ok) {
        const data = (await res.json()) as { url: string };
        setAfbeeldingen((prev) => [...prev, { url: data.url, naam: bestandsnaam }]);
      } else {
        const data = (await res.json()) as { error?: string };
        setFout(data.error ?? `Upload mislukt voor ${file.name}`);
      }
    }

    setBezig(false);
    setStatus(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3 border border-border rounded p-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-sans font-semibold text-text-primary">Afbeeldingen uploaden</h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={bezig || !slug}
          className="bg-white border border-border text-text-primary font-sans font-semibold text-sm rounded px-3 py-1.5 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          📷 {bezig ? status : "Bestanden kiezen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleBestanden}
          className="hidden"
        />
      </div>

      {!slug && (
        <p className="text-xs text-text-muted font-sans">Vul eerst een slug in.</p>
      )}

      {fout && <p className="text-xs text-brand font-sans">{fout}</p>}

      {/* Geüploade afbeeldingen */}
      {afbeeldingen.length > 0 && (
        <div className="flex flex-col gap-2">
          {afbeeldingen.map((afb) => (
            <div key={afb.url} className="flex items-center gap-2 bg-gray-50 rounded p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afb.url} alt={afb.naam} className="w-16 h-16 object-cover rounded flex-shrink-0" />
              <p className="flex-1 text-xs font-sans text-text-muted truncate min-w-0">{afb.url}</p>
              <button
                type="button"
                onClick={() => onInsert(`[IMG]${afb.url}[/IMG]`)}
                className="flex-shrink-0 text-xs font-sans font-semibold text-brand border border-brand rounded px-2 py-1 hover:bg-tag-bg transition-colors"
              >
                Invoegen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
