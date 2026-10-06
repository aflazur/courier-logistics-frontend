import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const tran_id = form.get('tran_id')?.toString();

  if (tran_id) {
    await fetch(`${BACKEND_URL}/payments/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tran_id }),
    }).catch(() => undefined);
  }

  const redirectUrl = new URL('/payment/cancel', req.url);
  redirectUrl.searchParams.set('status', 'cancelled');
  return NextResponse.redirect(redirectUrl, 303);
}
