'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { PaymentStatusBadge } from '@/components/shared/status-badge';
import { useShipments } from '@/hooks/use-shipments';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const { data, isLoading } = useShipments({ page, limit: 10 }, 'mine');

  const shipments = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Payments</h2>
        <p className="text-ink-500 text-sm">Delivery fee payments across all your shipments.</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : shipments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Book a shipment to see its payment here."
          />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-ink-100 text-ink-500 border-b text-left font-mono text-xs tracking-wide uppercase">
                  <th className="px-5 py-3 font-medium">Tracking</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr
                    key={s.id}
                    className="border-ink-100 hover:bg-chalk-100 border-b last:border-0"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/shipments/${s.id}`}
                        className="hover:text-signal-600 font-mono text-xs"
                      >
                        {s.trackingCode}
                      </Link>
                    </td>
                    <td className="text-ink-700 px-5 py-3 font-mono">
                      {formatCurrency(s.deliveryFee)}
                    </td>
                    <td className="px-5 py-3">
                      {s.payment ? (
                        <PaymentStatusBadge status={s.payment.status} />
                      ) : (
                        <span className="text-ink-400 text-xs">Not initiated</span>
                      )}
                    </td>
                    <td className="text-ink-500 px-5 py-3">
                      {s.payment?.paidAt ? formatDate(s.payment.paidAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
