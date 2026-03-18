import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Categorie =
  | "film"
  | "serie"
  | "streaming"
  | "trailer"
  | "review"
  | "nieuws";

export interface Artikel {
  id: number;
  titel: string;
  samenvatting: string;
  inhoud: string;
  slug: string;
  categorie: Categorie;
  thumbnail_url: string | null;
  bron_url: string | null;
  gepubliceerd: boolean;
  created_at: string;
  published_at: string;
}

export async function getArtikelen(limit = 20): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from("artikelen")
    .select("*")
    .eq("gepubliceerd", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase fout:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getArtikelenByCategorie(
  categorie: Categorie,
  limit = 20
): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from("artikelen")
    .select("*")
    .eq("gepubliceerd", true)
    .eq("categorie", categorie)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase fout:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getArtikel(slug: string): Promise<Artikel | null> {
  const { data, error } = await supabase
    .from("artikelen")
    .select("*")
    .eq("slug", slug)
    .eq("gepubliceerd", true)
    .single();

  if (error) {
    console.error("Supabase fout:", error.message);
    return null;
  }

  return data;
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("artikelen")
    .select("slug")
    .eq("gepubliceerd", true);

  if (error) {
    console.error("Supabase fout:", error.message);
    return [];
  }

  return data?.map((a) => a.slug).filter(Boolean) ?? [];
}
