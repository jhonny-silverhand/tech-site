import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminPassword, createAdminSession, adminEmailConfigured, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (String(email).toLowerCase().trim() !== adminEmailConfigured().toLowerCase()) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const ok = await verifyAdminPassword(String(password || ''));
    if (!ok) {
      const hint = !process.env.ADMIN_PASSWORD_HASH_B64 ? ' (ADMIN_PASSWORD_HASH_B64 is not set — run `npm run hash-password <pw>`)' : '';
      return NextResponse.json({ error: `Invalid credentials${hint}` }, { status: 401 });
    }
    const token = await createAdminSession(adminEmailConfigured());
    const store = await cookies();
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Login failed' }, { status: 500 });
  }
}
