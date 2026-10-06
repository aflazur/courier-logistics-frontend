import Link from 'next/link';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; shipmentId?: string }>;
}) {
  const { status, shipmentId } = await searchParams;
  const paid = status === 'paid';
  const errored = status === 'error';

  return (
    <div className="bg-chalk-100 flex min-h-screen items-center justify-center px-5">
      <div className="border-ink-100 w-full max-w-md rounded-sm border bg-white p-8 text-center">
        {paid ? (
          <CheckCircle2 className="text-route-600 mx-auto h-12 w-12" />
        ) : errored ? (
          <AlertTriangle className="text-signal-600 mx-auto h-12 w-12" />
        ) : (
          <XCircle className="text-alert-600 mx-auto h-12 w-12" />
        )}

        <h1 className="font-display text-ink-900 mt-4 text-xl font-semibold">
          {paid
            ? 'Payment confirmed'
            : errored
              ? "Couldn't confirm payment"
              : 'Payment not completed'}
        </h1>
        <p className="text-ink-500 mt-2 text-sm">
          {paid
            ? 'Your delivery fee has been verified and your shipment is scheduled for pickup.'
            : errored
              ? 'We couldn\u2019t verify this transaction. If money was deducted, it will be reconciled automatically - check your shipment status shortly.'
              : 'The payment gateway reported this transaction as unsuccessful. You can retry from your shipment\u2019s detail page.'}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {shipmentId && (
            <Button asChild variant="signal">
              <Link href={`/dashboard/shipments/${shipmentId}`}>View shipment</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
