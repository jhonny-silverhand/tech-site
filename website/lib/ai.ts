import { GoogleGenerativeAI } from '@google/generative-ai';
import { withTimeout } from './with-timeout';
import type { AIRecommendation, PCBuild } from './types';

function model() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

function extractJson(text: string): string {
  // Strip code fences if the model wraps output.
  const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(text);
  if (fence) return fence[1];
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');
  if (arrStart !== -1 && (start === -1 || arrStart < start) && arrEnd !== -1) {
    return text.slice(arrStart, arrEnd + 1);
  }
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function generateDraft(title: string, excerpt: string, niche: string): Promise<string> {
  const m = model();
  const prompt = `You are an expert technology editor for a premium publication called tech/site.
Write a complete, genuinely useful article in Markdown.

Title: ${title}
Niche: ${niche}
Excerpt/brief: ${excerpt || '(no brief provided)'}

Requirements:
- 1200-1800 words of real, specific, actionable content. No filler, no placeholder text.
- Start with a 2-3 sentence intro. Use ## and ### headings (at least 4 sections).
- Include concrete steps, commands, settings paths, or examples where relevant.
- Include one table or checklist where it helps.
- End with a short "Key takeaways" bullet list.
- Use fenced code blocks with language tags for any code/commands.
- Return ONLY the Markdown article body, no preamble.`;
  const res = await withTimeout(m.generateContent(prompt), 60000, 'Gemini draft generation');
  return res.response.text().trim();
}

export async function recommendProducts(
  query: string,
  category: string,
  catalog: { name: string; manufacturer?: string | null; description?: string | null; specs: { spec_key: string; spec_value: string }[]; price_inr?: number | null }[]
): Promise<AIRecommendation[]> {
  const m = model();
  const catalogText =
    catalog.length > 0
      ? catalog
          .map(
            (p, i) =>
              `${i + 1}. ${p.name}${p.manufacturer ? ` (${p.manufacturer})` : ''}${p.price_inr ? ` — ~₹${p.price_inr.toLocaleString('en-IN')}` : ''}\n   ${p.description || ''}\n   Specs: ${p.specs.map((s) => `${s.spec_key}: ${s.spec_value}`).join('; ')}`
          )
          .join('\n')
      : '(no catalog data — use your own knowledge of the Indian market with INR prices)';
  const prompt = `You are a shopping expert for Indian buyers (prices in INR, retailers: Amazon.in, Flipkart, Croma, Reliance Digital).
User request (category: ${category}): "${query}"

Catalog:
${catalogText}

Pick the 3-6 best matching products. Prefer catalog items when relevant.
Return ONLY a JSON array where each item is:
{"name": string, "manufacturer": string, "model": string, "label": "Best Overall"|"Best Value"|"Budget Pick"|"Premium Pick"|"Also Great",
 "reasoning": string (2-3 sentences), "pros": [2-3 strings], "cons": [1-2 strings],
 "estimated_price_inr": number, "product_slug": string (only if it clearly matches a catalog item, else omit)}
No markdown fences, no commentary — raw JSON only.`;
  const res = await withTimeout(m.generateContent(prompt), 60000, 'Gemini recommendations');
  const parsed = JSON.parse(extractJson(res.response.text()));
  const arr = Array.isArray(parsed) ? parsed : parsed.recommendations || parsed.products || [];
  return arr as AIRecommendation[];
}

export async function generatePCBuilds(budgetInr: number, useCase: string): Promise<PCBuild[]> {
  const m = model();
  const prompt = `You are a PC building expert for the Indian market (prices in INR, buy from Amazon.in / Flipkart / mdcomputers.in / vedantcomputers.com).
Budget: ₹${budgetInr.toLocaleString('en-IN')}. Use case: ${useCase}.

Generate 3 complete PC builds: "Budget" (~70% of budget), "Balanced" (~100% of budget), "Stretch" (~120% of budget).
Each build MUST include exactly these 8 component categories: CPU, GPU, Motherboard, RAM, Storage, PSU, Case, Cooler.
Use real models available in India with realistic INR prices. Total the prices.

Return ONLY a JSON array where each item is:
{"tier": string, "total_inr": number, "use_case": string,
 "components": [{"category": string, "name": string, "price_inr": number, "reasoning": string (1 sentence)}],
 "notes": string (2 sentences on who this build suits)}
Raw JSON only, no fences, no commentary.`;
  const res = await withTimeout(m.generateContent(prompt), 90000, 'Gemini PC builds');
  const parsed = JSON.parse(extractJson(res.response.text()));
  const arr = Array.isArray(parsed) ? parsed : parsed.builds || [];
  return arr as PCBuild[];
}
