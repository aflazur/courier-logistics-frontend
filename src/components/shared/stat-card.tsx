import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-sm border p-5',
        accent ? 'bg-ink-900 border-ink-900 text-chalk-50' : 'border-ink-100 text-ink-900 bg-white',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'font-mono text-xs tracking-wide uppercase',
            accent ? 'text-ink-300' : 'text-ink-500',
          )}
        >
          {label}
        </span>
        <Icon className={cn('h-4 w-4', accent ? 'text-signal-500' : 'text-ink-400')} />
      </div>
      <span className="font-display text-2xl sm:text-3xl font-semibold break-words">{value}</span>
    </div>
  );
}
