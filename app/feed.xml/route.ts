import { NextResponse } from "next/server";
import { getArtikelen } from "@/lib/supabase";

const BASE_URL = "https://unwatched.nl";

function toRfc2822(iso: string): string {
  return new Date(iso).toUTCString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const artikelen = await getArtikelen(50);

  const lastBuildDate = artikelen[0]?.created_at
    ? toRfc2822(artikelen[0].created_at)
    : new Date().toUTCString();

  const items = artikelen
    .map((a) => {
      const link = `${BASE_URL}/${a.slug}`;
      const enclosure = a.thumbnail_url
        ? `<enclosure url="${escapeXml(a.thumbnail_url)}" type="image/jpeg" length="0" />`
        : "";
      return `
    <item>
      <title>${escapeXml(a.titel)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(a.samenvatting)}</description>
      <pubDate>${toRfc2822(a.created_at)}</pubDate>
      ${enclosure}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Film &amp; Series Nieuws + Tips | UnWatched</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Het laatste film- en series nieuws</description>
    <language>nl</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
