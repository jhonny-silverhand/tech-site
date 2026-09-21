import fs from 'fs';
import path from 'path';
import type { Post } from '@/lib/types';

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function readArticle(filename: string): string {
  const filePath = path.join(process.cwd(), 'content', 'articles', filename);
  return fs.readFileSync(filePath, 'utf-8').trim();
}

interface SeedMeta {
  slug: string;
  title: string;
  excerpt: string;
  niche: string;
  file: string;
  authorId: string | null;
  authorName: string;
  isAiAssisted: boolean;
  seoTitle: string;
  seoDescription: string;
  createdDaysAgo: number;
}

/**
 * Local fallback + demo content, used automatically whenever Supabase isn't
 * configured (see isSupabaseConfigured() in lib/data.ts). Two of these are
 * attributed to demo users rather than Admin, on purpose — it's the
 * clearest way to see the admin-AI / user-manual split actually working.
 * Swap or delete any of these once real content exists; nothing here is
 * read once a Supabase project is connected.
 */
const SEED_META: SeedMeta[] = [
  {
    slug: 'free-ai-writing-assistants-beyond-chatgpt',
    title: '5 Free AI Writing Assistants Worth Trying Beyond ChatGPT',
    excerpt:
      'Claude, Gemini, Perplexity, Notion AI, and Le Chat each solve a different writing problem — here is when to reach for which one.',
    niche: 'ai-tools',
    file: 'free-ai-writing-assistants-beyond-chatgpt.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: true,
    seoTitle: '5 Free AI Writing Assistants Beyond ChatGPT (2026)',
    seoDescription:
      'A practical comparison of Claude, Gemini, Perplexity, Notion AI, and Le Chat, and when to use each one for writing.',
    createdDaysAgo: 2,
  },
  {
    slug: 'how-to-write-better-ai-prompts',
    title: 'How to Write Better AI Prompts: A Practical Framework',
    excerpt:
      'Most bad AI output is a prompting problem. A simple role/task/context/format template fixes the majority of it.',
    niche: 'ai-tools',
    file: 'how-to-write-better-ai-prompts.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: true,
    seoTitle: 'How to Write Better AI Prompts: A Practical Framework',
    seoDescription:
      'A simple, repeatable template for writing AI prompts that actually get specific, useful answers.',
    createdDaysAgo: 6,
  },
  {
    slug: 'understanding-react-server-components',
    title: 'Understanding React Server Components in 10 Minutes',
    excerpt:
      'What Server Components actually solve, when you need "use client", and the mistake almost everyone makes at first.',
    niche: 'programming',
    file: 'understanding-react-server-components.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: false,
    seoTitle: 'Understanding React Server Components (Next.js App Router)',
    seoDescription:
      'A practical, example-driven explanation of React Server Components, Client Components, and when to use each.',
    createdDaysAgo: 9,
  },
  {
    slug: 'debugging-nodejs-memory-leaks',
    title: 'Debugging Node.js Memory Leaks: A Step-by-Step Guide',
    excerpt:
      'A heap-snapshot workflow for finding the event listener, cache, or timer that is quietly leaking memory.',
    niche: 'programming',
    file: 'debugging-nodejs-memory-leaks.md',
    authorId: 'demo-user-priya',
    authorName: 'Priya Sharma',
    isAiAssisted: false,
    seoTitle: 'Debugging Node.js Memory Leaks: Step-by-Step Guide',
    seoDescription:
      'How to confirm, locate, and fix a Node.js memory leak using Chrome DevTools heap snapshots.',
    createdDaysAgo: 13,
  },
  {
    slug: 'fix-android-storage-full-without-losing-data',
    title: "Fix \u201CStorage Space Running Out\u201D on Android Without Losing Data",
    excerpt:
      'Clear cache, offload backed-up photos, and find duplicates before you delete anything you actually want to keep.',
    niche: 'android',
    file: 'fix-android-storage-full-without-losing-data.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: false,
    seoTitle: 'Fix Android Storage Full Without Losing Data',
    seoDescription:
      'A safe, step-by-step order of operations to free up Android storage without deleting anything important.',
    createdDaysAgo: 16,
  },
  {
    slug: 'speed-up-windows-11-boot-time',
    title: '7 Ways to Speed Up a Slow Windows 11 Boot',
    excerpt:
      'From startup apps to storage drivers, the highest-leverage fixes for a Windows 11 PC that boots too slowly.',
    niche: 'windows-linux',
    file: 'speed-up-windows-11-boot-time.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: false,
    seoTitle: '7 Ways to Speed Up a Slow Windows 11 Boot',
    seoDescription:
      'Seven concrete fixes for a slow Windows 11 boot, from startup apps to storage drivers to a clean reset.',
    createdDaysAgo: 19,
  },
  {
    slug: 'best-phones-under-300-2026',
    title: 'Best Phones Under $300 in 2026: What to Actually Check',
    excerpt:
      'Skip the spec sheet marketing — update policy, real RAM behavior, and network bands matter more at this price.',
    niche: 'buying-guides',
    file: 'best-phones-under-300-2026.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: true,
    seoTitle: 'Best Phones Under $300 (2026): What to Actually Check',
    seoDescription:
      'A buyer checklist for budget phones: update commitment, RAM behavior, refresh rate, battery, and network bands.',
    createdDaysAgo: 23,
  },
  {
    slug: 'best-valorant-settings-fps-aim',
    title: 'Best Valorant Settings for Higher FPS and Better Aim',
    excerpt:
      'Video settings for the best FPS-to-quality tradeoff, plus a sane way to actually tune your sensitivity.',
    niche: 'gaming',
    file: 'best-valorant-settings-fps-aim.md',
    authorId: 'demo-user-rohan',
    authorName: 'Rohan Mehta',
    isAiAssisted: false,
    seoTitle: 'Best Valorant Settings for FPS and Aim (2026)',
    seoDescription:
      'A starting-point Valorant settings guide covering video settings, sensitivity, crosshair, and mouse setup.',
    createdDaysAgo: 27,
  },
  {
    slug: 'technical-interview-prep-30-days',
    title: 'How to Prepare for a Technical Interview in 30 Days',
    excerpt:
      'A four-week structured plan: fundamentals, pattern recognition, mock interviews, then system design and rest.',
    niche: 'career-jobs',
    file: 'technical-interview-prep-30-days.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: false,
    seoTitle: 'Technical Interview Prep: A 30-Day Plan',
    seoDescription:
      'A structured four-week plan to prepare for technical interviews, covering fundamentals through mock interviews.',
    createdDaysAgo: 31,
  },
  {
    slug: 'credit-card-cashback-vs-points',
    title: 'Credit Card Cashback vs Reward Points: Which Is Actually Better',
    excerpt:
      'They solve different problems. How to figure out which one actually fits your spending and travel habits.',
    niche: 'finance',
    file: 'credit-card-cashback-vs-points.md',
    authorId: null,
    authorName: 'Admin',
    isAiAssisted: false,
    seoTitle: 'Credit Card Cashback vs Points: Which Is Better?',
    seoDescription:
      'A framework for deciding between cashback and reward points based on your actual spending and travel habits.',
    createdDaysAgo: 35,
  },
  {
    slug: 'notion-templates-that-save-time',
    title: '5 Notion Templates That Actually Save Time',
    excerpt:
      'Low-maintenance templates that save time by reducing decisions, not by adding automation you have to babysit.',
    niche: 'productivity',
    file: 'notion-templates-that-save-time.md',
    authorId: 'demo-user-priya',
    authorName: 'Priya Sharma',
    isAiAssisted: false,
    seoTitle: '5 Notion Templates That Actually Save Time',
    seoDescription:
      'Five low-maintenance Notion templates built to save time by reducing decisions, not adding upkeep.',
    createdDaysAgo: 39,
  },
];

export function getSeedPosts(): Post[] {
  return SEED_META.map((meta) => {
    const created = daysAgo(meta.createdDaysAgo);
    return {
      id: `seed-${meta.slug}`,
      title: meta.title,
      slug: meta.slug,
      excerpt: meta.excerpt,
      content: readArticle(meta.file),
      niche: meta.niche,
      cover_image_url: `https://picsum.photos/seed/${meta.slug}/1200/675`,
      status: 'published',
      author_id: meta.authorId,
      author_name: meta.authorName,
      is_ai_assisted: meta.isAiAssisted,
      seo_title: meta.seoTitle,
      seo_description: meta.seoDescription,
      created_at: created,
      updated_at: created,
      published_at: created,
    };
  });
}
