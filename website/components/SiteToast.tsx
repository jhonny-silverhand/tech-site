'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const SHOW_AFTER_MS = 600;
const DISMISS_AFTER_MS = 4000;

export function SiteToast() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let leaveTimer: ReturnType<typeof setTimeout>;
    const showTimer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    hideTimer = setTimeout(() => {
      setLeaving(true);
      leaveTimer = setTimeout(() => setVisible(false), 300);
    }, SHOW_AFTER_MS + DISMISS_AFTER_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(leaveTimer);
    };
  }, []);

  if (!visible) return null;

  function dismiss() {
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed bottom-5 right-5 z-[90] max-w-[min(340px,calc(100vw-2.5rem))]',
        'flex items-start gap-2.5 rounded-xl border border-line bg-paper/95 px-4 py-3',
        'shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur',
        'transition-all duration-300 ease-out',
        leaving ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100',
      ].join(' ')}
    >
      <span className="mt-0.5 shrink-0 text-accent">
        <Sparkles size={16} />
      </span>
      <p className="text-[13px] leading-snug text-ink-2">
        Hey — fresh guides drop every week. Stick around. ✦
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="ml-1 shrink-0 text-muted transition-colors hover:text-ink"
      >
        <X size={14} />
      </button>
    </div>
  );
}
