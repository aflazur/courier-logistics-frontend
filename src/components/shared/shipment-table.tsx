import Link from 'next/link';
import { ShipmentStatusBadge } from './status-badge';
import { EmptyState } from './empty-state';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Shipment } from '@/types/api';
import type { ReactNode } from 'react';

export function ShipmentTable({
  shipments,
  detailBasePath,
  renderActions,
}: {
  shipments: Shipment[];
  detailBasePath: string;
  renderActions?: (shipment: Shipment) => ReactNode;
}) {
  if (shipments.length === 0) {
    return (
      <EmptyState
        title="No shipments found"
        description="Nothing matches the current filters yet."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-ink-100 text-ink-500 border-b text-left font-mono text-xs tracking-wide uppercase">
            <th className="px-5 py-3 font-medium">Tracking</th>
            <th className="px-5 py-3 font-medium">Recipient</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Fee</th>
            <th className="px-5 py-3 font-medium">Created</th>
            {renderActions && <th className="px-5 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="border-ink-100 hover:bg-chalk-100 border-b last:border-0">
              <td className="px-5 py-3">
                <Link
                  href={`${detailBasePath}/${s.id}`}
                  className="text-ink-900 hover:text-signal-600 font-mono text-xs"
                >
                  {s.trackingCode}
                </Link>
              </td>
              <td className="text-ink-700 px-5 py-3">{s.recipientName}</td>
              <td className="px-5 py-3">
                <ShipmentStatusBadge status={s.status} />
              </td>
              <td className="text-ink-700 px-5 py-3 font-mono">{formatCurrency(s.deliveryFee)}</td>
              <td className="text-ink-500 px-5 py-3">{formatDate(s.createdAt)}</td>
              {renderActions && <td className="px-5 py-3 text-right">{renderActions(s)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
