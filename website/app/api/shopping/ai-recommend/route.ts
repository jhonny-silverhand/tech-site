import { NextRequest, NextResponse } from 'next/server';
import { aiJson, AIError } from '@/lib/ai-router';

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
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
    const parsed = (await aiJson(prompt)) as { summary?: string; picks?: unknown[] };

    return NextResponse.json({
      summary: parsed.summary || '',
      picks: Array.isArray(parsed.picks) ? parsed.picks.slice(0, 5) : [],
      query,
    });
  } catch (err) {
    const status = err instanceof AIError ? err.status : 500;
    console.error('[ai-recommend] Error:', err instanceof Error ? err.message.slice(0, 200) : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Something went wrong' },
      { status }
    );
  }
}
