# What to edit

A tour of every place you'll actually want to touch, roughly in the order you'll want to touch them.

## First things to change before showing this to anyone

- **Site name** — `components/Header.tsx` (the "tech/site" wordmark) and `app/layout.tsx` (page title/description metadata)
- **Contact email** — `app/contact/page.tsx`, the `CONTACT_EMAIL` constant at the top
- **Admin email + password** — see `00-how-to-run.md` section 3
- **Privacy policy details** — `app/privacy/page.tsx` is a real starting template, not filler, but it needs your actual date and a legal review before launch, especially if you'll have EU/UK or California visitors

## Adding, renaming, or removing a niche

Niches are defined in exactly one place: `lib/niches.ts`. Each entry is `{ slug, label, description, color }` — the `color` hex is what drives the dot/tag system across the whole site (nav, cards, article headers).

If you're running a live Supabase database, you also need to update the `check` constraint on the `niche` column to match — see the `niche text not null check (...)` line in `Guides/sql/schema.sql`. Run an `alter table` with the new list of allowed values, or drop and recreate the constraint. This is the one place niches exist in two spots instead of one; everything else in the app reads from `lib/niches.ts` alone.

## Replacing the sample articles

`content/articles/*.md` are real, complete starter articles (not lorem ipsum) shown automatically until Supabase is connected — see `isSupabaseConfigured()` in `lib/data.ts`. Once Supabase is connected, none of this local content is read anymore; everything comes from your `posts` table instead, so at that point you can leave these files alone or delete them.

To tweak one before then: edit its `.md` file directly. To change its title, niche, or other metadata: edit the matching entry in `content/seed-posts.ts`.

## Colors, fonts, shapes

All design tokens live in `tailwind.config.ts` under `theme.extend` — `colors` (including the per-niche palette in `lib/niches.ts`), `fontFamily`, and the `folder` border radius used throughout. Change a value once here and it updates everywhere that uses the corresponding Tailwind class.

`font-display` and `font-tagline` are the two brand fonts (Fraunces and Cormorant Garamond) — see "Brand fonts and logo" below for how they're loaded. `font-body` and `font-mono` are still plain system stacks on purpose (no font file to fetch for either), which is why body text and code/metadata chrome load instantly with zero layout shift.

## Cover images

Sample articles and any post without an uploaded image use `picsum.photos` (a placeholder photo service) as a stand-in. The plan this project started from listed real free options — Unsplash API, Pexels API, Pixabay, Openverse — any of which can replace it. The admin's upload button (Supabase Storage) works independently of this and is the more permanent path for real content.

## What's intentionally not built yet

Scoped out of this version on purpose, so you're not hunting for something that doesn't exist: the developer-tools section (JSON formatter, regex tester, etc.), AdSense/analytics integration, comments, bookmarks, ratings, a newsletter, and a mobile app. These were treated as later phases, after the core admin/user publishing system proves itself.

## Brand fonts and logo

Four fonts now carry the identity, all self-hosted via Fontsource (no `next/font/google`, no runtime request to any Google domain — see `app/layout.tsx`):

- **Fraunces** (`font-display`) — headings, wordmark, article/section titles
- **Cormorant Garamond** (`font-tagline`) — lighter editorial accents
- **Inter** (`font-body`) — body copy, added in the v1.2 design pass to replace the system sans stack
- **JetBrains Mono** (`font-mono`) — code blocks and metadata chrome, replacing the system mono stack

Two other fonts were suggested along the way and deliberately left out, both for the same reason — no free redistribution path: **Editorial New** (Pangram Pangram Foundry, suggested for the logo) and **Canela** (Colophon Foundry, suggested for headings). **SF Pro** was also suggested for body text; it's Apple's system font and isn't licensed for general self-hosting, which is why `-apple-system` still sits in the `font-body` fallback stack — that lets Apple devices show real SF Pro locally without needing to bundle it. If any of the three get properly licensed later, swapping them in means adding the font files under `public/fonts/`, wiring a `@font-face` (or `next/font/local`) in `app/layout.tsx`, and updating the matching entry in `tailwind.config.ts`.

The double-slash mark (`//` in accent blue, skewed, slowly blinking) in the header wordmark and in breadcrumbs is hand-built with styled `<span>`s rather than the font's own "/" character — the font's slash is too thin/upright to read as the logo's bold angled mark. The blink respects `prefers-reduced-motion` automatically via Tailwind's `motion-reduce:` variant.

