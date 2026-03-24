"use client";

import { Share2 } from "lucide-react";

interface Props {
  slug: string;
  titel: string;
}

export default function ShareButtons({ slug, titel }: Props) {
  const url = `https://unwatched.nl/${encodeURIComponent(slug)}`;
  const tekst = encodeURIComponent(titel);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${tekst}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${tekst}%20${url}`,
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-1 text-xs text-text-muted font-sans">
        <Share2 size={13} className="text-brand" />
        Delen
      </span>
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-sans font-medium px-2.5 py-1 rounded border border-border text-text-muted hover:border-brand hover:text-brand transition-colors"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
