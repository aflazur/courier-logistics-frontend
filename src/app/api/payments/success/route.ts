import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

// SSLCommerz POSTs form-encoded data directly to whatever SSLCZ_SUCCESS_URL is configured to on
// the backend. For the frontend to show its own confirmation page (rather than the raw JSON the
// backend returns), that env var is pointed here instead of straight at the backend. This route
// receives the gateway's POST, hands tran_id/val_id to the backend's real verification endpoint
// (which independently re-checks the transaction with SSLCommerz before marking anything paid -
// see courier-backend/src/modules/payment/payment.service.ts), and then redirects the browser
// to a GET page for display. The verification itself still happens entirely on the backend;
// this route is just a relay + UX layer, never trusting the gateway's redirect on its own.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const tran_id = form.get('tran_id')?.toString();
  const val_id = form.get('val_id')?.toString();

  const redirectUrl = new URL('/payment/success', req.url);

  if (!tran_id || !val_id) {
    redirectUrl.searchParams.set('status', 'error');
    return NextResponse.redirect(redirectUrl, 303);
  }

  try {
    const res = await fetch(`${BACKEND_URL}/payments/success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tran_id, val_id }),
    });
    const body = await res.json();

    redirectUrl.searchParams.set(
      'status',
      body.success && body.data?.status === 'PAID' ? 'paid' : 'failed',
    );
    if (body.data?.shipmentId) redirectUrl.searchParams.set('shipmentId', body.data.shipmentId);
  } catch {
    redirectUrl.searchParams.set('status', 'error');
  }

  return NextResponse.redirect(redirectUrl, 303);
}
