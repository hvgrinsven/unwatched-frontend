import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/beheer-auth";
import NieuwArtikelForm from "@/components/beheer/NieuwArtikelForm";

export default function NieuwArtikelPagina() {
  if (!isAuthenticated()) redirect("/beheer");

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-sora font-bold text-2xl text-text-primary">
          Nieuw artikel
        </h1>
        <Link
          href="/beheer/artikelen"
          className="text-sm font-sans text-text-muted hover:text-brand transition-colors"
        >
          ← Terug naar overzicht
        </Link>
      </div>
      <NieuwArtikelForm />
    </div>
  );
}
