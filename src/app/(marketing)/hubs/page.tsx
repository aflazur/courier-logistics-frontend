import type { Metadata } from 'next';
import { SearchX } from 'lucide-react';
import { HubCard } from '@/components/hubs/hub-card';
import { HubFilters } from '@/components/hubs/hub-filters';
import { HubPagination } from '@/components/hubs/hub-pagination';
import { applyQuery, fetchHubs, parseQuery } from '@/lib/hubs';

export const metadata: Metadata = {
  title: 'Explore Hubs',
  description: 'Browse the Courier & Logistics hub network by city and zone.',
};

export default async function HubsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const hubs = await fetchHubs();

  const cities = [...new Set(hubs.map((h) => h.city))].sort();
  // Zone options follow the selected city so users never pick a combination with no results.
  const zones = [
    ...new Set(hubs.filter((h) => !query.city || h.city === query.city).map((h) => h.zone)),
  ].sort();

  const { items, total, totalPages, page } = applyQuery(hubs, query);

  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.city) params.set('city', query.city);
  if (query.zone) params.set('zone', query.zone);
  if (query.sort !== 'name-asc') params.set('sort', query.sort);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Explore our hubs</h1>
      <p className="text-ink-500 mt-3 max-w-2xl">
        Every parcel moves through an origin hub and a destination hub. Browse the live network by
        city and zone to see where we operate.
      </p>

      <div className="mt-8">
        <HubFilters cities={cities} zones={zones} />
      </div>

      <p className="text-ink-500 mt-6 text-sm" role="status">
        {total} {total === 1 ? 'hub' : 'hubs'} found
      </p>

      {hubs.length === 0 ? (
        <p className="border-ink-100 text-ink-500 mt-4 rounded-sm border bg-white p-10 text-center text-sm">
          The hub network could not be loaded right now. Please try again in a moment.
        </p>
      ) : items.length === 0 ? (
        <div className="border-ink-100 mt-4 rounded-sm border bg-white p-10 text-center">
          <SearchX className="text-ink-500 mx-auto h-6 w-6" />
          <p className="text-ink-900 mt-3 text-sm font-medium">No hubs match your filters</p>
          <p className="text-ink-500 mt-1 text-sm">Try a different search, city or zone.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((h) => (
            <li key={h.id}>
              <HubCard hub={h} />
            </li>
          ))}
        </ul>
      )}

      <HubPagination page={page} totalPages={totalPages} total={total} params={params} />
    </div>
  );
}
