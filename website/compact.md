Objective
Align D:\work\techsite (current) with reference D:\work\tech-site\website (old) for backend/Supabase, UI polish, and data, while fixing runtime errors.
Important Details
Current project: D:\work\techsite → Supabase https://pploiphhwdmerwonqrct.supabase.co (live, populated).
Old project: D:\work\tech-site\website → Supabase https://kgflqrpdcaxccvuxyhff.supabase.co (old slugs, empty catalogs).
Taxonomy changed: old ai-tools, windows-linux, buying-guides... → new ai, programming, android, windows, gadgets, gaming, career, finance, productivity, pc-hardware; no CHECK constraint in current DB.
Design refs: Linear/Vercel-grade SaaS + Apple iOS 26 Liquid Glass (docs/design-liquid-glass.md); no emoji icons, no glass-on-glass, no fake LIVE/status.
npm run dev now self-cleans .next; never share .next between build and dev (causes vendor-chunks/@supabase.js, 5611.js, SegmentViewNode manifest errors).
Covers: explicit URL wins else https://picsum.photos/seed/{slug}/1200/675 via coverFor/withCover.
Admin auth is separate JWT (ADMIN_EMAIL + ADMIN_PASSWORD_HASH_B64 base64 bcrypt + ADMIN_SESSION_SECRET); restart dev after .env.local edits.
VITE_SUPABASE_ANON_KEY belongs to unrelated Vite app D:\work\tablesideordering\apps\web (https://pijldpytmwojapkxkmji.supabase.co), not Next.js projects.
Work State
Completed
UI system: tokens, Button/Field/Badge/Alert/EmptyState/Skeleton/Spinner, PostCard stretched-link, CommandPalette Spotlight-style solid panel with neutral focus, header taskbar without niches + /slug pill Topics row, LIVE/fake status removed, contrast pass to text-accentink.
Pictures: coverFor/withCover in lib/data.ts (18 sites), cover field in UserPostForm + admin/PostForm, API passthrough (user-posts, admin/posts), picsum.photos + Cloudinary/media hosts in next.config.mjs.
/shopping replaced with reference version: page + app/api/shopping/ai-recommend/route.ts ({query} → {summary,picks,query}, gemini-3.6-flash), lucide icons only.
Backend audit: supabase/schema.sql (20 tables) vs Guides/sql/schema.sql v4.0 + wishlist.sql + scraped-products.sql + pc-components.sql; storage bucket post-images matches; tsc --noEmit clean, npm run build passes.
Live DB probe: old 9 posts (all covered, old slugs, 0 products) vs current 11→17 posts, 21 products/86 specs/4 retailers/42 links, 8 guides/14 recs; all 11 current posts had no cover (fallback justified).
Migrated 6 posts old→new (remapped niches, preserved IDs/covers/authors, nulled author_id); 3 skipped (slug exists); total 17.
Fixed next/image unconfigured host bairesdev.mo.cloudinary.net via **.cloudinary.net + reference allowlist.
Restored footer: Ko-fi https://ko-fi.com/whysoserious_omik#setGoalModal, Made with care in India., dynamic year.
Diagnosed POST /api/admin/login 401: ADMIN_PASSWORD_HASH_B64 EMPTY; generated hash for admin123 via node scripts/hash-password.mjs and wrote to D:\work\techsite\.env.local (verified bcrypt-shape).
Audited D:\work\tech-site\website\.env.example (16 keys) and .env.local (7 keys filled, old URL confirmed). 
Active
Admin login pending user restart of dev server to load new hash, then login at /admin/login.
(none) other code changes pending.
Blocked
(none) — ports 3000/3003 freed, .next cleaned, tsc/build passing at last check.
Next Move
Restart dev (npm run dev) and verify /admin/login with ADMIN_EMAIL + admin123, then rotate to stronger password.
Restart dev to load updated next.config.mjs image hosts and verify homepage/niche cards load.
Relevant Files
D:\work\techsite\components\Header.tsx: taskbar + Topics pill row.
D:\work\techsite\components\CommandPalette.tsx, SearchTrigger.tsx: solid Spotlight palette, no blue outline.
D:\work\techsite\lib\data.ts: coverFor, withCover, CARD_COLUMNS.
D:\work\techsite\next.config.mjs: image remotePatterns (picsum, supabase, unsplash, **.cloudinary.net, *.medium.com, etc.).
D:\work\techsite\supabase\schema.sql: 20-table consolidated schema.
D:\work\techsite\app\(main)\shopping\page.tsx, app\api\shopping\ai-recommend\route.ts: reference version.
D:\work\techsite\components\Footer.tsx: Ko-fi link restored.
D:\work\techsite\.env.local: current Supabase + admin hash (needs restart).
D:\work\tech-site\website\.env.local, .env.example: old project env reference.
D:\work\techsite\docs\design-liquid-glass.md: saved Apple guide.
D:\work\techsite\scripts\hash-password.mjs, scripts\seed-supabase.ts: auth + seeding.
Temp scripts (not repo): db-crosscheck.cjs, db-migrate-posts.cjs, db-cover-hosts.cjs.