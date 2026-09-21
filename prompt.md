# Prompt: Build tech//site — Premium Technology Publication Platform

Build a complete, production-ready technology publication platform called **tech/site** from scratch. This is a premium editorial website with AI-powered features, a full user library system, product intelligence, and admin tools. The backend is **100% Supabase** (Auth, Database, Storage, Realtime where needed).

---

## 1. TECH STACK

- **Framework**: Next.js 15+ (App Router, TypeScript, Server Components)
- **React**: 19+
- **Styling**: Tailwind CSS 3.4+ with CSS-variable-backed theme tokens
- **Backend**: Supabase (Auth, PostgreSQL, Storage, RLS)
- **AI**: Google Gemini (gemini-2.5-flash or latest stable) for draft generation, product recommendations, PC build generation
- **Fonts**: Self-hosted via `@fontsource-variable` (Fraunces, Cormorant Garamond, Inter, JetBrains Mono) — NO Google Fonts runtime requests
- **Markdown**: `react-markdown` + `rehype-highlight` + `rehype-slug` + `remark-gfm`
- **Auth**: Supabase Auth for users; separate admin JWT auth (jose + bcryptjs) for admin panel
- **Deployment**: Vercel-ready

---

## 2. FOLDER STRUCTURE

```
website/
├── .env.local                    # Supabase keys, Gemini key, admin credentials
├── .env.example
├── middleware.ts                  # Supabase session refresh only
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── globals.css               # Tailwind directives + CSS variables + prose-tech styles + syntax highlighting
│   ├── icon.tsx                  # App icon (SVG)
│   ├── layout.tsx                # Root layout: fonts, metadata, ClientShell
│   ├── opengraph-image.png       # Default OG image
│   ├── robots.ts                 # robots.txt
│   ├── sitemap.ts                # Auto-generated sitemap
│   │
│   ├── (auth)/                   # Auth pages (no header/footer)
│   │   ├── layout.tsx            # Auth layout with background image
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (main)/                   # Public site (with header + footer)
│   │   ├── layout.tsx            # Header + Footer + FeatureDiscovery wrapper
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── onboarding/page.tsx   # 3-step user onboarding wizard
│   │   │
│   │   ├── articles/[slug]/page.tsx      # Article reader
│   │   ├── niche/[slug]/page.tsx         # Category page
│   │   ├── write/page.tsx                # Article writer
│   │   ├── write/[id]/page.tsx           # Article editor
│   │   │
│   │   ├── shopping/page.tsx             # AI Shopping Intelligence
│   │   ├── products/[slug]/page.tsx      # Product detail page
│   │   ├── pc-builder/page.tsx           # AI PC Builder
│   │   ├── compare/page.tsx              # Compare index + guide
│   │   ├── compare/[slug]/page.tsx       # Compare results
│   │   ├── wishlist/page.tsx             # User wishlist
│   │   │
│   │   ├── guides/page.tsx               # All buying guides
│   │   ├── guides/[slug]/page.tsx        # Individual guide
│   │   │
│   │   ├── library/page.tsx              # User library (bookmarks, history, queue)
│   │   ├── library/settings/page.tsx     # Library settings
│   │   ├── library/collections/[id]/page.tsx  # Collection detail
│   │   │
│   │   ├── dashboard/page.tsx            # User dashboard
│   │   ├── profile/@me/page.tsx          # Current user profile
│   │   ├── profile/[username]/page.tsx   # Public user profile
│   │   │
│   │   └── admin/
│   │       ├── login/page.tsx            # Admin login
│   │       └── (protected)/
│   │           ├── layout.tsx            # Admin auth guard
│   │           ├── dashboard/page.tsx    # Admin dashboard
│   │           ├── categories/page.tsx   # Manage categories
│   │           ├── posts/new/page.tsx    # Create post
│   │           └── posts/[id]/edit/page.tsx  # Edit post
│   │
│   └── api/
│       ├── search-index/route.ts         # Public search index for Cmd+K
│       ├── compare/route.ts              # Product comparison
│       ├── currency/convert/route.ts     # Currency conversion
│       ├── products/search/route.ts      # Product search
│       ├── products/[slug]/route.ts      # Product detail
│       ├── shopping/ai-recommend/route.ts    # Gemini AI recommendations
│       ├── pc-builder/ai-build/route.ts      # Gemini AI PC builds
│       ├── wishlist/route.ts             # Wishlist CRUD
│       └── admin/
│           ├── login/route.ts
│           ├── logout/route.ts
│           ├── generate/route.ts         # Gemini AI draft generation
│           ├── upload/route.ts           # Image upload to Supabase Storage
│           └── posts/
│               ├── route.ts              # List/create posts
│               └── [id]/route.ts         # Update/delete post
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Variants: primary, secondary, ghost, danger
│   │   └── Field.tsx             # Label, Input, Textarea, FieldGroup
│   │
│   ├── Header.tsx                # Server component, dark bg-void, animated logo, nav
│   ├── Footer.tsx                # Server component, version, article count
│   ├── MobileNav.tsx             # Client, mobile hamburger menu
│   ├── ClientShell.tsx           # Client wrapper: CommandPalette + SpeedInsights
│   ├── AccountMenu.tsx           # User dropdown menu
│   │
│   ├── CommandPalette.tsx        # Cmd+K search overlay
│   ├── KnowledgeOrbit.tsx        # Desktop circular niche navigator
│   ├── FeatureDiscovery.tsx      # Feature tips/announcements
│   ├── FeatureDiscoveryWrapper.tsx
│   │
│   ├── PostCard.tsx              # Article card (server component)
│   ├── ProductCard.tsx           # Product card (server component)
│   ├── BentoGrid.tsx             # Bento layout grid (server)
│   ├── HorizontalRail.tsx        # Horizontal scroll rail (client)
│   ├── NicheTag.tsx              # Colored niche badge
│   ├── BreadcrumbSlash.tsx       # Breadcrumb separator
│   │
│   ├── MarkdownContent.tsx       # Markdown renderer (server)
│   ├── TableOfContents.tsx       # Auto-generated TOC from headings
│   ├── RelatedPosts.tsx          # Related articles (server)
│   ├── AuthorBlock.tsx           # Author info + follow (server)
│   │
│   ├── ReadingProgress.tsx       # Scroll progress bar + % stat (shared context)
│   ├── BookmarkButton.tsx        # Bookmark toggle
│   ├── WishlistButton.tsx        # Wishlist toggle
│   ├── ReadingQueueButton.tsx    # Reading queue toggle
│   ├── FollowButton.tsx          # Author follow toggle
│   ├── TopicFollowButton.tsx     # Topic follow toggle
│   ├── CollectionPicker.tsx      # Add to collection
│   ├── CollectionActions.tsx     # Collection management
│   ├── NewCollectionForm.tsx     # Create collection form
│   │
│   ├── Comments.tsx              # Article comments (client, CRUD)
│   ├── Highlights.tsx            # Text highlights (client, CRUD)
│   ├── PrivateNotes.tsx          # Private notes (client, CRUD)
│   │
│   ├── ShoppingIntelligenceHero.tsx      # Shopping hero section
│   ├── ShoppingIntelligenceHeroLazy.tsx  # Dynamic import wrapper
│   │
│   ├── AccountSettingsForm.tsx   # Account settings
│   ├── ProfileSettingsClient.tsx # Profile settings
│   ├── LibraryMenu.tsx           # Library sidebar menu
│   ├── UserPostForm.tsx          # Post creation/editing form
│   ├── DeletePostButton.tsx      # Post deletion
│   │
│   └── admin/
│       ├── AdminNav.tsx          # Admin navigation
│       └── PostForm.tsx          # Admin post editor
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── niches.ts                 # 10 niche definitions + helpers
│   ├── utils.ts                  # cn(), slugify(), formatDate(), readingTime(), etc.
│   ├── data.ts                   # Post data fetching (with CARD_COLUMNS optimization)
│   ├── products.ts               # Product system (categories, retailers, recommendations)
│   ├── library.ts                # User library CRUD (bookmarks, history, etc.)
│   ├── auth.ts                   # Admin JWT auth (jose + bcryptjs)
│   ├── ai.ts                     # Gemini AI integration
│   ├── version.ts                # Reads version.json
│   ├── with-timeout.ts           # Promise timeout wrapper
│   ├── supabase/
│   │   ├── config.ts             # isSupabaseConfigured()
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server + admin Supabase clients
│   └── shopping/
│       └── currency.ts           # Currency conversion (ExchangeRate-API)
│
├── content/
│   ├── seed-posts.ts             # 11 seed articles with metadata
│   ├── seed-products.ts          # 20+ seed products with specs/retailers
│   └── articles/                 # Markdown files for seed articles
│       ├── free-ai-writing-assistants-beyond-chatgpt.md
│       ├── how-to-write-better-ai-prompts.md
│       ├── understanding-react-server-components.md
│       ├── debugging-nodejs-memory-leaks.md
│       ├── fix-android-storage-full-without-losing-data.md
│       ├── speed-up-windows-11-boot-time.md
│       ├── best-phones-under-300-2026.md
│       ├── best-valorant-settings-fps-aim.md
│       ├── technical-interview-prep-30-days.md
│       ├── credit-card-cashback-vs-points.md
│       └── notion-templates-that-save-time.md
│
├── scripts/
│   ├── gen-version.mjs           # Generates version.json from package.json + git
│   └── hash-password.mjs         # bcryptjs password hasher for admin
│
└── public/
    ├── version.json
    └── fonts/
        └── Pixels.ttf            # Custom font
```

