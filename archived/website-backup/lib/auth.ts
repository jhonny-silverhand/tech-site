import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'tech_site_admin_session';
const SESSION_LENGTH = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set. Add it to .env.local — see Guides/00-how-to-run.md.'
    );
  }
  return new TextEncoder().encode(secret);
}

/** Compares a submitted password against ADMIN_PASSWORD_HASH_B64 from env. */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const encoded = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!encoded) return false;
  const hash = Buffer.from(encoded, 'base64').toString('utf-8');
  return bcrypt.compare(password, hash);
}

/** Signs a short-lived JWT for the admin session cookie. */
export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_LENGTH)
    .sign(getSecret());
}

/** Verifies a session token. Returns true only for a valid, unexpired admin token. */
export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

/** Server-side check for use in layouts, pages, and route handlers. */
export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
