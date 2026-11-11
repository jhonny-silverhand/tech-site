# Technical Documentation — tech//site

**Updated:** 2026-11-11 · **Repo state:** `main` @ 1.4.1 (skin revert of the 1.4.0 Silkscreen redesign; /shopping console layout kept) · **Live:** https://tech-site-new.vercel.app/

## 1. What this is

A hybrid technology publication + shopping-intelligence platform: editorial articles across 10 niches, a personal knowledge library, a creator/user publishing layer, and product search/detail/compare data fetched **live from Gemini at request time** (no offline catalog). Single deployable Next.js app (`website/`) on Vercel, backed by Supabase.

## 2. Repository layout (monorepo)

```
tech-site/
├── website/                  ← THE APP (Next.js 15). Vercel Root Directory.
│   ├── app/                  ← App Router: (main), (auth) groups + api/
│   ├── components/           ← feature + ui/ primitives + admin/
│   ├── lib/                  ← data, AI router, live products, auth, niches…
│   ├── content/              ← 11 seed articles (markdown) + seed-posts/guides
│   ├── supabase/schema.sql   ← DB source of truth (20 tables, idempotent)
│   ├── docs/                 ← environment.md, design-liquid-glass.md
│   ├── scripts/              ← gen-version.mjs, hash-password.mjs
│   └── public/               ← fonts/Pixels.ttf, theme cats, showcase/, version.json
├── Guides/                   ← setup walkthroughs (00–04) + legacy SQL (v4.0 era)
├── marketing-page/           ← static marketing HTML + Pixels font (also at /showcase)
├── design-research/          ← 3.0 editorial design research
├── compacts/                 ← historical session-compaction summaries
├── data/last-scrape.json     ← legacy scrape record (2026-09-16; catalog is live-AI now)
├── archived/website-backup/  ← frozen pre-rebuild snapshot (own 4.x changelog) — read-only
├── prompt.md                 ← original 1,278-line build spec (historical; old taxonomy)
└── root docs: README, CHANGELOG (legacy), technical/business documentation, decisions, help, compact
```

## 3. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (`^15.1.6`), React 19, TypeScript 5.6 |
| Styling | Tailwind CSS 3.4, CSS-variable theme tokens (design system v2 restored 2026-11-11: rounded radii 4–16 px, blue accent), self-hosted Fontsource variable fonts (Fraunces, Cormorant Garamond, Inter, JetBrains Mono) + local `Pixels.ttf` brand font |
| Database/Auth | Supabase (PostgreSQL + Auth + Storage + RLS), `@supabase/ssr` 0.5 |
| AI | Gemini REST (direct fetch) with fallback chain + Groq — see §6 |
| Admin auth | `jose` (JWT) + `bcryptjs`, httpOnly cookie `tech_site_admin_session`, 7-day expiry |
| Email | Resend HTTP API (contact form, no SDK) |
| Markdown | react-markdown 9 + remark-gfm + rehype-highlight + rehype-slug |
| Icons/UI | `lucide-react ^0.454.0` (restored 2026-11-11 — the 1.4.0 custom `components/icons/` sharp-flat system was deleted with the skin revert), custom `components/ui/` primitives |
| Analytics | Vercel Speed Insights (rendered only when `NEXT_PUBLIC_VERCEL_ENV` is set) + Vercel Web Analytics |
| Deploy | Vercel (Root Directory `website`, `next build`; build runs `scripts/gen-version.mjs` first) |

Scripts (`website/package.json`): `dev` (wipes `.next`, then `next dev --turbopack`), `build`, `start`, `lint`, `hash-password`.

## 4. Application architecture

### Route groups (`website/app/`)
- **`(main)/`** — public site chrome (Header + Footer): home, `articles/[slug]`, `niche/[slug]`, `guides`, `products/[slug]`, `compare` (+ `[slug]` with `loading.tsx`), `shopping`, `pc-builder`, `library` (+ `settings`, `collections/[id]`), `profile/@me` + `profile/[username]`, `dashboard`, `write` (+ `[id]`), `onboarding`, `contact`, `about`, `privacy`, `font-preview` (noindex), and `admin/` (`login` + `(protected)/` dashboard/categories/posts).
- **`(auth)/`** — chrome-free editorial shell: login, signup, forgot-password, reset-password.
- **`api/`** — `admin/{login,logout,generate,upload,posts,posts/[id]}`, `user-posts{,/[id]}`, `products/{search,[slug]}`, `shopping/ai-recommend`, `pc-builder/ai-build`, `compare`, `wishlist`, `search-index`, `currency/convert`, `contact`.
- `middleware.ts` refreshes the Supabase session only — no route protection (protection happens in layouts/lib).

