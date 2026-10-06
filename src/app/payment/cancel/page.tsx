import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <div className="bg-chalk-100 flex min-h-screen items-center justify-center px-5">
      <div className="border-ink-100 w-full max-w-md rounded-sm border bg-white p-8 text-center">
        <XCircle className="text-alert-600 mx-auto h-12 w-12" />
        <h1 className="font-display text-ink-900 mt-4 text-xl font-semibold">
          Payment {status === 'cancelled' ? 'cancelled' : 'failed'}
        </h1>
        <p className="text-ink-500 mt-2 text-sm">
          No charge was made. You can try paying again from your shipment&apos;s detail page
          whenever you&apos;re ready.
        </p>
        <div className="mt-6">
          <Button asChild variant="signal">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
