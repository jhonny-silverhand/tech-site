import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { getAllPostsAdmin, countPublishedPosts } from '@/lib/data';
import { getAdminEmail } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const [posts, total, email] = await Promise.all([
    getAllPostsAdmin(),
    countPublishedPosts().catch(() => 0),
    getAdminEmail().catch(() => null),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 font-mono text-xs text-muted">Signed in as {email}</p>
        </div>
        <Link href="/admin/posts/new" className="inline-flex items-center gap-1.5 rounded-folder bg-accent px-4 py-2 text-sm font-medium text-white">
          <Plus size={15} /> New post
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-folder border border-line bg-paper p-5"><p className="font-display text-3xl font-semibold">{total}</p><p className="font-mono text-xs uppercase text-muted">Published</p></div>
        <div className="rounded-folder border border-line bg-paper p-5"><p className="font-display text-3xl font-semibold">{posts.length}</p><p className="font-mono text-xs uppercase text-muted">Total posts</p></div>
        <div className="rounded-folder border border-line bg-paper p-5"><p className="font-display text-3xl font-semibold">{posts.filter((p) => p.status === 'draft').length}</p><p className="font-mono text-xs uppercase text-muted">Drafts</p></div>
      </div>

      <h2 className="mt-8 font-display text-xl font-semibold">Recent posts</h2>
      <ul className="mt-3 divide-y divide-line rounded-folder border border-line bg-paper">
        {posts.slice(0, 30).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{p.title}</p>
              <p className="font-mono text-[11px] text-muted">{p.status} · {p.niche} · {formatDate(p.published_at || p.created_at)}</p>
            </div>
            <Link href={`/admin/posts/${p.id}/edit`} className="inline-flex shrink-0 items-center gap-1 text-sm text-accent hover:underline">
              <Pencil size={14} /> Edit
            </Link>
          </li>
        ))}
        {posts.length === 0 && <li className="px-4 py-6 text-sm text-muted">No posts yet.</li>}
      </ul>
    </div>
  );
}
