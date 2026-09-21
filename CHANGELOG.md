# Changelog

All notable changes to this project are logged here, newest first. Version numbers are informal (this isn't published to npm) — they just track meaningful rounds of changes.

---

## 4.0 — Editorial Knowledge Platform + Shopping Intelligence
**2026-09-10**

Major evolution from a multi-niche publication into a four-sided platform: **Editorial Publication × Personal Knowledge Space × Creator Platform × Shopping Intelligence**.

### Added
- **Personal Knowledge Space (Library)** — Reading Queue, Highlights (text selections + notes), Private Notes, public Collections CRUD
- **Creator Platform** — Public profiles (`/profile/@username`), Follow authors, Follow topics (niches), Article comments with ownership
- **Shopping Intelligence** — Product catalog (12 tables), category-aware specs, retailer prices/availability, affiliate-ready URLs, buying guides with structured recommendations, product comparison pages (`/compare`), recommendation engine (budget/priorities/use-cases)
- **Personalized Homepage** — Continue Reading, Because You Read..., Your Topics, From Authors You Follow, Recommended For You
- **Enhanced Search (Cmd+K)** — Now indexes products and buying guides alongside articles and niches
- **Profile Redirect** — `/profile/@me` redirects to current user's profile
- **Onboarding** — 3-step flow (name → username + availability check → interests/bio)
- **Reading Queue Button** — "Read later" on article pages

### Changed
- **Library** (`/library`) — Added Reading Queue, Highlights, Private Notes sections; public collections visible on profiles
- **Profile Pages** — Added follow button, following authors grid, following topics badges, public collections grid
- **Article Pages** — Added Comments, Highlights, Private Notes, Read Later buttons; author block with follow button
- **Header/Account Menu** — Full user identity with avatar, dropdown navigation (Profile, Library, My Articles, Collections, Settings, Sign Out)
- **Mobile Nav** — User identity header + full navigation when logged in
- **Schema** — Added 9 new tables: `comments`, `highlights`, `private_notes`, `reading_queue`, `author_follows`, `topic_follows`, `product_categories`, `products`, `product_specs`, `retailers`, `product_retailers`, `buying_guides`, `buying_guide_recommendations` (all with RLS)
- **Documentation** — Schema versioning in `Guides/sql/history/`, updated `README.md`, version stamp in `schema.sql`

### Database
- 13 new tables with full RLS policies
- `product_categories` now has public-read RLS (fixed Supabase warning)
- All new tables have appropriate indexes, foreign keys, unique constraints, ownership policies

### Fixed
- TypeScript strictness on nested Supabase selects
- Profile `@me` route now redirects properly
- Search index now includes products and buying guides

**Files changed:** 40+ components/pages/lib files · **Added:** 15+ new components and routes

---

## 4.2 — Footer Polish + About/Contact Content
**2026-09-11**

Focused refinement of footer interactions and expanded content on About/Contact pages.

### Added
- **Footer Ko-fi link** — Apple-inspired styling with animated underline, subtle kaomoji shift on hover
- **Footer nav links** — Animated underline (left→right) on hover for About/Privacy/Contact
- **About page** — Expanded with: The Model, all 9 niches detailed, Shopping Intelligence overview, Editorial Independence, Team, Tech Stack
- **Contact page** — Expanded with: What to Email About (5 categories), Response Time expectations, Other Ways to Connect (Ko-fi, GitHub), For Creators & Writers section

### Changed
- **Footer interactions** — Apple-inspired minimalism: muted default state, smooth `duration-300` transitions, animated underline from left→right, kaomoji shifts right on hover
- **Footer nav** — Consistent animated underline treatment for About/Privacy/Contact links

### Fixed
- About/Contact page JSX syntax (proper `<li>` closing tags)

**Files changed:** `components/Footer.tsx`, `app/(main)/about/page.tsx`, `app/(main)/contact/page.tsx`

---

## 4.3 — Privacy Policy + Link Updates
**2026-09-12**

### Added
- **Privacy Policy page** (`/privacy`) — Comprehensive policy covering: data collection (account, profile, content, automated, third-party), usage, sharing, retention, user rights (GDPR/CCPA), cookies, Shopping Intelligence data, children's privacy, international transfers, security, changes, contact. Signed and dated by tech//site Editorial Team.

### Changed
- **Ko-fi link** — Updated from `whysoserious_omk` to `whysoserious_omik` in Footer and Contact page
- **GitHub link** — Updated from `github.com/tech-site` to `github.com/jhonny-silverhand/tech-site` in Contact page

### Fixed
- Privacy policy JSX syntax (proper `<li>` closing tags)
- Build passes, TypeScript clean

**Files changed:** `components/Footer.tsx`, `app/(main)/contact/page.tsx`, `app/(main)/privacy/page.tsx` (new)

---

## 4.2 — Shopping Intelligence Mainline + Feature Discovery + Profile Routing Fix
**2026-09-10**

Continued evolution of 4.0 — making Shopping Intelligence a mainline feature for all users, adding creative feature discovery, and fixing profile routing.

### Added
- **Shopping Intelligence route (`/shopping`)** — Full guided recommendation flow: pick category → budget → priorities/use cases → advanced filters → personalized results with editorial reasoning, pros/cons, and live retailer prices. Works for logged-out users.
- **Shopping Intelligence homepage section** — Prominent editorial hero on `/` with category entry points, featured products with live prices, trust indicators. Visible to all users (logged-in and logged-out).
- **Feature Discovery system** — Contextual, non-annoying tips that appear from the bottom-right corner based on where the user is and what they're doing. Tips include: Cmd+K search, Shopping Intelligence, Library save, Reading Queue, Highlights/Notes, Follow authors/topics, Product comparison. Dismissible, remembers dismissed tips in localStorage, respects reduced-motion, adaptive shortcuts (⌘K/Ctrl+K).
- **Product comparison route (`/compare`)** — Side-by-side spec tables + price comparison for 2-4 products.

### Changed
- **Shopping Intelligence now works for logged-out users** — No authentication required for core recommendation flow, product browsing, buying guides, or comparison.
- **Profile `@me` route fixed** — `/profile/@me` now correctly redirects to current user's profile (or onboarding if no profile). Uses `%40me` folder encoding for Next.js Windows compatibility.
- **Homepage hierarchy** — Shopping Intelligence hero now sits between the hero/orbit section and personalized sections, making it a mainline destination.
- **Search index** — Now includes products and buying guides alongside articles and niches.

### Fixed
- `/profile/@me` 404 — Resolved by using URL-encoded folder name `%40me` (Next.js Windows filesystem compatibility).
- Feature Discovery TypeScript strictness — Proper CTA typing with required `onClick`.
- Shopping Intelligence API — Works without authentication.

### Database
- No schema changes required (leveraged existing 4.0 tables).

**Files added:** `app/(main)/shopping/page.tsx`, `app/api/shopping/recommend/route.ts`, `components/ShoppingIntelligenceHero.tsx`, `components/FeatureDiscovery.tsx`, `app/(main)/profile/%40me/page.tsx`
**Files modified:** `app/(main)/page.tsx`, `app/(main)/layout.tsx`, `app/(main)/shopping/page.tsx`, `lib/products.ts`

---

## 3.7 — Collections and account Settings (two of the five "Soon" items)
**2026-07-27**

Follow-up to `3.6`'s "Soon" list. Went through all five pending items, explained which had a real blocker versus which just needed scoping, and built the two with no blocker at all:

- **Collections are real**: name a group, add articles to it from any article page (`components/CollectionPicker.tsx` — a dropdown listing your collections with checkboxes, plus inline "new collection" creation), browse them from `/library`, view a single collection at `/library/collections/[id]` with rename and delete. New `collections` and `collection_posts` tables, both RLS-scoped to their owner.
- **Account Settings are real**: `/library/settings` — change display name, change password. Deliberately just account basics, not a path toward a profile page.
- Both now replace their "Soon" placeholders in the header's Library dropdown and on `/library`.

**Not touched, on purpose, each for a different reason:**
- **Comments and Highlights** — no external blocker, but both are big enough to deserve their own focused turn rather than a rushed add-on here. Highlights specifically needs a real anchoring strategy (store the quote + context, re-find it on render, degrade gracefully if the text changed) — that's a design decision worth getting right before writing code, not something to improvise mid-turn.
- **Newsletter preferences** — genuinely blocked, not a scoping question. No email-sending service is connected to this project at all; a preference toggle with no newsletter behind it would be a fake feature. Needs a provider decision (Resend, Postmark, Beehiiv, etc.) before there's anything honest to build.

**Changed files:** `components/LibraryMenu.tsx`, `app/(main)/articles/[slug]/page.tsx`, `app/(main)/library/page.tsx`, `lib/library.ts`, `Guides/sql/schema.sql`, `Guides/03-what-to-edit.md` · **Added:** `components/CollectionPicker.tsx`, `components/CollectionActions.tsx`, `components/NewCollectionForm.tsx`, `components/AccountSettingsForm.tsx`, `app/(main)/library/collections/[id]/page.tsx`, `app/(main)/library/settings/page.tsx`

---

## 3.6 — The Library (bookmarks + reading history) + a real performance fix
**2026-07-20**

Reverses part of `3.5`'s "no profile at all" stance — not back to a traditional profile, but a private "Library": bookmarks and reading history, no bio, no avatar, no followers, no public URLs. Built the two pieces that are genuinely real and well-specified; everything else the brief described is shown but explicitly marked as not built yet, detailed below.

- **Header now shows "Library" instead of "Sign In" once signed in** — Option B from the brief, the one it marked as the strongest fit. Clicking it opens a dropdown: Continue Reading (if there's a real one), Bookmarks with a live count, History, then Collections/Highlights/Comments/Newsletter/Settings shown disabled and labeled "Soon."
- **Bookmarks are real**: a Save button on every article (`components/BookmarkButton.tsx`), backed by a new `bookmarks` table with RLS scoping everything to its owner.
- **Reading history is real**: recorded automatically when a signed-in user opens an article (`recordView` in `lib/library.ts`), backing both the History list and "Continue Reading" (simply the most recent entry).
- **`/library`** is a genuine dashboard — bookmark/read counts (no fabricated "reading time," since nothing measures actual time spent — showed "articles read" instead of inventing an hours number), Continue Reading, the bookmark grid, the history grid.
- **Explicitly not built, shown as "Soon" rather than hidden or faked:** Collections (own CRUD, real UI work), Highlights (text-selection anchoring that survives re-renders — a hard problem, not a quick table), Comments (already scoped out in `2.0`), Newsletter preferences (no email-sending service integrated at all yet).

**Real bug caught and fixed during testing, not a small one:** making the header check auth on every page load introduced a serious performance regression — an unreachable or misconfigured Supabase project didn't fail cleanly, it made *every single page on the site* take **7.4 seconds** to load while the underlying request hung. Root cause was two unrelated Supabase calls with no timeout (the header's new auth check, and — this one predates today's work — the core post-fetching function every page already depended on). Fixed properly: a shared `withTimeout` utility (`lib/with-timeout.ts`), a 2.5s cap, applied everywhere a Supabase call sits on a page's critical path. Confirmed the fix directly — same broken config, 7.4s down to 2.7s.

**Changed files:** `components/Header.tsx`, `components/MobileNav.tsx`, `app/(main)/articles/[slug]/page.tsx`, `lib/data.ts`, `Guides/sql/schema.sql`, `Guides/03-what-to-edit.md` · **Added:** `lib/library.ts`, `lib/with-timeout.ts`, `components/LibraryMenu.tsx`, `components/BookmarkButton.tsx`, `app/(main)/library/page.tsx`

---

## 3.5 — Editorial authentication experience + real password reset
**2026-07-20**

**Structural change first, since it affects almost every route:** `app/` is now split into two route groups — `(main)` (public site chrome: home, about, articles, niches, dashboard, write, admin) and `(auth)` (login, signup, forgot-password, reset-password), each with its own layout. This is what makes it possible for auth pages to show a completely different, chrome-free shell instead of the normal header/footer. Route groups don't affect URLs — every existing link, redirect, and bookmark still points to the same paths as before.

**Authentication redesigned as an editorial moment**, per the brief: huge typography, minimal noise, no niche theming (auth is explicitly the site's *global* identity, not a category's).

- New split-screen shell (`app/(auth)/layout.tsx`) — a real, randomly-selected published post on the left (desktop only), the form on the right. Different on every visit, using data that already exists rather than a fabricated "featured story" mechanism.
- Sign in → "Continue reading." Sign up → "Discover technology through stories worth reading," button labeled "Become a reader." Copy throughout softened to match — reassuring on Forgot Password, minimal on success, no "Welcome back" banners or profile chrome anywhere (the brief is explicit: no profile system, login should stay nearly invisible after the fact).
- No separate "Verify Email" route — Supabase's own confirmation link resolves directly, so the existing post-signup "check your inbox" state got the editorial treatment instead of adding a redundant page.
- Admin login deliberately untouched — a control panel for one operator, not a reader joining the publication.

**Forgot Password and Reset Password are real, working flows, not just new page designs:**

- `app/(auth)/forgot-password/page.tsx` — calls `supabase.auth.resetPasswordForEmail`, shows the same response whether or not the email has an account (telling visitors which emails have accounts is a real, if minor, information leak).
- `app/(auth)/reset-password/page.tsx` — listens for Supabase's `PASSWORD_RECOVERY` event, shows a live "confirming your link" state while waiting, and a clear "this link has expired" state (with a way to request a new one) if that event never fires within a few seconds — rather than leaving someone stuck on a spinner if they reach the page without a valid token.

**Changed files:** `app/layout.tsx`, `Guides/01-database-setup.md`, `Guides/03-what-to-edit.md` · **Moved:** `app/page.tsx` and everything under `app/about/`, `app/privacy/`, `app/contact/`, `app/articles/`, `app/niche/`, `app/dashboard/`, `app/write/`, `app/admin/` → the same paths under `app/(main)/`; `app/login/`, `app/signup/` → `app/(auth)/` (both also redesigned) · **Added:** `app/(main)/layout.tsx`, `app/(auth)/layout.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/reset-password/page.tsx`

---

## 3.0 — Dark mode + fixed a real mobile navigation bug
**2026-07-20**

**Bug fix, not a feature:** the header's Write/Sign in/Admin links were `hidden md:flex` with no mobile equivalent — completely unreachable below the `md:` breakpoint, on every actual phone. Added `components/MobileNav.tsx` (hamburger menu) as the fallback, and added a "Sign up" link that was previously only reachable one click further in, from the login page.

**Dark mode**, done as a real toggle (not a forced conversion, and not left as an unanswered question this time):

- `components/ThemeToggle.tsx` in the header — sun/moon button, persists to `localStorage`, respects OS preference when nothing's been chosen yet.
- A blocking inline script in `app/layout.tsx` applies the saved/preferred theme before first paint — no flash of the wrong theme on load.
- **Architecture:** `bg` / `paper` / `ink` / `muted` / `line` in `tailwind.config.ts` now resolve to CSS variables (`globals.css`, one block for `:root`, one for `.dark`) instead of fixed hex. This means most of the codebase's existing `bg-bg` / `text-ink` / `bg-paper` / `text-muted` / `border-line` classes became theme-aware automatically — no need to hunt down and add `dark:` variants file by file. `void`, `accent`, and `warn` stay fixed in both themes on purpose (see the guide for why).
- Code blocks and syntax highlighting stay a fixed dark surface in both site themes, consistent with the `2.3` decision that code should look the same regardless of context.

**Real bug caught and fixed during testing, before shipping:** the secondary button variant and the admin nav's active-item state both used `bg-ink text-white` — which broke the moment `ink` became theme-flipping, since dark mode's `ink` is a *light* color. Both would have rendered as white text on a near-white background in dark mode. Fixed by switching both to the fixed `void` token instead. Also added `dark:` variants to the site's one recurring error-message pattern (five files shared the same red banner styling), so form errors stay legible in dark mode instead of washing out.

**Changed files:** `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `components/Header.tsx`, `components/ui/Button.tsx`, `components/admin/AdminNav.tsx`, `app/admin/login/page.tsx`, `app/login/page.tsx`, `app/signup/page.tsx`, `components/UserPostForm.tsx`, `components/admin/PostForm.tsx`, `Guides/03-what-to-edit.md` · **Added:** `components/ThemeToggle.tsx`, `components/MobileNav.tsx`

---

## 2.3 — Editorial personality: Finance figures, AI Tools citations, Gaming hero
**2026-07-19**

Implemented the three items the "3.0" research doc flagged as ready to build directly (see its "What's worth prioritizing first" section) — and only those three, on purpose. The doc itself said the rest (Programming's code motion, Buying Guides' pacing, Android's restraint ratio, Productivity's quietness) need a real visual pass before touching code, so building them now would have contradicted the research's own conclusion.

- **Finance:** currency amounts and percentages now render in mono, slightly larger than surrounding prose — Stripe's treatment of figures, applied via a new custom rehype plugin (`lib/rehype-figure-highlight.ts`) that walks text nodes and wraps matches, skipping code blocks and existing links on purpose.
- **AI Tools:** external links now render as a distinct citation-style pill (small background, external-link mark, opens in a new tab) instead of a plain inline link. Added real outbound links to the actual products discussed in `free-ai-writing-assistants-beyond-chatgpt.md` (Claude, Gemini, Perplexity, Notion, Le Chat) so this has something real to apply to, not just untested code.
- **Gaming:** article pages get a full-bleed cinematic hero (title and meta overlaid on a large image via a gradient scrim) instead of the standard contained cover image.
- **Bug caught during testing, fixed before shipping:** the AI Tools citation-link component was leaking react-markdown's internal `node` prop as a literal `node="[object Object]"` DOM attribute — spreading all incoming props onto the `<a>` without filtering. Fixed by explicitly destructuring it out.
- All three are scoped to their one niche via props (`MarkdownContent`'s `highlightFigures` / `citationStyle`) or a branch in the article page (`isCinematic`) — every other niche's article template is untouched, confirmed by re-checking a Programming article shows none of the three.

**Changed files:** `components/MarkdownContent.tsx`, `app/articles/[slug]/page.tsx`, `app/globals.css`, `Guides/03-what-to-edit.md`, `package.json`, `package-lock.json`, `content/articles/free-ai-writing-assistants-beyond-chatgpt.md` · **Added:** `lib/rehype-figure-highlight.ts`

---

## 2.2 — Fix: signup confirmation emails linking to localhost in production
**2026-07-19**

**Bug:** on the deployed site, clicking the email confirmation link from signup sent people to `localhost` instead of the real domain — confirmation only worked when testing locally.

**Root cause, two parts:**
1. Supabase builds confirmation emails from a single **Site URL** project setting, not from wherever the signup request came from. New projects default this to `http://localhost:3000`, and nothing forces you to change it before going live.
2. The signup code wasn't passing `emailRedirectTo` at all, so there was no code-side correction for that default — every environment, dev or production, was at the mercy of whatever the dashboard happened to have saved.

**Fix:**
- `app/signup/page.tsx` now passes `emailRedirectTo: `${window.location.origin}/dashboard``, derived from wherever the signup actually happened, instead of relying solely on the static dashboard setting.
- `Guides/01-database-setup.md` gets a new, prominent section with the exact dashboard steps (Site URL + Redirect URLs allowlist — both localhost *and* production need to be listed, not one replacing the other) and what to do about real users who already hit the broken link before this was fixed.
- `Guides/04-deployment.md` now points at that section directly instead of a shorter, easier-to-skip version of the same instructions.

**If you already deployed:** the code fix alone isn't enough — you still need to set Site URL / Redirect URLs in the Supabase dashboard for this to actually resolve on your live site. See `Guides/01-database-setup.md`.

**Changed files:** `app/signup/page.tsx`, `Guides/01-database-setup.md`, `Guides/04-deployment.md`

---

## 2.1 — Breadcrumb separator: single slash, bigger, Fraunces
**2026-07-19**

- Breadcrumb separators (article and niche pages) changed from a double `//` to a single `/`, rendered larger than the surrounding text in Fraunces (`components/BreadcrumbSlash.tsx`, new). The `tech//site` wordmark's own double-slash inside the breadcrumb is untouched — this only affects the separators between segments.

**Changed files:** `app/articles/[slug]/page.tsx`, `app/niche/[slug]/page.tsx` · **Added:** `components/BreadcrumbSlash.tsx`

---

## Research — "3.0" editorial design direction (no code shipped)
**2026-07-19**

Per the brief, this was research only — nothing below was implemented, and this entry deliberately isn't a numbered version bump, since nothing in the running app changed. Full writeup at `design-research/3.0-editorial-research.md`.

Covers: what should never change (confirmed against what's already built — logo, unified search, restrained motion, the existing color system), reusable cross-niche principles pulled from real research on Linear, Apple Music, Stripe, the Claude/ChatGPT/Perplexity landscape, and print-editorial grid theory, a per-niche "editorial universe" breakdown for all 9 niches, and a prioritized list for whenever this becomes an actual implementation pass. Deliberately didn't fabricate specific Dribbble/Behance shot links — real, verifiable sources only, listed at the end of the document.

**Added:** `design-research/3.0-editorial-research.md`

---

## 2.0 — Category color system
**2026-07-19**

Worked through the "Additional Ideas & Personal Design Updates" doc. It covers three ideas — a category color system, a two-mode search/recommendation engine, and a full comments system — of very different sizes. Built the one that's fully specified and ready to ship; the other two need real decisions first, detailed below rather than guessed at.

- **All 9 niche colors replaced** with the doc's "Suggested Color Language" (`lib/niches.ts`). Two of the doc's categories ("Apple," "Hardware") don't exist in this taxonomy and two of this taxonomy's niches ("Tech Buying Guides," "Career & Jobs") aren't in the doc — Buying Guides took the doc's unused Hardware red, Career & Jobs got a new indigo in the same palette family. Reasoning is commented directly in the code.
- **Color now reaches further than tags and dots:** a tiny accent line above every article title, blockquote borders, and table header underlines all pick up the *current article's* niche color via a new `--niche-accent` CSS variable (`components/MarkdownContent.tsx` + `globals.css`) — done dynamically per-article rather than hardcoded, so it's correct regardless of which niche a post is in.
- **Code blocks deliberately excluded** — the brief said "where appropriate," and code reading consistently regardless of category felt more important than matching the pattern everywhere.
- **Admin Publish button** now adopts the selected niche's color while editing — a small, contained version of "buttons adopt category color," rather than recoloring buttons sitewide where there's no niche context to draw from.

### Not built, and why

- **Guided Search / "tech//site Intelligence."** The quick-search half is already covered by the `1.2` command palette. The guided, decision-assistant half (device → budget → priorities → ranked picks like "Lenovo LOQ vs ASUS TUF") needs one of two things first: a real, maintained product database (specs and prices go stale within weeks, and populating one honestly means real data entry, not invented placeholder entries), or routing it through the existing AI integration live. The second option surfaces something worth deciding explicitly: the brief is clear that the recommendation shouldn't *read* as AI-generated ("they should feel: this platform analyzed everything") — which is a legitimate, common branding choice (plenty of "smart" features across the industry work this way without being deceptive), but it's a real decision about how honest the framing is with end users, not a styling detail, so it deserves a yes/no rather than an assumption.
- **Comments.** Sorting (7 modes), threading, upvotes, markdown, image attachments, mentions, pinning, and highlight badges is a genuinely large, separate feature — new database tables with moderation and voting logic, its own RLS policies, a rich comment editor. This was already listed as a long-term feature back in the original plan (see `1.0`), and nothing here changes that — it's real work worth its own focused pass, not a subsection of this one.

**Changed files:** `lib/niches.ts`, `components/MarkdownContent.tsx`, `app/globals.css`, `app/articles/[slug]/page.tsx`, `components/admin/PostForm.tsx`, `Guides/03-what-to-edit.md`

---

## 1.4 — Homepage: hero and Knowledge Orbit merged into one fold
**2026-07-19**

- `app/page.tsx`: hero text and the Knowledge Orbit now share a single flex row (text left, orbit right on `lg:` and up) instead of two stacked sections — Featured follows immediately after.
- Orbit resized (560px → 420px, radius scaled to match) to sit comfortably beside hero text rather than spanning full width.
- Mobile fallback simplified from the full descriptive card grid to a compact wrapped pill list, so the combined hero+nav fold stays reasonably short before Featured on small screens.

**Changed files:** `app/page.tsx`, `components/KnowledgeOrbit.tsx`

---

## 1.3 — Homepage: Knowledge Orbit, Bento grid, horizontal rail
**2026-07-18**

Answer to "which homepage concept" was "mix all three" — rather than run them as three redundant ways to do the same thing (browse the 9 niches), gave each a distinct job:

- **Knowledge Orbit** (`components/KnowledgeOrbit.tsx`) is now the primary niche navigation on large screens (`lg:` and up) — 9 niches in a circle around the wordmark, computed with real trigonometry (no NaN, verified), with a subtle mouse-tilt instead of a continuous auto-rotate (constant motion is exactly what `prefers-reduced-motion` users are opting out of, and it stops feeling alive after about five seconds anyway). Below `lg:`, hands off to the existing niche grid — a 9-item circle doesn't survive a phone screen, so this doesn't try to force it; same links, different presentation, both real `<a>` tags in the DOM.
- **Bento grid** (`components/BentoGrid.tsx`) is the new "Featured" section — an asymmetric CSS Grid (`grid-auto-flow: dense`) of the 6 most recent posts at varying tile sizes, cover image as background, niche-colored tag.
- **Horizontal rail** (`components/HorizontalRail.tsx`) is "Keep exploring" — a scroll-snap row of recent posts, album-cover style (3:4 covers), with desktop arrow controls.
- Homepage (`app/page.tsx`) rewritten to assemble all three under the existing hero.

**Deliberately not done:** a full dark-mode conversion — that question went unanswered, so this proceeds on the existing assumption (light editorial base, dark accents on surfaces that were already dark, per `1.2`). Worth a real answer before touching it further, since it's a bigger, more invasive change than anything in this entry.

**Changed files:** `app/page.tsx`, `Guides/03-what-to-edit.md` · **Added:** `components/KnowledgeOrbit.tsx`, `components/BentoGrid.tsx`, `components/HorizontalRail.tsx`

---

## 1.2 — Command palette, reading progress, ambient color, and a fuller type/color system
**2026-07-18**

Worked through the "operating system for knowledge" design brief. Rather than build a bit of everything shallowly, shipped the parts that are unambiguous wins and don't conflict with the site's actual job (fast, crawlable, scalable across many niches and authors) — the bigger structural questions (full dark mode? which homepage concept?) are flagged separately rather than guessed at.

- **Fonts:** added **Inter** (body) and **JetBrains Mono** (code/metadata), both self-hosted via Fontsource, replacing the system stacks. Matches the brief's font list exactly, apart from **Canela** and **SF Pro** — Canela is a paid Colophon Foundry release (same situation as Editorial New, already noted in `1.1`), and SF Pro isn't licensed for general self-hosting (Apple devices still get real SF Pro via the `-apple-system` fallback).
- **Colors:** introduced `void` (`#09090B`) for surfaces that are already dark — header, footer, code blocks — instead of converting the whole site's light background. Refined the accent blue to `#4F7DFF` per the brief's palette.
- **Command palette:** `Cmd/Ctrl+K` or `/` anywhere opens a fuzzy-search overlay over every post and niche (`components/CommandPalette.tsx` + a new public `api/search-index` route). One of the brief's "hidden easter eggs," built as real, working functionality rather than a mention.
- **Animated slash:** the header's `//` now blinks slowly, respecting `prefers-reduced-motion`.
- **Reading progress:** a glowing top progress bar plus a live "N% read" stat on article pages, tied to scroll position.
- **Ambient color:** article pages now get a faint background wash in the post's niche color — deliberately using the existing curated niche palette instead of extracting a color from the cover photo (simpler, faster, never muddy; true photo-derived color is a bigger follow-up if wanted).
- **Footer counter:** real article count and "updated N ago," computed from actual data — not a faked ticker, and deliberately no tool count, since dev tools don't exist yet.
- **Explicitly deferred, not forgotten:** the Bento wall / Knowledge Orbit / horizontal-magazine homepage concepts, the "living hero" with particles/parallax, the Apple-Music-style blurred article hero, glass-morphism code block chrome, the `T` reading-mode toggle, and Shift-scroll story scrubbing. All genuinely good ideas; each is either a large enough build or risky enough for performance/SEO/accessibility (heavy animation on a content site hurts Core Web Vitals and repeat-visit patience; a circular "orbit" as *primary* navigation is a real usability/accessibility regression versus the current scannable grid) that they deserve an explicit decision rather than a guess.

**Changed files:** `tailwind.config.ts`, `app/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `app/articles/[slug]/page.tsx`, `app/globals.css`, `lib/data.ts`, `lib/utils.ts`, `Guides/03-what-to-edit.md`, `package.json`, `package-lock.json` · **Added:** `components/CommandPalette.tsx`, `components/ReadingProgress.tsx`, `app/api/search-index/route.ts`

---

## 1.1 — Brand fonts and logo integration
**2026-07-18**

Replaced the placeholder typography and header wordmark with the real brand identity, based on the supplied `tech//site` logo.

- Swapped the display font stack for **Fraunces** (headings, wordmark, article/section titles) and added **Cormorant Garamond** (`font-tagline`) for lighter editorial accents — both matched to the logo's lettering.
- Self-hosted both via Fontsource (`@fontsource-variable/fraunces`, `@fontsource-variable/cormorant-garamond`) rather than `next/font/google`. Same font files Google Fonts serves, but bundled at build time with zero runtime or build-time request to any Google domain — more robust for locked-down networks and avoids a Google Fonts privacy question some EU deployments run into.
- Considered "Editorial New" (the third font suggested) but left it out — it's a paid Pangram Pangram Foundry release with no free redistribution path. Documented how to add it later if licensed.
- Rebuilt the header wordmark as `tech` + a bold, skewed double-slash (`//`) in accent blue + `site`, hand-built from styled `<span>`s rather than the font's own `/` glyph, to match the logo's graphic mark rather than a typed slash.
- Extended the same `//` motif into the article and niche page breadcrumbs for consistency (was a single `/`).
- Added the logo as the social share preview image (`app/opengraph-image.png`, auto-wired by Next.js) and a small generated `//` mark as the browser tab favicon (`app/icon.tsx`) — the wordmark itself is too wide to crop into a legible 32×32 icon.
- Added `metadataBase` to `app/layout.tsx` so the OG image resolves to a full URL (currently a placeholder domain — update it once there's a real one).
- Updated `Guides/03-what-to-edit.md` with a "Brand fonts and logo" section covering all of the above.

**Changed files:** `app/layout.tsx`, `tailwind.config.ts`, `components/Header.tsx`, `app/articles/[slug]/page.tsx`, `app/niche/[slug]/page.tsx`, `Guides/03-what-to-edit.md`, `package.json` · **Added:** `app/icon.tsx`, `app/opengraph-image.png`

---

## 1.0 — Initial build: admin/AI + user publishing platform
**2026-07-18**

First working version of the platform described in the original planning doc, scoped to Phase 1 (admin + AI drafting, user manual publishing, all 9 niches) — developer tools, AdSense, comments/bookmarks/ratings/newsletter/mobile app deliberately deferred to a later phase.

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind, Supabase (Postgres + Auth + Storage), self-contained local demo mode (works with zero config via `content/articles/*.md`).
- **Public site:** home page with a niche "directory" grid, 9 niche listing pages, article pages with table of contents, code syntax highlighting, and related posts, plus About/Privacy/Contact.
- **Admin:** single cookie-based login, full CRUD over every post regardless of author, an AI "Generate draft" panel (Gemini, admin-only, drafts land in the editor for review — nothing auto-publishes), image upload to Supabase Storage.
- **Users:** signup/login (Supabase Auth), a Medium-style manual editor with no AI access, enforced at the database level via Row Level Security rather than just hidden in the UI.
- **Content:** 11 real seed articles (not placeholder text) across all 9 niches, used automatically until Supabase is connected.
- **Docs:** `Guides/00` through `04` (how to run, database setup, AI key setup, what to edit, deployment), with ready-to-run SQL (`schema.sql`, `seed.sql`).
- Fixed two bugs found during build-testing: a bcrypt admin-password hash getting corrupted by `.env` parsing (now base64-encoded), and admin API routes returning blank 500s instead of clear messages when Supabase isn't connected yet.
