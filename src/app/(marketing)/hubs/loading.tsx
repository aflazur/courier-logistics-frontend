import { HubCardSkeleton } from '@/components/hubs/hub-card';

export default function HubsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16" role="status" aria-label="Loading hubs">
      <div className="bg-ink-100 h-8 w-64 animate-pulse rounded-sm" />
      <div className="bg-ink-100 mt-4 h-4 w-full max-w-xl animate-pulse rounded-sm" />
      <div className="bg-ink-100 mt-8 h-10 w-full animate-pulse rounded-sm" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <HubCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
