import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'tech_site_admin_session';
const SESSION_DAYS = 7;

function secret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET || 'dev-secret-change-me-please-1234';
  return new TextEncoder().encode(s);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64 || '';
  if (!b64) return false;
  try {
    const hash = Buffer.from(b64, 'base64').toString('utf8');
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function adminEmailConfigured(): string {
  return process.env.ADMIN_EMAIL || 'admin@techsite.com';
}

export async function createAdminSession(email: string): Promise<string> {
  return await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function isAdminRequest(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminEmail(): Promise<string | null> {
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}
