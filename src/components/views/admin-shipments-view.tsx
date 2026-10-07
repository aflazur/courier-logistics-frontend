'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ShipmentFilterBar } from '@/components/shared/filter-bar';
import { ShipmentTable } from '@/components/shared/shipment-table';
import { Pagination } from '@/components/shared/pagination';
import { AssignCourierDialog } from '@/components/admin/assign-courier-dialog';
import { useShipments } from '@/hooks/use-shipments';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminShipmentsView() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status') ?? undefined;
  const search = searchParams.get('search') ?? undefined;

  const { data, isLoading } = useShipments({ page, limit: 10, status, search }, 'admin');

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Manage shipments</h2>
        <p className="text-ink-500 text-sm">
          Assign couriers and review every shipment in the system.
        </p>
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
            <ShipmentTable
              shipments={data?.data ?? []}
              detailBasePath="/admin/manage"
              renderActions={(s) =>
                !s.courierId && s.status === 'PENDING' ? (
                  <AssignCourierDialog shipmentId={s.id} />
                ) : (
                  <span className="text-ink-400 text-xs">{s.courierId ? 'Assigned' : '—'}</span>
                )
              }
            />
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
