# Database setup (Supabase)

This connects real persistence: user accounts, posts that survive a restart, and image uploads. Supabase's free tier covers this comfortably for a new site.

## 1. Create a project

1. Go to https://supabase.com and create a free account
2. **New project** — pick any name/region, and set a database password (save it somewhere; you won't need it day-to-day, but you'll want it if you ever connect a Postgres client directly)
3. Wait for the project to finish provisioning (a couple of minutes)

## 2. Get your keys

In your project, go to **Settings → API**. You need three values:

| Value | Where | Goes in `.env.local` as |
|---|---|---|
| Project URL | Settings → API → Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | Settings → API → Project API keys | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | Settings → API → Project API keys | `SUPABASE_SERVICE_ROLE_KEY` |

The service role key bypasses every permission check in your database. It's what lets the admin account manage everyone's posts, which is exactly why it must **only** live in `.env.local` / your hosting provider's server-side env vars — never in anything prefixed `NEXT_PUBLIC_`, never committed, never sent to the browser.

## 3. Run the schema

1. In Supabase, open **SQL Editor**
2. Paste the entire contents of `Guides/sql/schema.sql`, run it
3. This creates the `posts` table, indexes, an auto-updating `updated_at`, and the Row Level Security policies that let signed-in users manage only their own posts

Read the comments at the bottom of `schema.sql` — they explain exactly why the admin panel doesn't need (or get) its own RLS policy.

## 4. (Optional) Seed some sample data

`Guides/sql/seed.sql` inserts 3 real sample posts, mainly useful to confirm the schema and RLS actually work end-to-end once you query them. It's optional — the site already looks fully populated locally without it, via `content/articles/*.md`. Paste it into the SQL Editor and run it any time.

## 5. Create the image storage bucket

The admin panel's image upload button needs a storage bucket:

1. Go to **Storage** → **New bucket**
2. Name it exactly `post-images`
3. Toggle **Public bucket** on (so uploaded images are viewable without auth)
4. Create

If you skip this, everything else still works — the admin can still paste a cover image URL by hand, they just won't be able to use the upload button until this bucket exists.

## 6. Add the keys to your app

Put the three values from step 2 into `website/.env.local`, then restart `npm run dev`. The public site, admin dashboard, and dashboard/write pages will now read and write real data instead of local samples.

## Fixing confirmation emails that link to localhost

**If signup confirmation emails are sending people to `localhost` instead of your real domain, this is why, and it's a two-minute fix.** Supabase builds every confirmation/magic-link email from a single **Site URL** setting in your project — not from wherever the request actually came from. New projects default this to `http://localhost:3000`, and it's easy to launch without ever changing it.

Fix it in Supabase: **Authentication → URL Configuration**

1. Set **Site URL** to your real production URL (e.g. `https://your-domain.com`)
2. Under **Redirect URLs**, add *both* your production URL and `http://localhost:3000` — not just one replacing the other. This list is an allowlist, not a single value, and you want local dev signups to keep working too.

This app also sets `emailRedirectTo` explicitly in both the signup code (`app/(auth)/signup/page.tsx`) and the forgot-password flow (`app/(auth)/forgot-password/page.tsx`), derived from wherever the request actually happened — that's what makes local dev and production both work correctly once both origins are in the Redirect URLs list above. Without an origin being in that allowlist, Supabase will reject it even if `emailRedirectTo` asks for it.

If you already deployed and real users hit the broken localhost link before this was fixed, their accounts exist but aren't confirmed — they can safely sign up again with the same email once the URLs above are set, or you can manually confirm them in **Authentication → Users** in the Supabase dashboard.
