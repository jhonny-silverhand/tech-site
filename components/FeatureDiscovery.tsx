'use client';

import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { X, ChevronRight, Keyboard, Sparkles, Bookmark, UserPlus, Search, Zap, BookOpen, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTip {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  shortcut?: string;
  trigger?: {
    route?: string;
    selector?: string;
    condition?: () => boolean;
  };
  cta?: {
    label: string;
    href?: string;
    onClick: () => void;
  };
  priority?: number;
  once?: boolean;
}

const FEATURE_TIPS: FeatureTip[] = [
  {
    id: 'cmd-k-search',
    title: 'Search everything instantly',
    description: 'Press ⌘K (Mac) or Ctrl+K (Windows/Linux) to open the command palette and jump to any article, section, product, or guide.',
    icon: <Search size={18} className="text-accent" />,
    shortcut: '⌘K / Ctrl+K',
    priority: 10,
    once: true,
  },
  {
    id: 'shopping-intelligence',
    title: 'Shopping Intelligence',
    description: 'Tell us what you need — budget, priorities, use case — and we\'ll analyze specs, prices, and reviews to recommend the best match with editorial reasoning.',
    icon: <Zap size={18} className="text-accent" />,
    trigger: { route: '/', selector: '[data-shopping-hero]' },
    cta: { label: 'Try it →', href: '/shopping', onClick: () => {} },
    priority: 9,
  },
  {
    id: 'library-save',
    title: 'Save articles to your Library',
    description: 'Click the bookmark button on any article to save it. Your saved articles, reading queue, highlights, and collections live in your Library.',
    icon: <Bookmark size={18} className="text-accent" />,
    trigger: { selector: '[data-bookmark-button]' },
    cta: { label: 'View Library', href: '/library', onClick: () => {} },
    priority: 8,
  },
  {
    id: 'reading-queue',
    title: 'Read later with Reading Queue',
    description: 'Found something interesting but no time now? Add it to your Reading Queue — a dedicated list for things you want to come back to.',
    icon: <BookOpen size={18} className="text-accent" />,
    trigger: { selector: '[data-queue-button]' },
    priority: 7,
  },
  {
    id: 'highlights-notes',
    title: 'Highlight & add private notes',
    description: 'Select text in any article to highlight it. Add your own private notes that only you can see — perfect for research or action items.',
    icon: <Sparkles size={18} className="text-accent" />,
    trigger: { selector: 'article' },
    priority: 6,
  },
  {
    id: 'follow-authors',
    title: 'Follow your favorite authors',
    description: 'Click "Follow" on any author block to get their new articles in your personalized feed and see them on your homepage.',
    icon: <UserPlus size={18} className="text-accent" />,
    trigger: { selector: '[data-author-block]' },
    cta: { label: 'Explore profiles', href: '/profile/@me', onClick: () => {} },
    priority: 5,
  },
  {
    id: 'follow-topics',
    title: 'Follow topics you care about',
    description: 'Follow niches like AI Tools, Programming, or Gaming to get personalized recommendations and see relevant content first.',
    icon: <Heart size={18} className="text-accent" />,
    trigger: { route: '/', selector: '[data-topic-tag]' },
    priority: 4,
  },
  {
    id: 'compare-products',
    title: 'Compare products side-by-side',
    description: 'Add up to 4 products to the comparison tool to see specs, prices, and trade-offs in a clean editorial table.',
    icon: <Zap size={18} className="text-accent" />,
    trigger: { route: '/compare', selector: '[data-product-card]' },
    cta: { label: 'Try comparison', href: '/compare', onClick: () => {} },
    priority: 3,
  },
];

function getMatchingTip(
  pathname: string,
  document: Document | null,
  dismissedTips: Set<string>
): FeatureTip | null {
  for (const tip of FEATURE_TIPS.sort((a, b) => (b.priority || 0) - (a.priority || 0))) {
    if (dismissedTips.has(tip.id) || (tip.once && dismissedTips.has(`${tip.id}:shown`))) {
      continue;
    }

    // Check route trigger
    if (tip.trigger?.route && !pathname.startsWith(tip.trigger.route)) {
      continue;
    }

    // Check selector trigger
    if (tip.trigger?.selector && document) {
      const element = document.querySelector(tip.trigger.selector);
      if (!element) continue;
      
      // Check if element is roughly in viewport
      const rect = element.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) continue;
    }

    // Check custom condition
    if (tip.trigger?.condition && !tip.trigger.condition()) {
      continue;
    }

    return tip;
  }
  return null;
}

