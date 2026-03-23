"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BeheerLoginPagina() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [laden, setLaden] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setFout("");

    const res = await fetch("/api/beheer/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wachtwoord }),
    });

    if (res.ok) {
      router.push("/beheer/artikelen");
    } else {
      setFout("Ongeldig wachtwoord");
      setLaden(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white border border-border rounded p-8 shadow-sm">
        <h1 className="font-sora font-bold text-xl text-text-primary mb-6">
          Beheer inloggen
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-sans font-medium text-text-primary mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand"
              autoFocus
              required
            />
          </div>
          {fout && <p className="text-sm text-brand font-sans">{fout}</p>}
          <button
            type="submit"
            disabled={laden}
            className="bg-brand text-white font-sans font-semibold text-sm rounded px-4 py-2 hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {laden ? "Bezig…" : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
