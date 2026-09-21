/**
 * Races a promise against a timeout, returning the fallback if the
 * timeout wins. Used everywhere this app calls Supabase from a Server
 * Component that sits on a page's critical path (Header, post listings,
 * the bookmark/history checks on article pages) — without this, an
 * unreachable or misconfigured Supabase project doesn't fail cleanly, it
 * makes every single page slow (confirmed: 7+ seconds per load) while
 * the underlying fetch hangs. This doesn't cancel that underlying
 * request, it just stops the page waiting on it — the practical fix for
 * the user-facing symptom, even though the request may still resolve in
 * the background.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);
}

export const SUPABASE_CALL_TIMEOUT_MS = 2500;
