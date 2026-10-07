import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CustomerShipmentsView } from '@/components/views/customer-shipments-view';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export const metadata: Metadata = { title: 'My shipments' };

// Server component shell (static metadata + Suspense). Interactive, URL-driven data lives in
// the client view so filtering, sorting and pagination stay in the query string.
export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CustomerShipmentsView />
    </Suspense>
  );
}
