import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { ShipmentDetailCard } from '@/components/shared/shipment-detail-card';
import { PaymentPanel } from '@/components/shared/payment-panel';
import { CancelShipmentButton } from '@/components/shared/cancel-shipment-button';
import type { Shipment } from '@/types/api';

export default async function CustomerShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: shipment } = await serverFetch<Shipment>(`/shipments/${id}`);

  const cancellable = ['PENDING', 'PICKUP_SCHEDULED', 'PICKED_UP'].includes(shipment.status);

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to shipments
      </Link>

      <ShipmentDetailCard shipment={shipment}>
        <PaymentPanel shipment={shipment} />
        {cancellable && <CancelShipmentButton shipmentId={shipment.id} />}
      </ShipmentDetailCard>
    </div>
  );
}