The logo file itself drives the social share preview (`app/opengraph-image.png` — Next.js wires this up automatically, nothing to configure). The browser tab icon (`app/icon.tsx`) is a small generated mark instead of a cropped version of the logo, since the wordmark is too wide to survive being shrunk to 32×32 legibly — replace it with a real designed icon whenever you have one.

## Command palette, reading progress, and ambient color

Added in the v1.2 design pass, alongside the font/color refresh:

- **Cmd/Ctrl+K or `/` anywhere** opens a search overlay (`components/CommandPalette.tsx`) over posts and niches. It lazily fetches `app/api/search-index/route.ts` on first open — that route is intentionally public (it returns nothing not already visible by browsing) and does simple client-side scoring rather than a fuzzy-search library, which is plenty for a site this size. If it ever feels slow with a very large catalog, that's the file to swap for a real search index.
- **Article pages** show a glowing scroll-progress bar and a live "N% read" stat (`components/ReadingProgress.tsx`), both tied to the `#article-body` element.
- **The ambient background wash** on article pages tints the page faintly with the post's *niche* color rather than extracting a color from its cover photo — reusing the curated palette in `lib/niches.ts` instead of whatever a photo happens to average out to. Simpler, faster, and it can never come out muddy. If you'd rather have true photo-derived ambient color later, that's a bigger, separate change (image color extraction, likely at upload time so it doesn't cost anything per page view).
- **The footer counter** is real data (`getSiteStats()` in `lib/data.ts`) — article count and time since the last publish. It deliberately doesn't show a tool count, since the developer-tools section doesn't exist yet.

## Homepage sections

The homepage (`app/page.tsx`) has three ways to browse, each doing a different job rather than three competing versions of the same "browse by niche" list:

- **Hero + Knowledge Orbit** — one shared fold. Hero text sits on the left; the orbit (`components/KnowledgeOrbit.tsx`, desktop `lg:` and up) sits to its right. Below `lg:`, a compact wrapped pill list replaces the orbit — a 9-item circle doesn't survive a phone screen legibly, so this hands off rather than forcing it. Featured follows immediately after, no separate nav section in between.
- **Bento grid** (`components/BentoGrid.tsx`) — the "Featured" section, an asymmetric tile grid for posts. "Featured" currently just means most recent 6 — there's no curation flag on `Post` yet. If that distinction matters later, add an `is_featured` column and change what `page.tsx` passes in; the component itself doesn't need to change.
- **Horizontal rail** (`components/HorizontalRail.tsx`) — the "Keep exploring" section, a scroll-snap row of everything recent. With more content later, consider splitting this into one rail per niche instead of one mixed rail — it's written generically enough (`posts: Post[]`) to reuse per-niche as-is.

## Category color system

Every niche's color (`lib/niches.ts`) now follows a deliberate "Suggested Color Language" rather than an arbitrary hand-picked wheel, and it propagates further than just tags and dots:

- **Homepage cards, nav, tags** — same as before, via `NicheTag` / `BentoGrid` / `HorizontalRail` / `KnowledgeOrbit`.
- **Reading progress bar** — already niche-colored (`ReadingProgressBar`, since `1.2`).
- **Article accent line + blockquotes + table header underline** — new. `components/MarkdownContent.tsx` takes an `accentColor` prop and sets it as a `--niche-accent` CSS custom property; `.prose-tech blockquote` and `.prose-tech th` in `globals.css` read that variable, falling back to the global accent if it's ever used without one.
- **Code blocks stay neutral on purpose.** Every article's code should look the same regardless of category — that's the one place restraint mattered more than consistency-with-the-brief.
- **Admin Publish button** — adopts the selected niche's color live while editing (`components/admin/PostForm.tsx`), a small, contained instance of "buttons adopt category color" rather than recoloring buttons sitewide, which wouldn't make sense outside a niche context.
- **Two niches don't map 1:1** to the color doc's own categories (it names "Apple" and "Hardware," this taxonomy has "Tech Buying Guides" and "Career & Jobs" instead) — Buying Guides took the doc's unused Hardware red, and Career & Jobs got a new indigo in the same palette family. Both choices and reasoning are commented directly above `NICHES` in `lib/niches.ts`.

## Dark mode