---

## 3. ENVIRONMENT VARIABLES

```env
# Supabase (fully used for auth, database, storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin auth (separate from Supabase Auth)
ADMIN_EMAIL=admin@techsite.com
ADMIN_PASSWORD_HASH_B64=base64-encoded-bcrypt-hash
ADMIN_SESSION_SECRET=random-32-char-secret

# AI
GEMINI_API_KEY=your-gemini-api-key
```

---

## 4. SUPABASE DATABASE SCHEMA

Create these tables with proper RLS policies:

### Users & Auth
```sql
-- profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  favorite_niches TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Public read, owner write
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### Posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  niche TEXT NOT NULL,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  reading_time INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  niche_color TEXT,
  is_ai_assisted BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_niche ON posts(niche);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);

-- RLS: Public read published, admin full access
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can do everything" ON posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND username = 'admin')
);
```

### Library (bookmarks, reading history, queue, collections)
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE TABLE reading_history (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE reading_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collection_posts (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (collection_id, post_id)
);

-- RLS: Users can only access their own library data
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own history" ON reading_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own queue" ON reading_queue FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own collections" ON collections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own collection posts" ON collection_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);
```

### Social (comments, follows)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE author_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, author_id)
);

CREATE TABLE topic_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, niche_slug)
);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own follows" ON author_follows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own topic follows" ON topic_follows FOR ALL USING (auth.uid() = user_id);
```

