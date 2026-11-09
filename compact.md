# compact — tech//site

**Updated:** 2026-11-09 · **Repo:** github.com/jhonny-silverhand/tech-site · **Branch:** `main` @ `01287e1` (2026-09-24, HEAD) · **Live:** https://tech-site-new.vercel.app/ (HTTP 200 verified 2026-11-09)

Read this file first when cold-starting on this project.
`website/compact.md` and `compacts/*.md` are **historical** session-compaction summaries (frozen); this root file is the canonical one.

## Objective

Maintain and further develop **tech//site** — a hybrid multi-niche technology publication + 100% live AI shopping-intelligence site. Monorepo: Next.js 15 app in `website/`, deployed on Vercel, backed by Supabase.

## Important Details

- **Layout:** `website/` = the app (start here) · `Guides/` = setup docs + legacy SQL · `archived/website-backup/` = frozen pre-rebuild snapshot (its own 4.x changelog) · `marketing-page/` = static marketing page, also served in-app at `/showcase` · `prompt.md` = original 1,278-line build spec (**historical**, uses the old taxonomy) · `compacts/` = old session summary · `data/last-scrape.json` = legacy scrape record (products are live-AI now, not scraped).
- **Stack:** Next.js 15 App Router + React 19 + TypeScript + Tailwind 3.4 · Supabase (Postgres + Auth + Storage) · Gemini + Groq via `lib/ai-router.ts` · Resend (contact) · lucide-react · Fontsource variable fonts + local `Pixels.ttf` brand font.
- **Database:** 20 tables, source of truth = `website/supabase/schema.sql` (idempotent, includes `featured` column on `posts`, RLS everywhere, `handle_new_user` trigger creates `user_xxxxxxxx` usernames). Storage bucket `post-images`. Live project: `pploiphhwdmerwonqrct.supabase.co` (old abandoned project: `kgflqrpdcaxccvuxyhff`). `Guides/sql/` = legacy v4.0-era SQL, reference only.
- **AI subsystem:** central chokepoint `lib/ai-router.ts` — `gemini-3.8-flash → gemini-3.7-flash → gemini-3.6-flash` (single try each, 3 s gap), then Groq `openai/gpt-oss-120b` (separate quota pool, needs `GROQ_API_KEY`). `lib/gemini.ts` is now a compatibility shim over the router. Products are **100% live from the model at request time** (`lib/live-products.ts`) — no offline catalog; prices are AI estimates labeled in the UI; Amazon.in/Flipkart search links generated per product.
- **Auth (two systems):** users = Supabase email auth + RLS (split publishing: users write manually, **no AI**, enforced at DB level); admin = separate JWT cookie `tech_site_admin_session` (7-day, `jose` + bcrypt via `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH_B64` / `ADMIN_SESSION_SECRET`), login at `/admin/login`. Dev credential on record: `admin@techsite.com` / `admin123` — **needs rotation**.
- **Contact:** `POST /api/contact` → Resend → `jhonnysilverhand.069@gmail.com`.
- **Theming:** hierarchical tokens (`bg→sunken→paper→elev`), warm-paper light / blue-charcoal dark, persisted + `prefers-color-scheme`, FOUC-safe init; Pixels font wordmarks (~38–40 px); neko cat day/night toggle + celebration popup (`techsite:theme-changed` custom event).
- **Taxonomy (`lib/niches.ts`, 10):** `ai, programming, android, windows, gadgets, gaming, career, finance, productivity, pc-hardware`. Slugs are immutable (URLs, sitemap, `topic_follows`). Display label for `ai` is "AI Tools".
- **Dev discipline:** `npm run dev` self-cleans `.next` and runs Turbopack; **never** share `.next` between dev and build (vendor-chunk 500s); restart dev after any `.env.local` edit; critical-path Supabase calls wrapped in `withTimeout` (2.5 s).
- **Env vars:** see `website/.env.example` + `website/docs/environment.md` — Supabase ×3, `ADMIN_*` ×3, `GEMINI_API_KEY`, `GROQ_API_KEY`/`GROQ_MODEL`, `RESEND_API_KEY`/`CONTACT_TO`/`CONTACT_FROM`, `NEXT_PUBLIC_SITE_URL`.
- **Git:** commits use `Omkar K <omkardile84@gmail.com>` (owner instruction, 2026-11-09; earlier history shows "Omkar Kardile" and "jhonny-silverhand"). Origin remote is configured with an embedded PAT — never print the remote URL or the token.
- **Vercel:** Root Directory = `website`, build `next build`; two unmerged Vercel-bot branches exist (`vercel/install-vercel-speed-insights-…`, `vercel/vercel-web-analytics-…`).

