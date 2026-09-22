/** Central AI chokepoint: every model call in the app flows through here.
 *
 *  Order: gemini-3.8-flash → gemini-3.7-flash → gemini-3.6-flash
 *  (single try each, 3 s gap between attempts), then Groq (separate
 *  vendor + quota pool) if GROQ_API_KEY is set. Keeps free-tier burn
 *  minimal: at most 3 Gemini calls per request. */

const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash'];
const GAP_MS = 3000;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export class AIError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function stripFences(raw: string): string {
  return raw.trim().replace(/^```(json)?\s*/i, '').replace(/```\s*$/i, '');
}

async function geminiOnce(model: string, apiKey: string, prompt: string, json: boolean): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: json ? { temperature: 0.6, responseMimeType: 'application/json' } : { temperature: 0.7 },
      }),
    }
  );
  if (!res.ok) {
    const body = (await res.text().catch(() => '')).slice(0, 200);
    throw new AIError(`Gemini ${model}: ${res.status} ${body}`, res.status >= 400 && res.status < 500 && res.status !== 429 ? res.status : 502);
  }
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new AIError(`Gemini ${model}: empty response`, 502);
  return text;
}

async function groqOnce(apiKey: string, prompt: string, json: boolean): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    const body = (await res.text().catch(() => '')).slice(0, 200);
    throw new AIError(`Groq: ${res.status} ${body}`, 502);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new AIError('Groq: empty response', 502);
  return text;
}

/** Raw text from the first model that answers. */
export async function aiText(prompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey && !process.env.GROQ_API_KEY) throw new AIError('AI not configured', 503);

  if (geminiKey) {
    for (let i = 0; i < GEMINI_MODELS.length; i++) {
      const model = GEMINI_MODELS[i];
      try {
        return await geminiOnce(model, geminiKey, prompt, false);
      } catch (err) {
        console.error(`[ai-router] ${model} failed, ${i < GEMINI_MODELS.length - 1 ? 'waiting 3s' : 'moving on'}`);
        if (i < GEMINI_MODELS.length - 1) await sleep(GAP_MS);
        else console.error('[ai-router] Gemini chain exhausted:', err instanceof Error ? err.message.slice(0, 160) : err);
      }
    }
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    console.error('[ai-router] switching to Groq');
    return groqOnce(groqKey, prompt, false);
  }
  throw new AIError('AI service unavailable', 502);
}

/** Parsed JSON from the first model that answers. */
export async function aiJson(prompt: string): Promise<unknown> {
  const raw = await aiTextJson(prompt);
  const cleaned = stripFences(raw);
  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    throw new AIError('Could not parse AI response', 502);
  }
}

async function aiTextJson(prompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey && !process.env.GROQ_API_KEY) throw new AIError('AI not configured', 503);

  if (geminiKey) {
    for (let i = 0; i < GEMINI_MODELS.length; i++) {
      const model = GEMINI_MODELS[i];
      try {
        return await geminiOnce(model, geminiKey, prompt, true);
      } catch (err) {
        console.error(`[ai-router] ${model} failed, ${i < GEMINI_MODELS.length - 1 ? 'waiting 3s' : 'moving on'}`);
        if (i < GEMINI_MODELS.length - 1) await sleep(GAP_MS);
        else console.error('[ai-router] Gemini chain exhausted:', err instanceof Error ? err.message.slice(0, 160) : err);
      }
    }
  }

  const grokKey = process.env.GROQ_API_KEY;
  if (grokKey) {
    console.error('[ai-router] switching to Groq');
    return groqOnce(grokKey, prompt, true);
  }
  throw new AIError('AI service unavailable', 502);
}
