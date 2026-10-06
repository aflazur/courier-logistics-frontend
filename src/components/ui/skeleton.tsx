import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-ink-100 animate-pulse rounded-sm', className)} {...props} />;
}

export { Skeleton };
