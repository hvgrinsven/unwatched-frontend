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
      <ol className="flex flex-col gap-1">
        {headings.map((h, i) => (
          <li key={h.anchor} className="flex items-baseline gap-2">
            <span className="text-xs font-sans text-brand font-semibold w-4 shrink-0">
              {i + 1}.
            </span>
            <a
              href={`#${h.anchor}`}
              className="text-sm font-sans text-text-primary hover:text-brand transition-colors"
            >
              {h.tekst}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
