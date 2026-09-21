/** Shared Gemini helper: model fallback chain + strict-JSON parsing.
 *  All product data is fetched live at request time — no offline catalog. */

const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

function endpointFor(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function geminiJson(prompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError('AI not configured', 503);

  let lastStatus = 502;
  let lastBody = '';
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let res: Response;
      try {
        res = await fetch(`${endpointFor(model)}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, responseMimeType: 'application/json' },
          }),
        });
      } catch (err) {
        lastBody = err instanceof Error ? err.message : 'network error';
        continue;
      }
      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) throw new GeminiError('AI returned empty response', 502);
        const cleaned = raw.trim().replace(/^```(json)?\s*/i, '').replace(/```\s*$/i, '');
        try {
          return JSON.parse(cleaned) as unknown;
        } catch {
          throw new GeminiError('Could not parse AI response', 502);
        }
      }
      lastStatus = res.status;
      lastBody = (await res.text().catch(() => '')).slice(0, 300);
      if (res.status === 503 || res.status === 429) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }
    console.error(`[gemini] model ${model} failed (${lastStatus}), trying fallback`);
  }
  console.error('[gemini] all models failed:', lastStatus, lastBody);
  throw new GeminiError('AI service unavailable', 502);
}
