# Changelog

All notable changes to tech/site are documented here.

## [4.0.0] - 2026-09-15

### Added
- **Shopping Intelligence** — NL search wizard with category browsing, budget filters, and multi-retailer comparison
- **PC Builder** — 7-step interactive wizard (CPU→Mobo→RAM→GPU→Storage→PSU→Case) with real-time compatibility validation
- **Compatibility Engine** — Socket, chipset, RAM type, PSU wattage, case form factor, and GPU length checks
- **Scrapers** — Amazon India + Flipkart scrapers running automatically on dev start (`npm run dev`)
- **436 real products** scraped from Flipkart across 8 categories (smartphones, laptops, headphones, tablets, monitors, keyboards, mice, smartwatches)
- **126 PC components** from iBlessi dataset (CC BY 4.0) with full specs and compatibility rules
- **Scraped Products API** — `/api/scraped-products/search` with category, price, brand, and sort filters
- **PC Builder API** — `/api/pc-builder/components`, `/api/pc-builder/compatibility`, `/api/pc-builder/suggest`
- **Product detail pages** — `/products/[slug]` with price tracking and comparison links
- **Compare page** — `/compare/[slug]` with external comparison links (GSMArena, Versus.com)
- **Wishlist** — Save products with Supabase-backed persistence
- **Version control display** — Footer shows version, commit hash (linked to GitHub), and branch
- **Auto version generation** — `scripts/gen-version.mjs` runs on `npm run build`
- **PC Building Guide for India** — Component breakdowns, 4 build configs (₹50K–₹2.5L), assembly steps, Indian vendor guide
- **`components` niche** added with pink color theme
- Navigation links for Shopping and PC Builder in header and mobile nav

### Changed
- `npm run dev` now runs scrapers automatically before starting Next.js
- `npm run build` now generates version.json before building
- Footer updated with version badge, commit hash, and branch indicator
- Flipkart scraper: broader CDN regex for images, rating/review extraction, discount calculation
- Amazon scraper: skips products without prices (bot detection resilience)
- CSV seed data removed (was 600 fake products)

### Fixed
- Flipkart scraper price range capped to ₹100–₹1,00,000 (prevents numeric overflow)
- PostgreSQL array literal syntax in PC components SQL (`'{value1,value2}'` format)
- SQL migrations: DROP POLICY/TRIGGER IF EXISTS for idempotent re-runs
- `scraped_products.price_inr` nullable for products where price extraction fails
- dotenv loading in scraper scripts from `.env.local`

### Removed
- CSV seed products (`content/seed-products-csv.ts`, 600 fake products)
- CSV parser script (`scripts/parse-csv-seed.mjs`)
- Synthetic catalog (`Guides/tech_gadgets_seed_catalog_5000.csv`)

## [3.7.1] - 2026-09-14

### Fixed
- outputFileTracingRoot set to prevent random 404s from wrong workspace root
- Various fixes from nemo

## [3.7.0] - 2026-09-14

### Added
- Vercel Speed Insights integration
- Vercel Web Analytics integration

## [3.6.0] - 2026-09-13

### Added
- Initial patches and fixes

## [3.5.0] - 2026-09-12

### Added
- Vercel Speed Insights installed

## [3.0.0] - 2026-09-11

### Added
- Major update

## [2.3.0] - 2026-09-10

### Added
- Initial migration
