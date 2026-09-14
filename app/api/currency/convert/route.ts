import { NextResponse } from 'next/server';
import { CurrencyConverter } from '@/lib/shopping/currency';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, from, to = 'INR' } = body;

    if (!amount || !from) {
      return NextResponse.json(
        { error: 'amount and from currency are required' },
        { status: 400 }
      );
    }

    const converter = new (await import('@/lib/shopping/currency')).CurrencyConverter();
    const result = await converter.convert(amount, from, to);

    return NextResponse.json({
      originalAmount: result.originalAmount,
      originalCurrency: result.originalCurrency,
      convertedAmount: result.convertedAmount,
      targetCurrency: result.targetCurrency,
      rate: result.rate,
      rateTimestamp: result.rateTimestamp,
      source: result.source,
      isApproximate: result.isApproximate,
    });
  } catch (err) {
    console.error('[api/currency/convert] Error:', err);
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const from = searchParams.get('from');
  const to = searchParams.get('to') || 'INR';

  if (!amount || !from) {
    return NextResponse.json(
      { error: 'amount and from parameters are required' },
      { status: 400 }
    );
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum)) {
    return NextResponse.json(
      { error: 'invalid amount' },
      { status: 400 }
    );
  }

  const converter = new (await import('@/lib/shopping/currency')).CurrencyConverter();
  const result = await converter.convert(parseFloat(amount), from, to);

  return NextResponse.json({
    originalAmount: result.originalAmount,
    originalCurrency: result.originalCurrency,
    convertedAmount: result.convertedAmount,
    targetCurrency: result.targetCurrency,
    rate: result.rate,
    rateTimestamp: result.rateTimestamp,
    source: result.source,
    isApproximate: result.isApproximate,
  });
}