'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInitiatePayment } from '@/hooks/use-payments';
import { formatCurrency } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import type { Shipment } from '@/types/api';

export function PaymentPanel({ shipment }: { shipment: Shipment }) {
  const initiatePayment = useInitiatePayment();

  if (shipment.payment?.status === 'PAID') return null;

  const handlePay = async () => {
    const res = await initiatePayment.mutateAsync({ shipmentId: shipment.id });
    // Full navigation, not a client-side route - this hands off to SSLCommerz's hosted
    // checkout page entirely, outside our Next.js app.
    window.location.href = res.data.gatewayUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay delivery fee</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-ink-500 text-sm">
          Pickup is scheduled automatically once this fee is confirmed as paid.
        </p>
        <Button
          variant="signal"
          className="w-full"
          disabled={initiatePayment.isPending}
          onClick={handlePay}
        >
          <CreditCard className="h-4 w-4" />
          {initiatePayment.isPending
            ? 'Starting checkout...'
            : `Pay ${formatCurrency(shipment.deliveryFee)}`}
        </Button>
      </CardContent>
    </Card>
  );
}
