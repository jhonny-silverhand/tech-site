# Business Documentation — tech//site

**Updated:** 2026-11-09 · Sources: root/website READMEs, live site copy, privacy page, changelogs, session-compaction notes, git history. Items marked *(inferred)* are interpretation of documented behavior, not explicit statements.

## 1. Why it exists

tech//site's stated mission (site hero + `website/README.md`): **"Practical answers, not filler — across code, devices, and money."** It is a hybrid editorial publication + shopping-intelligence service: in-depth guides, honest product comparisons, and AI tools that respect the reader's time. The differentiators claimed by the original build spec (§23 "What makes this different"): dual data mode, AI-powered features, full user library, product intelligence, premium editorial design, performance-first architecture, complete SEO.

Positioning *(inferred from tagline and editorial rules)*: a quality-first alternative to SEO-spam tech content, where recommendations are transparent about being AI-sourced.

## 2. Users & audiences

| Audience | What they get | Auth |
|---|---|---|
| Anonymous readers | Full public site: articles, niche pages, buying guides, product search/detail/compare, `/shopping` assistant, `/pc-builder` — shopping works logged-out (documented in legacy changelog 4.2) | None |
| Registered readers | Personal Library (bookmarks, reading history/queue, collections, highlights, private notes), personalized homepage, topic/author follows, comments, public profile, manual article publishing | Supabase email auth |
| The admin (single operator) | Full content control (CRUD over all posts), AI draft generation, image upload, niche/category management | Separate JWT login `/admin/login` |
| Supporter | Ko-fi donations at `whysoserious_omik` | — |

Primary market: **India** — prices in INR, Amazon.in/Flipkart retailer links, "Made with care in India." footer, buying-guide price points (₹5K–₹25K) *(INR/India is documented; "primary market" is inferred from it)*.

## 3. Content model

- **10 niches** (`lib/niches.ts`): AI Tools, Programming, Android, Windows, Gadgets, Gaming, Career, Finance, Productivity, PC Hardware. Niche slugs are immutable (URLs, sitemap, `topic_follows`).
- **Split publishing model** (documented, enforced at DB level): one admin account with AI drafting assistance; open signup for users who write and publish **manually — no AI access on that side**.
- Seed content: 11 real demo articles served until Supabase is connected; live DB reported 17 posts at last session (per compaction notes).
- Products are **not editorial catalog content**: they are generated live per request by AI and labeled as estimates.

## 4. Business rules & requirements

1. **Product prices are AI estimates** — always labeled as such in the UI, with retailer links (Amazon.in/Flipkart search) for verification. (Privacy page + README.)
2. **AI drafts never auto-publish** — they land in the admin editor for review; the editing step is deliberately kept as quality/SEO protection. (`Guides/02-api-setup.md`.)
3. **Users never get AI generation** — enforced via admin-only API routes + RLS, not just hidden UI. (Original spec §19 + README.)
4. **Honesty about capabilities** — no fake LIVE/status indicators (removed in a past pass), no fabricated statistics (e.g. no invented "reading time" hours), newsletter toggle not built because no email service exists behind it. (Legacy changelog 3.6/4.0-era entries.)
5. **Privacy commitments** — `/privacy` covers data collection/usage/retention, GDPR/CCPA-style rights, affiliate disclosure, AI-estimate accuracy disclosure, shopping-data handling.
6. **Wishlist only for catalog (Supabase) products** — live-only AI products hide the button (FK constraint). (website/CHANGELOG 1.0.0 "Known limitations".)
7. **Contact** — messages route via Resend to `jhonnysilverhand.069@gmail.com`; form responds 503 "not configured yet" without `RESEND_API_KEY`.
8. **Immutable taxonomy slugs** — niche renames require migration discipline because slugs back URLs, sitemap, and follow relations. (Compaction notes.)
9. **No auto-executed monetization on users** — no ads (AdSense explicitly scoped out at 1.0), no tracking beyond Vercel analytics/Speed Insights.

## 5. Monetization & support status

- **Active:** Ko-fi supporter link (`whysoserious_omik`) in footer/contact.
- **Ready but inactive:** retailer links are affiliate-ready (URL columns exist), but no affiliate keys are configured in the current app. The old pre-rebuild project kept Amazon PA-API / Flipkart / Croma / ExchangeRate keys in its env for a future real-price integration (documented in `website/docs/environment.md` "Reference (old project)").
- **Deliberately absent:** ads/newsletter/dev-tools section — each deferred with reasons on record (see `decisions.md`).

## 6. Cost & dependency profile *(inferred from stack choices)*

- Free-tier-first: Supabase free tier, Gemini free tier (rate-limited; mitigated by model chain + Groq second pool), Resend free tier, Vercel hosting, Fontsource self-hosted fonts (no Google Fonts runtime). Running costs ≈ ₹0 at current scale; the tradeoff is quota-driven latency (10–25 s) on AI product pages, disclosed to users via notices.

## 7. Open business decisions (on record, unresolved)

1. **Newsletter** — blocked on choosing a bulk-email provider (Resend is now used for contact only).
2. **Real retailer prices** — old project's scrape/PA-API approach was abandoned in the live-AI rebuild; whether to reintroduce real prices (and affiliate monetization) is undecided.
3. **Comments scope** — a full comments system (threading, votes, moderation) was repeatedly deferred as a large separate build.
4. **Dev-tools section, AdSense, mobile app** — scoped out at 1.0, no update since.
5. **Marketing surface** — `/showcase` static marketing page shipped 2026-09-22; placement/promotion strategy not documented.
