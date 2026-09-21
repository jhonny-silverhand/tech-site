import { NextResponse } from 'next/server';
import { convertCurrency, SUPPORTED_CURRENCIES } from '@/lib/shopping/currency';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amount = Number(searchParams.get('amount') || '0');
  const from = (searchParams.get('from') || 'INR').toUpperCase();
  const to = (searchParams.get('to') || 'USD').toUpperCase();
  if (!amount || amount <= 0) return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
  if (!SUPPORTED_CURRENCIES.includes(from as never) || !SUPPORTED_CURRENCIES.includes(to as never)) {
    return NextResponse.json({ error: `Supported: ${SUPPORTED_CURRENCIES.join(', ')}` }, { status: 400 });
  }
  const result = await convertCurrency(amount, from, to);
  return NextResponse.json({ amount, from, to, ...result });
}
