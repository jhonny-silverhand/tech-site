import type { Post, PostCard as PostCardType } from '@/lib/types';
import { getRelatedPosts } from '@/lib/data';
import { PostCard } from './PostCard';

export async function RelatedPosts({ post }: { post: Post | PostCardType }) {
  const related = await getRelatedPosts(post, 3);
  if (related.length === 0) return null;
  return (
    <section aria-label="Related articles">
      <h2 className="font-display text-2xl font-semibold text-ink">Keep reading</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