### Reading Features (highlights, private notes)
```sql
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  selected_text TEXT NOT NULL,
  note TEXT,
  location_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE private_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own highlights" ON highlights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON private_notes FOR ALL USING (auth.uid() = user_id);
```

### Products & Shopping
```sql
CREATE TABLE product_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  spec_schema JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT REFERENCES product_categories(slug),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  manufacturer TEXT,
  model TEXT,
  release_date TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  unit TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  website TEXT,
  logo_url TEXT,
  is_official BOOLEAN DEFAULT false,
  affiliate_base_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE product_retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  price_cents INTEGER,
  currency TEXT DEFAULT 'INR',
  availability TEXT DEFAULT 'unknown' CHECK (availability IN ('in_stock', 'out_of_stock', 'pre_order', 'limited', 'unknown')),
  affiliate_url TEXT,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Products are publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
-- (Similar public read policies for product_categories, product_specs, retailers, product_retailers)
```

### Buying Guides
```sql
CREATE TABLE buying_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_slug TEXT,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  author_id UUID,
  author_name TEXT,
  is_ai_assisted BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE buying_guide_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES buying_guides(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  reason TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Storage
```sql
-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Allow authenticated uploads to post-images
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Public read access to post-images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');
```

---

## 5. THEME & DESIGN SYSTEM

### Colors (CSS variables in globals.css)
```css
:root {
  --bg: #FAFAF9;           /* Page background */
  --paper: #FFFFFF;         /* Card background */
  --ink: #1A1A1A;           /* Primary text */
  --muted: #6B7280;         /* Secondary text */
  --line: #E5E7EB;          /* Borders */
  --accent: #4F7DFF;        /* Brand blue */
  --warn: #FF6B35;          /* Warning orange */
  --void: #09090B;          /* Header/footer dark bg */
}

.dark {
  --bg: #09090B;
  --paper: #18181B;
  --ink: #FAFAF9;
  --muted: #9CA3AF;
  --line: #27272A;
}
```

### Tailwind Config
```ts
// Custom colors, fonts, borderRadius, animations
colors: {
  bg: 'var(--bg)',
  paper: 'var(--paper)',
  ink: 'var(--ink)',
  muted: 'var(--muted)',
  line: 'var(--line)',
  void: '#09090B',
  accent: '#4F7DFF',
  warn: '#FF6B35',
}
fonts: {
  display: ['Fraunces Variable', 'serif'],
  tagline: ['Cormorant Garamond Variable', 'serif'],
  body: ['Inter Variable', 'sans-serif'],
  mono: ['JetBrains Mono Variable', 'monospace'],
}
borderRadius: { folder: '7px' }
animations: { 'slash-blink': 'slash-blink 2.4s ease-in-out infinite' }
```

### Design Principles
- **Editorial feel** — generous whitespace, premium typography, content-first
- **Dark header/footer** (`bg-void text-white`) — always dark regardless of theme
- **Light page content** — forced light mode for reading experience
- **Prose typography** — `.prose-tech` class for article body (custom heading sizes, paragraph spacing, link styles, code blocks always dark)
- **Accent color** `#4F7DFF` — links, buttons, interactive elements
- **Niche colors** — each category has a distinct color for visual identity
- **Card style** — `rounded-folder border border-line bg-paper` with hover states
- **Font stack** — Fraunces for display/headings, Inter for body, JetBrains Mono for code/meta

