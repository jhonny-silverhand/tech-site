import Link from 'next/link';
import Image from 'next/image';
import type { PostCard } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { NicheTag } from './NicheTag';
import { Badge } from './ui/Badge';

export function PostCard({ post }: { post: PostCard }) {
  const href = `/articles/${post.slug}`;
  return (
    <article className="card card-interactive group relative flex h-full flex-col overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)]">
      {post.cover_image_url && (
        <div className="relative aspect-[16/9] w-full flex-none overflow-hidden border-b border-line bg-sunken">
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="relative z-10 flex w-fit flex-wrap items-center gap-1.5">
          <NicheTag slug={post.niche} color={post.niche_color} />
          {post.is_ai_assisted && (
            <Badge tone="neutral" className="normal-case tracking-normal">
              AI-assisted
            </Badge>
          )}
        </div>
        <h3 className="t-section text-[17px] leading-snug text-ink group-hover:text-accentink">
          <Link
            href={href}
            className="clamp-2 rounded-sm after:absolute after:inset-0 after:rounded-[12px] focus-visible:outline-none"
            aria-label={post.title}
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
        <p className="t-numeric mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-3 font-mono text-[11px] text-muted">
          <span className="max-w-[140px] truncate font-medium text-ink2">{post.author_name}</span>
          <span aria-hidden className="text-faint">
            ·
          </span>
          <span>{formatDate(post.published_at)}</span>
          <span aria-hidden className="text-faint">
            ·
          </span>
          <span>{post.reading_time} min</span>
        </p>
      </div>
    </article>
  );
}
