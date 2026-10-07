'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { useAuditLogs } from '@/hooks/use-admin';
import { formatDate } from '@/lib/utils';
import { FileClock } from 'lucide-react';

export function AdminAuditLogsView() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const { data, isLoading } = useAuditLogs({ page, limit: 15 });

  const logs = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Audit logs</h2>
        <p className="text-ink-500 text-sm">Every administrative action, in order.</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={FileClock}
            title="No audit entries yet"
            description="Actions like role changes and status updates will show up here."
          />
        ) : (
          <>
            <ul className="divide-ink-100 divide-y">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-ink-900 font-mono text-sm font-medium">{log.action}</p>
                    <p className="text-ink-500 mt-0.5 text-xs">
                      {log.entityType} &middot; {log.actor?.name ?? log.actorId}
                    </p>
                  </div>
                  <span className="text-ink-400 font-mono text-xs whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
            {data?.meta && <Pagination meta={data.meta} />}
          </>
        )}
      </Card>
    </div>
  );
}