## Work State

### Completed
- Editorial publication (articles, niches, TOC, related posts, cinematic gaming hero), personal Library (bookmarks/history/queue/collections/highlights/private notes), creator platform (profiles, follows, comments, onboarding, editor), admin dashboard overhaul (stats, quick actions, delete), live shopping/compare/pc-builder, `/showcase` marketing page, per-niche cover pools (`lib/cover-pools.ts`), site-wide corner toast (4 s auto-dismiss), desktop-view notice on small displays, mobile overflow fixes, contact form, route loading bar.
- Full history: `website/CHANGELOG.md` 1.0 → 1.3.0 (1.3.0 backfilled 2026-11-09) + `decisions.md`.

### Active
- **`featured` schema-cache bug (open):** "Could not find the 'featured' column of 'posts' in the schema cache". The column exists in `website/supabase/schema.sql` (line 57) and a live REST probe `GET /rest/v1/posts?select=featured` on the live project returned `200 [{"featured":true}]` (per compaction notes). Suspected stale PostgREST schema cache or a query hitting a different table/project. Unresolved at last session end (2026-09-2x).

### Blocked
- None hard. Pending hygiene: rotate Groq/Resend keys (exposed in a past chat session), rotate admin dev password (`admin123`), decide `package.json` version bump (still `1.1.0` while changelog is at `1.3.0`; `website/public/version.json` is a stale build artifact reading `1.0.0/unknown`).

## Next Move
1. Resolve the `featured` schema-cache bug: diff `website/supabase/schema.sql` `posts` columns vs the live DB, identify the failing query/table, reload the PostgREST schema cache (Supabase: `NOTIFY pgrst, 'reload schema';` or dashboard restart), re-run loopbacks (`tsc --noEmit`, key pages, admin/products APIs).
2. Rotate exposed keys + admin password; update Vercel env vars.
3. Agree next feature work with the owner.

## Relevant Files
- `website/lib/ai-router.ts` — AI chokepoint (chain + Groq) · `website/lib/live-products.ts`, `website/lib/gemini.ts` (shim) · `website/lib/ai.ts` (admin drafts)
- `website/lib/data.ts` (CARD_COLUMNS, seed fallback), `website/lib/niches.ts`, `website/lib/cover-pools.ts`, `website/lib/library.ts`, `website/lib/products.ts`, `website/lib/auth.ts`, `website/lib/with-timeout.ts`
- `website/supabase/schema.sql` — DB source of truth · `website/middleware.ts` (session refresh only)
- `website/app/(main)/page.tsx` (homepage, 4-way `Promise.all`) · `website/app/api/**` (admin, products, shopping, pc-builder, compare, contact, wishlist, search-index, currency)
- `website/components/` — Header/Footer/CommandPalette/ProductCard/ThemeToggle/ThemeCelebration/RouteProgress/SiteToast + `ui/` primitives
- Docs: this file, `README.md`, `CHANGELOG.md` (legacy), `website/CHANGELOG.md` (current), `technical-documentation.md`, `business-documentation.md`, `decisions.md`, `help.md`

## Documentation rules (standing, owner-mandated)
After **every** change, same turn: update `README.md`, `CHANGELOG.md` (current log = `website/CHANGELOG.md`; root `CHANGELOG.md` stays legacy), `technical-documentation.md`, `business-documentation.md`, `decisions.md`, `help.md`, and this file. Entries factual and dated, no editorializing. Flag contradictions — never silently overwrite.
