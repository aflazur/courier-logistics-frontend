'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCancelShipment } from '@/hooks/use-shipments';

export function CancelShipmentButton({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const cancelShipment = useCancelShipment();

  const handleCancel = async () => {
    if (!confirm('Cancel this shipment? This cannot be undone.')) return;
    await cancelShipment.mutateAsync(shipmentId);
    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      className="w-full"
      disabled={cancelShipment.isPending}
      onClick={handleCancel}
    >
      {cancelShipment.isPending ? 'Cancelling...' : 'Cancel shipment'}
    </Button>
  );
}
