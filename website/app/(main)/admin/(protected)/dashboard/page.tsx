import Link from 'next/link';
import { Plus, Pencil, FileText, CheckCircle2, PenLine, Sparkles, ExternalLink, LayoutGrid } from 'lucide-react';
import { getAllPostsAdmin, countPublishedPosts } from '@/lib/data';
import { getAdminEmail } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { DeletePostButton } from '@/components/DeletePostButton';

export const metadata = { title: 'Admin Dashboard' };

function ageInDays(iso: string | null | undefined): number {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-successsoft text-success',
  draft: 'bg-warnsoft text-warn',
};

export default async function AdminDashboardPage() {
  const [posts, total, email] = await Promise.all([
    getAllPostsAdmin(),
    countPublishedPosts().catch(() => 0),
    getAdminEmail().catch(() => null),
  ]);
  const drafts = posts.filter((p) => p.status !== 'published');
  const aiCount = posts.filter((p) => p.is_ai_assisted).length;
  const monthCount = posts.filter((p) => ageInDays(p.published_at || p.created_at) <= 30).length;

  const stats = [
    { label: 'Published', value: total, icon: CheckCircle2, tint: 'text-success bg-successsoft' },
    { label: 'Drafts', value: drafts.length, icon: PenLine, tint: 'text-warn bg-warnsoft' },
    { label: 'Total posts', value: posts.length, icon: FileText, tint: 'text-accent bg-accentsoft' },
    { label: 'AI-assisted', value: aiCount, icon: Sparkles, tint: 'text-accent bg-accentsoft' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">tech//admin</p>
          <h1 className="t-page mt-1 text-3xl sm:text-4xl">Dashboard</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-muted">
            <span className="status-dot" aria-hidden /> Signed in as {email}
          </p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-4 py-2 text-sm font-medium text-ink-2 hover:border-linestrong hover:text-ink">
            <ExternalLink size={15} aria-hidden /> View site
          </Link>
          <Link href="/admin/posts/new" className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-card hover:brightness-110 active:translate-y-px">
            <Plus size={15} aria-hidden /> New post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card card-interactive flex items-center gap-3.5 p-5">
            <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${s.tint}`}>
              <s.icon size={18} aria-hidden />
            </span>
            <span>
              <span className="t-numeric block font-display text-[26px] font-semibold leading-none">{s.value}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-muted">{s.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Drafts needing attention */}
      {drafts.length > 0 && (
        <section aria-label="Drafts needing attention" className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="t-section text-[20px]">Needs attention <span className="ml-1 rounded-full bg-warnsoft px-2 py-0.5 align-middle font-mono text-[11px] text-warn">{drafts.length}</span></h2>
          </div>
          <ul className="card divide-y divide-line overflow-hidden">
            {drafts.slice(0, 5).map((p) => {
              const age = ageInDays(p.updated_at || p.created_at);
              return (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="font-mono text-[11px] text-muted">
                      draft · {p.niche} · untouched {age === 0 ? 'today' : `${age}d ago`}
                    </p>
                  </div>
                  <Link href={`/admin/posts/${p.id}/edit`} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-accentsoft px-2.5 py-1.5 text-[13px] font-medium text-accentink hover:brightness-95">
                    <Pencil size={13} aria-hidden /> Continue
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* All posts */}
      <section aria-label="All posts" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="t-section text-[20px]">All posts</h2>
          <p className="font-mono text-[11px] text-muted">{monthCount} published in the last 30 days</p>
        </div>
        <ul className="card divide-y divide-line overflow-hidden">
          {posts.slice(0, 30).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-paper-2/60">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium">{p.title}</span>
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${STATUS_STYLE[p.status] || 'bg-paper-2 text-muted'}`}>
                    {p.status}
                  </span>
                  {p.is_ai_assisted && (
                    <span className="rounded bg-accentsoft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accentink" title="AI-assisted">
                      AI
                    </span>
                  )}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">{p.niche} · {formatDate(p.published_at || p.created_at)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/admin/posts/${p.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-accentink hover:bg-accentsoft" aria-label={`Edit ${p.title}`}>
                  <Pencil size={14} aria-hidden /> <span className="hidden sm:inline">Edit</span>
                </Link>
                <DeletePostButton postId={p.id} endpoint={`/api/admin/posts/${p.id}`} redirectTo="/admin/dashboard" compact />
              </div>
            </li>
          ))}
          {posts.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">No posts yet — write your first one.</li>}
        </ul>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href="/admin/posts/new" className="card card-interactive flex items-center gap-3 p-4">
          <Plus size={17} aria-hidden className="flex-none text-accent" />
          <span><span className="block text-sm font-medium">New post</span><span className="block text-[12px] text-muted">Draft from scratch</span></span>
        </Link>
        <Link href="/admin/categories" className="card card-interactive flex items-center gap-3 p-4">
          <LayoutGrid size={17} aria-hidden className="flex-none text-accent" />
          <span><span className="block text-sm font-medium">Categories</span><span className="block text-[12px] text-muted">Manage niches</span></span>
        </Link>
        <Link href="/" target="_blank" className="card card-interactive flex items-center gap-3 p-4">
          <ExternalLink size={17} aria-hidden className="flex-none text-accent" />
          <span><span className="block text-sm font-medium">View live site</span><span className="block text-[12px] text-muted">Opens in a new tab</span></span>
        </Link>
      </section>
    </div>
  );
}
