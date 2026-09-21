import { PostCard } from './PostCard';
import type { Post } from '@/lib/types';

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-16 pt-10 border-t border-line">
      <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-6">More in this niche</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
