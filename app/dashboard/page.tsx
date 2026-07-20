import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from '@/components/ui/Button';
import { NicheTag } from '@/components/NicheTag';
import { DeletePostButton } from '@/components/DeletePostButton';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-4 rounded-folder border border-line bg-paper p-4 text-[13.5px] text-muted leading-relaxed">
          User accounts need a connected Supabase project. Follow Guides/01-database-setup.md, then this page
          will work.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  const myPosts = (posts as Post[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Your posts</h1>
        <Link href="/write">
          <Button>New post</Button>
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <p className="mt-10 font-mono text-[13px] text-muted">You haven&apos;t written anything yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-line border-t border-b border-line">
          {myPosts.map((post) => (
            <div key={post.id} className="py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <NicheTag slug={post.niche} />
                  <span
                    className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 font-display text-lg text-ink truncate">{post.title || '(untitled)'}</p>
                <p className="font-mono text-[11px] text-muted">Updated {formatDate(post.updated_at)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/write/${post.id}`} className="font-mono text-[12px] text-accent hover:underline">
                  Edit
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
