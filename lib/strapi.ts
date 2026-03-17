const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

export type Categorie =
  | "film"
  | "serie"
  | "streaming"
  | "trailer"
  | "review"
  | "nieuws";

export interface StrapiThumbnail {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface Artikel {
  id: number;
  documentId: string;
  titel: string;
  samenvatting: string;
  inhoud: Record<string, unknown>[];
  slug: string;
  categorie: Categorie;
  bron_url: string | null;
  gepubliceerd: boolean;
  publishedAt: string;
  thumbnail: StrapiThumbnail | null;
}

interface StrapiListResponse {
  data: Artikel[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse {
  data: Artikel | null;
}

async function strapiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, options);

    if (!res.ok) {
      console.error(`Strapi fout: ${res.status} ${res.statusText} — ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("Strapi verbinding mislukt:", err);
    return null;
  }
}

export async function getArtikels(pageSize = 20): Promise<Artikel[]> {
  const data = await strapiFetch<StrapiListResponse>(
    `/api/artikels?sort=publishedAt:desc&populate=thumbnail&pagination[pageSize]=${pageSize}`
  );
  return data?.data ?? [];
}

export async function getArtikelsByCategorie(
  categorie: Categorie,
  pageSize = 20
): Promise<Artikel[]> {
  const data = await strapiFetch<StrapiListResponse>(
    `/api/artikels?sort=publishedAt:desc&populate=thumbnail&pagination[pageSize]=${pageSize}&filters[categorie][$eq]=${categorie}`
  );
  return data?.data ?? [];
}

export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  const data = await strapiFetch<StrapiListResponse>(
    `/api/artikels?filters[slug][$eq]=${slug}&populate=thumbnail`
  );
  return data?.data?.[0] ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  const data = await strapiFetch<StrapiListResponse>(
    `/api/artikels?fields[0]=slug&pagination[pageSize]=100`
  );
  return data?.data?.map((a) => a.slug) ?? [];
}

export function getThumbnailUrl(thumbnail: StrapiThumbnail | null): string {
  if (!thumbnail) return "/placeholder.svg";
  if (thumbnail.url.startsWith("http")) return thumbnail.url;
  return `${STRAPI_URL}${thumbnail.url}`;
}
