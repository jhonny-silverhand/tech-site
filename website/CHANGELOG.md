# Changelog

All notable changes to tech//site are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.4.0] - 2026-11-09

### Redesign — "Silkscreen" design system v3 (icons + tokens + /shopping)
*(Method: awwwards-skill workflow from github.com/juliobsz/skills — concept, art direction,
typography, motion — applied with focus on /shopping. System documented in `DESIGN.md`.)*

- **Sharp-flat icon system** (`components/icons/`, 69 glyphs): replaces lucide-react
  site-wide (35 import sites). Hand-drawn in the Streamline "Sharp Flat" visual language —
  24 px grid, fill-only, mitered corners, two-tone (`currentColor` + 34 % `sf-tone2` tint),
  lucide-compatible API (`size`/`className`). Rationale: the official Streamline set is
  paid (subscription npm token); the visual language is replicated instead. lucide-react,
  Inter, Fraunces and Cormorant Garamond dependencies removed.
- **Typography switch — Archivo Variable** (self-hosted width-axis 62–125 %): display cut
  `font-stretch: 125 %` w800, text cut normal width; JetBrains Mono unchanged; serif voices
  (Fraunces/Cormorant) and Inter removed from type scale, prose and Tailwind config.
- **Geometry — radius 0 sitewide**: Tailwind radius scale overridden to 0 px (only
  `rounded-full` kept for true circles — dots, orbit rings, spinner); pill chips and
  avatars converted to square in 16 files; `.card`/`.chip`/`.elev`/`.sunken` sharp.
- **Signal accent**: blue `#3d63f2` → red-orange `#D9481F` (light) / `#FF6B3D` (dark),
  text-safe `#BE3A0E` / `#FF8A5E` (AA-verified 4.7:1 / 8.5:1). Favicon `//` mark follows.
- **`/shopping` deep redesign**: console hero (four-corner status strip, poster statement,
  `>`-prompt query input, scanline sweep while the AI chain works), loading state with
  cycling stage readout (PARSING → SPECS → PRICES → RANKING) + elapsed counter, results as
  a ranked ledger (tabular rank numerals, top-pick signal bar, feature chips, flood-hover
  buy buttons), pipeline strip, query tips, dark next-instruments footer strip. Page's
  hardcoded cream/teal palette removed — now fully on site tokens (light + dark).
- **Homepage shopping panel** (`ShoppingIntelligenceHero`) restyled to the console language;
  `ProductCard` and compare/pc-builder pages inherit the new system via tokens.
- **Motion system** (globals.css): `.snap-in` settle entrances, `.scanline` sweep,
  `.flood` button fills, `.icon-nudge` arrow travel, `.roll`/`.draw` nav hovers — all with
  `:focus-visible` and reduced-motion fallbacks.
- **Docs:** `website/DESIGN.md` added (concept card + system, awwwards-skill artifact);
  `package.json` version aligned to changelog (1.1.0 → 1.4.0, resolving a flagged drift).
- QA: `tsc --noEmit` clean; `next build` clean (54 routes); /shopping, /, /compare
  verified by screenshot in light + dark + 390 px mobile (VLM review loop, 6 icons iterated).

## [1.3.0] - 2026-11-09

### Backfilled — shipped 2026-09-22 → 2026-09-24, previously undocumented
*(16 commits had no changelog entries; backfilled factually from git history during the 2026-11-09 documentation review)*
- **Central AI router** (`lib/ai-router.ts`): every model call now flows through one
  chokepoint — `gemini-3.8-flash → 3.7-flash → 3.6-flash` (single try each, 3 s gap),
  then Groq `openai/gpt-oss-120b` fallback via `GROQ_API_KEY` (separate quota pool).
  `lib/gemini.ts` reduced to a compatibility shim. (`cc2a5c3`, `9aebd28`)
- **Real retailer links from model output + heavy-load notice** on `/shopping`. (`f2e2ae9`)
- **Breadcrumb separators `//`** + breadcrumb on the compare index. (`b3333b6`)
- **Marketing showcase served at `/showcase`** (static HTML + Pixels font). (`59d1674`)
- **Pixel neko day/night theme switch** — cat artwork, tight 10 KB face crops,
  celebration popup, simple Sun/Moon toggle via `techsite:theme-changed`. (`1e516dd`, `38dd306`, `90de0b2`)
- **Admin dashboard overhaul** — stats, drafts attention, quick actions, delete;
  Pixels wordmark sizing pass (40 px sitewide, 32 px admin nav/login; `//` on all
  brand mentions except copyright). (`3153fa3`, `7966496`, `c30f0de`)
- **Desktop-view notice popup** on small displays. (`9c5d53b`)
- **Site-wide corner toast**, auto-dismiss 4 s. (`be52192`)
- **Curated per-niche cover pools** replace random picsum covers (`lib/cover-pools.ts`). (`833fa1a`)
- **Mobile overflow fixes** — long inline code wraps, product spec tables scroll. (`4af2bf4`)
- **Compacts + marketing fonts committed** (`compacts/markdown-file-review.md`). (`01287e1`)

### Added — 2026-11-09
- **Root documentation set** (owner-mandated standing workflow): `compact.md`,
  `technical-documentation.md`, `business-documentation.md`, `decisions.md`,
  `help.md`; root `README.md` refreshed (10-niche taxonomy, live-AI shopping,
  current schema/env pointers); legacy status note added to root `CHANGELOG.md`.
- Documentation review flagged (recorded in `decisions.md`): `package.json` still
  `1.1.0` vs this changelog; committed `public/version.json` stale at `1.0.0`;
  `website/temp.md` is an unrelated GitHub-profile draft; Groq/Resend keys exposed
  in a past chat session need rotation.

## [1.2.0] - 2026-09-21

### Added
- Working contact form — `POST /api/contact` via Resend with validation
  and inline states (`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`).
- YouTube-style route loading bar (`RouteProgress`) matching the article
  read-progress slot.
- Niche font specimens draft page (`/font-preview`, noindex, unreleased).
- Monorepo layout — app at `website/`, legacy snapshot at
  `archived/website-backup`, guides and research alongside.

### Changed
- Nav Admin button removed; footer link reads "admin login".
- Pixels wordmark scaled up (~40px: header 38, footer 40, orbit/auth 38)
  with layout guards; embedded in OG image (Satori flex fix).
- Cheerful shopping redo — cream/grape surfaces with coral, sunny,
  and teal accents; display titles unchanged.
- PC builder, shopping, and drafts share the Gemini fallback chain
  (`3.6 → 3.5 → latest`) after the `2.5-flash` retirement.
- AI niche displays as "AI Tools" (slug unchanged).

### Fixed
- `user_xxxxxxxx` handles — username editor with availability check,
  post-login setup redirect, signup error/confirmation surfacing.
- Header username trimmed to 10ch with full name on hover.
- Scroll-behavior hydration warning (`data-scroll-behavior`).
- AccountMenu hydration mismatch (stale Turbopack server HTML).

## [1.1.0] - 2026-09-21

### Added
- Username onboarding — editable username with availability check in
  settings; logins with auto `user_xxxxxxxx` handles route to setup;
  signup surfaces profile errors and email-confirmation state.
- Pixels brand font (legacy asset) for the wordmark.
- `successsoft/dangersoft/warnsoft` theme tokens; compare search errors
  render as banners instead of silent empty lists.
- AI niche displays as "AI Tools" (slug unchanged).

### Changed
- Package identity: `tech-site` 1.1.0 with author/repo metadata.
- Monorepo layout — app lives at `website/`, legacy code under
  `archived/`, guides and research alongside.

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
