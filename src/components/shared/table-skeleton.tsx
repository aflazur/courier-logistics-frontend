import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="border-ink-100 space-y-3 rounded-sm border bg-white p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
