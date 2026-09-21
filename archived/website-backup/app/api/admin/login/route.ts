import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSessionToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  if (!expectedEmail || !process.env.ADMIN_PASSWORD_HASH_B64) {
    return NextResponse.json(
      { error: 'Admin login is not configured yet. See Guides/00-how-to-run.md.' },
      { status: 500 }
    );
  }

  const emailMatches = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  const passwordMatches = await verifyAdminPassword(password);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
