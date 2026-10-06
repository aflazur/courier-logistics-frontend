'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShipmentFilterBar } from '@/components/shared/filter-bar';
import { ShipmentTable } from '@/components/shared/shipment-table';
import { Pagination } from '@/components/shared/pagination';
import { useShipments } from '@/hooks/use-shipments';

export default function ProviderDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status') ?? undefined;
  const search = searchParams.get('search') ?? undefined;

  const { data, isLoading } = useShipments({ page, limit: 10, status, search }, 'assigned');

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">My deliveries</h2>
        <p className="text-ink-500 text-sm">Shipments currently assigned to you.</p>
      </div>

      <Card>
        <ShipmentFilterBar />
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <>
            <ShipmentTable shipments={data?.data ?? []} detailBasePath="/provider/shipments" />
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
