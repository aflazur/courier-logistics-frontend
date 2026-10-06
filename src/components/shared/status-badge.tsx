import { Badge } from '@/components/ui/badge';
import type { ShipmentStatus, PaymentStatus } from '@/types/api';

const SHIPMENT_STATUS_STYLE: Record<ShipmentStatus, 'neutral' | 'signal' | 'success' | 'alert'> = {
  PENDING: 'neutral',
  PICKUP_SCHEDULED: 'signal',
  PICKED_UP: 'signal',
  AT_ORIGIN_HUB: 'signal',
  IN_TRANSIT: 'signal',
  AT_DESTINATION_HUB: 'signal',
  OUT_FOR_DELIVERY: 'signal',
  DELIVERED: 'success',
  FAILED_DELIVERY: 'alert',
  RETURNED: 'alert',
  CANCELLED: 'alert',
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, 'neutral' | 'signal' | 'success' | 'alert'> = {
  PENDING: 'signal',
  PAID: 'success',
  FAILED: 'alert',
  CANCELLED: 'alert',
  REFUNDED: 'neutral',
};

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  return <Badge variant={SHIPMENT_STATUS_STYLE[status]}>{status.replace(/_/g, ' ')}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_STATUS_STYLE[status]}>{status}</Badge>;
}
