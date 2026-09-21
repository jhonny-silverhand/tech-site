import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Server Component / Route Handler client, bound to the visitor's own
 * cookies. Subject to Row Level Security — this is how public pages read
 * published posts and how a signed-in user's own dashboard reads their
 * drafts server-side.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies — safe
            // to ignore since middleware isn't refreshing sessions here.
          }
        },
      },
    }
  );
}

/**
 * Service-role client. BYPASSES Row Level Security entirely — this is what
 * gives the single admin account full control over every user's posts.
 *
 * Only ever import this inside app/api/admin/** route handlers, after
 * verifying the admin session cookie with lib/auth.ts. Never import it in
 * a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
