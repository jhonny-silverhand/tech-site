import type { PostCard as PostCardType } from '@/lib/types';
import { PostCard } from './PostCard';
import { cn } from '@/lib/utils';

export function BentoGrid({ posts, className }: { posts: PostCardType[]; className?: string }) {
  const items = posts.slice(0, 6);
  if (items.length === 0) return null;
  return (
    <div className={cn('grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((p, i) => (
        <div key={p.id} className={cn('min-w-0', i === 0 && 'sm:col-span-2 lg:col-span-1')}>
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}
