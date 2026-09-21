-- ============================================================
-- tech//site Database Schema
-- Version: 4.0
-- Previous Version: 3.8
-- Date: 2026-09-10
-- ============================================================

-- tech-site database schema
-- Run this once in your Supabase project's SQL Editor. Full walkthrough in
-- Guides/01-database-setup.md.

create extension if not exists pgcrypto;

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null,
  niche text not null check (niche in (
    'ai-tools', 'programming', 'android', 'windows-linux',
    'buying-guides', 'gaming', 'career-jobs', 'finance', 'productivity'
  )),
  cover_image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Admin',
  is_ai_assisted boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_status_published_idx on posts (status, published_at desc);
create index if not exists posts_niche_idx on posts (niche);
create index if not exists posts_author_id_idx on posts (author_id);

-- Keep updated_at current automatically on every UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- ------------------------------------------------------------------
-- Row Level Security
--
-- This is what makes "users can only touch their own posts" true at the
-- database level, not just in the app's UI. The admin panel never relies
-- on these policies at all — it authenticates with its own cookie
-- (lib/auth.ts) and talks to Supabase with the SERVICE ROLE key
-- (lib/supabase/server.ts -> createAdminClient), which bypasses RLS
-- entirely. That's the whole mechanism behind "one admin, full control."
-- ------------------------------------------------------------------

alter table posts enable row level security;

drop policy if exists "public can read published posts" on posts;
create policy "public can read published posts"
  on posts for select
  using (status = 'published');

drop policy if exists "users can read own posts" on posts;
create policy "users can read own posts"
  on posts for select
  using (auth.uid() = author_id);

drop policy if exists "users can insert own posts" on posts;
create policy "users can insert own posts"
  on posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "users can update own posts" on posts;
create policy "users can update own posts"
  on posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "users can delete own posts" on posts;
create policy "users can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- ------------------------------------------------------------------
-- Library (added in 3.6) — bookmarks and reading history. Deliberately
-- NOT a full profile system: no bio, no avatar upload, no public profile
-- URLs, no followers. Just two small per-user tables backing the
-- "Library" panel. Collections, highlights, personal notes, newsletter
-- preferences, and comments are intentionally not here yet — see
-- Guides/03-what-to-edit.md for why each was deferred rather than built
-- shallow.
-- ------------------------------------------------------------------

-- ------------------------------------------------------------------
-- Profiles (added in 3.8) — strong user identity layer.
-- Stores display name, username, bio, avatar, website, social links,
-- and favorite niches. This is the editorial creator profile that makes
-- "tech//site" feel like your space, not just a reading tool.
-- ------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  website text,
  twitter text,
  github text,
  linkedin text,
  favorite_niches text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on profiles (username);

alter table profiles enable row level security;

drop policy if exists "public can read profiles" on profiles;
create policy "public can read profiles"
  on profiles for select
  using (true);

drop policy if exists "users manage own profile" on profiles;
create policy "users manage own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------------
-- Library tables
-- ------------------------------------------------------------------

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);
create index if not exists bookmarks_user_id_idx on bookmarks (user_id, created_at desc);

alter table bookmarks enable row level security;

drop policy if exists "users manage own bookmarks" on bookmarks;
create policy "users manage own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One row per (user, post) — viewed_at is updated (not duplicated) on
-- every re-read via upsert, so this table doubles as both "history"
-- (every row, sorted by viewed_at) and "continue reading" (the newest
-- row) without needing two separate tables.
create table if not exists reading_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (user_id, post_id)
);
create index if not exists reading_history_user_id_idx on reading_history (user_id, viewed_at desc);

alter table reading_history enable row level security;

drop policy if exists "users manage own reading history" on reading_history;
create policy "users manage own reading history"
  on reading_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Collections (added after 3.6) — named groups of saved posts. A
-- collection has one owner; collection_posts is the many-to-many join
-- between collections and posts. collection_posts has no user_id column
-- of its own, so its RLS policies check ownership through the parent
-- collection instead.

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists collections_user_id_idx on collections (user_id, created_at desc);

alter table collections enable row level security;

