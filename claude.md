# CLAUDE.md — UnWatched Nieuws Blog

Dit is de projectconstitutie voor de UnWatched nieuws blog op unwatched.nl/nieuws.
Lees dit bestand altijd volledig voordat je iets bouwt of aanpast.

---

## Project Doel

Een film- en serienieuws blog geïntegreerd in unwatched.nl. Stijl gebaseerd op nu.nl:
overzichtelijk, snel, nieuwsgedreven. Artikelen worden automatisch geplaatst via Make.com
via de Strapi REST API. De frontend is een Next.js site.

---

## Tech Stack

| Laag        | Technologie                        |
|-------------|------------------------------------|
| Frontend    | Next.js 14 (App Router)            |
| Styling     | Tailwind CSS                       |
| CMS / API   | Strapi v5 (hosted op Strapi Cloud) |
| Database    | Strapi's eigen SQLite / Postgres   |
| Hosting     | Cloudflare Pages                   |
| Automatisering | Make.com → Strapi REST API      |
| Afbeeldingen | Cloudinary (via Make.com pipeline) |

---

## Designsysteem

Stijlreferentie: **nu.nl** — compact nieuws, veel content zichtbaar, duidelijke hiërarchie.

### Kleuren
```css
--color-brand:       #E8001C;   /* UnWatched rood — primaire accentkleur */
--color-brand-dark:  #B8001A;
--color-bg:          #F5F5F5;   /* lichtgrijs pagina-achtergrond */
--color-surface:     #FFFFFF;   /* kaart-achtergrond */
--color-text-primary:#0D0D0D;
--color-text-muted:  #666666;
--color-border:      #E0E0E0;
--color-tag-bg:      #FFF0F0;
--color-tag-text:    #E8001C;
```

### Typografie
- **Headlines**: `Sora` (Google Fonts) — modern, leesbaar, licht futuristisch
- **Body**: `Source Serif 4` — prettig leesbaar voor artikeltekst
- **UI / labels**: `DM Sans` — compact, neutraal

### Layout principes
- Max breedte: 1280px, centered
- Hoofdgrid: 3 kolommen desktop (groot artikel links, smallere rechts), 1 kolom mobiel
- Kaarten hebben altijd: thumbnail, categorie-tag, titel, datum, korte samenvatting
- Geen overdreven witruimte — nieuwsdicht zoals nu.nl
- Sticky navigatiebalk bovenaan met logo + categoriefilters

---

## Strapi Content Types

### `artikel` (collection type)
```
titel          String (required)
samenvatting   Text (required, max 200 tekens)
inhoud         Rich Text (required)
slug           UID (gebaseerd op titel)
thumbnail      Media (single image)
categorie      Enumeration: film | serie | streaming | trailer | review | nieuws
bron_url       String (optioneel — originele bron)
gepubliceerd   Boolean (default: false)
publishedAt    DateTime (Strapi's eigen veld)
```

### API endpoint (publiek leesbaar)
```
GET /api/artikels?sort=publishedAt:desc&populate=thumbnail&pagination[pageSize]=20
GET /api/artikels/:slug
```

---

## Make.com Integratie

Make.com stuurt een HTTP POST naar Strapi bij elk nieuw artikel:

```json
POST /api/artikels
Authorization: Bearer {{STRAPI_API_TOKEN}}
Content-Type: application/json

{
  "data": {
    "titel": "{{titel}}",
    "samenvatting": "{{samenvatting}}",
    "inhoud": "{{inhoud_html}}",
    "categorie": "{{categorie}}",
    "bron_url": "{{bron_url}}",
    "thumbnail": {{cloudinary_media_id}},
    "gepubliceerd": true
  }
}
```

Afbeeldingen worden eerst via Cloudinary geüpload en daarna als media-ID meegegeven.

---

## Next.js Projectstructuur

```
unwatched-nieuws/
├── CLAUDE.md                  ← dit bestand
├── app/
│   ├── layout.tsx             ← root layout met nav + footer
│   ├── page.tsx               ← homepage: nieuwsoverzicht
│   ├── [slug]/
│   │   └── page.tsx           ← artikel detailpagina
│   └── categorie/[naam]/
│       └── page.tsx           ← gefilterde categorieweergave
├── components/
│   ├── ArtikelKaart.tsx       ← herbruikbare nieuwskaart
│   ├── HeroArtikel.tsx        ← groot uitgelicht artikel bovenaan
│   ├── Navigatie.tsx          ← sticky nav met categoriefilters
│   ├── ArtikelGrid.tsx        ← grid van meerdere kaarten
│   └── Footer.tsx
├── lib/
│   └── strapi.ts              ← fetch helper voor Strapi API
├── public/
└── tailwind.config.ts
```

---

## Coderingsregels (volg altijd)

1. Gebruik **TypeScript** overal — geen `.js` bestanden
2. Gebruik **Next.js App Router** — geen Pages Router
3. Data fetching via **Server Components** (`async/await` in component)
4. Gebruik `next/image` voor alle afbeeldingen (automatische optimalisatie)
5. Gebruik `next/link` voor interne navigatie
6. Responsief: mobiel-first, Tailwind breakpoints `sm:` `md:` `lg:`
7. SEO: elke pagina heeft `metadata` export met titel + description
8. Revalidatie: gebruik `revalidate = 60` (ISR) zodat nieuwe artikelen automatisch verschijnen
9. Error handling: toon altijd een fallback als de Strapi API niet beschikbaar is
10. Geen `any` types in TypeScript

---

## Omgevingsvariabelen (.env.local)

```
NEXT_PUBLIC_STRAPI_URL=https://jouw-strapi-project.strapiapp.com
STRAPI_API_TOKEN=xxxx
NEXT_PUBLIC_SITE_URL=https://unwatched.nl
```

---

## Wat NIET te doen

- Geen WordPress of andere CMS dan Strapi
- Geen client-side data fetching voor artikeloverzichten (gebruik SSR/ISR)
- Geen CSS frameworks anders dan Tailwind
- Geen onnodige npm packages — hou het lichtgewicht
- Geen placeholder content in productie-commits

---

## Doelgroep & Toon

Nederlandse film- en serie-enthousiastelingen. Toon: direct, informatief, licht enthousiast.
Geen clickbait koppen. Korte, heldere samenvattingen.