# DESIGN.md — tech//site design system v3 "Silkscreen"

**Created:** 2026-11-09 · **Method:** awwwards-skill workflow (github.com/juliobsz/skills `/awwwards`),
applied to an existing production app · **Scope:** site-wide tokens + icons, deep redesign of `/shopping`.

Read together with `app/globals.css` (token source of truth) and `components/icons/` (icon system).

## Concept Card

```
Idea:        tech//site is a precision instrument panel — every screen is a test bench
             you operate, not a page you scroll.
Metaphor:    PCB / electronic test instrument. Ground = board substrate, ink = silkscreen
             print, accent = signal trace, icons = silkscreen component glyphs, mono type
             = machine readouts, tabular numbers = calibrated scales.
Signature:   /shopping console — query goes in, a scanline sweeps the input, a mono
             readout narrates the AI chain (PARSING → SPECS → PRICES → RANKING), and
             ranked picks snap-settle into a numbered ledger.
Emotion:     competent, fast, no-nonsense — "this machine knows what it is doing".
Frame:       the four-corner status strip above the shopping hero.
Anchor:      the site's own identity — a tech publication whose product is verifiable
             information; an instrument panel is what trust looks like in hardware.
Motion verb: snap and settle — quick expo-out translations, hard stops, nothing floats.
```

## Why this concept (of the three candidates)

1. **Diag-bench / instrument panel** — chosen. Fits the tech-publication identity and the
   Streamline sharp-flat icon language (those icons literally are silkscreen labels);
   gives the shopping flow a signature; the motion verb extends to hovers site-wide.
2. Index desk (editorial ledger, Obys-style list) — rejected: discards the site's tech
   character in favor of a fashion-portfolio voice.
3. Checkout receipt (thermal paper, barcode motifs) — rejected: charming but novelty-first;
   weak fit for a publication that also runs articles, library, and admin.

## System

### Icon language (the seed of the redesign)

Owner directive: switch to Streamline **sharp flat** (streamlinehq.com/icons/sharp-flat-style).
The official set is paid (subscription + secret token via `@streamlinehq/streamlinehq` npm),
so the system is **hand-drawn in that exact visual language** instead:

- 24×24 grid, **fills only** (no strokes), mitered sharp corners, geometric.
- **Two-tone**: primary = `currentColor`, secondary = `.sf-tone2`
  (`color-mix(in srgb, currentColor 34%, transparent)`) — every icon adapts to its text color.
- 69 glyphs in `components/icons/` (base + arrows + system + content + shopping), lucide-react
  name-compatible API (`size`, `className`) — call sites migrated by import-path swap only.
- QA'd visually at 24–64 px, light + dark (six glyphs iterated after review:
  TrendingDown, Keyboard, Headphones, Highlighter, PenLine, Pencil).

### Palette (roles)

| Role | Light | Dark |
|---|---|---|
| ground `--bg` | `#EDEDEB` cool datasheet paper | `#0A0B0F` blue-charcoal |
| ink `--ink` | `#101014` | `#F1F2F6` |
| accent (signal) | `#D9481F` | `#FF6B3D` |
| accent-ink (text-safe) | `#BE3A0E` (4.7:1 on ground) | `#FF8A5E` (8.5:1) |

One signal accent, used rarely and meaningfully (was: blue `#3d63f2` everywhere).
Success/danger/warn unchanged. Niche colors unchanged (they are content, not chrome).
Both themes designed (theme toggle + neko celebration retained).

### Typography — one family, two cuts

- **Archivo Variable** (`@fontsource-variable/archivo/wdth.css`, self-hosted, width axis
  62–125%): display = `font-stretch: 125%` weight 800 ("Archivo Expanded"), text = normal
  width. The awwwards-skill pairing "Archivo expanded 800 + Archivo 400: one family, two
  personalities."
- **JetBrains Mono** stays for data/meta/code (already the site's voice).
- **Removed:** Fraunces, Cormorant Garamond, Inter (Inter/Fraunces are the exact
  "reflexive generator" choices the skill warns about). Serif voices gone — all-grotesk system.
- **Pixels** pixel font stays for the wordmark (brand asset, the "one unexpected element").

### Geometry & surfaces

- **Radius 0 everywhere** — the Tailwind radius scale is overridden to 0 px (only
  `rounded-full` survives for true circles: status dots, orbit rings, spinner, avatars-as-
  dots). Cards, chips, inputs, buttons, modals: sharp.
- Hairline borders over shadows (kept from v2); chips read as PCB silkscreen labels.
- Avatars and pill chips converted to square (16 files) — deliberate, on-concept.

### Motion (verb: snap and settle)

- `.snap-in` — staggered settle entrance for ledger rows (0.32 s, custom snap ease).
- `.scanline` — the AI-work sweep bar (shopping signature + reusable).
- `.flood` — buttons fill from the left edge on hover (with `prefers-reduced-motion` respect).
- `.icon-nudge` — arrows travel 4 px along their direction on parent hover.
- `.roll` / `.draw` — letter-roll nav hovers and drawn underlines (available system-wide).
- All hover states also on `:focus-visible`; reduced-motion keeps color/underline states.

### /shopping (flagship application)

Console hero (four-corner status strip, poster statement "DESCRIBE IT. / WE RANK IT.",
`>`-prompt query input with scanline) → preset chips with device glyphs → loading state
with cycling stage readout + elapsed counter → **ranked ledger results** (big tabular rank
numerals, top-pick signal bar, feature chips, flood buy buttons) → pipeline strip
(01 PARSE / 02 ANALYZE / 03 RANK) → query tips → dark footer strip linking Compare and
PC Builder. Deep-link `?q=` support retained. Runs entirely on site tokens (previously
hardcoded cream/teal palette — removed).

### Deliberately kept (not AI-tells, but brand)

- The `tech//site` pixel wordmark with blinking `//`.
- Circular status dots, circular orbit diagram (geometry, not corner radius).
- Warm-neutral paper ground rather than pure white (print-datasheet reference).
