import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function ShoppingIntelligenceHero({ products }: { products: Product[] }) {
  return (
    <section
      aria-label="Shopping intelligence"
      className="relative overflow-hidden rounded-xl border border-white/10 bg-void text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.35fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-300">
            <Sparkles size={12} className="text-accent" aria-hidden />
            AI Shopping Intelligence
          </p>
          <h2 className="t-page mt-3 text-[28px] sm:text-[32px]">
            Tell us what you need. AI picks the right product.
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-zinc-400">
            Real specs, real Indian prices, honest pros and cons — powered by Gemini and our product database.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/shopping"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white shadow-card hover:brightness-110 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get AI recommendations <ArrowRight size={15} aria-hidden />
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-sm text-zinc-200 hover:border-white/40 hover:text-white"
            >
              Compare products
            </Link>
          </div>
          <p className="t-numeric mt-4 font-mono text-[11px] text-zinc-600">
            Updated for 2026 · Prices in ₹ INR · AI-estimated, verify at retailer
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Shop by category">
            {[
              { href: '/shopping?q=laptops', label: 'Laptops' },
              { href: '/shopping?q=smartphones', label: 'Phones' },
              { href: '/shopping?q=headphones', label: 'Audio' },
              { href: '/guides', label: 'Buying guides' },
            ].map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-[32px] items-center rounded-full border border-white/15 px-3 text-xs text-zinc-300 hover:border-white/40 hover:text-white"
                >
                  {c.label}
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
