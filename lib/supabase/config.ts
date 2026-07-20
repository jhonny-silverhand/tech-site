/**
 * Client-safe check — only reads NEXT_PUBLIC_ env vars (inlined at build
 * time), so this file has zero server-only dependencies and can be
 * imported from both Server Components and 'use client' components.
 * Keep it that way: don't import fs, next/headers, etc. into this file.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
