# tech-site

### https://tech-site-new.vercel.app/

A multi-niche technology publication with a split publishing model: one admin account with full control and an AI drafting tool, and open signup for regular users who write and publish manually — no AI access on that side. Built on Next.js 15 (App Router) + Supabase, styled distinctly rather than with default templates.

```
tech-site/
├── website/     ← the actual Next.js application — start here
├── Guides/      ← setup docs: how to run, database, AI keys, what to edit, deployment
└── CHANGELOG.md ← versioned history of meaningful changes
```

## Fastest path to seeing it running

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000 — the full public site loads immediately with real sample content across all 9 niches, no setup required.

## Where to go next

Everything else — connecting a real database, turning on the admin's AI drafting button, going to production — is covered in `Guides/`, starting with `Guides/00-how-to-run.md`.

## Core Features (v4.0)

### Editorial Publication
- **9 niches**: AI Tools, Programming, Android, Windows & Linux, Tech Buying Guides, Gaming, Career & Jobs, Finance, Productivity
- Article pages with table of contents, code syntax highlighting, niche-specific editorial treatments
- Reading progress bar, related posts, ambient niche color wash
- Cinematic hero for Gaming niche

### Personal Knowledge Space (Library)
- **Saved** — bookmarked articles
- **Reading Queue** — intentionally saved for later
- **History** — previously read content (auto-recorded)
- **Highlights** — saved text selections with optional private notes
- **Private Notes** — user notes on articles (never public)
- **Collections** — named groups of saved posts (create/rename/delete)

### Creator / Community Platform
- **Public profiles** (`/profile/@username`) — avatar, bio, links, interests, published articles
- **Author following** — follow writers, see their posts on homepage
- **Topic following** — follow niches, personalized discovery
- **Comments** — article discussions with ownership enforcement
- **Onboarding** — 3-step flow (name → username → interests)
- **Article editor** — markdown, niche selection, cover image, SEO fields

### Shopping Intelligence
- **Product catalog** — category-aware specs, extensible schema
- **Where to buy** — retailer links, prices, availability, affiliate-ready
- **Buying guides** — editorial guides with structured recommendations
- **Product comparison** — side-by-side specs + price table
- **Recommendation engine** — budget/priority/use-case matching with explanations
- **Search integration** — products + buying guides in Cmd+K palette

### Admin Dashboard
- Single admin account, full CRUD over all posts
- AI draft generation (Gemini)
- Image upload, niche-aware publish button

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS, self-hosted variable fonts (Fraunces, Cormorant Garamond, Inter, JetBrains Mono)
- **Auth**: Two systems — admin (custom JWT cookie) + users (Supabase Auth with RLS)
- **Icons**: lucide-react
- **Markdown**: react-markdown + remark-gfm + rehype-highlight + rehype-slug
- **Analytics**: Vercel Speed Insights + Analytics

## Key Links
- **Ko-fi**: https://ko-fi.com/whysoserious_omik
- **GitHub**: https://github.com/jhonny-silverhand/tech-site
- **Privacy Policy**: `/privacy`

## Project Structure
```
website/
├── app/
│   ├── (main)/           ← public site chrome (Header, Footer)
│   │   ├── page.tsx      ← homepage (personalized when logged in)
│   │   ├── articles/[slug]/
│   │   ├── profile/[username]/
│   │   ├── profile/@me/  ← redirect to own profile
│   │   ├── library/      ← personal knowledge space
│   │   ├── dashboard/    ← user's own posts
│   │   ├── write/        ← article editor
│   │   ├── guides/       ← buying guides
│   │   ├── products/[slug]/
│   │   ├── compare/      ← product comparison
│   │   ├── onboarding/   ← 3-step new user flow
│   │   └── admin/        ← admin panel (separate auth)
│   ├── (auth)/           ← auth pages (no site chrome)
│   └── api/              ← admin endpoints, search index
├── components/
│   ├── ui/               ← Button, Input, Field primitives
│   ├── admin/            ← AdminNav, PostForm
│   └── ...               ← feature components
├── lib/
│   ├── data.ts           ← public post queries
│   ├── library.ts        ← bookmarks, history, collections, highlights, notes, follows
│   ├── products.ts       ← product catalog, recommendations, buying guides
│   ├── supabase/         ← client/server/admin clients
│   ├── auth.ts           ← admin JWT session
│   ├── ai.ts             ← Gemini integration
│   ├── niches.ts         ← 9-niche taxonomy + colors
│   └── utils.ts          ← slugify, dates, reading time, cn()
├── content/
│   ├── articles/         ← 11 seed articles (markdown)
│   └── seed-posts.ts     ← local demo data
├── scripts/hash-password.mjs
├── middleware.ts         ← Supabase session refresh
└── globals.css           ← theme variables, prose-tech, code blocks
```

## Development Commands
```bash
cd website
npm run dev      # dev server (port 3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # ESLint
```

## Environment Variables
Required in `website/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SESSION_SECRET=...          # random 32+ char string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH_B64=...       # bcrypt hash, base64-encoded (run: npm run hash-password)
GEMINI_API_KEY=...                # for AI draft generation (optional)
```

## Database Setup
1. Create Supabase project
2. Run `Guides/sql/schema.sql` in SQL Editor (idempotent, safe to re-run)
3. Add `localhost:3000` and production URL to Supabase Auth → URL Configuration → Redirect URLs
4. Enable Email provider in Supabase Auth
5. Configure `.env.local` with project credentials

See `Guides/01-database-setup.md` for full walkthrough.

## Database Schema Versioning
- **Current schema**: `Guides/sql/schema.sql` (always latest)
- **History**: `Guides/sql/history/schema-v{version}.sql`
- **Version stamp** inside every schema file
- Never overwrite history — create new versioned file on schema changes

See `CHANGELOG.md` for version history.