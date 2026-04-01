import type { Heading } from "@/lib/extract-headings";

interface Props {
  headings: Heading[];
}

export default function Inhoudsopgave({ headings }: Props) {
  if (headings.length < 3) return null;

  return (
    <nav className="my-6 rounded border-l-4 border-brand bg-tag-bg px-4 py-3">
      <p className="font-sora font-semibold text-sm text-text-primary mb-2">
        Inhoudsopgave
      </p>
      <ul className="flex flex-col gap-1">
        {headings.map((h) => (
          <li key={h.anchor} className="flex items-baseline gap-2">
            <span className="shrink-0">🔸</span>
            <a
              href={`#${h.anchor}`}
              className="text-sm font-sans text-text-primary hover:text-brand transition-colors"
            >
              {h.tekst}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