---

## 6. NICHE/CATEGORY SYSTEM

10 technology categories, each with a unique color:

| Slug | Label | Color | Description |
|------|-------|-------|-------------|
| `ai-tools` | AI Tools | `#4F7DFF` | Reviews, comparisons, tutorials, prompt libraries |
| `programming` | Programming | `#10B981` | React, Next.js, Node.js, debugging, code examples |
| `android` | Android | `#84CC16` | Tips, tricks, app reviews, customization |
| `windows-linux` | Windows & Linux | `#06B6D4` | Error fixes, tutorials, optimization |
| `buying-guides` | Tech Buying Guides | `#EF4444` | Phones, laptops, gadgets comparisons |
| `gaming` | Gaming | `#8B5CF6` | Guides, builds, settings, tier lists |
| `career-jobs` | Career & Jobs | `#6366F1` | Exams, preparation guides, eligibility |
| `finance` | Finance | `#F59E0B` | Banking, UPI, credit cards, investments |
| `productivity` | Productivity | `#F97316` | Notion, VS Code, AI-assisted workflows |
| `components` | PC Components | `#EC4899` | CPUs, GPUs, motherboards, RAM, PC building |

---

## 7. FEATURE: HOMEPAGE

The homepage is a content-rich editorial front page:

1. **Hero Section** — Tagline "Practical answers, not filler — across code, devices, and money." + KnowledgeOrbit (desktop circular niche navigator with mouse-follow tilt animation)
2. **Shopping Intelligence Hero** — AI-powered product recommendations (lazy-loaded, below fold)
3. **Personalized Sections** (logged-in users only):
   - Continue Reading (from reading history)
   - Because You Read... (related to recent history)
   - Your Topics (followed niches)
   - From Authors You Follow (recent posts from followed authors)
   - Recommended For You (AI product recommendations based on interests)
4. **Buying Guides** — 3 latest guides in a grid
5. **Featured** — BentoGrid layout (6 posts)
6. **Keep Exploring** — HorizontalRail (scrollable 12 posts)

### Data Fetching Pattern
```ts
// All independent fetches in parallel
const [posts, personalized, shoppingHero, buyingGuides] = await Promise.all([
  getRecentPosts(12),
  getPersonalizedData(),
  getShoppingIntelligenceHero(),
  getBuyingGuidesForHomepage(),
]);
```

### KnowledgeOrbit
- Desktop only (`hidden lg:flex`)
- 9 niches arranged in a circle around the wordmark
- **Auto-rotates at very slow constant speed** (full 360° over ~60 seconds) via CSS animation
- No mouse-follow tilt — pure continuous rotation
- Pauses on hover, resumes on mouse leave
- Respects `prefers-reduced-motion: reduce` (disables rotation)
- Each niche is a link to `/niche/{slug}`
- Pills: `rounded-full border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-sm text-zinc-100 hover:border-white`
- Center: `tech//site` logo text + "pick a topic" tagline in Cormorant Garamond italic

```css
/* Orbit rotation keyframes */
@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Individual niche pills counter-rotate to stay upright */
@keyframes orbit-counter-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.orbit-ring {
  animation: orbit-spin 60s linear infinite;
}

.orbit-ring:hover {
  animation-play-state: paused;
}

.orbit-pill {
  animation: orbit-counter-spin 60s linear infinite;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .orbit-ring, .orbit-pill {
    animation: none;
  }
}
```

---

## 8. FEATURE: ARTICLE PAGES

Full-featured article reader:

1. **Reading Progress** — Fixed top bar + inline "% read" stat (shared scroll context, single listener)
2. **Hero Image** — Full-width cover with `priority` loading, proper `sizes` attribute
3. **Metadata** — Author name, publication date, reading time, AI-assisted badge
4. **Action Buttons** — Bookmark, Add to Collection, Reading Queue
5. **Table of Contents** — Auto-generated from headings, sticky sidebar on desktop
6. **Article Body** — Markdown rendered with syntax highlighting (dark code blocks)
7. **Author Block** — Author profile, bio, follow button (server component, shared userId)
8. **Comments** — Client-side CRUD with Supabase
9. **Highlights** — Client-side text highlighting system
10. **Private Notes** — Client-side private note-taking
11. **Related Posts** — 3 related articles from same niche

### Performance Optimizations
- `recordView()` is fire-and-forget (non-blocking)
- Comments, Highlights, Notes, Related wrapped in `<Suspense>` boundaries
- Article body streams first, below-fold sections stream via Suspense
- JSON-LD structured data for SEO
- Open Graph + Twitter Card metadata

