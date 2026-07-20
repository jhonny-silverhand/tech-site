import { notFound } from 'next/navigation';
import { getNiche } from '@/lib/niches';
import { getPostsByNiche } from '@/lib/data';
import { PostCard } from '@/components/PostCard';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';

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
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
        tech<span className="text-accent">//</span>site
        <BreadcrumbSlash />
        <span style={{ color: niche.color }}>{niche.slug}</span>
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{niche.label}</h1>
      <p className="mt-3 max-w-xl text-[15.5px] text-muted leading-relaxed">{niche.description}</p>

      {posts.length === 0 ? (
        <p className="mt-14 font-mono text-[13px] text-muted">Nothing published here yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