Toggle lives in the header (`components/ThemeToggle.tsx`) — sun/moon icon, persists to `localStorage`, defaults to OS preference if the visitor's never chosen one. A blocking script in `app/layout.tsx` applies the saved choice before first paint, so there's no flash of the wrong theme on load.

The mechanism: `bg` / `paper` / `ink` / `muted` / `line` in `tailwind.config.ts` aren't hex values anymore — they reference CSS variables defined in `globals.css`, once for `:root` (light) and once for `.dark`. That means almost every existing `bg-bg`, `text-ink`, `bg-paper`, `text-muted`, `border-line` class across the whole codebase became theme-aware automatically, with no per-file changes needed. `void`, `accent`, and `warn` deliberately stay fixed hex values in both themes — `void` is "intentionally always-dark chrome" (header, footer, code blocks), and `accent`/`warn` already have enough contrast against both a light and a dark background.

**The one real trap this pattern has, if you add new UI later:** don't use `bg-ink` as a background expecting it to always render dark — in dark mode, `ink` flips to a *light* color (it means "primary foreground," which is light-on-dark there), so `bg-ink text-white` would silently become white-on-near-white. This actually happened once already — the secondary button and the admin nav's active-item state both had this exact bug, caught in testing before shipping. If you want a background that's always dark regardless of theme, use `bg-void`, not `bg-ink`.

Code blocks and syntax highlighting colors are exempt from all of this on purpose — they're a fixed dark surface in both site themes, per the reasoning in `design-research/3.0-editorial-research.md`.

## Mobile navigation

The header's Write/Sign in/Sign up/Admin links live in `components/MobileNav.tsx` below the `md:` breakpoint (a hamburger menu) and in `Header.tsx`'s inline `nav` above it. This exists because those links were previously just `hidden` on mobile with nothing replacing them — not a deliberate simplification, a real bug where the buttons were completely unreachable on an actual phone. If you add a new header-level link, add it to both `MobileNav.tsx`'s `LINKS` array and the desktop `<nav>` in `Header.tsx` — they're two separate lists, not one shared source, since the desktop version needs different styling (individual pill links) than the mobile version (a stacked menu).

## Route structure: (main) vs (auth)

`app/` now has two route groups, each with its own layout — this is why auth pages don't show the normal site header/footer. Route groups (folders in parentheses) don't affect the URL at all; `/login` is still `/login` regardless of which group's folder it physically lives in.

- **`app/(main)/`** — everything that should have the public site chrome: home, about, privacy, contact, articles, niches, dashboard, write, and the entire admin section. Its `layout.tsx` renders `Header` and `Footer`.
- **`app/(auth)/`** — login, signup, forgot-password, reset-password. Its `layout.tsx` is the split-screen editorial shell instead (see below) — deliberately no site header, footer, or niche strip.
- **`app/layout.tsx`** (the true root, outside both groups) — just html/body/fonts/theme-init-script/command-palette. Both groups sit underneath it.

Adding a new page: decide which chrome it needs, then add it inside the matching group's folder. A page directly in `app/` (outside both groups) only gets the bare root layout — no header, no footer, nothing — which is almost never what you want for a new public page.

## Authentication pages

Redesigned per the "3.5" brief — editorial rather than utility-form, and deliberately not niche-themed (the brief calls this out specifically: auth represents the site's *global* identity, not a category's).

- **The left panel** (`app/(auth)/layout.tsx`, desktop only) shows a real, randomly-selected published post — not a fabricated "featured story." Different on every page load, using data that already exists rather than a new content type. Below `lg:`, it's hidden entirely and the form is centered alone.
- **Forgot Password and Reset Password are genuinely new, working flows** — not just pages that look nice. Forgot Password calls `supabase.auth.resetPasswordForEmail`; Reset Password listens for Supabase's `PASSWORD_RECOVERY` auth event (with a timeout that shows an "expired link" state if it never fires, e.g. if someone reaches the page without a valid reset token) and calls `supabase.auth.updateUser` to actually set the new password.
- **There's no separate "Verify Email" route.** Supabase's confirmation link resolves directly with nothing in between for the app to show, so the brief's "Verify Email" moment is really the "check your inbox" state already shown right after signing up — that got the same editorial treatment rather than a redundant extra page.
- Admin login (`/admin/login`) is untouched on purpose — it's a control panel for one operator, not a reader joining the publication, so the utilitarian treatment there is correct, not an oversight.

## The Library — bookmarks, collections, reading history

