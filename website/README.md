# tech//site

Practical answers, not filler — across code, devices, money, careers, and AI.
A hybrid blog + shopping-intelligence site: in-depth guides, honest product
comparisons, and AI tools that respect your time.

## Features

- **Articles & guides** — markdown-backed posts, buying guides with product
  recommendations, niche topic pages, table of contents, reading progress.
- **Live product intelligence** — product search, detail pages, and
  side-by-side comparisons are fetched **live from Gemini at request time**.
  No offline catalog: specs, winners per row, pros/cons, verdicts, and
  AI-estimated Indian street prices with Amazon/Flipkart search links.
- **AI shopping assistant** (`/shopping`) — natural-language recommendations
  with real picks, features, and buy links.
- **AI PC builder** (`/pc-builder`) — budget + use-case builds with
  component reasoning.
- **Library** — bookmarks, reading history/queue, collections, highlights,
  private notes, author/topic follows, all Supabase-backed.
- **Auth** — Supabase email auth for readers; separate JWT admin login
  (`/admin/login`) for content management.
- **Theming** — hierarchical light/dark design system (warm paper /
  blue-charcoal), persisted + system-preference aware. See
  [docs/design-liquid-glass.md](docs/design-liquid-glass.md).

## Stack

Next.js 15 (App Router, Turbopack dev) · React 19 · Tailwind CSS ·
Supabase (Postgres, Auth, Storage) · Gemini API · lucide-react icons.

## Quickstart

```bash
npm install
cp .env.example .env.local   # then fill values (see docs/environment.md)
npm run dev                  # http://localhost:3000 (self-cleans .next)
```

Production:

```bash
npm run build   # always from a clean .next — never share it with dev
npm start       # http://localhost:3000
```

Other scripts: `npm run hash-password -- "pw"` (admin hash),
`npm run lint`.

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin DB access |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH_B64` / `ADMIN_SESSION_SECRET` | Separate admin JWT auth |
| `GEMINI_API_KEY` | Live product data, shopping, PC builder, admin drafts |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, sitemap) |

Full reference: [docs/environment.md](docs/environment.md).
Restart dev after editing `.env.local`.

## Project structure

```
app/(main)/     pages (articles, guides, shopping, compare, pc-builder, …)
app/(auth)/     login, signup, password flows
app/api/        admin/*, compare, products/*, shopping/ai-recommend, …
components/     UI system (ui/*), cards, header/footer, palette
lib/            data, live-products (Gemini), gemini, auth, supabase/*
content/        markdown articles + seed posts/guides
supabase/       schema.sql (source of truth for the DB)
docs/           design + environment guides
```

Key API routes: `POST /api/shopping/ai-recommend {query}`,
`GET /api/products/search?q=`, `GET /api/products/[slug]`,
`GET /api/compare?names=a,b`, `POST /api/admin/login`.

## Notes & caveats

- Product prices are **AI estimates** — the UI labels them and links
  retailers for verification.
- Gemini free-tier quota is shared across search/detail/compare/hero;
  expect 10–25 s waits and occasional 429/503s (model fallback chain
  covers short outages).
- Dev and build must never share `.next` (causes vendor-chunk manifest
  errors) — `npm run dev` wipes it automatically.
- See [CHANGELOG.md](CHANGELOG.md) for history.
