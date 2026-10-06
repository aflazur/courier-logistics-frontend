'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import {
  shipmentRecipientStepSchema,
  shipmentPackageStepSchema,
  type ShipmentRecipientStepInput,
  type ShipmentPackageStepInput,
} from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateShipment } from '@/hooks/use-shipments';
import { formatCurrency, cn } from '@/lib/utils';

const STEPS = ['Recipient', 'Package', 'Review'] as const;

export function CreateShipmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [recipientData, setRecipientData] = useState<ShipmentRecipientStepInput | null>(null);
  const [packageData, setPackageData] = useState<ShipmentPackageStepInput | null>(null);
  const createShipment = useCreateShipment();

  const recipientForm = useForm<ShipmentRecipientStepInput>({
    resolver: zodResolver(shipmentRecipientStepSchema),
    defaultValues: recipientData ?? undefined,
  });

  const packageForm = useForm<ShipmentPackageStepInput>({
    resolver: zodResolver(shipmentPackageStepSchema),
    defaultValues: packageData ?? undefined,
  });

  const estimatedFee = packageData?.weightKg ? 60 + packageData.weightKg * 25 : null;

  const submitAll = async () => {
    if (!recipientData || !packageData) return;
    const res = await createShipment.mutateAsync({ ...recipientData, ...packageData });
    router.push(`/dashboard/shipments/${res.data.id}`);
  };

  return (
    <div className="max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  i < step
                    ? 'bg-route-600 text-white'
                    : i === step
                      ? 'bg-signal-500 text-ink-950'
                      : 'bg-ink-100 text-ink-500',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn('text-sm font-medium', i === step ? 'text-ink-900' : 'text-ink-500')}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="bg-ink-100 mx-3 h-px flex-1" />}
          </div>
        ))}
      </div>

      <div className="border-ink-100 rounded-sm border bg-white p-6">
        {step === 0 && (
          <form
            onSubmit={recipientForm.handleSubmit((data) => {
              setRecipientData(data);
              setStep(1);
            })}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <Label htmlFor="recipientName">Recipient name</Label>
              <Input id="recipientName" {...recipientForm.register('recipientName')} />
              {recipientForm.formState.errors.recipientName && (
                <p className="text-alert-600 text-xs">
                  {recipientForm.formState.errors.recipientName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recipientPhone">Recipient phone</Label>
              <Input
                id="recipientPhone"
                {...recipientForm.register('recipientPhone')}
                placeholder="01700000000"
              />
              {recipientForm.formState.errors.recipientPhone && (
                <p className="text-alert-600 text-xs">
                  {recipientForm.formState.errors.recipientPhone.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deliveryAddress">Delivery address</Label>
              <Input id="deliveryAddress" {...recipientForm.register('deliveryAddress')} />
              {recipientForm.formState.errors.deliveryAddress && (
                <p className="text-alert-600 text-xs">
                  {recipientForm.formState.errors.deliveryAddress.message}
                </p>
              )}
            </div>
            <Button type="submit" variant="signal" className="w-full">
              Continue
            </Button>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={packageForm.handleSubmit((data) => {
              setPackageData(data);
              setStep(2);
            })}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <Label htmlFor="pickupAddress">Pickup address</Label>
              <Input id="pickupAddress" {...packageForm.register('pickupAddress')} />
              {packageForm.formState.errors.pickupAddress && (
                <p className="text-alert-600 text-xs">
                  {packageForm.formState.errors.pickupAddress.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weightKg">Weight (kg)</Label>
              <Input id="weightKg" type="number" step="0.1" {...packageForm.register('weightKg')} />
              {packageForm.formState.errors.weightKg && (
                <p className="text-alert-600 text-xs">
                  {packageForm.formState.errors.weightKg.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parcelType">Parcel type (optional)</Label>
              <Input
                id="parcelType"
                {...packageForm.register('parcelType')}
                placeholder="PACKAGE"
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="submit" variant="signal" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === 2 && recipientData && packageData && (
          <div className="space-y-5">
            <div className="space-y-3 text-sm">
              <div className="border-ink-100 flex justify-between border-b pb-2">
                <span className="text-ink-500">Recipient</span>
                <span className="text-ink-900 font-medium">{recipientData.recipientName}</span>
              </div>
              <div className="border-ink-100 flex justify-between border-b pb-2">
                <span className="text-ink-500">Delivery address</span>
                <span className="text-ink-900 max-w-xs text-right">
                  {recipientData.deliveryAddress}
                </span>
              </div>
              <div className="border-ink-100 flex justify-between border-b pb-2">
                <span className="text-ink-500">Pickup address</span>
                <span className="text-ink-900 max-w-xs text-right">
                  {packageData.pickupAddress}
                </span>
              </div>
              <div className="border-ink-100 flex justify-between border-b pb-2">
                <span className="text-ink-500">Weight</span>
                <span className="text-ink-900">{packageData.weightKg} kg</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-500 font-medium">Estimated delivery fee</span>
                <span className="text-signal-600 font-display text-lg font-semibold">
                  {estimatedFee !== null ? formatCurrency(estimatedFee) : '—'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                variant="signal"
                className="flex-1"
                disabled={createShipment.isPending}
                onClick={submitAll}
              >
                {createShipment.isPending ? 'Booking...' : 'Book shipment'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
