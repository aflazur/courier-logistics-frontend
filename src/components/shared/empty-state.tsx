import type { LucideIcon } from 'lucide-react';
import { PackageSearch } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-ink-100 rounded-full p-4">
        <Icon className="text-ink-500 h-6 w-6" />
      </div>
      <div>
        <p className="font-display text-ink-900 font-medium">{title}</p>
        {description && <p className="text-ink-500 mt-1 max-w-xs text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
