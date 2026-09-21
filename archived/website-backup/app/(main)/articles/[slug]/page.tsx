import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts } from '@/lib/data';
import { getNiche } from '@/lib/niches';
import { formatDate, readingTime } from '@/lib/utils';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import { ReadingProgressBar, ReadingProgressStat, ReadingProgressProvider } from '@/components/ReadingProgress';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { BookmarkButton } from '@/components/BookmarkButton';
import { CollectionPicker } from '@/components/CollectionPicker';
import { ReadingQueueButton } from '@/components/ReadingQueueButton';
import { AuthorBlock } from '@/components/AuthorBlock';
import { Comments } from '@/components/Comments';
import { Highlights } from '@/components/Highlights';
import { PrivateNotes } from '@/components/PrivateNotes';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { isBookmarked, recordView, isInQueue, getCommentsForPost, getPostHighlights, getPostPrivateNote } from '@/lib/library';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not found' };
  const niche = getNiche(post.niche);
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name],
      section: niche?.label ?? post.niche,
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

/** Lightweight Suspense fallback for below-fold sections */
function SectionSkeleton() {
  return <div className="animate-pulse bg-line rounded-folder h-32 mt-10" aria-hidden="true" />;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const niche = getNiche(post.niche);
  const ambientColor = niche?.color ?? '#4F7DFF';

  const libraryEnabled = isSupabaseConfigured();

  // Parallelize all independent Supabase queries after we have the post
  // Comments are public data — include in Tier 2, no need to wait for auth
  const [related, bookmarked, inQueue, authResult, comments] = await Promise.all([
    getRelatedPosts(post),
    libraryEnabled ? isBookmarked(post.id) : false,
    libraryEnabled ? isInQueue(post.id) : false,
    libraryEnabled
      ? createClient().then(s => s.auth.getUser()).then(r => r.data.user)
      : Promise.resolve(null),
    libraryEnabled ? getCommentsForPost(post.id) : Promise.resolve([]),
  ]);

  const userId = authResult?.id ?? null;

  // Fetch user-specific data (highlights, notes) — needs userId
  const [highlights, privateNote] = libraryEnabled && userId
    ? await Promise.all([
        getPostHighlights(post.id, userId),
        getPostPrivateNote(post.id, userId),
      ])
    : [[], null];

  // Fire-and-forget: record the view without blocking the page render
  if (libraryEnabled && !post.id.startsWith('seed-')) {
    recordView(post.id).catch(() => {});
  }

  // Per design-research/3.0: Gaming gets a larger, "cinematic" hero
  // treatment (full-bleed image, title overlaid) — the one niche where
  // the research specifically justified scale as the differentiator.
  // Everything else keeps the shared template unchanged.
  const isCinematic = post.niche === 'gaming';

  const metaLine = (
    <div
      className={`mt-4 flex flex-wrap items-center gap-3 font-mono text-[12px] ${
        isCinematic ? 'text-white/75' : 'text-muted'
      }`}
    >
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
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    author: { '@type': 'Person', name: post.author_name },
    datePublished: post.published_at,
    image: post.cover_image_url,
    publisher: {
      '@type': 'Organization',
      name: 'tech//site',
      url: 'https://tech-site.example',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tech-site.example/articles/${post.slug}`,
    },
  };

  return (
    <ReadingProgressProvider targetId="article-body">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
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

      {isCinematic ? (
        <div className="relative left-1/2 w-screen -translate-x-1/2 mt-8">
          <div className="relative h-[62vh] min-h-[420px] max-h-[680px] overflow-hidden bg-line">
            {post.cover_image_url && (
              <Image src={post.cover_image_url} alt="" fill className="object-cover" priority sizes="100vw" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-10">
                <div
                  className="h-[3px] w-10 rounded-full"
                  style={{ backgroundColor: ambientColor }}
                  aria-hidden="true"
                />
                <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[1.05] text-white">{post.title}</h1>
                {metaLine}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 h-[3px] w-10 rounded-full" style={{ backgroundColor: ambientColor }} aria-hidden="true" />
          <h1 className="mt-3 font-display text-3xl sm:text-4xl leading-tight text-ink">{post.title}</h1>
          {metaLine}
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
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <BookmarkButton postId={post.id} initialBookmarked={bookmarked} enabled={libraryEnabled} />
        <CollectionPicker postId={post.id} enabled={libraryEnabled} />
        <ReadingQueueButton postId={post.id} initialInQueue={inQueue} enabled={libraryEnabled} />
      </div>

      <div id="article-body" className="mt-10">
        <TableOfContents content={post.content} />
        <MarkdownContent
          content={post.content}
          accentColor={ambientColor}
          highlightFigures={post.niche === 'finance'}
          citationStyle={post.niche === 'ai-tools'}
        />
      </div>

      {/* Medium-style discussion cards (author, comments, highlights, notes) */}
      <div className="mt-6 flex flex-col gap-6">
      {/* Below-fold sections stream via Suspense — article body renders first */}
      <Suspense fallback={<SectionSkeleton />}>
        <AuthorBlock authorId={post.author_id} authorName={post.author_name} currentUserId={userId} />
      </Suspense>

      {libraryEnabled && (
        <>
          <Suspense fallback={<SectionSkeleton />}>
            <Comments postId={post.id} initialComments={comments} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <Highlights postId={post.id} initialHighlights={highlights} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <PrivateNotes postId={post.id} initialNote={privateNote} />
          </Suspense>
        </>
      )}

      <Suspense fallback={<SectionSkeleton />}>
        <RelatedPosts posts={related} />
      </Suspense>
      </div>
    </article>
    </ReadingProgressProvider>
  );
}
