import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/data';
import { getNiche } from '@/lib/niches';

/**
 * The whole point of this shell: authentication as its own quiet,
 * editorial moment rather than a form living under the normal site chrome
 * — no nav pills, no command palette hint, no niche strip. Per the 3.5
 * brief, this page deliberately does NOT use niche theming; the featured
 * story's own niche tag shows in its natural color (same as it would
 * anywhere else on the site), but the shell itself — typography, layout,
 * palette — stays the site's neutral global identity.
 *
 * The left panel is a real, randomly-chosen published post, not a
 * fabricated "featured story" — genuinely different on each visit, using
 * data that already exists rather than a new content type.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const posts = await getPublishedPosts();
  const featured = posts.length > 0 ? posts[Math.floor(Math.random() * posts.length)] : null;
  const niche = featured ? getNiche(featured.niche) : null;

  return (
    <div className="min-h-screen flex bg-bg">
      {featured && (
        <div className="hidden lg:block lg:w-[44%] relative shrink-0">
          <Image src={featured.cover_image_url} alt="" fill priority className="object-cover" sizes="44vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex items-center font-display text-xl text-white">
              <span>tech</span>
              <span className="flex gap-[2px] mx-[2px] -skew-x-12">
                <span className="inline-block w-[3px] h-[0.85em] bg-accent" />
                <span className="inline-block w-[3px] h-[0.85em] bg-accent" />
              </span>
              <span>site</span>
            </Link>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-white/55 mb-3">Today&apos;s story</p>
              {niche && (
                <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: niche.color }}>
                  {niche.label}
                </span>
              )}
              <h2 className="mt-2 font-display text-3xl xl:text-4xl leading-[1.15] text-white">{featured.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/75 line-clamp-3 max-w-md">
                {featured.excerpt}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden px-6 pt-8">
          <Link href="/" className="flex items-center font-display text-xl text-ink">
            <span>tech</span>
            <span className="flex gap-[2px] mx-[2px] -skew-x-12">
              <span className="inline-block w-[3px] h-[0.85em] bg-accent" />
              <span className="inline-block w-[3px] h-[0.85em] bg-accent" />
            </span>
            <span>site</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
