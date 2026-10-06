'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/api';

export function Pagination({ meta }: { meta: PaginationMeta }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (meta.totalPages <= 1) return null;

  return (
    <div className="border-ink-100 flex items-center justify-between border-t px-5 py-3">
      <p className="text-ink-500 font-mono text-xs">
        Page {meta.page} of {meta.totalPages} &middot; {meta.total} total
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => goToPage(meta.page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => goToPage(meta.page + 1)}
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
