'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Building2, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { HubFormDialog } from '@/components/admin/hub-form-dialog';
import { DeleteHubButton } from '@/components/admin/delete-hub-button';
import { useDebounce } from '@/hooks/use-debounce';
import { useHubs } from '@/hooks/use-hubs';

export function HubsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isLoading, isError, refetch } = useHubs();

  // Search lives in the URL (?search=dhaka) so the filtered view can be shared or bookmarked.
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debounced = useDebounce(search);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set('search', debounced);
    else params.delete('search');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const query = (searchParams.get('search') ?? '').toLowerCase();
  const hubs = useMemo(() => {
    const all = data?.data ?? [];
    if (!query) return all;
    return all.filter((h) =>
      [h.name, h.city, h.zone, h.address].some((v) => v.toLowerCase().includes(query)),
    );
  }, [data, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-ink-900 text-lg font-semibold">Hubs</h2>
          <p className="text-ink-500 text-sm">
            Sorting and dispatch points. Customers choose from these when booking.
          </p>
        </div>
        <HubFormDialog />
      </div>

      <Card>
        <div className="border-ink-100 border-b p-4">
          <div className="relative max-w-sm">
            <Search className="text-ink-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, city, zone or address"
              aria-label="Search hubs"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Could not load hubs"
            description="Check your connection and try again."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : hubs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={query ? 'No hubs match your search' : 'No hubs yet'}
            description={
              query
                ? 'Try a different city or zone.'
                : 'Add your first hub so customers can pick one.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-ink-100 text-ink-500 border-b font-mono text-xs tracking-wide uppercase">
                  <th className="px-5 py-3 font-medium">Hub</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Zone</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hubs.map((h) => (
                  <tr key={h.id} className="border-ink-100 border-b last:border-0">
                    <td className="text-ink-900 px-5 py-3 font-medium">{h.name}</td>
                    <td className="px-5 py-3">{h.city}</td>
                    <td className="px-5 py-3">{h.zone}</td>
                    <td className="text-ink-500 px-5 py-3">{h.address}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <HubFormDialog hub={h} />
                        <DeleteHubButton hub={h} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
