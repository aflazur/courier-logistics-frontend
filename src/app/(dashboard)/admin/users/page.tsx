import type { Metadata } from 'next';
import { Suspense } from 'react';
import { UsersManager } from '@/components/admin/users-manager';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export const metadata: Metadata = { title: 'Manage users' };

// Server component shell: the interactive table is a client island.
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersManager />
    </Suspense>
  );
}
