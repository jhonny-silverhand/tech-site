# How to run this

## Requirements

- Node.js 18.18 or newer (20 LTS recommended)
- npm (comes with Node)

## 1. Install and start

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000. The entire public site — home page, all 9 niches, every article — works immediately with **zero configuration**, using the real sample articles in `content/articles/*.md`. Nothing to connect, nothing to fill in first.

That local content is a stand-in. The moment Supabase is connected (see `01-database-setup.md`), every public page automatically switches to reading from your real database instead — nothing else to flip.

## 2. What needs setup, and what doesn't

| Feature | Works with zero config? |
|---|---|
| Public site (home, niches, articles) | Yes — serves `content/articles/*.md` |
| Admin login | No — needs `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH_B64` below |
| AI "Generate draft" button | No — needs `GEMINI_API_KEY`, see `02-api-setup.md` |
| User signup / login / writing | No — needs a connected Supabase project, see `01-database-setup.md` |
| Admin creating/editing/deleting posts | No — same, needs Supabase |

Until Supabase is connected, the admin dashboard still opens and shows the local sample content, but read-only, so it's not a dead end while you're setting things up.

## 3. Set up your admin login

1. Copy the env file: `cp .env.example .env.local`
2. Pick a real admin email and put it in `ADMIN_EMAIL`
3. Generate a password hash:
   ```bash
   npm run hash-password -- "your-real-password"
   ```
4. Paste the printed value into `ADMIN_PASSWORD_HASH_B64` in `.env.local`, exactly as shown. It's base64-encoded on purpose — the raw hash contains `$` characters that `.env` parsers (including Next.js's own) can misread as variable references and silently corrupt, so the script encodes it into something that always pastes safely.
5. Generate a random session secret and put it in `ADMIN_SESSION_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. Restart `npm run dev`, then sign in at `/admin/login`

`.env.local` is gitignored — it will never get committed by accident.

## 4. Next steps

- `01-database-setup.md` — connect Supabase so posts, accounts, and images actually persist
- `02-api-setup.md` — turn on the admin's AI drafting button
- `03-what-to-edit.md` — the first things you'll want to customize
- `04-deployment.md` — put it on the internet
