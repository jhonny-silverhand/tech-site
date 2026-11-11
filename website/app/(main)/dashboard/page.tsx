import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, History, PenLine, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PostCard } from '@/components/PostCard';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { CARD_COLUMNS, withCover } from '@/lib/data';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Dashboard</p>
        <h1 className="t-page mt-1 text-3xl">Connect Supabase to unlock your dashboard</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Dashboard needs Supabase configured. Add your keys to .env.local, then sign in.
        </p>
        <Link href="/login" className="mt-4 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:brightness-110">
          Go to login
        </Link>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/login');

  const uid = auth.user.id;
  const [bm, hist, mine, profile] = await Promise.all([
    supabase.from('bookmarks').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    supabase.from('reading_history').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    supabase.from('posts').select(CARD_COLUMNS).eq('author_id', uid).order('created_at', { ascending: false }).limit(6),
    supabase.from('profiles').select('username, display_name').eq('id', uid).maybeSingle(),
  ]);

  const prof = (profile.data || {}) as { username?: string; display_name?: string | null };

  const stats = [
    { label: 'Bookmarks', value: bm.count || 0, href: '/library', icon: <Bookmark size={15} aria-hidden /> },
    { label: 'Articles read', value: hist.count || 0, href: '/library?tab=history', icon: <History size={15} aria-hidden /> },
    { label: 'Your articles', value: (mine.data || []).length, href: '/write', icon: <PenLine size={15} aria-hidden /> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="t-page mt-1 text-[30px] sm:text-4xl">
            Hi{prof.display_name ? `, ${prof.display_name}` : ''}
          </h1>
          <p className="t-numeric mt-1 font-mono text-[12px] text-muted">
            {stats.reduce((a, s) => a + s.value, 0)} items tracked
          </p>
        </div>
        <Link href="/write">
          <Button variant="dark">
            <Plus size={15} aria-hidden /> New article
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-interactive group p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span className="text-faint">{s.icon}</span> {s.label}
            </p>
            <p className="t-numeric t-display mt-2 text-[34px] text-ink">{s.value}</p>
            <p className="mt-1 text-[13px] font-medium text-accentink opacity-0 transition-opacity group-hover:opacity-100">
              View →
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-5 mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your work</p>
          <h2 className="t-section mt-1 text-[22px]">Your articles</h2>
        </div>
        <Link href="/write" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium text-accentink hover:bg-accentsoft">
          <Plus size={14} aria-hidden /> New
        </Link>
      </div>
      {(mine.data || []).length === 0 ? (
        <EmptyState
          icon={<PenLine size={26} aria-hidden />}
          title="You haven't published anything yet"
          description="Share what you know — guides, breakdowns, lessons from real builds."
          action={
            <Link href="/write">
              <Button>Write your first article</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(mine.data as any[]).map(withCover).map((p) => (
            <div key={p.id} className="flex flex-col gap-1.5">
              <PostCard post={p} />
              <Link href={`/write/${p.id}`} className="w-fit rounded-sm px-1 text-[13px] font-medium text-accentink hover:bg-accentsoft hover:underline hover:underline-offset-4">
                Edit →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
