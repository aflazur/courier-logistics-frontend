import type { Hub } from '@/types/api';
import { BACKEND_URL } from '@/lib/config';

export const HUBS_PER_PAGE = 8; // 2 rows of 4 on desktop

export type HubSort = 'name-asc' | 'name-desc' | 'city-asc' | 'zone-asc';

export const SORT_OPTIONS: { value: HubSort; label: string }[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'city-asc', label: 'City (A-Z)' },
  { value: 'zone-asc', label: 'Zone (A-Z)' },
];

/** Public endpoint, no auth needed. Cached for 5 minutes like the backend's own list cache. */
export async function fetchHubs(): Promise<Hub[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/hubs`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return ((await res.json()) as { data?: Hub[] }).data ?? [];
  } catch {
    return [];
  }
}

export async function fetchHub(id: string): Promise<Hub | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/hubs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return ((await res.json()) as { data?: Hub }).data ?? null;
  } catch {
    return null;
  }
}

export interface HubQuery {
  q: string;
  city: string;
  zone: string;
  sort: HubSort;
  page: number;
}

export function parseQuery(sp: Record<string, string | string[] | undefined>): HubQuery {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
  const sort = one(sp.sort);
  const page = Number.parseInt(one(sp.page), 10);
  return {
    q: one(sp.q).trim().slice(0, 80),
    city: one(sp.city),
    zone: one(sp.zone),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as HubSort) : 'name-asc',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function applyQuery(hubs: Hub[], query: HubQuery) {
  const needle = query.q.toLowerCase();
  const filtered = hubs.filter(
    (h) =>
      (!query.city || h.city === query.city) &&
      (!query.zone || h.zone === query.zone) &&
      (!needle ||
        [h.name, h.city, h.zone, h.address].some((f) => f.toLowerCase().includes(needle))),
  );

  const [field, dir] = query.sort.split('-') as ['name' | 'city' | 'zone', 'asc' | 'desc'];
  filtered.sort((a, b) => a[field].localeCompare(b[field]) * (dir === 'desc' ? -1 : 1));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / HUBS_PER_PAGE));
  const page = Math.min(query.page, totalPages);
  const items = filtered.slice((page - 1) * HUBS_PER_PAGE, page * HUBS_PER_PAGE);
  return { items, total, totalPages, page };
}