### ReadingProgress Architecture
```tsx
// Single scroll listener shared via context
<ReadingProgressProvider targetId="article-body">
  <ReadingProgressBar color={ambientColor} />  {/* Fixed top bar */}
  {/* ... article content ... */}
  <ReadingProgressStat />  {/* Inline % read */}
</ReadingProgressProvider>
```

---

## 9. FEATURE: AI SHOPPING INTELLIGENCE

Gemini-powered product recommendation engine:

### User Flow
1. User describes what they need (budget, priorities, use case)
2. AI analyzes specs, prices, reviews
3. Returns 3-6 product picks with reasoning, pros/cons, buy links

### Implementation
- `/api/shopping/ai-recommend` — POST endpoint, sends prompt to Gemini
- `shopping/page.tsx` — Form + results display
- `ShoppingIntelligenceHero.tsx` — Homepage hero variant
- Products from Supabase database (seed data as fallback)
- Buy links to Amazon/Flipkart/Croma/Reliance

### AI Prompt Structure
```
Given a user query about [category], recommend the best products.
For each product provide:
- name, manufacturer, model
- why it's recommended (reasoning)
- pros (2-3)
- cons (1-2)
- label (Best Overall, Best Value, Budget Pick, etc.)
Use real product data from the database.
```

---

## 10. FEATURE: AI PC BUILDER

Gemini-powered PC build generator:

### User Flow
1. User specifies budget, use case (gaming, productivity, etc.)
2. AI generates 3 complete PC builds (Budget, Mid-Range, High-End)
3. Each build has 8 components: CPU, GPU, Motherboard, RAM, Storage, PSU, Case, Cooler
4. Each component has name, price, reasoning, link to buy

### Implementation
- `/api/pc-builder/ai-build` — POST endpoint
- `pc-builder/page.tsx` — Form + expandable build cards
- Components with real Indian pricing (INR)
- Buy links to Amazon/Flipkart

---

## 11. FEATURE: PRODUCT DETAIL MODAL

Product details open as a **modal overlay** (like CommandPalette), NOT as a separate page. This keeps users in context while browsing products.

### Design
- **Trigger**: Clicking any product card (in shopping results, recommendations, comparison, etc.)
- **Overlay**: `fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm` — same as CommandPalette
- **Container**: `max-w-2xl mx-auto mt-[8vh] max-h-[84vh] overflow-y-auto rounded-folder border border-line bg-paper shadow-2xl`
- **Close**: ESC key + click outside + X button in top-right
- **Scroll**: Modal body scrolls, not the page behind it

### Modal Content Layout
```
┌─────────────────────────────────────────────┐
│  Home / Shopping / Apple iPhone 15 (128GB)  │  ← Breadcrumb
│                                             │
│  APPLE · IPHONE 15                         │  ← Manufacturer + model (mono, uppercase)
│  Apple iPhone 15 (128GB)          ♡ Wishlist│  ← Title (Fraunces, large) + Wishlist button
│  Dynamic Island, 48MP camera...            │  ← Description (muted text)
│                                             │
│  ─── Specifications ──────────────────────  │  ← Section divider
│  ┌─────────────┬──────────────────────────┐│
│  │ Chip        │ Apple A16 Bionic         ││  ← Spec table (zebra striping)
│  │ Display     │ 6.1-inch Super Retina... ││
│  │ Camera      │ 48MP + 12MP ultrawide    ││
│  │ Storage     │ 128 GB                   ││
│  │ Battery     │ 3349 mAh, ~20h video     ││
│  └─────────────┴──────────────────────────┘│
│                                             │
│  ─── Where to buy ────────────────────────  │
│  ┌──────────────────┐ ┌──────────────────┐ │
│  │ Amazon     ↗     │ │ Flipkart    ↗    │ │  ← Retailer cards
│  │ ₹65,999          │ │ ₹64,999          │ │     with external link icon
│  │ In Stock         │ │ In Stock         │ │
│  └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────┘
```

### Implementation
- `ProductDetailModal.tsx` — Client component, fetches product data from `/api/products/[slug]`
- Opened via React context: `ProductModalProvider` wraps the app, `openProductModal(slug)` triggers it
- Product cards across the site use `onClick={() => openProductModal(product.slug)}` instead of `<Link href={...}>`
- No separate `/products/[slug]` page — everything is modal-based
- Modal handles its own loading state with skeleton placeholders
- Backdrop blur: `backdrop-blur-sm` on the overlay

### Spec Table Style
- Alternating row backgrounds: even rows `bg-bg`, odd rows `bg-paper`
- Left column: `font-mono text-sm text-muted` (spec key)
- Right column: `text-sm text-ink` (spec value)
- Table container: `rounded-folder border border-line overflow-hidden`

