import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { generateDraft } from '@/lib/ai';

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { topic, niche } = body as { topic?: string; niche?: string };

  if (typeof topic !== 'string' || !topic.trim()) {
    return NextResponse.json({ error: 'A topic is required.' }, { status: 400 });
  }

  try {
    const draft = await generateDraft(topic, typeof niche === 'string' ? niche : '');
    return NextResponse.json(draft);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
