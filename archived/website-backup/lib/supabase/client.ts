import { createBrowserClient } from '@supabase/ssr';

/**
 * Client-side Supabase instance, used from 'use client' components for:
 * - user signup / login (Supabase Auth)
 * - a signed-in user reading/writing their OWN posts (enforced by Row
 *   Level Security in Guides/sql/schema.sql — this key can never see or
 *   touch another user's drafts)
 *
 * Only call this where NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are known to be
 * set — gate on isSupabaseConfigured() from lib/data.ts first.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
