import { withTimeout } from '../with-timeout';

const RATES_CACHE = new Map<string, { rate: number; at: number }>();
const CACHE_MS = 6 * 60 * 60 * 1000;

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'] as const;

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ converted: number; rate: number; source: 'live' | 'fallback' }> {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  if (f === t) return { converted: amount, rate: 1, source: 'fallback' };

  const cacheKey = `${f}:${t}`;
  const cached = RATES_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return { converted: amount * cached.rate, rate: cached.rate, source: 'live' };
  }

  try {
    const res = await withTimeout(
      fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(f)}`),
      8000,
      'currency API'
    );
    if (!res.ok) throw new Error(`currency API ${res.status}`);
    const json = (await res.json()) as { rates?: Record<string, number> };
    const rate = json.rates?.[t];
    if (!rate) throw new Error(`no rate for ${t}`);
    RATES_CACHE.set(cacheKey, { rate, at: Date.now() });
    return { converted: amount * rate, rate, source: 'live' };
  } catch {
    // Static fallback table (approx) so compare pages never break offline.
    const fallback: Record<string, number> = {
      'INR:USD': 0.012,
      'USD:INR': 83.5,
      'INR:EUR': 0.011,
      'EUR:INR': 90.5,
      'INR:GBP': 0.0094,
      'GBP:INR': 106,
      'USD:EUR': 0.92,
      'EUR:USD': 1.09,
    };
    const rate = fallback[cacheKey] ?? 1;
    return { converted: amount * rate, rate, source: 'fallback' };
  }
}
