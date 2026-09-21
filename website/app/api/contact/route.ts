import { NextResponse } from 'next/server';

const TO = process.env.CONTACT_TO || 'jhonnysilverhand.069@gmail.com';
const FROM = process.env.CONTACT_FROM || 'tech//site <onboarding@resend.dev>';

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet. Please email us directly.' },
      { status: 503 }
    );
  }
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);
  if (name.length < 2) return NextResponse.json({ error: 'Please add your name.' }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: 'Please add a valid email.' }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ error: 'Message is too short.' }, { status: 400 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `tech//site contact: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[contact] Resend error:', res.status, errText.slice(0, 300));
    return NextResponse.json({ error: 'Could not send — please try again later.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
