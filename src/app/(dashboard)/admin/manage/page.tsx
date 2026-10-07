import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminShipmentsView } from '@/components/views/admin-shipments-view';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export const metadata: Metadata = { title: 'Manage shipments' };

// Server component shell (static metadata + Suspense). Interactive, URL-driven data lives in
// the client view so filtering, sorting and pagination stay in the query string.
export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AdminShipmentsView />
    </Suspense>
  );
}
