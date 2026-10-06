'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PackagePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShipmentFilterBar } from '@/components/shared/filter-bar';
import { ShipmentTable } from '@/components/shared/shipment-table';
import { Pagination } from '@/components/shared/pagination';
import { useShipments } from '@/hooks/use-shipments';

export default function CustomerDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status') ?? undefined;
  const search = searchParams.get('search') ?? undefined;

  const { data, isLoading } = useShipments({ page, limit: 10, status, search }, 'mine');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-ink-900 text-lg font-semibold">My shipments</h2>
          <p className="text-ink-500 text-sm">Track every parcel you&apos;ve booked.</p>
        </div>
        <Button asChild variant="signal">
          <Link href="/dashboard/shipments/new">
            <PackagePlus className="h-4 w-4" /> New shipment
          </Link>
        </Button>
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
            <ShipmentTable shipments={data?.data ?? []} detailBasePath="/dashboard/shipments" />
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
