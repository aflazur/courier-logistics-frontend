'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { SORT_OPTIONS } from '@/lib/hubs';

const ALL = 'ALL';

export function HubFilters({ cities, zones }: { cities: string[]; zones: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const debounced = useDebounce(search);

  const update = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (debounced === (searchParams.get('q') ?? '')) return;
    update({ q: debounced || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const city = searchParams.get('city') ?? ALL;
  const zone = searchParams.get('zone') ?? ALL;
  const sort = searchParams.get('sort') ?? 'name-asc';
  const active = searchParams.has('q') || searchParams.has('city') || searchParams.has('zone');

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_11rem_11rem_auto]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="text-ink-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          aria-label="Search hubs"
          placeholder="Search by name, area or address..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select
        value={city}
        onValueChange={(v) => update({ city: v === ALL ? null : v, zone: null })}
      >
        <SelectTrigger aria-label="Filter by city">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All cities</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={zone} onValueChange={(v) => update({ zone: v === ALL ? null : v })}>
        <SelectTrigger aria-label="Filter by zone">
          <SelectValue placeholder="Zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All zones</SelectItem>
          {zones.map((z) => (
            <SelectItem key={z} value={z}>
              {z}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => update({ sort: v === 'name-asc' ? null : v })}>
        <SelectTrigger aria-label="Sort hubs">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setSearch('');
            update({ q: null, city: null, zone: null });
          }}
        >
          <X className="h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}
