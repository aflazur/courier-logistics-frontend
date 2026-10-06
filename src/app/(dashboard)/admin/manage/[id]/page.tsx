import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { ShipmentDetailCard } from '@/components/shared/shipment-detail-card';
import { StatusUpdatePanel } from '@/components/shared/status-update-panel';
import { AssignCourierDialog } from '@/components/admin/assign-courier-dialog';
import type { Shipment } from '@/types/api';

export default async function AdminShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: shipment } = await serverFetch<Shipment>(`/shipments/${id}`);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/manage"
        className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to shipments
      </Link>

      <ShipmentDetailCard shipment={shipment}>
        {!shipment.courierId && shipment.status === 'PENDING' && (
          <AssignCourierDialog shipmentId={shipment.id} />
        )}
        <StatusUpdatePanel shipmentId={shipment.id} currentStatus={shipment.status} />
      </ShipmentDetailCard>
    </div>
  );
}
