import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getSeedPosts } from '@/content/seed-posts';
import { Button } from '@/components/ui/Button';
import { NicheTag } from '@/components/NicheTag';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function loadAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    // Local demo mode: show the seed content read-only so there's still
    // something meaningful to look at before Supabase is connected.
    return getSeedPosts();
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
  if (error) {
    console.error('[admin dashboard] failed to load posts:', error.message);
    return [];
  }
  return (data as Post[]) ?? [];
}

export default async function AdminDashboardPage() {
  const posts = await loadAllPosts();
  const demoMode = !isSupabaseConfigured();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">All posts</h1>
        {!demoMode && (
          <Link href="/admin/posts/new">
            <Button>New post</Button>
          </Link>
        )}
      </div>

      {demoMode && (
        <div className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          Showing local seed content in read-only demo mode. Connect Supabase (Guides/01-database-setup.md) to
          create, edit, or delete posts here.
        </div>
      )}

      <div className="mt-8 divide-y divide-line border-t border-b border-line">
        {posts.map((post) => (
          <div key={post.id} className="py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <NicheTag slug={post.niche} />
                <span
                  className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {post.status}
                </span>
                {post.is_ai_assisted && (
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                    AI-assisted
                  </span>
                )}
              </div>
              <p className="mt-1 font-display text-lg text-ink truncate">{post.title}</p>
              <p className="font-mono text-[11px] text-muted">
                {post.author_name} · Updated {formatDate(post.updated_at)}
              </p>
            </div>
            {!demoMode && (
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-mono text-[12px] text-accent hover:underline"
                >
                  Edit
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
