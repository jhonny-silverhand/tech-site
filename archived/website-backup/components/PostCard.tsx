import Link from 'next/link';
import Image from 'next/image';
import { NicheTag } from './NicheTag';
import { formatDate, readingTime } from '@/lib/utils';
import type { Post } from '@/lib/types';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/articles/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-folder bg-line mb-3">
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      </Link>
      <NicheTag slug={post.niche} />
      <h3 className="mt-2 font-display text-xl leading-snug text-ink">
        <Link href={`/articles/${post.slug}`} className="hover:underline decoration-1 underline-offset-2">
          {post.title}
        </Link>
      </h3>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted line-clamp-2">{post.excerpt}</p>
      <div className="mt-2 font-mono text-[11px] text-muted/80 flex items-center gap-2">
        <span>{post.author_name}</span>
        <span>·</span>
        <span>{formatDate(post.published_at)}</span>
        <span>·</span>
        <span>{readingTime(post.content)} min read</span>
      </div>
    </article>
  );
}
