import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentStatusBadge, PaymentStatusBadge } from './status-badge';
import { StatusTimeline } from './status-timeline';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Shipment } from '@/types/api';

export function ShipmentDetailCard({
  shipment,
  children,
}: {
  shipment: Shipment;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="font-mono">{shipment.trackingCode}</CardTitle>
              <p className="text-ink-500 mt-1 text-sm">{shipment.recipientName}</p>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </CardHeader>
          <CardContent className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Pickup</p>
              <p className="text-ink-800 mt-1">{shipment.pickupAddress}</p>
            </div>
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Delivery</p>
              <p className="text-ink-800 mt-1">{shipment.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Recipient phone</p>
              <p className="text-ink-800 mt-1">{shipment.recipientPhone}</p>
            </div>
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Weight</p>
              <p className="text-ink-800 mt-1">{shipment.weightKg} kg</p>
            </div>
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Delivery fee</p>
              <p className="text-ink-800 mt-1 font-semibold">
                {formatCurrency(shipment.deliveryFee)}
              </p>
            </div>
            <div>
              <p className="text-ink-400 font-mono text-xs uppercase">Booked</p>
              <p className="text-ink-800 mt-1">{formatDate(shipment.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline history={shipment.statusHistory ?? []} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {shipment.payment && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Payment</CardTitle>
              <PaymentStatusBadge status={shipment.payment.status} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Amount</span>
                <span className="text-ink-800 font-mono">
                  {formatCurrency(shipment.payment.amount)}
                </span>
              </div>
              {shipment.payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-ink-500">Paid at</span>
                  <span className="text-ink-800">{formatDate(shipment.payment.paidAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {shipment.courier?.user && (
          <Card>
            <CardHeader>
              <CardTitle>Courier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-ink-800 font-medium">{shipment.courier.user.name}</p>
              <p className="text-ink-500">{shipment.courier.user.phone ?? 'No phone on file'}</p>
            </CardContent>
          </Card>
        )}

        {children}
      </div>
    </div>
  );
}
