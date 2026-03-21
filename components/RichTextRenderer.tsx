interface Props {
  inhoud: string;
}

type Blok =
  | { type: "h2"; tekst: string }
  | { type: "p"; tekst: string }
  | { type: "faq"; vraag: string; antwoord: string };

function parseerInhoud(inhoud: string): Blok[] {
  // Normaliseer escaped newlines naar echte newlines
  const genormaliseerd = inhoud.replace(/\\n/g, "\n");

  // Splits op [ALINEA] als paragraafscheider
  const segmenten = genormaliseerd.split(/\[ALINEA\]/);

  const blokken: Blok[] = [];

  for (const segment of segmenten) {
    const tekst = segment.trim();
    if (!tekst) continue;

    // [H2]...[/H2]
    const h2Match = tekst.match(/^\[H2\]([\s\S]*?)\[\/H2\]$/);
    if (h2Match) {
      blokken.push({ type: "h2", tekst: h2Match[1].trim() });
      continue;
    }

    // [FAQ]Q: vraag A: antwoord[/FAQ]
    const faqMatch = tekst.match(/^\[FAQ\]([\s\S]*?)\[\/FAQ\]$/);
    if (faqMatch) {
      const binnenste = faqMatch[1].trim();
      const qaMatch = binnenste.match(/^Q:\s*([\s\S]*?)\s*A:\s*([\s\S]*)$/);
      if (qaMatch) {
        blokken.push({
          type: "faq",
          vraag: qaMatch[1].trim(),
          antwoord: qaMatch[2].trim(),
        });
        continue;
      }
    }

    // Gewone paragraaf — splits ook op dubbele newlines binnen een segment
    const alineas = tekst.split(/\n\n+/).filter(Boolean);
    for (const alinea of alineas) {
      blokken.push({ type: "p", tekst: alinea.replace(/\n/g, " ").trim() });
    }
  }

  return blokken;
}

export default function RichTextRenderer({ inhoud }: Props) {
  const blokken = parseerInhoud(inhoud);

  return (
    <div className="space-y-4">
      {blokken.map((blok, i) => {
        if (blok.type === "h2") {
          return (
            <h2
              key={i}
              className="font-sora font-bold text-xl text-text-primary mt-6 mb-2"
            >
              {blok.tekst}
            </h2>
          );
        }

        if (blok.type === "faq") {
          return (
            <div key={i} className="border-l-4 border-brand pl-4 py-1">
              <h3 className="font-sora font-semibold text-base text-text-primary mb-1">
                {blok.vraag}
              </h3>
              <p className="text-base leading-relaxed text-text-primary">
                {blok.antwoord}
              </p>
            </div>
          );
        }

        return (
          <p key={i} className="text-base leading-relaxed text-text-primary">
            {blok.tekst}
          </p>
        );
      })}
    </div>
  );
}
