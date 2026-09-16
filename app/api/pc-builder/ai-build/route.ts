import { NextRequest, NextResponse } from 'next/server';

const MODEL = 'gemini-3.6-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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

  const prompt = `You are a senior PC building advisor for an Indian audience. The user wants to build a custom PC.

USER REQUIREMENTS: "${query}"

INSTRUCTIONS:
1. Generate 2-3 complete PC builds that best match the user's needs and budget.
2. Each build must include ALL of these components with specific real product names:
   - CPU (Processor)
   - CPU Cooler
   - Motherboard
   - RAM (Memory)
   - GPU (Graphics Card)
   - Storage (SSD/NVMe)
   - PSU (Power Supply)
   - PC Case
3. For each component provide: exact product name, brand, brief specs, and why it was chosen.
4. Use real, accurate product names and specs available in India (2024-2025 models).
5. Include estimated price ranges in INR (₹) for each component and total build cost.
6. Label each build with a tier: Budget, Mid-Range, or High-End.
7. Add a brief explanation of why each build was recommended.
8. For each component, include a search URL for buying:
   - Amazon India: https://www.amazon.in/s?k={component name with + for spaces}
   - Flipkart: https://www.flipkart.com/search?q={component name with + for spaces}

RESPOND WITH ONLY a JSON object (no markdown fences), in exactly this shape:
{
  "summary": "Brief overview of the builds",
  "builds": [
    {
      "name": "Build Name (e.g., Budget Gaming Build)",
      "tier": "budget | midrange | highend",
      "useCase": "Best for gaming / content creation / office work",
      "totalPrice": "₹XX,XXX - ₹XX,XXX",
      "components": [
        {
          "category": "CPU",
          "name": "AMD Ryzen 5 7600",
          "brand": "AMD",
          "specs": "6 cores / 12 threads, 3.8 GHz base, AM5 socket",
          "priceRange": "₹18,000 - ₹21,000",
          "reason": "Excellent price-to-performance for gaming",
          "links": {
            "amazon": "https://www.amazon.in/s?k=AMD+Ryzen+5+7600",
            "flipkart": "https://www.flipkart.com/search?q=AMD+Ryzen+5+7600"
          }
        },
        {
          "category": "CPU Cooler",
          "name": "Deepcool AK400",
          "brand": "Deepcool",
          "specs": "120mm tower, 4 heat pipes",
          "priceRange": "₹2,500 - ₹3,500",
          "reason": "Budget-friendly, great cooling",
          "links": {
            "amazon": "https://www.amazon.in/s?k=Deepcool+AK400",
            "flipkart": "https://www.flipkart.com/search?q=Deepcool+AK400"
          }
        }
      ],
      "notes": "Optional tips about this build"
    }
  ]
}

Include ALL 8 components (CPU, CPU Cooler, Motherboard, RAM, GPU, Storage, PSU, Case) in each build. Make builds realistic and optimized for the stated budget and use case.`;

  try {
    let res: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
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
      if (res.ok) break;
      if (res.status === 503 || res.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }

    if (!res || !res.ok) {
      const errText = res ? await res.text().catch(() => '') : '';
      console.error('[ai-build] Gemini error:', res?.status, errText.slice(0, 300));
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const raw: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return NextResponse.json({ error: 'AI returned empty response' }, { status: 502 });
    }

    const cleaned = raw.trim().replace(/^```(json)?\s*/i, '').replace(/```\s*$/i, '');
    let parsed: { summary?: string; builds?: unknown[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Could not parse AI response' }, { status: 502 });
    }

    return NextResponse.json({
      summary: parsed.summary || '',
      builds: Array.isArray(parsed.builds) ? parsed.builds.slice(0, 3) : [],
      query,
    });
  } catch (err) {
    console.error('[ai-build] Error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
