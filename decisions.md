# Decision Log — tech//site

Newest first. Format: **date — decision — why — alternatives considered.**
Entries before 2026-11-09 are reconstructed from git history (`main`, 30 commits, 2026-09-21 → 2026-09-24), the two changelogs, and session-compaction notes; the source (commit/version) is cited per entry. Alternatives are listed only where a source documents them.

---

- **2026-11-09 — Documentation set bootstrapped at repo root; changelog backfilled to 1.3.0; root CHANGELOG marked legacy (not rewritten).** Why: owner-mandated standing doc workflow (README / CHANGELOG / technical / business / decisions / help / compact kept current after every change); 16 commits from 2026-09-22→24 had shipped with no changelog entries — backfilled factually and flagged rather than silently normalized. Alternatives: rewriting the legacy root CHANGELOG (rejected — flag, don't overwrite), maintaining a second root-level 1.x changelog (rejected — drift; current log stays at `website/CHANGELOG.md`). Git commits from the sandbox use `Omkar K <omkardile84@gmail.com>` per owner instruction; history also contains "Omkar Kardile" and "jhonny-silverhand" authorships (not rewritten).
- **2026-11-09 — Flagged, deliberately untouched:** `website/temp.md` (a Johnny-Silverhand-style GitHub profile README draft, unrelated to the app), `package.json` still `1.1.0` vs changelog `1.3.0`, committed `website/public/version.json` stale at `1.0.0/unknown`, duplicate "4.2" sections in legacy root CHANGELOG, `Guides/03-what-to-edit.md` pre-rebuild specifics. Why: contradictions get flagged for the owner, not silently overwritten.

---

- **2026-09-24 — Session compaction notes + marketing fonts committed** (`01287e1`: `compacts/markdown-file-review.md`, `marketing-page/fonts/Pixels.ttf`).
- **2026-09-23 — Curated per-niche cover pools replace random picsum covers** (`833fa1a`, `lib/cover-pools.ts`). Why: deterministic, on-brand covers per niche instead of random placeholders. Also shipped: desktop-view notice on small displays (`9c5d53b`), site-wide corner toast with 4 s auto-dismiss (`be52192`), mobile overflow fixes — wrap long inline code + scrollable product spec tables (`4af2bf4`).
- **2026-09-22 — Central AI router with Groq fallback** (`cc2a5c3`, `9aebd28`, `lib/ai-router.ts`). Decision: every model call flows through one chokepoint; chain `gemini-3.8-flash → 3.7-flash → 3.6-flash` (single try, 3 s gaps), then Groq `openai/gpt-oss-120b` as a separate-vendor, separate-quota fallback. Why: recurring Gemini 429/503 quota waves degraded shopping/compare/pc-builder. Alternatives on record: single-model calls (status quo, fragile), Gemini SDK (router uses direct fetch — fewer deps). Related same-day: real retailer links taken from model output + heavy-load notice on `/shopping` (`f2e2ae9`); breadcrumb separators `//` + breadcrumb on compare index (`b3333b6`); static marketing showcase served at `/showcase` (`59d1674`).
- **2026-09-22 — Admin dashboard overhaul** (`3153fa3`, `7966496`, `c30f0de`): stats, drafts-attention, quick actions, delete; Pixels wordmark sizing pass (40 px sitewide, 32 px admin nav/login; `//` on all brand mentions except copyright).
- **2026-09-21 — Pixel neko day/night theme switch** (`1e516dd`, `38dd306`, `90de0b2`): cat artwork + tight 10 KB face crops, celebration popup, simple Sun/Moon toggle via `techsite:theme-changed` event; YouTube-style route loading bar (`d347de2`).
- **2026-09-21 — Changelog 1.2.0** (`ab0d6cd`) — last changelog update before the 2026-11-09 backfill; covered contact form (Resend), route loading bar, `/font-preview`, monorepo layout, wordmark scaling, cheerful shopping redo, Gemini fallback chain after `2.5-flash` retirement, username fixes.
- **2026-09-21 — REBUILD release wave (website/CHANGELOG 1.0.0, commits `7b5ffff`…`ca8cfa2`):**
  - **Offline product catalog deleted — products 100% live from Gemini at request time.** `content/seed-products.ts` and `scripts/seed-supabase.ts` removed; `lib/products.ts` becomes Supabase-only (wishlist/guides). Why: specs/prices in a static catalog go stale; live AI keeps data fresh at the cost of latency + AI-EST labels. This superseded the scraped-catalog approach (Amazon/Flipkart scrapers, 436 products, PC compatibility engine) preserved in `archived/website-backup`.
  - **Monorepo restructure** (`3de5017`): app at `website/`, legacy snapshot at `archived/website-backup`, guides/research/history alongside; redundant `techsite` repo left for deletion. Why: one repo for app + docs + history.
  - **Turbopack dev + `.next` hygiene**: `npm run dev` wipes `.next` first; never share `.next` between dev and build (caused prod vendor-chunk 500s). SpeedInsights gated to Vercel env.
  - **Package identity**: `tech-site@1.1.0` with author/repo metadata.
  - **Contact via Resend** (`b1be858`) — direct fetch, no SDK; provider decision that had been blocked since 3.7.
  - **Username system** (`ca8cfa2`): onboarding, availability check, `user_xxxxxxxx` auto-handles routed to setup.
  - **Hierarchical theming** (warm-paper light / blue-charcoal dark), Pixels brand font sitewide, Ko-fi footer restored, admin login moved to footer link, Gemini fallback chain after model retirement.
- **2026-09-15 era (archived snapshot, superseded):** scraped products + PC compatibility engine + dev-start scrapers (`archived/website-backup/CHANGELOG` 4.0.0). Abandoned by the 2026-09-21 live-AI rebuild.
- **2026-09-12 — Privacy policy + link fixes** (legacy 4.3): comprehensive `/privacy` (GDPR/CCPA-style sections, shopping-data handling); Ko-fi handle corrected to `whysoserious_omik`; GitHub link pointed at `jhonny-silverhand/tech-site`.
- **2026-09-11 — Footer polish + About/Contact expansion** (legacy 4.2): Apple-inspired footer interactions.
- **2026-09-10 — Four-sided platform** (legacy 4.0 + second "4.2"): Editorial Publication × Personal Knowledge Space × Creator Platform × Shopping Intelligence; shopping/mainline features made to work logged-out; FeatureDiscovery tips system.
- **2026-07-27 — Collections + account settings only** (legacy 3.7): of five "Soon" items, built the two unblocked ones; Comments/Highlights deferred as large focused builds; newsletter blocked on email-provider choice.
- **2026-07-20 — The Library + withTimeout** (legacy 3.6): private library (bookmarks, history) over a profile system; 2.5 s timeout wrapper after a hung Supabase URL made every page load 7.4 s.
- **2026-07-20 — Route groups + real password reset** (legacy 3.5): `(main)`/`(auth)` split; auth redesigned as an editorial moment.
- **2026-07-20 — Dark mode via CSS variables + MobileNav fix** (legacy 3.0): theme-aware tokens instead of per-file `dark:` variants; fixed unreachable mobile header links; `bg-ink`→`bg-void` lesson recorded.
- **2026-07-19 — Category color system** (legacy 2.0): niche colors propagate via `--niche-accent`; guided search deferred pending the AI-vs-database honesty decision (later resolved by the live-AI rebuild with explicit AI labeling); comments deferred again. Niche editorial treatments shipped (legacy 2.3): Finance mono figures, AI citation links, Gaming cinematic hero. Signup-email localhost fix (2.2); breadcrumb mark (2.1).
- **2026-07-19 — Research-only design direction** (no code): `design-research/3.0-editorial-research.md` — restraint as brand, Stripe-style finance figures, Nothing-OS-style Android restraint; explicitly no fabricated Dribbble/Behance links.
- **2026-07-18 — Initial build, Phase-1 scope** (legacy 1.0): admin+AI drafting and user manual publishing in; dev tools, AdSense, comments/bookmarks/ratings/newsletter/mobile app out. Brand fonts self-hosted via Fontsource — no Google Fonts runtime requests; paid/unlicensed faces (Editorial New, Canela, SF Pro) excluded (1.1). Command palette, reading progress, ambient color (1.2).

---

## Pending decisions (open)

1. `package.json` version bump (1.1.0 → align with changelog 1.3.0) — owner call.
2. Rotate exposed Groq/Resend keys + admin dev password (`admin123`) — security hygiene, owner action.
3. Fate of `website/temp.md` (GitHub profile README draft) — keep, move, or delete.
4. Newsletter provider, real-price/affiliate integration, comments scope, dev-tools section — long-standing open scopes (see `business-documentation.md` §7).
5. `featured` schema-cache bug resolution path (see `help.md`).