### Retailer Card Style
- `rounded-folder border border-line bg-paper p-4 hover:border-ink transition-colors`
- Retailer name: `font-display text-lg font-semibold text-ink`
- Price: `font-display text-xl text-ink`
- Availability: `font-mono text-xs text-muted`
- External link icon: `<ExternalLink size={14} />` in top-right corner

---

## 12. FEATURE: TOPIC HOMEPAGES

Each niche/category gets its own dedicated homepage at `/niche/{slug}`.

### Design (matches screenshot)
```
┌─────────────────────────────────────────────┐
│  Home  /  Windows                           │  ← Breadcrumb
│                                             │
│  ● Windows                                  │  ← Colored dot + niche name (Fraunces, 3xl)
│  Faster PCs                                 │  ← Niche tagline (Cormorant Garamond, italic, muted)
│  Windows optimization, troubleshooting...   │  ← Description (muted text)
│                                  [Follow Windows]  ← Follow button (black bg, white text)
│  ─────────────────────────────────────────  │  ← Colored divider line (niche color)
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ● WINDOWS                          │   │  ← Article card
│  │ Speed Up Windows 11 Boot Time: 9...│   │     NicheTag pill (colored dot + label)
│  │ From 90 seconds to under 20:...    │   │     Title (Fraunces, semibold)
│  │ Sana Sheikh · 10 Jan 2026 · 2 min  │   │     Excerpt (muted)
│  └─────────────────────────────────────┘   │     Meta (mono, 11px)
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Another article card...             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Implementation
- Route: `/niche/[slug]/page.tsx`
- Server component, fetches posts filtered by niche
- Breadcrumb: `Home / {Niche Label}` with links
- Header: Colored dot (`h-3 w-3 rounded-full`) + niche name (Fraunces, `text-3xl`)
- Tagline: Niche tagline in Cormorant Garamond italic
- Description: Niche description in muted text
- Follow button: `bg-void text-white px-4 py-2 rounded-folder text-sm font-medium` (black button, white text)
  - When following: `bg-paper text-ink border border-line` (light button)
  - Uses `TopicFollowButton` component
- Divider: `h-[2px] w-full` with `background-color: {niche.color}`
- Article list: Vertical stack of PostCard components
- No grid/rail — clean single-column editorial layout

### Follow Button States
```tsx
// Not following
<button className="bg-void text-white px-4 py-2 rounded-folder text-sm font-medium hover:opacity-90 transition-opacity">
  Follow {niche.label}
</button>

// Following
<button className="bg-paper text-ink border border-line px-4 py-2 rounded-folder text-sm font-medium hover:border-ink transition-colors">
  Following
</button>
```

---

## 13. FEATURE: USER LIBRARY

Full personal library system:

- **Bookmarks** — Save articles for later
- **Reading History** — Auto-tracked, "Continue Reading" on homepage
- **Reading Queue** — Explicit queue for articles to read
- **Collections** — User-created folders to organize saved articles
- **Highlights** — Text highlighting with optional notes
- **Private Notes** — Per-article private notes
- **Topic Follows** — Follow niches for personalized content
- **Author Follows** — Follow authors for their content

---

## 13. FEATURE: ADMIN CMS

Admin content management:

- **Admin Auth** — Separate JWT auth (not Supabase Auth), bcrypt password, httpOnly cookie, 7-day expiry
- **Dashboard** — Post count, recent posts, stats
- **Post Management** — Create, edit, delete posts with markdown editor
- **AI Draft Generation** — Gemini generates article drafts from title/excerpt
- **Image Upload** — Upload to Supabase Storage bucket `post-images`
- **Category Management** — View niche categories
- **RLS Bypass** — Admin uses service-role key for full database access

---

## 14. FEATURE: COMMAND PALETTE (Cmd+K)

Global search overlay:

- Triggered by `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- Lazy-loads search index from `/api/search-index` on first open
- Client-side fuzzy matching with hand-rolled scorer
- Returns: posts, niches, products, buying guides
- Keyboard navigation (arrow keys + Enter)
- Dynamically imported (`ssr: false`)

---

## 15. FEATURE: READING PROGRESS

Consolidated scroll tracking:

- **Single scroll listener** via React context (not two separate listeners)
- **ReadingProgressBar** — Fixed top bar, colored by niche, with glow effect
- **ReadingProgressStat** — Inline "N% read" text in article meta
- Uses `passive: true` scroll listener
- Caches `getElementById` result in ref

---

## 16. DATA FETCHING PATTERNS

