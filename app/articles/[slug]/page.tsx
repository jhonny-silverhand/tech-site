import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts } from '@/lib/data';
import { getNiche } from '@/lib/niches';
import { formatDate, readingTime } from '@/lib/utils';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import { ReadingProgressBar, ReadingProgressStat } from '@/components/ReadingProgress';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const niche = getNiche(post.niche);
  const ambientColor = niche?.color ?? '#4F7DFF';
  const related = await getRelatedPosts(post);

  return (
    <article className="relative mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <ReadingProgressBar color={ambientColor} />

      {/* Ambient wash: a quiet tint of the niche's color behind the page,
          instead of extracting a color from the cover photo — reuses the
          curated niche palette rather than whatever a photo happens to
          average out to, and costs nothing at render time. */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 800px 500px at 50% 0%, ${ambientColor}14, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:text-ink transition-colors">
          tech<span className="text-accent">//</span>site
        </Link>
        <BreadcrumbSlash />
        <Link
          href={`/niche/${post.niche}`}
          style={{ color: niche?.color }}
          className="hover:opacity-70 transition-opacity"
        >
          {post.niche}
        </Link>
        <BreadcrumbSlash />
        <span className="text-ink/60">{post.slug}</span>
      </p>

      <div className="mt-3 h-[3px] w-10 rounded-full" style={{ backgroundColor: ambientColor }} aria-hidden="true" />
      <h1 className="mt-3 font-display text-3xl sm:text-4xl leading-tight text-ink">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[12px] text-muted">
        <span>{post.author_name}</span>
        <span>·</span>
        <span>{formatDate(post.published_at)}</span>
        <span>·</span>
        <span>{readingTime(post.content)} min read</span>
        <span>·</span>
        <ReadingProgressStat />
        {post.is_ai_assisted && (
          <>
            <span>·</span>
            <span className="text-accent">AI-assisted draft, edited by {post.author_name}</span>
          </>
        )}
      </div>

      {post.cover_image_url && (
        <div className="relative aspect-[16/9] mt-8 rounded-folder overflow-hidden bg-line">
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      )}

      <div id="article-body" className="mt-10">
        <TableOfContents content={post.content} />
        <MarkdownContent content={post.content} accentColor={ambientColor} />
      </div>

      <RelatedPosts posts={related} />
    </article>
  );
}

