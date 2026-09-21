import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { generateDraft } from '@/lib/ai';

export async function POST(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { title, excerpt, niche } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 503 });
    const draft = await generateDraft(String(title), String(excerpt || ''), String(niche || 'programming'));
    return NextResponse.json({ draft });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Generation failed' }, { status: 500 });
  }
}
