# Environment setup

Copy `.env.example` to `.env.local` and fill every value. **Restart dev**
after any edit — Next.js bakes env at boot.

## Supabase (live project)

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → Data API → URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → `anon` `public` key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` (secret — server only, never `NEXT_PUBLIC_`) |

Schema source of truth: `supabase/schema.sql` (apply in the SQL editor).
Storage bucket `post-images` must exist for cover uploads.

## Admin login (separate from Supabase Auth)

Single admin account with its own JWT cookie — readers never touch it.

```bash
npm run hash-password -- "your-real-password"   # prints ADMIN_PASSWORD_HASH_B64=...
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # ADMIN_SESSION_SECRET
```

| Variable | Notes |
|---|---|
| `ADMIN_EMAIL` | e.g. `admin@techsite.com` |
| `ADMIN_PASSWORD_HASH_B64` | Paste the base64 string exactly as printed |
| `ADMIN_SESSION_SECRET` | Long random hex, 7-day signed cookies |

Login at `/admin/login`. Default dev credential (rotate immediately):
`admin@techsite.com` / `admin123`.

## AI (Gemini)

Free key: <https://aistudio.google.com/apikey> → `GEMINI_API_KEY`.
Powers product search/detail/compare, `/shopping`, `/pc-builder`, and the
admin draft generator. Quota is shared — watch 429s in server logs.

## Site

`NEXT_PUBLIC_SITE_URL` — canonical origin (`http://localhost:3000` for
dev; production URL when deployed). Used by metadata, sitemap, robots.

## Contact form (Resend)

The `/contact` form sends mail via the Resend API (no SDK — direct fetch).

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Create at <https://resend.com/api-keys> (free tier suffices) |
| `CONTACT_TO` | Inbox, defaults to `jhonnysilverhand.069@gmail.com` |
| `CONTACT_FROM` | Sender identity; `onboarding@resend.dev` works without a custom domain. For production, verify your domain in Resend and use `contact@yourdomain` |

Without `RESEND_API_KEY` the form responds 503 with "not configured yet".
Set it in Vercel env vars too.

## Reference (old project)

The previous codebase (`tech-site`, Supabase `kgflqrpdcaxccvuxyhff`) keeps
its own `.env.local` with the same key names plus retailer/affiliate keys
(Amazon PA-API, Flipkart, Croma/Apify, ExchangeRate) for a future
real-price integration. Supabase keys are **project-bound** — never copy
them across projects. `GEMINI_API_KEY` is portable and was copied over.
