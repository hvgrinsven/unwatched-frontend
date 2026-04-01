export interface Heading {
  tekst: string;
  anchor: string;
}

export function tekstNaarAnchor(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(inhoud: string): Heading[] {
  const regex = /\[H2\]([\s\S]*?)\[\/H2\]/g;
  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(inhoud)) !== null) matches.push(m);
  return matches.map((m) => {
    const tekst = m[1].trim();
    return { tekst, anchor: tekstNaarAnchor(tekst) };
  });
}
