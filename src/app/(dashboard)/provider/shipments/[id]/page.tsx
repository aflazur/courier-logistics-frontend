import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { ShipmentDetailCard } from '@/components/shared/shipment-detail-card';
import { StatusUpdatePanel } from '@/components/shared/status-update-panel';
import type { Shipment } from '@/types/api';

export default async function ProviderShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: shipment } = await serverFetch<Shipment>(`/shipments/${id}`);

  return (
    <div className="space-y-4">
      <Link
        href="/provider"
        className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to deliveries
      </Link>

      <ShipmentDetailCard shipment={shipment}>
        <StatusUpdatePanel shipmentId={shipment.id} currentStatus={shipment.status} />
      </ShipmentDetailCard>
    </div>
  );
}
