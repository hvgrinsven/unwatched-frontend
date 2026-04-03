import type { Metadata } from "next";
import { getArtikelenByCategorie } from "@/lib/supabase";
import ReviewsOverzicht from "@/components/ReviewsOverzicht";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Reviews",
  description: "Alle film- en seriereviews van UnWatched, gesorteerd op score.",
};

export default async function ReviewsPagina() {
  const artikelen = await getArtikelenByCategorie("review", 100);

  const genres = Array.from(
    new Set(artikelen.map((a) => a.genre).filter((g): g is string => !!g))
  ).sort((a, b) => a.localeCompare(b, "nl"));

  return <ReviewsOverzicht artikelen={artikelen} genres={genres} />;
}
