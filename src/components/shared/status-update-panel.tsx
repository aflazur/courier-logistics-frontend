'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUpdateShipmentStatus } from '@/hooks/use-shipments';
import { ALLOWED_TRANSITIONS } from '@/lib/shipment-transitions';
import type { ShipmentStatus } from '@/types/api';

export function StatusUpdatePanel({
  shipmentId,
  currentStatus,
}: {
  shipmentId: string;
  currentStatus: ShipmentStatus;
}) {
  const [nextStatus, setNextStatus] = useState<ShipmentStatus | ''>('');
  const [note, setNote] = useState('');
  const updateStatus = useUpdateShipmentStatus(shipmentId);

  const options = ALLOWED_TRANSITIONS[currentStatus];

  if (options.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-ink-500 text-sm">This shipment has reached a final state.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!nextStatus) return;
    await updateStatus.mutateAsync({ status: nextStatus, note: note || undefined });
    setNextStatus('');
    setNote('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={nextStatus} onValueChange={(v) => setNextStatus(v as ShipmentStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose next status" />
          </SelectTrigger>
          <SelectContent>
            {options.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <Button
          variant="signal"
          className="w-full"
          disabled={!nextStatus || updateStatus.isPending}
          onClick={handleSubmit}
        >
          {updateStatus.isPending ? 'Updating...' : 'Update status'}
        </Button>
      </CardContent>
    </Card>
  );
}
