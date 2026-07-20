import type { Niche } from './types';

/**
 * The site's full taxonomy. All 9 niches ship enabled from day one —
 * nothing here is per-phase. To add, remove, or rename a niche, edit this
 * file and see Guides/03-what-to-edit.md (you'll also need to update the
 * matching CHECK constraint in Guides/sql/schema.sql if you're touching
 * a live database).
 *
 * Colors follow the "Suggested Color Language" from the category-identity
 * doc. That doc names 9 colors for 9 categories, but they're not quite the
 * same 9 as this taxonomy — it has "Apple" and "Hardware" where this has
 * "Tech Buying Guides" and "Career & Jobs". Buying Guides took the doc's
 * unused Hardware red (buying guides ARE about hardware). Career & Jobs
 * isn't covered by the doc at all, so it gets a new indigo chosen to fit
 * the same saturated, modern palette family without repeating a hue.
 * Note AI Tools' blue (#4F7DFF) is also the site's global --accent color
 * (set separately) — that overlap is intentional, from the same source.
 */
export const NICHES: Niche[] = [
  {
    slug: 'ai-tools',
    label: 'AI Tools',
    description: 'Reviews, comparisons, tutorials, and prompt libraries.',
    color: '#4F7DFF',
  },
  {
    slug: 'programming',
    label: 'Programming',
    description: 'React, Next.js, Node.js, debugging guides, code examples.',
    color: '#10B981',
  },
  {
    slug: 'android',
    label: 'Android',
    description: 'Tips, tricks, app reviews, and customization.',
    color: '#84CC16',
  },
  {
    slug: 'windows-linux',
    label: 'Windows & Linux',
    description: 'Error fixes, tutorials, optimization.',
    color: '#06B6D4',
  },
  {
    slug: 'buying-guides',
    label: 'Tech Buying Guides',
    description: 'Phones, laptops, gadgets — comparisons and best-under-budget picks.',
    color: '#EF4444',
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    description: 'Guides, builds, settings, tier lists.',
    color: '#8B5CF6',
  },
  {
    slug: 'career-jobs',
    label: 'Career & Jobs',
    description: 'Exams, preparation guides, eligibility.',
    color: '#6366F1',
  },
  {
    slug: 'finance',
    label: 'Finance',
    description: 'Banking, UPI, credit cards, investments.',
    color: '#F59E0B',
  },
  {
    slug: 'productivity',
    label: 'Productivity',
    description: 'Notion, VS Code, and AI-assisted workflows.',
    color: '#F97316',
  },
];

export const NICHE_SLUGS = NICHES.map((n) => n.slug);

export function getNiche(slug: string): Niche | undefined {
  return NICHES.find((n) => n.slug === slug);
}