### Post Queries (Optimized)
```ts
// CARD_COLUMNS excludes heavy 'content' body for lists/cards
const CARD_COLUMNS = 'id, slug, title, excerpt, niche, author_id, author_name, author_avatar, cover_image_url, published_at, reading_time, seo_title, seo_description, status, featured, tags, niche_color, is_ai_assisted, created_at, updated_at';

// getPublishedPostsCards() — for cards/lists (no content body)
// getPublishedPosts() — for article pages (with content body)
// getPostBySlugDirect() — single post query (no full table scan)
```

### Parallelization
```ts
// Homepage: 4 independent fetches in parallel
const [posts, personalized, shoppingHero, buyingGuides] = await Promise.all([...]);

// Article page: comments (public) in Tier 2, not waiting for auth
const [related, bookmarked, inQueue, authResult, comments] = await Promise.all([...]);

// recordView: fire-and-forget
recordView(post.id).catch(() => {});
```

### Dual Data Mode
Every data function tries Supabase first, falls back to seed data:
```ts
if (isSupabaseConfigured()) {
  // Try Supabase
} else {
  // Fall back to seed data
}
```

---

## 17. SEO & SOCIAL

### Sitemap (`app/sitemap.ts`)
- Auto-generated from posts, guides, niches
- Includes: homepage, shopping, pc-builder, guides, about, contact
- Proper `lastModified`, `changeFrequency`, `priority`

### Robots.txt (`app/robots.ts`)
- Allow: `/`
- Disallow: `/admin/`, `/api/`, `/dashboard`, `/library/`, `/write/`
- Sitemap URL

### Open Graph (per article page)
```ts
openGraph: {
  title, description, type: 'article',
  publishedTime, authors, section,
  images: [{ url, width: 1200, height: 630 }]
}
```

### Twitter Card
```ts
twitter: { card: 'summary_large_image', title, description, images }
```

### JSON-LD (per article page)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "image": "...",
  "publisher": { "@type": "Organization", "name": "tech//site" }
}
```

---

## 18. PERFORMANCE OPTIMIZATIONS (Implement These)

### CSS
- **Scoped transitions** — Do NOT use `* { transition: ... }`. Target only `a, button, input, header, nav, footer`
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all animations

### Dynamic Imports (all with `ssr: false` via client wrappers)
- `CommandPalette` — via `ClientShell.tsx`
- `SpeedInsights` — via `ClientShell.tsx`
- `FeatureDiscovery` — via `FeatureDiscoveryWrapper.tsx`
- `ShoppingIntelligenceHero` — via `ShoppingIntelligenceHeroLazy.tsx`

### Component Architecture
- `PostCard` — Server component (no hooks, no 'use client')
- `ProductCard` — Server component
- `BentoGrid` — Server component
- `Header` / `Footer` — Server components
- `KnowledgeOrbit` — Client with `requestAnimationFrame` throttle
- `Comments` / `Highlights` / `PrivateNotes` — Client, lazy-loaded via Suspense

### Next.js Config
```js
experimental: {
  optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
}
```

### Article Page Streaming
```tsx
<Suspense fallback={<SectionSkeleton />}>
  <AuthorBlock ... />
</Suspense>
<Suspense fallback={<SectionSkeleton />}>
  <Comments ... />
</Suspense>
<Suspense fallback={<SectionSkeleton />}>
  <RelatedPosts ... />
</Suspense>
```

---

## 19. AUTHENTICATION

### User Auth (Supabase Auth)
- Email/password signup and login
- Session managed by Supabase client
- Middleware refreshes session cookies
- Profile auto-created on signup via database trigger or onboarding page

### Admin Auth (Separate JWT System)
- Single admin account (email + bcrypt password hash)
- JWT signed with `jose`, httpOnly cookie `tech_site_admin_session`
- 7-day expiry
- Service-role key bypasses RLS for admin operations
- Admin layout checks `isAdminRequest()` for route protection

---

## 20. SEED DATA

### Articles (11 seed posts)
Create markdown files in `content/articles/` covering:
- AI tools (ChatGPT alternatives, prompt engineering)
- Programming (React Server Components, Node.js debugging)
- Android (storage fix)
- Windows (boot time optimization)
- Gaming (Valorant settings)
- Career (interview prep)
- Finance (credit cards)
- Productivity (Notion templates)

Each article: 1000-2000 words of real, useful content. Not placeholder text.

### Products (20+ seed products)
Seed data in `content/seed-products.ts`:
- Laptops: MacBook Air M2, Dell XPS 13, ThinkPad X1 Carbon, Acer Aspire, ASUS Vivobook, etc.
- Smartphones: iPhone 15, Galaxy S24, Pixel 8, budget phones
- Headphones: Sony WH-1000XM5, Bose QC45, AirPods Max, budget options
- Each with: specs array, retailers array (Amazon/Flipkart/Croma with INR prices)

### Buying Guides (8 seed guides)
- Best phones under ₹5K, ₹8K, ₹10K, ₹15K, ₹20K
- Best laptops for students
- Best headphones under ₹5K
- Complete PC building guide for India

---

## 21. CRITICAL IMPLEMENTATION DETAILS

### globals.css Structure
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS variables for theming */
:root { ... }
.dark { ... }

/* Prose typography for articles */
.prose-tech { ... }
.prose-tech h1 { ... }
.prose-tech h2 { ... }
.prose-tech p { ... }
.prose-tech a { ... }
.prose-tech code { ... }      /* Always dark background */
.prose-tech pre { ... }       /* Always dark (#09090B) */

/* Syntax highlighting (always dark) */
.hljs { background: #09090B; color: #c9d1d9; }
.hljs-keyword { color: #ff7b72; }
.hljs-string { color: #a6e3a1; }
/* ... more token colors ... */

/* Scoped transitions (NOT on *) */
a, button, input, header, nav, footer { transition: ... }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { ... }
```

