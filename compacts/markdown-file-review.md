# Compact — Markdown File Review
- agentId: 152c20ec-eb08-408f-bc07-f2d9a1cd7d85
- title: Markdown File Review
- dir: D:\work\techsite
- source: transcript.txt (Summary of the earlier part of this conversation + recent messages)

---

## Objective
- Maintain and polish `tech//site` hybrid blog + live AI shopping site in monorepo `D:\work\tech-site\website`, fixing theming, auth, products, admin, and deploy pipeline.

## Important Details
- Current app: `D:\work\tech-site\website` (moved from `D:\work\techsite`); monorepo repo `https://github.com/jhonny-silverhand/tech-site` branch `main`; redundant `techsite` repo left for deletion; old code frozen at `archived/website-backup`, legacy docs in `reference/`.
- Vercel: Root Directory `website`, `npm run vercel-build` / `next build`; build clean 51 pages, ~103 kB shared JS; env vars required: Supabase URL/anon/service_role, `ADMIN_*`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`.
- Supabase live: `https://pploiphhwdmerwonqrct.supabase.co` (17 posts); old project `https://kgflqrpdcaxccvuxyhff.supabase.co` abandoned; new Supabase project pending user keys; `supabase/schema.sql` idempotent and audited.
- Taxonomy: `ai, programming, android, windows, gadgets, gaming, career, finance, productivity, pc-hardware`; display `ai` as `AI Tools`; slugs immutable (URLs, sitemap, `topic_follows`); old slugs `ai-tools, windows-linux, buying-guides...` rejected.
- Products 100% live: `lib/ai-router.ts` chain `gemini-3.8-flash → 3.7-flash → 3.6-flash` single-try +3s gap then Groq `openai/gpt-oss-120b` via `GROQ_API_KEY`; prices labeled `AI-EST`; no offline seed (`content/seed-products.ts`, `scripts/seed-supabase.ts` deleted).
- Dev: `npm run dev` self-cleans `.next` + `--turbopack`; never share `.next` between dev/build or run two servers (causes `vendor-chunks/@supabase.js` 500s); dev on `:3000`.
- Auth: Supabase user auth + separate admin JWT (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH_B64`, `ADMIN_SESSION_SECRET`); admin login `admin@techsite.com` / `admin123` verified 200; user `user_xxxxxxxx` auto-handles require settings onboarding.
- Theming: hierarchical tokens `bg→sunken→paper→elev`, warm paper light / blue-charcoal dark, persisted + `prefers-color-scheme`; Pixels font `public/fonts/Pixels.ttf` for all `tech//site` wordmarks (~40px) except copyright; neko theme cats `public/theme-cat-*.png` + face crops.
- Contact: `POST /api/contact` via Resend to `jhonnysilverhand.069@gmail.com`; keys `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`; exposed Resend/Groq keys need rotation.
- Git local-only identity `Omkar Kardile <omkardile84@gmail.com>`; global config empty.

## Work State
### Completed
- Theming overhaul, persistence, FOUC script, adaptive header/hero/footer/menus; `successsoft/dangersoft/warnsoft` tokens; `data-scroll-behavior="smooth"`.
- Turbopack dev (Ready ~2.6s, 2-4x cold-compile win); prod measurements 0.2-1s pages.
- SpeedInsights gated to Vercel (`NEXT_PUBLIC_VERCEL_ENV`); `GEMINI_API_KEY` restored; shopping fallback chain; hero 8s budget +30min cache.
- Live products: `lib/gemini.ts`, `lib/live-products.ts`, live search/detail/compare APIs, detailed compare page + `loading.tsx`, closest-match detail, ProductCard images/price-at-retailer/history/compare links, hero quick-links `/shopping?q=`, privacy affiliate/AI disclosures.
- Username system: editor + availability check, login redirect `?setup=1`, signup error surfacing, header 10ch trim + hover title.
- Pixels wired: `@font-face`, `font-pixel`, BrandMark/header/footer/orbit/auth/admin/celebration/OG (Satori flex fix); scaled to ~38-40px.
- Contact form working (validation, 503 without key, live 200 test `01a0c428-...`).
- RouteProgress YouTube-style bar; ThemeCelebration neko popup + simple Sun/Moon toggle via `techsite:theme-changed`.
- Admin dashboard overhaul (stats, drafts attention, pills, delete via `DeletePostButton` endpoint/compact props, quick actions); nav Admin removed, footer `admin login`.
- Docs: `README.md`, `CHANGELOG.md` v1.2.0, `docs/environment.md`, `reference/` archive; monorepo + `archived/website-backup` pushed; `package.json` `tech-site@1.1.0`.
- Loopbacks green: `tsc --noEmit` clean, routes 200/307/404 correct, console zero errors; Vercel deploy succeeded `7b5ffff`.
- Shopping cheerful redo (cream `#FFF8ED`/grape `#16152E` + coral/sunny/teal), real `/dp/` `/p/` links prompt, 5s heavy-load notice.
- Font specimens draft `/font-preview` (noindex).

### Active
- Investigating `Could not find the 'featured' column of 'posts' in the schema cache`; live probe `GET /rest/v1/posts?select=featured` returned `200 [{"featured":true}]` on `pploiphhwdmerwonqrct.supabase.co`.

### Blocked
- (none) — prior Gemini 429/503 quota waves handled by Groq failover; Groq/Resend keys pasted in chat need rotation.

## Next Move
1. Continue `featured` schema-cache debug: diff `supabase/schema.sql` posts columns vs live DB, identify mismatched query/table or stale PostgREST cache, fix code or reload schema.
2. Re-run loopback (tsc + key pages + admin/products APIs) and push fix.

## Relevant Files
- `D:\work\tech-site\website\app\layout.tsx`: theme init, scroll-behavior, metadata
- `D:\work\tech-site\website\app\globals.css`: tokens, Pixels `@font-face`, surfaces
- `D:\work\tech-site\website\lib\ai-router.ts`: 3.8→3.7→3.6 + Groq fallback
- `D:\work\tech-site\website\lib\gemini.ts`, `lib\live-products.ts`, `lib\ai.ts`, `lib\products.ts`, `lib\data.ts`, `lib\niches.ts`
- `D:\work\tech-site\website\app\api\shopping\ai-recommend\route.ts`, `app\api\products\search\route.ts`, `app\api\products\[slug]\route.ts`, `app\api\compare\route.ts`, `app\api\contact\route.ts`, `app\api\pc-builder\ai-build\route.ts`
- `D:\work\tech-site\website\app\(main)\compare\page.tsx`, `app\(main)\compare\[slug]\page.tsx`, `app\(main)\compare\[slug]\loading.tsx`
- `D:\work\tech-site\website\app\(main)\shopping\page.tsx`, `app\(main)\products\[slug]\page.tsx`, `components\ProductCard.tsx`, `components\ShoppingIntelligenceHero.tsx`
- `D:\work\tech-site\website\components\ThemeToggle.tsx`, `components\ThemeCelebration.tsx`, `components\RouteProgress.tsx`, `components\ClientShell.tsx`, `components\BrandMark.tsx`, `components\Header.tsx`, `components\Footer.tsx`, `components\KnowledgeOrbit.tsx`, `components\AccountMenu.tsx`, `components\AccountSettingsForm.tsx`
- `D:\work\tech-site\website\app\(main)\admin\(protected)\dashboard\page.tsx`, `components\admin\AdminNav.tsx`, `app\(main)\admin\login\page.tsx`, `components\DeletePostButton.tsx`
- `D:\work\tech-site\website\public\fonts\Pixels.ttf`, `public\theme-cat-dark.png`, `public\theme-cat-light.png`, `public\theme-cat-*-face.png`, `public\techsite - variant 3.svg`
- `D:\work\tech-site\website\supabase\schema.sql`, `.env.local`, `.env.example`, `docs\environment.md`, `package.json`, `tailwind.config.ts`
- `D:\work\tech-site\website\app\opengraph-image.tsx`, `app\(main)\privacy\page.tsx`, `app\(main)\contact\page.tsx`, `app\(main)\about\page.tsx`

## Recent messages (tail)
- user: /review
- user: $traycer-review
- user: can u access compat?
