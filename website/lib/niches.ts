export interface Niche {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  description: string;
}

export const NICHES: Niche[] = [
  { slug: 'ai', name: 'AI Tools', tagline: 'Models, prompts & workflows', color: '#4F7DFF', description: 'Practical AI tooling: prompts, models, agents and workflows that actually save time.' },
  { slug: 'programming', name: 'Programming', tagline: 'Code that ships', color: '#10B981', description: 'Web development, debugging, architecture and engineering craft.' },
  { slug: 'android', name: 'Android', tagline: 'Master your phone', color: '#84CC16', description: 'Android tips, fixes, apps and buying advice.' },
  { slug: 'windows', name: 'Windows', tagline: 'Faster PCs', color: '#06B6D4', description: 'Windows optimization, troubleshooting and power-user guides.' },
  { slug: 'gadgets', name: 'Gadgets', tagline: 'Phones, laptops & audio', color: '#F59E0B', description: 'Honest gadget reviews and buying guides with real prices.' },
  { slug: 'gaming', name: 'Gaming', tagline: 'FPS, settings & builds', color: '#EF4444', description: 'Game settings, performance tuning and PC builds.' },
  { slug: 'career', name: 'Career', tagline: 'Interviews & growth', color: '#8B5CF6', description: 'Interview prep, resumes, and engineering career growth.' },
  { slug: 'finance', name: 'Finance', tagline: 'Money, smartly', color: '#14B8A6', description: 'Credit cards, investing basics, and personal finance for techies.' },
  { slug: 'productivity', name: 'Productivity', tagline: 'Systems that stick', color: '#EC4899', description: 'Note-taking, templates, workflows and deep work.' },
  { slug: 'pc-hardware', name: 'PC Hardware', tagline: 'Builds & benchmarks', color: '#FF6B35', description: 'CPUs, GPUs, builds and component buying guides.' },
];

export const NICHE_MAP: Record<string, Niche> = Object.fromEntries(NICHES.map((n) => [n.slug, n]));

export function getNiche(slug: string): Niche {
  return (
    NICHE_MAP[slug] || {
      slug,
      name: slug,
      tagline: '',
      color: '#4F7DFF',
      description: '',
    }
  );
}

export function nicheColor(slug: string): string {
  return NICHE_MAP[slug]?.color || '#4F7DFF';
}