### Root Layout
```tsx
// fonts (self-hosted, NOT next/font)
import '@fontsource-variable/fraunces';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';

// ClientShell: dynamically imports CommandPalette + SpeedInsights (ssr: false)
import { ClientShell } from '@/components/ClientShell';

// Metadata with metadataBase
export const metadata: Metadata = {
  metadataBase: new URL('https://tech-site.example'),
  title: { default: 'tech/site — practical guides across AI, code, and gadgets', template: '%s — tech/site' },
  description: '...',
};
```

### Main Layout
```tsx
// FeatureDiscoveryWrapper: dynamically imports FeatureDiscovery (ssr: false)
import { FeatureDiscoveryWrapper } from '@/components/FeatureDiscoveryWrapper';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function MainLayout({ children }) {
  return (
    <FeatureDiscoveryWrapper>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </FeatureDiscoveryWrapper>
  );
}
```

### Middleware
```ts
// Only refreshes Supabase auth session — no route protection
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(...);
  await supabase.auth.getUser(); // refresh session
  return supabaseResponse;
}
```

### Supabase Server Client
```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(cookiesToSet) { ... } } }
  );
}

// Admin client using service-role key (bypasses RLS)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

---

## 22. BUILD & DEPLOYMENT

### Scripts
```json
{
  "dev": "next dev",
  "build": "node scripts/gen-version.mjs && next build",
  "start": "next start",
  "lint": "next lint",
  "hash-password": "node scripts/hash-password.mjs"
}
```

### gen-version.mjs
Reads `package.json` version + git commit info, writes to `public/version.json`.

### hash-password.mjs
CLI tool: `node scripts/hash-password.mjs <password>` — outputs base64-encoded bcrypt hash for `.env.local`.

---

## 23. WHAT MAKES THIS DIFFERENT

1. **Dual data mode** — Works without any database (seed data fallback). Every Supabase call has a local fallback.
2. **AI-powered features** — Not just a blog. Gemini powers shopping recommendations, PC builds, and draft generation.
3. **Full user library** — Bookmarks, history, queue, collections, highlights, notes, follows. Not just reading.
4. **Product intelligence** — Full product database with specs, retailers, prices, buy links. Comparison engine.
5. **Premium editorial design** — Not a generic blog template. Custom typography, niche colors, KnowledgeOrbit, BentoGrid.
6. **Performance-first architecture** — Server components, parallel fetching, Suspense streaming, consolidated scroll listeners, scoped CSS transitions.
7. **Complete SEO** — Sitemap, robots.txt, Open Graph, Twitter Card, JSON-LD structured data.

---

## 24. BUILD CHECKLIST

After building, verify:
- [ ] Homepage renders with all sections (hero, orbit, shopping, guides, featured, keep exploring)
- [ ] Article pages render with reading progress, TOC, comments, highlights, notes, related
- [ ] Shopping page works with AI recommendations
- [ ] PC Builder generates builds via AI
- [ ] Compare page searches and compares products
- [ ] Library bookmarks, history, collections work
- [ ] Admin login, post creation, AI draft generation work
- [ ] Command Palette (Cmd+K) searches all content
- [ ] Mobile responsive (hamburger nav, stacked layouts)
- [ ] Dark/light theme toggle works
- [ ] Sitemap.xml generates correctly
- [ ] Robots.txt has proper rules
- [ ] All images have proper `sizes` attributes
- [ ] Hero images have `priority` loading
- [ ] No `SELECT *` on card/list queries (use CARD_COLUMNS)
- [ ] No N+1 query patterns
- [ ] All independent data fetches use `Promise.all`
- [ ] `recordView` is fire-and-forget
- [ ] Below-fold sections use Suspense boundaries