Per the "3.6" brief: not a profile system, no bio/avatar/followers/public URLs — just a private per-user library, since the header needs *some* signal that login worked without making the account the center of the interface.

- **What's real:** Bookmarks (Save button on every article, `components/BookmarkButton.tsx`), Collections (named groups of saved posts — `components/CollectionPicker.tsx` on articles, `components/NewCollectionForm.tsx` plus the Collections grid on `/library`, `app/(main)/library/collections/[id]/page.tsx` for a single collection with rename/delete), Reading History (recorded automatically on view, `recordView` in `lib/library.ts`), and account Settings (`/library/settings` — display name, password). All back the header's Library dropdown (`components/LibraryMenu.tsx` — Option B from the brief, the one it marked as the strongest fit).
- **What's shown but disabled:** Highlights and Comments — visible in both the dropdown and the `/library` page as "Soon." Neither is a quick add: Highlights needs text-selection anchoring that survives content re-renders (a genuinely hard problem — the solvable version stores the quote plus surrounding context and re-finds it on render, degrading gracefully rather than breaking, but it's real engineering, not a table), and Comments was already scoped out back in `2.0`.
- **Newsletter preferences isn't close to buildable yet** — there's no email-sending service connected to this project. Supabase only handles auth emails (confirmation, reset), not bulk sending. A toggle that saves to a database but triggers no actual newsletter would be a fake feature. This needs an actual decision (Resend, Postmark, Beehiiv, or similar) before there's anything honest to build.
- **No "reading time" stat** — nothing here measures time spent, only what's been opened. "Articles read" is shown instead of a fabricated hours number.
- Schema: `bookmarks`, `reading_history`, `collections`, and `collection_posts` are all in `Guides/sql/schema.sql` — re-run that file (it's idempotent) against an existing database to pick up new tables as they're added.

## Resilience: Supabase calls have a hard timeout

Every Supabase call that sits on a page's critical path (`lib/data.ts`'s post fetching, everything in `lib/library.ts`) is wrapped in `withTimeout` (`lib/with-timeout.ts`), capped at 2.5 seconds. This exists because of a real, measured problem: an unreachable or misconfigured Supabase URL didn't fail cleanly, it made *every single page* take 7+ seconds to load while the underlying request hung before eventually giving up. If you add a new function that queries Supabase from a Server Component other users will hit directly (not an admin-only, already-authenticated route), wrap it the same way — the pattern is meant to be reused, not a one-off fix.

## Editing the AI prompt itself

The exact instructions sent to the AI model live in `lib/ai.ts`, in the `prompt` array. Edit the "Rules" list there to change house style, length, or formatting expectations for generated drafts.

## Niche-specific editorial treatments

Implemented from `design-research/3.0-editorial-research.md`'s priority list — the three items the research flagged as ready to build directly, no mockup pass needed first:

- **Finance:** currency amounts and percentages in article body text render in mono, slightly larger than surrounding prose (Stripe's treatment of figures). Implemented as a custom rehype plugin (`lib/rehype-figure-highlight.ts`) that only runs when `MarkdownContent`'s `highlightFigures` prop is true — wired to `post.niche === 'finance'` in the article page. It skips code blocks and existing links on purpose, so a linked price or a code sample doesn't get double-styled.
- **AI Tools:** external links render as a distinct citation-style pill (small background, external-link mark, opens in a new tab) instead of a plain inline link — `ExternalCitationLink` in `components/MarkdownContent.tsx`, gated on the `citationStyle` prop, wired to `post.niche === 'ai-tools'`. Internal links are untouched.
- **Gaming:** article pages get a full-bleed "cinematic" hero (title and meta overlaid on a large image via a gradient scrim) instead of the standard small contained cover image — see the `isCinematic` branch in `app/articles/[slug]/page.tsx`, keyed on `post.niche === 'gaming'`.

**Deliberately not implemented yet**, per the research doc's own "lower-confidence" list: Programming's code-block motion idea, Buying Guides' one-product-at-a-time pacing, Android's Nothing-OS-inspired restraint ratio, and Productivity's "quietest niche" treatment. Building those without a real visual pass first would contradict the reasoning in the research doc itself.

Adding a similar treatment for another niche later: follow the same pattern — add a prop to `MarkdownContent` or branch in the article page, gate it on `post.niche === '...'`, and keep the change scoped to that one niche rather than touching the shared template.
