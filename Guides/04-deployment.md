# Deployment (Vercel)

Vercel is the natural fit for a Next.js App Router project like this one — it's built by the same team and needs no configuration for the framework itself.

## 1. Push to GitHub

```bash
cd website
git init
git add .
git commit -m "Initial commit"
```

Create a new (private, if you prefer) repository on GitHub and push `website/` to it. `.gitignore` already excludes `node_modules`, `.next`, and `.env.local`, so secrets won't be committed.

## 2. Import into Vercel

1. Go to https://vercel.com, sign in, **Add New → Project**
2. Import the GitHub repo you just pushed
3. Framework preset should auto-detect as Next.js — leave the defaults

## 3. Add environment variables

Before your first deploy (or right after — you can redeploy), add every variable from your local `.env.local` to **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH_B64`
- `ADMIN_SESSION_SECRET`
- `GEMINI_API_KEY`

Use the same real values you're using locally — don't regenerate the admin hash or session secret unless you want to change your admin password.

## 4. Point Supabase at your real domain

Once you have a production URL (either the `*.vercel.app` one Vercel gives you, or a custom domain), set it as the Site URL and add it to Redirect URLs in Supabase — this is the single most common thing to forget before launch, and the exact fix (plus why it happens) is in `01-database-setup.md` under "Fixing confirmation emails that link to localhost." Do this before sharing the link with real users, not after.

## 5. Deploy

Trigger a deploy (Vercel does this automatically on push, or use the dashboard's Deploy button). Once it's live, sign in at `/admin/login` on the production URL and confirm everything — dashboard, new post, AI generate, image upload — works the same as it did locally.

## A note on the local seed content

Once `NEXT_PUBLIC_SUPABASE_URL` is set in production, the site stops using `content/articles/*.md` automatically and serves only what's in your `posts` table — so make sure you've either run `Guides/sql/seed.sql` or published some real posts through the admin panel before sharing the link, or the site will look empty.
