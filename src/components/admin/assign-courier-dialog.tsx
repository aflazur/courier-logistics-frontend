'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCouriers } from '@/hooks/use-couriers';
import { useAssignCourier } from '@/hooks/use-shipments';

export function AssignCourierDialog({ shipmentId }: { shipmentId: string }) {
  const [open, setOpen] = useState(false);
  const [courierProfileId, setCourierProfileId] = useState('');
  const { data: couriersRes, isLoading } = useCouriers({ isAvailable: true, limit: 50 });
  const assignCourier = useAssignCourier(shipmentId);

  const couriers = couriersRes?.data ?? [];

  const handleAssign = async () => {
    if (!courierProfileId) return;
    await assignCourier.mutateAsync(courierProfileId);
    setOpen(false);
    setCourierProfileId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="signal">
          Assign courier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign a courier</DialogTitle>
          <DialogDescription>Pick an available courier for this shipment.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-ink-500 text-sm">Loading available couriers...</p>
        ) : couriers.length === 0 ? (
          <p className="text-ink-500 text-sm">No couriers are currently available.</p>
        ) : (
          <Select value={courierProfileId} onValueChange={setCourierProfileId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a courier" />
            </SelectTrigger>
            <SelectContent>
              {couriers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.user?.name ?? c.userId} {c.vehicleType ? `· ${c.vehicleType}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          className="mt-4"
          variant="signal"
          disabled={!courierProfileId || assignCourier.isPending}
          onClick={handleAssign}
        >
          {assignCourier.isPending ? 'Assigning...' : 'Confirm assignment'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
