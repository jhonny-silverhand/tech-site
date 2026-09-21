import { NextResponse } from 'next/server';
import { generatePCBuilds } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const budgetInr = Number(body.budgetInr);
    const useCase = String(body.useCase || 'Gaming 1080p');
    if (!budgetInr || budgetInr < 20000 || budgetInr > 1000000) {
      return NextResponse.json({ error: 'Budget must be between ₹20,000 and ₹10,00,000' }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured. Add it to .env.local to enable AI builds.' }, { status: 503 });
    }
    const builds = await generatePCBuilds(budgetInr, useCase);
    return NextResponse.json({ builds });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Build generation failed' }, { status: 500 });
  }
}
