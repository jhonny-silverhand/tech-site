export interface SeedPost {
  slug: string;
  title: string;
  excerpt: string;
  niche: string;
  niche_color: string;
  author_name: string;
  tags: string[];
  featured?: boolean;
  is_ai_assisted?: boolean;
  file: string;
}

export const SEED_POSTS: SeedPost[] = [
  {
    slug: 'free-ai-writing-assistants-beyond-chatgpt',
    title: '7 Free AI Writing Assistants Beyond ChatGPT (Tested)',
    excerpt: 'ChatGPT gets all the attention, but these free alternatives are better at brainstorming, editing, and long-form drafting.',
    niche: 'ai',
    niche_color: '#4F7DFF',
    author_name: 'Meera Krishnan',
    tags: ['ai', 'writing', 'tools'],
    featured: true,
    file: 'free-ai-writing-assistants-beyond-chatgpt.md',
  },
  {
    slug: 'how-to-write-better-ai-prompts',
    title: 'How to Write Better AI Prompts: A Practical Framework',
    excerpt: 'Stop guessing. A five-part prompt structure — role, context, task, constraints, format — that works on every model.',
    niche: 'ai',
    niche_color: '#4F7DFF',
    author_name: 'Arjun Mehta',
    tags: ['ai', 'prompts', 'guide'],
    featured: true,
    file: 'how-to-write-better-ai-prompts.md',
  },
  {
    slug: 'understanding-react-server-components',
    title: 'Understanding React Server Components (Without the Hype)',
    excerpt: 'What Server Components actually do, when they help, and the three mental models that make them click.',
    niche: 'programming',
    niche_color: '#10B981',
    author_name: 'Arjun Mehta',
    tags: ['react', 'nextjs', 'web'],
    featured: true,
    file: 'understanding-react-server-components.md',
  },
  {
    slug: 'debugging-nodejs-memory-leaks',
    title: 'Debugging Node.js Memory Leaks: A Field Guide',
    excerpt: 'Heap snapshots, clinic.js, and the four leak patterns behind 90% of production OOM crashes.',
    niche: 'programming',
    niche_color: '#10B981',
    author_name: 'Sana Sheikh',
    tags: ['nodejs', 'debugging', 'backend'],
    file: 'debugging-nodejs-memory-leaks.md',
  },
  {
    slug: 'fix-android-storage-full-without-losing-data',
    title: 'Fix "Storage Full" on Android Without Losing Data',
    excerpt: 'Reclaim 5–15 GB in 20 minutes: the exact order to clear cache, offload media, and tame WhatsApp.',
    niche: 'android',
    niche_color: '#84CC16',
    author_name: 'Rahul Verma',
    tags: ['android', 'storage', 'how-to'],
    file: 'fix-android-storage-full-without-losing-data.md',
  },
  {
    slug: 'speed-up-windows-11-boot-time',
    title: 'Speed Up Windows 11 Boot Time: 9 Fixes That Work',
    excerpt: 'From 90 seconds to under 20: disable the right startup apps, fix Fast Startup, and check your drive health.',
    niche: 'windows',
    niche_color: '#06B6D4',
    author_name: 'Sana Sheikh',
    tags: ['windows', 'performance', 'how-to'],
    file: 'speed-up-windows-11-boot-time.md',
  },
  {
    slug: 'best-phones-under-300-2026',
    title: 'Best Phones Under ₹25,000 in 2026 (Tested Picks)',
    excerpt: 'Five phones worth buying under ₹25,000 — with the cameras, batteries and update policies compared honestly.',
    niche: 'gadgets',
    niche_color: '#F59E0B',
    author_name: 'Rahul Verma',
    tags: ['smartphones', 'buying-guide', 'budget'],
    featured: true,
    file: 'best-phones-under-300-2026.md',
  },
  {
    slug: 'best-valorant-settings-fps-aim',
    title: 'Best Valorant Settings for FPS and Aim (2026)',
    excerpt: 'The graphics, sensitivity and crosshair settings competitive players actually use — plus how to find yours.',
    niche: 'gaming',
    niche_color: '#EF4444',
    author_name: 'Dev Patel',
    tags: ['valorant', 'gaming', 'settings'],
    file: 'best-valorant-settings-fps-aim.md',
  },
  {
    slug: 'technical-interview-prep-30-days',
    title: 'Technical Interview Prep in 30 Days: A Realistic Plan',
    excerpt: 'A week-by-week DSA + system design + behavioral plan for working professionals with 90 minutes a day.',
    niche: 'career',
    niche_color: '#8B5CF6',
    author_name: 'Priya Nair',
    tags: ['interviews', 'career', 'dsa'],
    featured: true,
    file: 'technical-interview-prep-30-days.md',
  },
  {
    slug: 'credit-card-cashback-vs-points',
    title: 'Cashback vs. Points: Which Credit Cards Actually Pay?',
    excerpt: 'The math behind Indian rewards cards — when 5% cashback beats 10X points, and the two-card setup that covers most people.',
    niche: 'finance',
    niche_color: '#14B8A6',
    author_name: 'Priya Nair',
    tags: ['credit-cards', 'finance', 'india'],
    file: 'credit-card-cashback-vs-points.md',
  },
  {
    slug: 'notion-templates-that-save-time',
    title: '9 Notion Templates That Actually Save Time',
    excerpt: 'Not aesthetic dashboards — working systems for tasks, notes, job hunts and reading lists you will keep using.',
    niche: 'productivity',
    niche_color: '#EC4899',
    author_name: 'Meera Krishnan',
    tags: ['notion', 'productivity', 'templates'],
    featured: true,
    file: 'notion-templates-that-save-time.md',
  },
];
