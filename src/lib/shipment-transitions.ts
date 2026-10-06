import type { ShipmentStatus } from '@/types/api';

// Mirrors courier-backend/src/modules/shipment/shipment.stateMachine.ts exactly. Keeping this in
// sync with the backend isn't what enforces the rule (the backend re-checks independently and
// is the real authority - this just avoids offering an update the backend would reject anyway),
// but it means the UI only ever shows valid next steps instead of a dead-end 400 error.
export const ALLOWED_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDING: ['PICKUP_SCHEDULED', 'CANCELLED'],
  PICKUP_SCHEDULED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['AT_ORIGIN_HUB', 'CANCELLED'],
  AT_ORIGIN_HUB: ['IN_TRANSIT'],
  IN_TRANSIT: ['AT_DESTINATION_HUB'],
  AT_DESTINATION_HUB: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY'],
  FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED'],
  DELIVERED: [],
  RETURNED: [],
  CANCELLED: [],
};