### Rendering & performance patterns
- Server Components by default (`PostCard`, `ProductCard`, `BentoGrid`, `Header`, `Footer`); interactivity isolated in Client Components.
- Homepage runs 4 independent fetches via `Promise.all` (`app/(main)/page.tsx`); below-fold sections stream via `<Suspense>`.
- `CARD_COLUMNS` in `lib/data.ts` excludes the heavy `content` body for card/list queries.
- Dynamic imports with `ssr: false` through wrapper components (`ClientShell` → CommandPalette + SpeedInsights; `FeatureDiscoveryWrapper`; `ShoppingIntelligenceHeroLazy`).
- Critical-path Supabase calls wrapped in `withTimeout` (2.5 s cap, `lib/with-timeout.ts`) — introduced after a hung Supabase URL made every page take 7.4 s.
- `recordView` (reading history) is fire-and-forget.
- Session notes report: clean build of 51 pages, ~103 kB shared First Load JS.

## 5. Data layer

- **Dual mode:** every content function checks `isSupabaseConfigured()` (`lib/supabase/config.ts`) — Supabase first, local seed fallback (`content/seed-posts.ts` + `content/articles/*.md`) when unconfigured. Public site works with zero setup.
- **Schema:** `website/supabase/schema.sql` is the source of truth — 20 tables: `profiles, posts, bookmarks, reading_history, reading_queue, collections, collection_posts, comments, author_follows, topic_follows, highlights, private_notes, product_categories, products, product_specs, retailers, product_retailers, wishlists, buying_guides, buying_guide_recommendations`. Idempotent (safe to re-run). RLS on all user data; `posts.featured` boolean exists in schema and app (`getFeaturedPosts`). `handle_new_user` trigger auto-creates `user_xxxxxxxx` usernames on signup.
- **Guides/sql/** holds the legacy v4.0-era SQL (schema history, seeds, scraped-products, pc-components) — reference only, not the current schema.
- **Storage:** bucket `post-images` (public) for admin cover uploads.
- **Supabase clients:** browser (`lib/supabase/client.ts`), server cookie-aware (`lib/supabase/server.ts`), and admin service-role client (bypasses RLS, server-only).

## 6. AI subsystem

- **`lib/ai-router.ts` — single chokepoint for every model call:** `gemini-3.8-flash → gemini-3.7-flash → gemini-3.6-flash` (one try each, 3 s gap between attempts), then **Groq** `openai/gpt-oss-120b` if `GROQ_API_KEY` is set (separate vendor + quota pool). Exposes `aiText()` / `aiJson()`; throws `AIError` with HTTP status. Caps Gemini burn at ≤3 calls per request.
- **`lib/gemini.ts`** — reduced to a compatibility shim re-exporting from the router (`GeminiError`, `geminiJson`).
- **`lib/live-products.ts`** — product search/detail data synthesized from model JSON at request time: slugified names, up to 24 specs, AI-estimated INR prices (`price_inr` → cents), and Amazon.in/Flipkart **search** links per product (`live: true` flag). No offline catalog (`content/seed-products.ts` and `scripts/seed-supabase.ts` were deleted at the 1.0 rebuild).
- **`lib/ai.ts`** — admin-only draft generation (prompt + rules array; drafts land in the editor, never auto-publish).
- **Consumers:** `/api/shopping/ai-recommend`, `/api/products/search`, `/api/products/[slug]`, `/api/compare`, `/api/pc-builder/ai-build`, homepage shopping hero, admin generate.
- **Quota reality:** Gemini free tier is shared across all these routes; 429/503 waves are expected — the chain + Groq exist exactly for that. Product pages can take 10–25 s; compare has a dedicated `loading.tsx` skeleton and `/shopping` shows a heavy-load notice.

## 7. Authentication

- **Users:** Supabase email/password auth; session refreshed in middleware; RLS scopes all library/social data to `auth.uid()`. Signup confirmation + password recovery flows set `emailRedirectTo` from the actual origin (requires both localhost and prod URL in Supabase → Authentication → URL Configuration → Redirect URLs).
- **Admin:** single account, separate from Supabase Auth. `POST /api/admin/login` verifies bcrypt hash (`ADMIN_PASSWORD_HASH_B64`, base64-encoded so `$` chars survive `.env` parsing) and sets a signed JWT cookie; `(protected)` layout guards routes; admin API uses the service-role client.
- **Split publishing model (enforced):** admin can generate AI drafts; regular users get no AI anywhere — admin-only routes + RLS.

## 8. Theming & UI system (v2 — restored 2026-11-11 via the 1.4.1 skin revert)

- Design system v2 (`website/app/globals.css`): warm-paper light / blue-charcoal dark, hierarchical surface tokens (`bg → sunken → paper → elev`), accent `#3d63f2` light / `#7aa2ff` dark, rounded radii (Tailwind scale 4–16 px). Typography: Fraunces Variable (`.t-display/.t-page/.t-section`, `.font-display`), Cormorant Garamond taglines (`.t-dek`), Inter body, JetBrains Mono for data (`t-meta`, chips, code). Icons: `lucide-react` everywhere.
- Utilities: `.card`, `.card-interactive`, `.chip` (tone variants), `.eyebrow`, `.status-dot` (idle/busy + pulse), `.skeleton`, prose system `.prose-tech`. Theme persisted in `localStorage`, `prefers-color-scheme` fallback, FOUC-safe inline init script in `app/layout.tsx`.
- **`/shopping` console layout (kept from 1.4.0, owner instruction "only keep the current layout"):** corner meta strip (status dot + chain/currency readout), two-column hero with labeled query input (`>` prompt + helper line), cycling scan-stage readout (`SCAN_STAGES`) + elapsed counter while the AI chain works, results as a ranked ledger (rank / body / price+buy columns, top-pick coral bar + gold badge), numbered "How it works" cells, numbered tips rows, Compare/PC-Builder footer cards. Rendered on the page's original hardcoded cream/grape + coral palette (`#FFF8ED`/`#16152E`, `#E85D5D`) with original texts — not site tokens (pre-1.4.0 behavior).
- Known trap (bit us twice): `bg-ink` flips to a light color in dark mode — use `bg-void` for always-dark surfaces.
- `Pixels.ttf` wordmark font (~38–40 px) on header/footer/orbit/auth/admin/OG image, except copyright line.
- Neko cat day/night toggle (`public/theme-cat-*.png` + tight face crops) with `ThemeCelebration` popup driven by the `techsite:theme-changed` custom event; `RouteProgress` YouTube-style route loading bar; `SiteToast` corner toast (4 s auto-dismiss); desktop-view notice popup on small displays.
- Per-niche editorial treatments: Finance mono figures (rehype plugin), AI citation-style links, Gaming cinematic hero. Niche colors from `lib/niches.ts` drive tags/cards/progress/ambient wash.

## 9. Environment & deployment

- Env contract: `website/.env.example` (Supabase ×3, `ADMIN_*` ×3, `GEMINI_API_KEY`, `GROQ_API_KEY` + `GROQ_MODEL`, `RESEND_API_KEY` + `CONTACT_TO`/`CONTACT_FROM`, `NEXT_PUBLIC_SITE_URL`). Full walkthrough: `website/docs/environment.md`. Restart dev after edits.
- Vercel: Root Directory `website`; same env vars in Project Settings; `NEXT_PUBLIC_SITE_URL` = production origin (metadata/sitemap/robots).
- `public/version.json` is generated at build by `scripts/gen-version.mjs` (reads package.json + git); the committed copy reads `1.0.0/unknown` — treat as build artifact, not source of truth.
- SEO: dynamic `sitemap.ts`, `robots.ts` (disallows `/admin/`, `/api/`, `/dashboard`, `/library/`, `/write/`), OG/Twitter metadata, JSON-LD on articles, generated OG image (`opengraph-image.tsx`).

## 10. Data flow (end-to-end)

```
Reader ──▶ Next.js page (Server Component)
             ├─ content ──▶ lib/data.ts ──▶ Supabase (withTimeout 2.5s) ──▶ fallback: content/seed-*
             ├─ library/social ──▶ lib/library.ts ──▶ Supabase (RLS, user-scoped)
             ├─ products/compare/shopping/pc-builder ──▶ api route ──▶ lib/ai-router.ts
             │        ├─ Gemini 3.8 → 3.7 → 3.6 (3s gaps) ──▶ JSON
             │        └─ Groq gpt-oss-120b (fallback)
             │             └─▶ lib/live-products.ts shapes Product[] (AI-EST price, retailer search links)
             └─ contact ──▶ /api/contact ──▶ Resend ──▶ owner inbox

Admin ──▶ /admin/login (JWT cookie) ──▶ admin API (service-role) ──▶ full CRUD + AI drafts + Storage upload
```

## 11. Known open issue

**`featured` schema-cache error** — "Could not find the 'featured' column of 'posts' in the schema cache." Column exists in `website/supabase/schema.sql`; live REST probe on `pploiphhwdmerwonqrct.supabase.co` returned `200` with `featured` data. Suspected stale PostgREST schema cache or a query against a different table/project. Next step: diff schema vs live DB, reload PostgREST schema cache, re-run loopbacks. See `help.md`.

## 12. Heritage notes (read before touching legacy paths)

- Root `CHANGELOG.md` = legacy pre-rebuild log (v1.0→v4.3, 2026-07-18→09-12; contains two different "4.2" sections). Current log = `website/CHANGELOG.md` (1.x series).
- `archived/website-backup/` = frozen intermediate snapshot (scraped-catalog era: Amazon/Flipkart scrapers, 436 products, PC compatibility engine) — superseded by the live-AI rebuild; do not build on it.
- `prompt.md` reflects the **original** spec: old niche slugs (`ai-tools`, `windows-linux`, `buying-guides`, `career-jobs`, `components`) and offline seed products — the live app uses `lib/niches.ts` (10 slugs) and live AI products instead.
- `Guides/03-what-to-edit.md` still describes some pre-rebuild specifics (e.g. `CONTACT_EMAIL` constant, `picsum` covers) — verify against code before relying on it.