drop policy if exists "users manage own collections" on collections;
create policy "users manage own collections"
  on collections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists collection_posts (
  collection_id uuid not null references collections(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, post_id)
);
create index if not exists collection_posts_collection_id_idx on collection_posts (collection_id, added_at desc);

alter table collection_posts enable row level security;

drop policy if exists "users manage own collection_posts" on collection_posts;
create policy "users manage own collection_posts"
  on collection_posts for all
  using (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()))
  with check (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()));

-- ------------------------------------------------------------------
-- Comments (added in 4.0) — article discussions
-- ------------------------------------------------------------------

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on comments (post_id, created_at desc);
create index if not exists comments_user_id_idx on comments (user_id, created_at desc);

alter table comments enable row level security;

drop policy if exists "public can read comments on published posts" on comments;
create policy "public can read comments on published posts"
  on comments for select
  using (
    exists (select 1 from posts p where p.id = post_id and p.status = 'published')
  );

drop policy if exists "users manage own comments" on comments;
create policy "users manage own comments"
  on comments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Highlights (added in 4.0) — saved text selections with optional notes
-- ------------------------------------------------------------------

create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  selected_text text not null,
  note text,
  location_json jsonb, -- stores selection range for re-identification
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists highlights_user_id_idx on highlights (user_id, created_at desc);
create index if not exists highlights_post_id_idx on highlights (post_id, created_at desc);

alter table highlights enable row level security;

drop policy if exists "users manage own highlights" on highlights;
create policy "users manage own highlights"
  on highlights for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Private Notes (added in 4.0) — user notes on saved/highlighted content
-- ------------------------------------------------------------------

create table if not exists private_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create index if not exists private_notes_user_id_idx on private_notes (user_id, created_at desc);

alter table private_notes enable row level security;

drop policy if exists "users manage own private notes" on private_notes;
create policy "users manage own private notes"
  on private_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Reading Queue (added in 4.0) — intentionally saved for later reading
-- Separate from bookmarks which are general saves
-- ------------------------------------------------------------------

create table if not exists reading_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create index if not exists reading_queue_user_id_idx on reading_queue (user_id, added_at desc);

alter table reading_queue enable row level security;

drop policy if exists "users manage own reading queue" on reading_queue;
create policy "users manage own reading queue"
  on reading_queue for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Author Follows (added in 4.0) — users can follow authors
-- ------------------------------------------------------------------

create table if not exists author_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, author_id)
);

create index if not exists author_follows_user_id_idx on author_follows (user_id, created_at desc);
create index if not exists author_follows_author_id_idx on author_follows (author_id, created_at desc);

alter table author_follows enable row level security;

drop policy if exists "public can read follows" on author_follows;
create policy "public can read follows"
  on author_follows for select
  using (true);

drop policy if exists "users manage own follows" on author_follows;
create policy "users manage own follows"
  on author_follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Topic Follows (added in 4.0) — users can follow niches/topics
-- ------------------------------------------------------------------

create table if not exists topic_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  niche_slug text not null check (niche_slug in (
    'ai-tools', 'programming', 'android', 'windows-linux',
    'buying-guides', 'gaming', 'career-jobs', 'finance', 'productivity'
  )),
  created_at timestamptz not null default now(),
  unique (user_id, niche_slug)
);

create index if not exists topic_follows_user_id_idx on topic_follows (user_id, created_at desc);

alter table topic_follows enable row level security;

drop policy if exists "public can read topic follows" on topic_follows;
create policy "public can read topic follows"
  on topic_follows for select
  using (true);

drop policy if exists "users manage own topic follows" on topic_follows;
create policy "users manage own topic follows"
  on topic_follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Product Data Model (added in 4.0) — Shopping Intelligence
-- ------------------------------------------------------------------

-- Product categories (extensible, category-specific specs)
create table if not exists product_categories (
  slug text primary key,
  name text not null,
  description text,
  spec_schema jsonb not null default '{}', -- JSON schema for category-specific specs
  created_at timestamptz not null default now()
);

alter table product_categories enable row level security;

