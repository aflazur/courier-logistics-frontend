import Link from 'next/link';
import { ArrowRight, MapPin, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubIllustration } from './hub-illustration';
import type { Hub } from '@/types/api';

/** Fixed structure so every card has the same size, radius and layout. */
export function HubCard({ hub }: { hub: Hub }) {
  return (
    <article className="border-ink-100 flex h-full flex-col overflow-hidden rounded-sm border bg-white">
      <div className="h-32 overflow-hidden">
        <HubIllustration id={hub.id} className="h-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-ink-900 line-clamp-1 font-semibold">{hub.name}</h3>
        <p className="text-ink-500 mt-1.5 line-clamp-2 min-h-10 text-sm">{hub.address}</p>
        <dl className="text-ink-700 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">City</dt>
            <MapPin className="text-signal-600 h-3.5 w-3.5" />
            <dd>{hub.city}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Zone</dt>
            <Layers className="text-signal-600 h-3.5 w-3.5" />
            <dd>{hub.zone}</dd>
          </div>
        </dl>
        <Button asChild variant="outline" size="sm" className="mt-5 w-full">
          <Link href={`/hubs/${hub.id}`}>
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function HubCardSkeleton() {
  return (
    <div
      className="border-ink-100 flex h-full flex-col overflow-hidden rounded-sm border bg-white"
      aria-hidden="true"
    >
      <div className="bg-ink-100 h-32 animate-pulse" />
      <div className="flex flex-1 flex-col p-5">
        <div className="bg-ink-100 h-4 w-2/3 animate-pulse rounded-sm" />
        <div className="bg-ink-100 mt-3 h-3 w-full animate-pulse rounded-sm" />
        <div className="bg-ink-100 mt-2 h-3 w-4/5 animate-pulse rounded-sm" />
        <div className="bg-ink-100 mt-5 h-3 w-1/2 animate-pulse rounded-sm" />
        <div className="bg-ink-100 mt-5 h-8 w-full animate-pulse rounded-sm" />
      </div>
    </div>
  );
}
