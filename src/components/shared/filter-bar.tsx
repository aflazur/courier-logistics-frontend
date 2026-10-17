'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import type { ShipmentStatus } from '@/types/api';

const STATUSES: ShipmentStatus[] = [
  'PENDING',
  'PICKUP_SCHEDULED',
  'PICKED_UP',
  'AT_ORIGIN_HUB',
  'IN_TRANSIT',
  'AT_DESTINATION_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED_DELIVERY',
  'RETURNED',
  'CANCELLED',
];

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'weightKg:desc', label: 'Heaviest first' },
  { value: 'weightKg:asc', label: 'Lightest first' },
  { value: 'deliveryFee:desc', label: 'Highest fee' },
  { value: 'deliveryFee:asc', label: 'Lowest fee' },
] as const;

/** Turns the `sort` URL param ("field:order") into API params; unknown values fall back to default. */
export function parseShipmentSort(sort: string | null | undefined): {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} {
  const match = SORT_OPTIONS.find((o) => o.value === sort);
  if (!match) return {};
  const [sortBy, sortOrder] = match.value.split(':');
  return { sortBy, sortOrder: sortOrder as 'asc' | 'desc' };
}

export function ShipmentFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const setParam = (key: string, value: string, emptyValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === emptyValue) params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-ink-100 flex flex-col gap-3 border-b p-5 sm:flex-row sm:flex-wrap">
      <div className="relative flex-1 sm:min-w-64">
        <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search by tracking code or recipient..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select
        defaultValue={searchParams.get('status') ?? 'ALL'}
        onValueChange={(v) => setParam('status', v, 'ALL')}
      >
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get('sort') ?? 'createdAt:desc'}
        onValueChange={(v) => setParam('sort', v, 'createdAt:desc')}
      >
        <SelectTrigger className="sm:w-48" aria-label="Sort shipments">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        aria-label="Created from"
        title="Created from"
        className="sm:w-40"
        value={searchParams.get('from') ?? ''}
        max={searchParams.get('to') ?? undefined}
        onChange={(e) => setParam('from', e.target.value, '')}
      />
      <Input
        type="date"
        aria-label="Created to"
        title="Created to"
        className="sm:w-40"
        value={searchParams.get('to') ?? ''}
        min={searchParams.get('from') ?? undefined}
        onChange={(e) => setParam('to', e.target.value, '')}
      />
    </div>
  );
}