drop policy if exists "public can read product categories" on product_categories;
create policy "public can read product categories"
  on product_categories for select
  using (true);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references product_categories(slug),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  manufacturer text,
  model text,
  release_date date,
  status text not null default 'active' check (status in ('active', 'discontinued', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_slug_idx on products (category_slug);
create index if not exists products_slug_idx on products (slug);
create index if not exists products_status_idx on products (status);

alter table products enable row level security;

drop policy if exists "public can read active products" on products;
create policy "public can read active products"
  on products for select
  using (status = 'active');

-- Product specifications (category-specific, key-value)
create table if not exists product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  spec_key text not null,
  spec_value text not null,
  unit text, -- e.g., 'GB', 'hours', 'MP', 'Hz'
  display_order int not null default 0,
  unique (product_id, spec_key)
);

create index if not exists product_specs_product_id_idx on product_specs (product_id);

alter table product_specs enable row level security;

drop policy if exists "public can read specs of active products" on product_specs;
create policy "public can read specs of active products"
  on product_specs for select
  using (exists (select 1 from products p where p.id = product_id and p.status = 'active'));

-- Retailers
create table if not exists retailers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  website text,
  logo_url text,
  is_official boolean not null default false,
  affiliate_base_url text, -- base URL for affiliate links
  created_at timestamptz not null default now()
);

alter table retailers enable row level security;

drop policy if exists "public can read retailers" on retailers;
create policy "public can read retailers"
  on retailers for select
  using (true);

-- Product-Retailer relationships (where to buy, prices)
create table if not exists product_retailers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  retailer_id uuid not null references retailers(id) on delete cascade,
  url text not null,
  price_cents int, -- price in minor currency unit (e.g., paise for INR)
  currency text not null default 'INR',
  availability text check (availability in ('in_stock', 'out_of_stock', 'pre_order', 'limited', 'unknown')) default 'unknown',
  affiliate_url text, -- full affiliate URL if different from url
  last_checked timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, retailer_id)
);

create index if not exists product_retailers_product_id_idx on product_retailers (product_id);
create index if not exists product_retailers_retailer_id_idx on product_retailers (retailer_id);

alter table product_retailers enable row level security;

drop policy if exists "public can read product retailers for active products" on product_retailers;
create policy "public can read product retailers for active products"
  on product_retailers for select
  using (exists (select 1 from products p where p.id = product_id and p.status = 'active'));

-- Buying Guides (editorial content linking products)
create table if not exists buying_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null, -- markdown
  category_slug text not null references product_categories(slug),
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'tech//site',
  is_ai_assisted boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists buying_guides_category_slug_idx on buying_guides (category_slug);
create index if not exists buying_guides_slug_idx on buying_guides (slug);
create index if not exists buying_guides_status_published_idx on buying_guides (status, published_at desc);

alter table buying_guides enable row level security;

drop policy if exists "public can read published buying guides" on buying_guides;
create policy "public can read published buying guides"
  on buying_guides for select
  using (status = 'published');

drop policy if exists "users can read own buying guides" on buying_guides;
create policy "users can read own buying guides"
  on buying_guides for select
  using (auth.uid() = author_id);

drop policy if exists "users can insert own buying guides" on buying_guides;
create policy "users can insert own buying guides"
  on buying_guides for insert
  with check (auth.uid() = author_id);

drop policy if exists "users can update own buying guides" on buying_guides;
create policy "users can update own buying guides"
  on buying_guides for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "users can delete own buying guides" on buying_guides;
create policy "users can delete own buying guides"
  on buying_guides for delete
  using (auth.uid() = author_id);

-- Buying Guide Product Recommendations (structured recommendations within guides)
create table if not exists buying_guide_recommendations (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references buying_guides(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  label text not null, -- e.g., 'Best Overall', 'Best Value', 'Budget Pick'
  reason text, -- why this recommendation
  pros text[],
  cons text[],
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (guide_id, product_id)
);

create index if not exists buying_guide_recommendations_guide_id_idx on buying_guide_recommendations (guide_id);

alter table buying_guide_recommendations enable row level security;

drop policy if exists "public can read recommendations for published guides" on buying_guide_recommendations;
create policy "public can read recommendations for published guides"
  on buying_guide_recommendations for select
  using (exists (select 1 from buying_guides bg where bg.id = guide_id and bg.status = 'published'));