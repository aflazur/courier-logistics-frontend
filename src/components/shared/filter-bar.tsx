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

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'ALL') params.delete('status');
    else params.set('status', status);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-ink-100 flex flex-col gap-3 border-b p-5 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search by tracking code or recipient..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select defaultValue={searchParams.get('status') ?? 'ALL'} onValueChange={setStatus}>
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
    </div>
  );
}
