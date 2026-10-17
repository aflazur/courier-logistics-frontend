import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function href(base: URLSearchParams, page: number) {
  const params = new URLSearchParams(base);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const qs = params.toString();
  return qs ? `/hubs?${qs}` : '/hubs';
}

const BTN =
  'border-ink-300 text-ink-900 hover:bg-ink-100 inline-flex h-8 items-center gap-1 rounded-sm border px-3 text-xs font-medium';

/** Link-based pagination: works without client JS and keeps filters in the URL. */
export function HubPagination({
  page,
  totalPages,
  total,
  params,
}: {
  page: number;
  totalPages: number;
  total: number;
  params: URLSearchParams;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-between gap-3"
      aria-label="Pagination"
    >
      <p className="text-ink-500 font-mono text-xs">
        Page {page} of {totalPages} &middot; {total} hubs
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {page > 1 ? (
          <Link href={href(params, page - 1)} className={BTN}>
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Link>
        ) : (
          <span className={cn(BTN, 'pointer-events-none opacity-50')} aria-disabled="true">
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </span>
        )}
        {pages.map((p) => (
          <Link
            key={p}
            href={href(params, p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(BTN, 'justify-center px-0', 'w-8', p === page && 'bg-ink-900 text-chalk-50 hover:bg-ink-800')}
          >
            {p}
          </Link>
        ))}
        {page < totalPages ? (
          <Link href={href(params, page + 1)} className={BTN}>
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className={cn(BTN, 'pointer-events-none opacity-50')} aria-disabled="true">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
