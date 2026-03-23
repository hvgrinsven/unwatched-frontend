import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/beheer-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ArtikelEditForm from "@/components/beheer/ArtikelEditForm";

interface Props {
  params: { id: string };
}

export default async function BeheerArtikelBewerkPagina({ params }: Props) {
  if (!isAuthenticated()) redirect("/beheer");

  const { data: artikel, error } = await supabaseAdmin
    .from("artikelen")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !artikel) notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/beheer/artikelen"
            className="text-sm font-sans text-text-muted hover:text-brand transition-colors"
          >
            ← Overzicht
          </Link>
          <span className="text-border">|</span>
          <h1 className="font-sora font-bold text-xl text-text-primary truncate max-w-xs sm:max-w-none">
            {artikel.titel}
          </h1>
        </div>
        <a
          href="/api/beheer/logout"
          className="text-sm font-sans text-text-muted hover:text-brand transition-colors"
        >
          Uitloggen
        </a>
      </div>

      <ArtikelEditForm artikel={artikel} />
    </div>
  );
}
