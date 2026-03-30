"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  slug: string;
  currentUrl: string;
  onUpload: (url: string) => void;
}

async function comprimeerAfbeelding(file: File, maxBytes = 1024 * 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const maxDim = 1920;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      let quality = 0.85;
      const probeer = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("Canvas toBlob mislukt")); return; }
            if (blob.size <= maxBytes || quality <= 0.3) {
              resolve(blob);
            } else {
              quality = Math.round((quality - 0.1) * 10) / 10;
              probeer();
            }
          },
          "image/jpeg",
          quality
        );
      };
      probeer();
    };

    img.onerror = () => reject(new Error("Afbeelding laden mislukt"));
    img.src = objectUrl;
  });
}

export default function ThumbnailUpload({ slug, currentUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [voortgang, setVoortgang] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(currentUrl);

  async function handleBestand(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!slug) {
      setFout("Vul eerst een slug in voordat je een afbeelding uploadt.");
      return;
    }

    setFout(null);
    setUploading(true);
    setVoortgang("Comprimeren…");

    let blob: Blob;
    try {
      blob = await comprimeerAfbeelding(file);
      setVoortgang(`Uploaden (${(blob.size / 1024).toFixed(0)} KB)…`);
    } catch {
      setFout("Afbeelding comprimeren mislukt.");
      setUploading(false);
      setVoortgang(null);
      return;
    }

    const form = new FormData();
    form.append("file", blob, `${slug}.jpg`);
    form.append("slug", slug);

    const res = await fetch("/api/beheer/upload", { method: "POST", body: form });

    if (res.ok) {
      const data = (await res.json()) as { url: string };
      setPreview(data.url);
      onUpload(data.url);
      setVoortgang(null);
    } else {
      const data = (await res.json()) as { error?: string };
      setFout(data.error ?? "Upload mislukt");
      setVoortgang(null);
    }

    setUploading(false);
    // Reset input zodat dezelfde file opnieuw gekozen kan worden
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preview */}
      {preview && (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-border max-w-sm">
          <Image src={preview} alt="Thumbnail preview" fill className="object-cover" sizes="384px" />
        </div>
      )}

      {/* Upload knop */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-white border border-border text-text-primary font-sans font-semibold text-sm rounded px-4 py-2.5 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span>{uploading ? "⏳" : "📷"}</span>
          {uploading ? voortgang : preview ? "Afbeelding wijzigen" : "Afbeelding uploaden"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture={undefined}
          onChange={handleBestand}
          className="hidden"
        />
      </div>

      {fout && <p className="text-xs text-brand font-sans">{fout}</p>}
    </div>
  );
}
