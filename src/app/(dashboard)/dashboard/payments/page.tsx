import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CustomerPaymentsView } from '@/components/views/customer-payments-view';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export const metadata: Metadata = { title: 'Payments' };

// Server component shell (static metadata + Suspense). Interactive, URL-driven data lives in
// the client view so filtering, sorting and pagination stay in the query string.
export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CustomerPaymentsView />
    </Suspense>
  );
}
