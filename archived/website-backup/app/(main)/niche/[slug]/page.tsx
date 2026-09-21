import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNiche, NICHES } from '@/lib/niches';
import { getPostsByNiche } from '@/lib/data';
import { PostCard } from '@/components/PostCard';
import { TopicFollowButton } from '@/components/TopicFollowButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const niche = getNiche(slug);
  return { title: niche ? niche.label : 'Section' };
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const niche = getNiche(slug);
  if (!niche) notFound();

  const posts = await getPostsByNiche(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <span className="text-ink">{niche.label}</span>
      </nav>

      {/* Header */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: niche.color }}
            />
            <h1 className="font-display text-3xl font-semibold text-ink">
              {niche.label}
            </h1>
          </div>
          {niche.tagline && (
            <p className="mt-2 font-tagline text-lg italic text-muted">
              {niche.tagline}
            </p>
          )}
          {niche.description && (
            <p className="mt-2 max-w-xl text-[15px] text-muted leading-relaxed">
              {niche.description}
            </p>
          )}
        </div>
        <TopicFollowButton nicheSlug={slug} />
      </div>

      {/* Colored divider */}
      <div
        className="mt-6 h-[2px] w-full"
        style={{ backgroundColor: niche.color }}
      />

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="mt-14 font-mono text-[13px] text-muted">Nothing published here yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
