import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HubsManager } from '@/components/admin/hubs-manager';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export const metadata: Metadata = { title: 'Manage hubs' };

// Server component shell: the interactive table and dialogs are a client island.
export default function AdminHubsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <HubsManager />
    </Suspense>
  );
}
