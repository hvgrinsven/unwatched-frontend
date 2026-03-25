import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/supabase";

const BASE_URL = "https://unwatched.nl";

const CATEGORIEËN = ["nieuws", "film", "serie", "review", "streaming"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artikelen = await getAllSlugs();

  const artikelEntries: MetadataRoute.Sitemap = artikelen.map(({ slug, created_at }) => ({
    url: `${BASE_URL}/${slug}`,
    lastmod: new Date(created_at).toISOString(),
  }));

  const categorieEntries: MetadataRoute.Sitemap = CATEGORIEËN.map((cat) => ({
    url: `${BASE_URL}/categorie/${cat}`,
  }));

  return [
    { url: BASE_URL },
    ...categorieEntries,
    ...artikelEntries,
  ];
}
