import { NextRequest, NextResponse } from 'next/server';
import { aiJson, AIError } from '@/lib/ai-router';
import { getPostBySlugDirect } from '@/lib/data';

/** AI TL;DR for articles — 3 bullets + one takeaway, generated through the
 *  central AI router. Module-level cache: one generation per slug per 30 min
 *  (per serverless instance) to keep free-tier burn low. */

export const maxDuration = 60;

const TTL_MS = 30 * 60 * 1000;
const MAX_ENTRIES = 100;

type Tldr = { bullets: string[]; takeaway: string };
const cache = new Map<string, { at: number; data: Tldr }>();

function sanitize(parsed: { bullets?: unknown; takeaway?: unknown }): Tldr | null {
  const bullets = Array.isArray(parsed.bullets)
    ? parsed.bullets.map((b) => String(b).trim()).filter(Boolean).slice(0, 4).map((b) => b.slice(0, 240))
    : [];
  const takeaway = typeof parsed.takeaway === 'string' ? parsed.takeaway.trim().slice(0, 280) : '';
  if (bullets.length === 0 && !takeaway) return null;
  return { bullets, takeaway };
}

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  const hit = cache.get(slug);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return NextResponse.json(hit.data);
  }

  const post = await getPostBySlugDirect(slug);
  if (!post) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  if (!post.content || post.content.trim().length < 200) {
    return NextResponse.json({ error: 'Article has no body to summarize' }, { status: 422 });
  }

  const content = post.content.slice(0, 6000);
  const prompt = `You are the TL;DR engine of a practical technology publication. Summarize the article below for a busy reader.

TITLE: ${post.title}
CONTENT (markdown, possibly truncated):
"""
${content}
"""

RULES:
1. Extract exactly 3 bullet points — the most decision-useful takeaways.
2. Each bullet: one sentence, max 140 characters, plain text, no markdown.
3. Add one closing "takeaway" line, max 160 characters, that states who should read the full article and why.
4. Use ONLY facts present in the content above. Never invent numbers, names, or claims.

RESPOND WITH ONLY a JSON object (no markdown fences), exactly this shape:
{"bullets": ["…", "…", "…"], "takeaway": "…"}`;

  try {
    const parsed = (await aiJson(prompt)) as { bullets?: unknown; takeaway?: unknown };
    const data = sanitize(parsed);
    if (!data) return NextResponse.json({ error: 'Empty summary' }, { status: 502 });

    cache.set(slug, { at: Date.now(), data });
    if (cache.size > MAX_ENTRIES) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof AIError ? err.status : 500;
    console.error('[tldr] Error:', err instanceof Error ? err.message.slice(0, 200) : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Something went wrong' },
      { status }
    );
  }
}
