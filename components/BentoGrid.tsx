import Link from 'next/link';
import Image from 'next/image';
import { getNiche } from '@/lib/niches';
import type { Post } from '@/lib/types';

// Repeats every 6 tiles; [grid-auto-flow:dense] on the container packs
// around whatever's actually in the list, so this doesn't need to line up
// perfectly with the post count.
const SPAN_PATTERN = [
  'col-span-2 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-2 row-span-2',
];

/**
 * "Featured" here means most recent — there's no curation flag on Post
 * yet. Good enough for now; if that distinction matters later, add an
 * `is_featured` column and swap what the homepage passes in rather than
 * changing this component.
 */
export function BentoGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[130px] sm:auto-rows-[150px] gap-3 [grid-auto-flow:dense]">
      {posts.map((post, i) => {
        const span = SPAN_PATTERN[i % SPAN_PATTERN.length];
        const isLarge = span.includes('row-span-2');
        const niche = getNiche(post.niche);
        return (
          <Link key={post.id} href={`/articles/${post.slug}`} className={`group relative overflow-hidden rounded-folder ${span}`}>
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide text-white/80"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: niche?.color }} />
                {niche?.label}
              </span>
              <p
                className={`mt-1 font-display leading-snug text-white ${
                  isLarge ? 'text-lg sm:text-xl' : 'text-[13px] sm:text-sm line-clamp-2'
                }`}
              >
                {post.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
