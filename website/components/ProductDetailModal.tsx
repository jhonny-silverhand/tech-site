'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { BreadcrumbSlash } from './BreadcrumbSlash';
import { WishlistButton } from './WishlistButton';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';

export const OPEN_PRODUCT_EVENT = 'techsite:open-product';

/** Open the product quick-view popup from anywhere: openProductQuickView('iphone-15') */
export function openProductQuickView(slug: string) {
  window.dispatchEvent(new CustomEvent(OPEN_PRODUCT_EVENT, { detail: { slug } }));
}

/** Link-styled trigger usable inside server components (guides, compare). */
export function ProductQuickViewLink({
  slug,
  children,
  className,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => openProductQuickView(slug)} className={className}>
      {children}
    </button>
  );
}

type ModalState =
  | { status: 'closed' }
  | { status: 'loading'; slug: string }
  | { status: 'ready'; product: Product; wished: boolean }
  | { status: 'error'; message: string };

/**
 * Site-wide product quick-view popup — same blurred-backdrop pattern as the
 * Cmd+K palette. Product cards open details here instead of navigating away;
 * the /products/[slug] page stays for direct links and SEO.
 */
export function ProductDetailModalHost() {
  const [state, setState] = useState<ModalState>({ status: 'closed' });

  const close = useCallback(() => setState({ status: 'closed' }), []);

  useEffect(() => {
    async function onOpen(e: Event) {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      if (!slug) return;
      setState({ status: 'loading', slug });
      try {
        const [prodRes, wishRes] = await Promise.all([
          fetch(`/api/products/${encodeURIComponent(slug)}`),
          fetch('/api/wishlist').catch(() => null),
        ]);
        const prodJson = await prodRes.json();
        if (!prodRes.ok) throw new Error(prodJson.error || 'Product not found');
        let wished = false;
        if (wishRes?.ok) {
          const wishJson = await wishRes.json();
          wished = ((wishJson.productIds as string[]) || []).includes(prodJson.product.id);
        }
        setState({ status: 'ready', product: prodJson.product as Product, wished });
      } catch (err) {
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong' });
      }
    }
    window.addEventListener(OPEN_PRODUCT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PRODUCT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    if (state.status !== 'closed') {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [state.status, close]);

  if (state.status === 'closed') return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[6vh] backdrop-blur-sm sm:p-6 sm:pt-[8vh]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Product details"
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-line bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-7">
          <BreadcrumbSlash
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping', href: '/shopping' },
              { label: state.status === 'ready' ? state.product.name : state.status === 'loading' ? 'Loading…' : 'Product' },
            ]}
          />
          <button
            onClick={close}
            aria-label="Close product details"
            className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          {state.status === 'loading' && (
            <div className="animate-pulse space-y-4 py-6">
              <div className="h-3 w-40 rounded bg-line" />
              <div className="h-9 w-3/4 rounded bg-line" />
              <div className="h-4 w-full rounded bg-line" />
              <div className="h-40 w-full rounded bg-line" />
            </div>
          )}

          {state.status === 'error' && (
            <p className="py-10 text-center text-sm text-red-600">{state.message}</p>
          )}

          {state.status === 'ready' && (
            <>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {[state.product.manufacturer, state.product.model].filter(Boolean).join(' · ') || 'Product'}
              </p>
              <div className="mt-1.5 flex flex-wrap items-start justify-between gap-4">
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{state.product.name}</h2>
                <WishlistButton productId={state.product.id} initialWished={state.wished} />
              </div>
              {state.product.description && (
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{state.product.description}</p>
              )}

              {state.product.specs.length > 0 && (
                <>
                  <h3 className="mt-8 font-display text-2xl font-bold">Specifications</h3>
                  <div className="mt-3 overflow-hidden rounded-folder border border-line">
                    <table className="w-full text-sm">
                      <tbody>
                        {[...state.product.specs]
                          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                          .map((s, i) => (
                            <tr key={i} className={i % 2 ? 'bg-paper' : 'bg-bg'}>
                              <td className="w-1/3 px-4 py-2.5 font-medium text-ink">{s.spec_key}</td>
                              <td className="px-4 py-2.5 text-muted">
                                {s.spec_value}
                                {s.unit ? ` ${s.unit}` : ''}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <h3 className="mt-8 font-display text-2xl font-bold">Where to buy</h3>
              <div className="mb-1 mt-3 grid gap-3 sm:grid-cols-2">
                {state.product.retailers.map((r, i) => (
                  <a
                    key={i}
                    href={r.affiliate_url || r.url}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="group rounded-folder border border-line bg-paper p-4 transition-colors hover:border-ink"
                  >
                    <p className="flex items-center justify-between font-medium text-ink">
                      {r.retailer_name}
                      <ExternalLink size={14} className="text-muted transition-colors group-hover:text-accentink" />
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {r.price_cents != null ? formatINR(r.price_cents, r.currency) : 'Check price'}
                    </p>
                    <p className="font-mono text-[11px] capitalize text-muted">{r.availability.replace(/_/g, ' ')}</p>
                  </a>
                ))}
                {state.product.retailers.length === 0 && (
                  <p className="text-sm text-muted">No retailer links yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
