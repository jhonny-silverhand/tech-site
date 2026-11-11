import { NICHES } from '@/lib/niches';

/** DRAFT preview — font specimens per niche. Delete once picks are final. */
const FONTS: Record<string, { family: string; href: string; note: string }> = {
  ai: { family: 'Space Grotesk', href: 'Space+Grotesk:wght@500;700', note: 'Techy, modern — AI vibe' },
  programming: { family: 'JetBrains Mono', href: '', note: 'Already in project — terminal feel' },
  android: { family: 'Sora', href: 'Sora:wght@500;700', note: 'Geometric, friendly-tech' },
  windows: { family: 'Manrope', href: 'Manrope:wght@500;700;800', note: 'Clean neo-grotesque' },
  gadgets: { family: 'Outfit', href: 'Outfit:wght@500;700', note: 'Rounded, product-y' },
  gaming: { family: 'Chakra Petch', href: 'Chakra+Petch:wght@500;600;700', note: 'Squared game-UI feel' },
  career: { family: 'Fraunces', href: '', note: 'Already in project — editorial serif' },
  finance: { family: 'Archivo', href: 'Archivo:wght@500;700;800', note: 'Strong, trustworthy grotesque' },
  productivity: { family: 'Caveat', href: 'Caveat:wght@500;700', note: 'Handwritten, cheerful notes vibe' },
  'pc-hardware': { family: 'Rajdhani', href: 'Rajdhani:wght@500;600;700', note: 'Condensed techy' },
};

export const metadata = { title: 'Font preview (draft)', robots: 'noindex' };

export default function FontPreviewPage() {
  const links = Object.values(FONTS)
    .map((f) => f.href)
    .filter(Boolean)
    .map((h) => `family=${h}`);
  const cssUrl = `https://fonts.googleapis.com/css2?${links.join('&')}&display=swap`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Draft · delete me later</p>
      <h1 className="t-page mt-1 text-3xl">Niche font specimens</h1>
      <p className="mt-2 text-sm text-muted">
        One display face per niche, Unblast-style: bold, high-personality. Reply with keep/swap per row.
      </p>
      <link rel="stylesheet" href={cssUrl} />
      <div className="mt-8 space-y-4">
        {NICHES.map((n) => {
          const f = FONTS[n.slug];
          if (!f) return null;
          return (
            <section key={n.slug} className="card p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: n.color }} aria-hidden />
                /{n.slug} · {f.family} — {f.note}
              </p>
              <p className="mt-3 text-[44px] leading-[1.05]" style={{ fontFamily: `'${f.family}', sans-serif` }}>
                {n.name}
              </p>
              <p className="mt-2 text-[17px] text-muted" style={{ fontFamily: `'${f.family}', sans-serif` }}>
                {n.tagline} — Practical answers at 120Hz with zero filler text.
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
