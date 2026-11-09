import Link from 'next/link';
import { Sparkles, ArrowRight } from '@/components/icons';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function ShoppingIntelligenceHero({ products }: { products: Product[] }) {
  return (
    <section
      aria-label="Shopping intelligence"
      className="relative overflow-hidden border border-white/10 bg-void text-white"
    >
  {/* instrument strip */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent"
  />
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.35fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300">
            <Sparkles size={12} className="text-accent" aria-hidden />
            ai shopping intelligence
          </p>
          <h2 className="t-page mt-3 text-[26px] uppercase leading-[1.04] sm:text-[30px]">
            Tell us what you need.
            <br />
            <span className="text-accent">The AI ranks what to buy.</span>
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-zinc-400">
            Real specs, real Indian prices, honest pros and cons — powered by the Gemini chain and
            our product database.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/shopping"
              className="flood inline-flex h-10 items-center gap-2 border border-accent bg-accent px-4 text-sm font-medium text-white transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Run a query <ArrowRight size={15} className="icon-nudge" aria-hidden />
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-10 items-center border border-white/15 px-4 text-sm text-zinc-200 transition-colors hover:border-white/40 hover:text-white"
            >
              Compare products
            </Link>
          </div>
          <p className="t-numeric mt-4 font-mono text-[11px] text-zinc-600">
            updated for 2026 · prices in ₹ inr · ai-estimated, verify at retailer
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Shop by category">
            {[
              { href: '/shopping?q=laptops', label: 'laptops' },
              { href: '/shopping?q=smartphones', label: 'phones' },
              { href: '/shopping?q=headphones', label: 'audio' },
              { href: '/guides', label: 'buying guides' },
            ].map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-[32px] items-center border border-white/15 px-3 font-mono text-[11px] text-zinc-300 transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
                >
                  /{c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {products.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="[&_.bg-paper-2]:!bg-white/5 [&_.card]:!border-white/10 [&_.card]:!bg-white/[0.03] [&_.card]:!shadow-none [&_.t-section]:!text-white [&_.t-numeric]:!text-white [&_.text-accentink]:!text-accent [&_.text-faint]:!text-zinc-500 [&_.text-ink]:!text-zinc-100 [&_.text-muted]:!text-zinc-400 hover:[&_.card]:!border-white/25"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
