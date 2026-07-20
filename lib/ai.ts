import type { GeneratedDraft } from './types';
import { getNiche } from './niches';

// Free-tier model as of mid-2026 (see Guides/02-api-setup.md). Google
// renames/retires models occasionally — if generation starts failing with
// a 404, check https://ai.google.dev/gemini-api/docs/models for the
// current free-tier name and update this constant.
const MODEL = 'gemini-3.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Calls Gemini to produce a full draft (title/excerpt/content/SEO fields)
 * for the admin's "Generate draft" button. This is intentionally the ONLY
 * place in the codebase that calls an external AI model — regular users
 * never have access to it. The admin is still expected to read, edit, and
 * fact-check the result before publishing; see the note in
 * Guides/03-what-to-edit.md about why auto-publishing AI output untouched
 * is a bad idea for search rankings, not just quality.
 */
export async function generateDraft(topic: string, nicheSlug: string): Promise<GeneratedDraft> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to .env.local — see Guides/02-api-setup.md.');
  }

  const niche = getNiche(nicheSlug);
  const prompt = [
    `You are a knowledgeable staff writer for a technology publication, writing for the "${niche?.label ?? 'Technology'}" section.`,
    `Section focus: ${niche?.description ?? 'general technology coverage'}.`,
    `Write an original, accurate, genuinely useful article about: "${topic}".`,
    '',
    'Rules:',
    '- Write for a reader who wants practical help, not filler. No generic intros like "In today\'s fast-paced world".',
    '- Use Markdown: an H2 per major section, short paragraphs, and bullet or numbered lists where they help.',
    '- If the topic involves code, include at least one fenced code block with a language tag.',
    '- Length: roughly 500-800 words in "content".',
    '- Do not invent statistics, prices, quotes, or named sources.',
    '',
    'Respond with ONLY a JSON object, no markdown fences, in exactly this shape:',
    '{"title": string, "excerpt": string (max 160 chars), "content": string (markdown), "seo_title": string (max 60 chars), "seo_description": string (max 155 chars)}',
  ].join('\n');

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error('Gemini returned an empty response. It may have blocked the topic — try rephrasing.');
  }

  // responseMimeType should already give clean JSON, but strip fences defensively
  // in case a future model version wraps it anyway.
  const cleaned = raw.trim().replace(/^```(json)?\s*/i, '').replace(/```\s*$/i, '');

  let parsed: Partial<GeneratedDraft>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse the AI response as JSON. Try generating again.');
  }

  return {
    title: parsed.title?.trim() || topic,
    excerpt: parsed.excerpt?.trim() || '',
    content: parsed.content?.trim() || '',
    seo_title: parsed.seo_title?.trim() || parsed.title?.trim() || topic,
    seo_description: parsed.seo_description?.trim() || parsed.excerpt?.trim() || '',
  };
}
