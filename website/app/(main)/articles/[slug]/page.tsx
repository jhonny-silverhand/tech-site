import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPostBySlugDirect as getPost, getRelatedPosts } from '@/lib/data';
import { recordViewIfAuthed } from '@/lib/data-extras';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getNiche } from '@/lib/niches';
import { formatDate } from '@/lib/utils';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { NicheTag } from '@/components/NicheTag';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import { AuthorBlock } from '@/components/AuthorBlock';
import { Comments } from '@/components/Comments';
import { Highlights } from '@/components/Highlights';
import { PrivateNotes } from '@/components/PrivateNotes';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ReadingQueueButton } from '@/components/ReadingQueueButton';
import { CollectionPicker } from '@/components/CollectionPicker';
import { TopicFollowButton } from '@/components/TopicFollowButton';
import {
  ReadingProgressProvider,
  ReadingProgressBar,
  ReadingProgressStat,
} from '@/components/ReadingProgress';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found' };
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-site.example';
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
      section: post.niche,
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

function SectionSkeleton() {
  return <div className="h-40 animate-pulse rounded-folder border border-line bg-paper" />;
}

async function getArticleContext(postId: string, authorId: string | null, niche: string) {
  let bookmarked = false;
  let inQueue = false;
  let topicFollowing = false;
  let userId: string | null = null;
  let commentCount: number | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: auth } = await supabase.auth.getUser();
      userId = auth.user?.id || null;
      // Public comments count doesn't wait on auth conceptually — but one round trip is fine in parallel:
      const tasks: Promise<unknown>[] = [
        Promise.resolve(
          supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', postId)
        ).then(({ count }) => {
          commentCount = count;
        }),
      ];
      if (userId) {
        const uid = userId;
        tasks.push(
          Promise.resolve(
            supabase.from('bookmarks').select('id').eq('user_id', uid).eq('post_id', postId).maybeSingle()
          ).then(({ data }) => {
            bookmarked = Boolean(data);
          }),
          Promise.resolve(
            supabase.from('reading_queue').select('id').eq('user_id', uid).eq('post_id', postId).maybeSingle()
          ).then(({ data }) => {
            inQueue = Boolean(data);
          }),
          Promise.resolve(
            supabase.from('topic_follows').select('id').eq('user_id', uid).eq('niche_slug', niche).maybeSingle()
          ).then(({ data }) => {
            topicFollowing = Boolean(data);
          })
        );
      }
      await Promise.all(tasks);
    } catch {
      // public fallbacks
    }
  }
  void authorId;
  return { bookmarked, inQueue, topicFollowing, userId, commentCount };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const niche = getNiche(post.niche);
  const ambientColor = post.niche_color || niche.color;

  const ctx = await getArticleContext(post.id, post.author_id, post.niche);
  // Fire-and-forget view tracking (never blocks render).
  recordViewIfAuthed(post.id).catch(() => {});
  const related = await getRelatedPosts(post, 3).catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author_name },
    datePublished: post.published_at,
    image: post.cover_image_url || undefined,
    publisher: { '@type': 'Organization', name: 'tech//site' },
  };

  return (
    <ReadingProgressProvider targetId="article-body">
      <ReadingProgressBar color={ambientColor} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: niche.name, href: `/niche/${niche.slug}` }, { label: post.title }]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_260px]">
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <NicheTag slug={post.niche} color={ambientColor} />
              {post.is_ai_assisted && (
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">AI-assisted</span>
              )}
            </div>
            <h1 className="t-display mt-3 text-[32px] sm:text-[44px]">
              {post.title}
            </h1>
            {post.excerpt && <p className="t-dek mt-3 max-w-2xl text-[21px] text-muted">{post.excerpt}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-y border-line py-3 font-mono text-[12px] text-muted">
              <span className="font-semibold text-ink">{post.author_name}</span>
              <span aria-hidden className="text-faint">·</span>
              <span className="t-numeric">{formatDate(post.published_at)}</span>
              <span aria-hidden className="text-faint">·</span>
              <span className="t-numeric">{post.reading_time} min read</span>
              <span aria-hidden className="text-faint">·</span>
              <ReadingProgressStat />
              {ctx.commentCount != null && (
                <><span aria-hidden className="text-faint">·</span><span className="t-numeric">{ctx.commentCount} comments</span></>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <BookmarkButton postId={post.id} initialBookmarked={ctx.bookmarked} />
              <ReadingQueueButton postId={post.id} initialInQueue={ctx.inQueue} />
              <CollectionPicker postId={post.id} />
            </div>

            {post.cover_image_url && (
              <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-folder bg-bg">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-8">
              <MarkdownContent source={post.content} id="article-body" />
            </div>

            {(post.tags || []).length > 0 && (
              <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Tags">
                {(post.tags || []).map((t) => (
                  <span key={t} className="chip" data-tone="neutral">#{t}</span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-6">
              <Suspense fallback={<SectionSkeleton />}>
                <AuthorBlock authorId={post.author_id} authorName={post.author_name} currentUserId={ctx.userId} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Comments postId={post.id} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Highlights postId={post.id} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <PrivateNotes postId={post.id} />
              </Suspense>
            </div>
          </article>

          <div className="hidden lg:block">
            <div className="sticky top-6 flex flex-col gap-4">
              <TableOfContents content={post.content} />
              <div className="card p-4">
                <p className="t-meta text-muted">More {niche.name}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Get new {niche.name.toLowerCase()} guides in your feed.</p>
                <div className="mt-3">
                  <TopicFollowButton nicheSlug={niche.slug} nicheName={niche.name} initialFollowing={ctx.topicFollowing} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Suspense fallback={<SectionSkeleton />}>
            <RelatedPosts post={post} />
          </Suspense>
          {related.length === 0 && null}
        </div>
      </div>
    </ReadingProgressProvider>
  );
}
