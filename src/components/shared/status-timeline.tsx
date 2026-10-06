import { ShipmentStatusBadge } from './status-badge';
import { formatDate } from '@/lib/utils';
import type { ShipmentStatusHistoryEntry } from '@/types/api';

export function StatusTimeline({ history }: { history: ShipmentStatusHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-ink-500 text-sm">No status history yet.</p>;
  }

  return (
    <ol className="space-y-0">
      {history.map((entry, i) => (
        <li key={entry.id} className="relative pb-6 pl-6 last:pb-0">
          {i !== history.length - 1 && (
            <span className="bg-ink-100 absolute top-3 bottom-0 left-[5px] w-px" />
          )}
          <span className="bg-signal-500 absolute top-1.5 left-0 h-2.5 w-2.5 rounded-full" />
          <div className="flex flex-wrap items-center gap-2">
            <ShipmentStatusBadge status={entry.toStatus} />
            <span className="text-ink-400 font-mono text-xs">{formatDate(entry.createdAt)}</span>
          </div>
          {entry.note && <p className="text-ink-600 mt-1 text-sm">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}
