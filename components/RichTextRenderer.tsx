"use client";

interface Props {
  inhoud: string;
}

export default function RichTextRenderer({ inhoud }: Props) {
  const alineas = inhoud
    .split(/\n\n|\\n\\n/)
    .map((p) => p.replace(/\\n/g, "\n").trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {alineas.map((alinea, i) => (
        <p key={i} className="text-base leading-relaxed">
          {alinea}
        </p>
      ))}
    </div>
  );
}