interface FeatureDiscoveryProps {
  children: ReactNode;
}

export function FeatureDiscovery({ children }: FeatureDiscoveryProps) {
  const [activeTip, setActiveTip] = useState<FeatureTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load dismissed tips from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('feature-discovery-dismissed');
      if (stored) {
        setDismissedTips(new Set(JSON.parse(stored)));
      }
    } catch {}
    setMounted(true);
  }, []);

  // Check for matching tip on route change or periodically
  const checkForTip = useCallback(() => {
    if (!mounted || activeTip) return;
    
    const tip = getMatchingTip(window.location.pathname, document, dismissedTips);
    if (tip) {
      setActiveTip(tip);
      // Auto-hide after 15 seconds if not dismissed
      hideTimerRef.current = setTimeout(() => {
        dismissTip(tip.id, true);
      }, 15000);
    }
  }, [pathname, mounted, activeTip, dismissedTips]);

  // Listen for route changes (Next.js router)
  useEffect(() => {
    if (!mounted) return;
    checkForTip();
    
    const handleRouteChange = () => {
      setTimeout(checkForTip, 100);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [pathname, mounted, checkForTip]);

  // Initial check
  useEffect(() => {
    if (mounted) {
      setTimeout(checkForTip, 1000);
    }
  }, [mounted, checkForTip]);

  function dismissTip(tipId: string, auto = false) {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    
    setDismissedTips(prev => {
      const next = new Set(prev);
      next.add(tipId);
      if (auto) next.add(`${tipId}:shown`);
      try {
        localStorage.setItem('feature-discovery-dismissed', JSON.stringify([...next]));
      } catch {}
      return next;
    });
    
    setActiveTip(null);
  }

  function handleClickOutside(e: MouseEvent) {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      dismissTip(activeTip!.id);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTip]);

  if (!mounted || !activeTip) return <>{children}</>;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutDisplay = activeTip.shortcut?.replace('⌘K / Ctrl+K', isMac ? '⌘K' : 'Ctrl+K');
  const cta = activeTip.cta;

  return (
    <>
      {children}
      <div
        ref={cardRef}
        className={cn(
          'fixed bottom-4 right-4 z-50 w-full max-w-sm animate-slide-up',
          'md:bottom-6 md:right-6'
        )}
        role="dialog"
        aria-label="Feature tip"
      >
        <div className="relative rounded-folder border border-line bg-paper shadow-2xl overflow-hidden">
          <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              {activeTip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display text-[15px] text-ink">{activeTip.title}</h4>
                  {shortcutDisplay && (
                    <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      <Keyboard size={10} />
                      {shortcutDisplay}
                    </span>
                  )}
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{activeTip.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissTip(activeTip.id)}
                  className="flex-shrink-0 text-muted hover:text-ink transition-colors p-1"
                  aria-label="Dismiss tip"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {cta && (
              <div className="border-t border-line px-4 py-3 bg-ink/2">
                <a
                  href={cta.href}
                  onClick={cta.onClick ? (e: React.MouseEvent) => { e.preventDefault(); cta.onClick(); dismissTip(activeTip.id); } : undefined}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-accent hover:underline"
                >
                  {cta.label}
                  <ChevronRight size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function pathname() {
  return window.location.pathname;
}