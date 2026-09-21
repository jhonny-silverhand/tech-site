import Link from 'next/link';
import { Bookmark, Library, Highlighter, Sparkles } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

const PERKS = [
  { icon: <Bookmark size={15} aria-hidden />, text: 'Bookmark articles and build collections' },
  { icon: <Library size={15} aria-hidden />, text: 'Continue where you left off, on any device' },
  { icon: <Highlighter size={15} aria-hidden />, text: 'Highlight text and keep private notes' },
  { icon: <Sparkles size={15} aria-hidden />, text: 'AI shopping picks tuned to your interests' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="flex items-center justify-center bg-bg px-4 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          <Link href="/" aria-label="tech//site home" className="inline-block rounded-sm">
            <BrandMark className="text-[22px]" />
          </Link>
          <div className="mt-8">{children}</div>
          <p className="mt-8 font-mono text-[11px] leading-relaxed text-faint">
            Protected by Supabase Auth · Your data stays yours
          </p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-void p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        />
        <p className="eyebrow !text-zinc-500">Why join?</p>
        <p className="t-display mt-3 max-w-md text-[40px]">Your library, your topics, your pace.</p>
        <ul className="mt-8 space-y-1 text-[15px]">
          {PERKS.map((p, i) => (
            <li key={i} className="flex items-center gap-3 rounded-md px-2 py-2.5 text-zinc-300">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-accent">
                {p.icon}
              </span>
              {p.text}
            </li>
          ))}
        </ul>
        <p className="t-numeric mt-10 font-mono text-[11px] text-zinc-600">Free forever · No spam · Unsubscribe anytime</p>
      </div>
    </div>
  );
}
