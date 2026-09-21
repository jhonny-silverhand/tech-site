import { NextRequest, NextResponse } from 'next/server';

const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
const endpointFor = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const prompt = `You are a senior tech product advisor for an Indian audience. The user is looking for product recommendations.

USER QUERY: "${query}"

INSTRUCTIONS:
1. Recommend 3-5 products that best match the user's needs.
2. For each product, provide: name, brand, category, a short tagline (why it's recommended), 4-6 key features, who it's best for, and actual buying links for Indian e-commerce.
3. Generate real, accurate product names and specs based on your knowledge up to early 2025. Use current/most recent models available in India.
4. For buying links, use this format:
   - Amazon India: https://www.amazon.in/s?k={product name with + for spaces}
   - Flipkart: https://www.flipkart.com/search?q={product name with + for spaces}
5. Include price ranges in INR (₹) based on typical Indian market pricing.
6. Add a brief summary explaining your top pick.

RESPOND WITH ONLY a JSON object (no markdown fences), in exactly this shape:
{
  "summary": "Brief explanation of recommendations",
  "picks": [
    {
      "name": "Product Name",
      "brand": "Brand",
      "category": "Category (e.g. Smartphone, Laptop, Headphones)",
      "tagline": "One-line why this pick",
      "features": ["feature1", "feature2", "feature3", "feature4"],
      "bestFor": "Who this is ideal for",
      "priceRange": "₹XX,XXX - ₹XX,XXX",
      "links": {
        "amazon": "https://www.amazon.in/s?k=...",
        "flipkart": "https://www.flipkart.com/search?q=..."
      }
    }
  ]
}`;

  try {
    let res: Response | null = null;
    let lastErr = '';
    outer: for (const model of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        res = await fetch(`${endpointFor(model)}?key=${apiKey}`, {
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
        if (res.ok) break outer;
        if (res.status === 503 || res.status === 429) {
          lastErr = await res.text().catch(() => '');
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        lastErr = await res.text().catch(() => '');
        break;
      }
      console.error(`[ai-recommend] model ${model} unavailable, trying fallback`);
    }

    if (!res || !res.ok) {
      const errText = res ? await res.text().catch(() => '') : '';
      console.error('[ai-recommend] Gemini error:', res?.status, errText.slice(0, 300));
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const raw: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return NextResponse.json({ error: 'AI returned empty response' }, { status: 502 });
    }

    const cleaned = raw.trim().replace(/^```(json)?\s*/i, '').replace(/```\s*$/i, '');
    let parsed: { summary?: string; picks?: unknown[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Could not parse AI response' }, { status: 502 });
    }

    return NextResponse.json({
      summary: parsed.summary || '',
      picks: Array.isArray(parsed.picks) ? parsed.picks.slice(0, 5) : [],
      query,
    });
  } catch (err) {
    console.error('[ai-recommend] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
