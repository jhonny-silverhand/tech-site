import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByNiche } from '@/lib/data';
import { getNiche, NICHES } from '@/lib/niches';
import { BreadcrumbSlash } from '@/components/BreadcrumbSlash';
import { PostCard } from '@/components/PostCard';
import { TopicFollowButton } from '@/components/TopicFollowButton';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function generateStaticParams() {
  return NICHES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNiche(slug);
  return { title: niche.name, description: niche.description };
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const niche = getNiche(slug);
  if (!NICHES.find((n) => n.slug === slug)) notFound();

  const posts = await getPostsByNiche(slug, 24);

  let following = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { data } = await supabase.from('topic_follows').select('id').eq('user_id', auth.user.id).eq('niche_slug', slug).maybeSingle();
        following = Boolean(data);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BreadcrumbSlash items={[{ label: 'Home', href: '/' }, { label: niche.name }]} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-7">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 font-mono text-[11px] text-muted">
            <span className="h-[8px] w-[8px] rounded-full" style={{ background: niche.color }} aria-hidden />
            Topic · <span className="t-numeric">{posts.length} article{posts.length === 1 ? '' : 's'}</span>
          </p>
          <h1 className="t-display mt-3 text-[36px] sm:text-[48px]">{niche.name}</h1>
          <p className="t-dek mt-2 text-[22px] text-muted">{niche.tagline}</p>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{niche.description}</p>
        </div>
        <TopicFollowButton nicheSlug={niche.slug} nicheName={niche.name} initialFollowing={following} />
      </div>
      {posts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-lg border border-dashed border-linestrong bg-paper px-6 py-12 text-center">
          <p className="t-section text-[17px]">No articles in {niche.name} yet</p>
          <p className="max-w-sm text-sm text-muted">Our editors are working on the first batch. Follow the topic to get notified.</p>
        </div>
      ) : (
        <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
