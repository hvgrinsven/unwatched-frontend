import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/supabase";

const BASE_URL = "https://unwatched.nl";

const CATEGORIEËN = ["nieuws", "film", "serie", "review", "streaming"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  const artikelEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categorieEntries: MetadataRoute.Sitemap = CATEGORIEËN.map((cat) => ({
    url: `${BASE_URL}/categorie/${cat}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categorieEntries,
    ...artikelEntries,
  ];
}
