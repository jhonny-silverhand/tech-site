# Changelog

All notable changes to tech//site are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-09-21

Initial release of the rebuilt site (Next.js 15 + Supabase + live Gemini).

### Added
- **Live product intelligence** — search, detail, and compare fetched from
  Gemini at request time (`lib/gemini.ts`, `lib/live-products.ts`):
  specs, per-row winners with reasons, pros/cons, verdict, price guidance.
- **Detailed compare pages** — trophy winners, AI verdict card, retailer
  links, `compare/[slug]/loading.tsx` skeleton for long AI waits.
- **Commerce UI** — ProductCard with images, price-at-retailer attribution,
  price-history (PriceBefore/PriceHistory.in) and spec-compare
  (GSMArena/Versus) links; hero category quick-links with `/shopping?q=`
  deep-linking; related buying guides on product pages.
- **Hierarchical theming** — warm-paper light / blue-charcoal dark token
  system (`bg → sunken → paper → elev`), persisted theme +
  `prefers-color-scheme` fallback, FOUC-safe init, adaptive header/hero/
  menus. See `docs/design-liquid-glass.md`.
- **Gemini model fallback chains** (`3.6-flash → 3.5-flash → flash-latest`)
  on shopping, PC builder, and product routes.
- **Homepage AI hero budget** — 8 s cap so a slow model never blocks the
  page; 30-min cache warms in background.
- **Compare search errors** — API failures surface as banners instead of
  silent empty lists; `successsoft/dangersoft/warnsoft` theme tokens.
- **Privacy disclosures** — AI-estimate accuracy, affiliate, shopping-data
  handling, retention, contact sections.
- **SpeedInsights gating** — rendered on Vercel only (self-hosted 404 fix).
- **Docs** — README, CHANGELOG, `docs/environment.md`.

### Changed
- **Offline product catalog removed** — `content/seed-products.ts` and
  `scripts/seed-supabase.ts` deleted; `lib/products.ts` is Supabase-only
  (wishlist/guides relations); search-index drops products.
- Dev runs on **Turbopack** (`next dev --turbopack`, ~2–4× faster cold
  compiles); prod First Load JS stays lean at ~103 kB shared.
- `GEMINI_API_KEY` restored from reference env (was empty → AI 503s).

### Fixed
- Admin login 401 — generated `ADMIN_PASSWORD_HASH_B64` (verified
  `admin123` → 200 `{"ok":true}`).
- `data-scroll-behavior="smooth"` — silences Next route-transition warning.
- Prod vendor-chunk corruption from dev/build sharing `.next` — clean-build
  discipline documented.

### Known limitations
- Product prices are AI estimates; Gemini free-tier quota is shared and
  rate-limits under bursts (429/503 with graceful degradation).
- Wishlist works only for catalog (Supabase) products — live-only items
  hide the button (FK constraint).
