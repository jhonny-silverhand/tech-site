'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X, ExternalLink, Heart } from 'lucide-react';

interface ProductModalContextType {
  openProductModal: (slug: string) => void;
  closeProductModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | null>(null);

export function useProductModal() {
  const ctx = useContext(ProductModalContext);
  if (!ctx) throw new Error('useProductModal must be used within ProductModalProvider');
  return ctx;
}

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const router = useRouter();

  const openProductModal = useCallback((s: string) => {
    setSlug(s);
    document.body.style.overflow = 'hidden';
    router.push(`?product=${s}`, { scroll: false });
  }, [router]);

  const closeProductModal = useCallback(() => {
    setSlug(null);
    document.body.style.overflow = '';
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };
    if (slug) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [slug, closeProductModal]);

  return (
    <ProductModalContext.Provider value={{ openProductModal, closeProductModal }}>
      {children}
      {slug && <ProductDetailModal slug={slug} onClose={closeProductModal} />}
    </ProductModalContext.Provider>
  );
}

interface ProductData {
  name: string;
  description: string | null;
  manufacturer: string | null;
  model: string | null;
  image_url: string | null;
  specs: Array<{
    spec_key: string;
    spec_value: string;
    unit: string | null;
  }>;
}

interface RetailerData {
  name: string;
  price: number;
  currency: string;
  availability: string;
  url: string;
}

interface ProductApiResponse {
  product: ProductData;
  retailers: RetailerData[];
  specs: ProductData['specs'];
}

function ProductDetailModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [data, setData] = useState<ProductApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-[8vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[84vh] overflow-y-auto rounded-folder border border-line bg-paper shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-folder p-2 text-muted hover:text-ink hover:bg-bg transition-colors"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-4 w-32 bg-line rounded animate-pulse" />
            <div className="h-8 w-64 bg-line rounded animate-pulse" />
            <div className="h-4 w-48 bg-line rounded animate-pulse" />
            <div className="h-48 w-full bg-line rounded animate-pulse mt-6" />
          </div>
        ) : !data ? (
          <div className="p-8 text-center text-muted">Product not found</div>
        ) : (
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted mb-4">
              <span className="hover:text-ink cursor-pointer">Home</span>
              <span>/</span>
              <span className="hover:text-ink cursor-pointer">Shopping</span>
              <span>/</span>
              <span className="text-ink">{data.product.name}</span>
            </div>

            {/* Header */}
            <div className="mb-6">
              {data.product.manufacturer && (
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
                  {data.product.manufacturer}
                </p>
              )}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl font-semibold text-ink leading-tight">
                  {data.product.name}
                </h1>
                <button className="flex-shrink-0 rounded-folder border border-line p-2 text-muted hover:text-warn hover:border-warn transition-colors">
                  <Heart size={18} />
                </button>
              </div>
              {data.product.description && (
                <p className="mt-2 text-muted text-[15px] leading-relaxed">
                  {data.product.description}
                </p>
              )}
            </div>

            {/* Specifications */}
            {data.specs && data.specs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-widest font-mono text-muted mb-3">
                  Specifications
                </h2>
                <div className="rounded-folder border border-line overflow-hidden">
                  {data.specs.map((spec, i) => (
                    <div
                      key={spec.spec_key}
                      className={`flex border-b border-line last:border-b-0 ${i % 2 === 0 ? 'bg-bg' : 'bg-paper'}`}
                    >
                      <span className="w-1/3 px-4 py-2.5 font-mono text-sm text-muted">
                        {spec.spec_key}
                      </span>
                      <span className="flex-1 px-4 py-2.5 text-sm text-ink">
                        {spec.spec_value}{spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Where to buy */}
            {data.retailers && data.retailers.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest font-mono text-muted mb-3">
                  Where to buy
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.retailers.map((retailer) => (
                    <a
                      key={retailer.name}
                      href={retailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-folder border border-line bg-paper p-4 hover:border-ink transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-lg font-semibold text-ink">
                            {retailer.name}
                          </p>
                          <p className="font-display text-xl text-ink mt-1">
                            {retailer.currency} {retailer.price.toLocaleString()}
                          </p>
                          <p className="font-mono text-xs text-muted mt-1">
                            {retailer.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>
                        <ExternalLink size={14} className="text-muted group-hover:text-ink transition-colors mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
