'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courierProfileSchema, type CourierProfileInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMyCourierProfile, useUpdateCourierProfile } from '@/hooks/use-couriers';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CourierProfileForm() {
  const { data, isLoading } = useMyCourierProfile();
  const updateProfile = useUpdateCourierProfile();

  const { register, control, handleSubmit, reset } = useForm<CourierProfileInput>({
    resolver: zodResolver(courierProfileSchema),
    values: data
      ? {
          isAvailable: data.data.isAvailable,
          vehicleType: data.data.vehicleType ?? '',
          licenseNumber: data.data.licenseNumber ?? '',
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const onSubmit = (values: CourierProfileInput) => {
    updateProfile.mutate(values, { onSuccess: () => reset(values) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label>Availability</Label>
        <Controller
          control={control}
          name="isAvailable"
          render={({ field }) => (
            <div className="flex gap-2">
              {[
                { value: true, label: 'Available' },
                { value: false, label: 'Unavailable' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'rounded-sm border px-4 py-2 text-sm font-medium',
                    field.value === opt.value
                      ? 'border-signal-500 bg-signal-100 text-signal-600'
                      : 'border-ink-300 text-ink-700 hover:bg-ink-100',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="vehicleType">Vehicle type</Label>
        <Input id="vehicleType" {...register('vehicleType')} placeholder="Bike, Van, Truck..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="licenseNumber">License number</Label>
        <Input id="licenseNumber" {...register('licenseNumber')} placeholder="DL-123456" />
      </div>
      <Button type="submit" variant="signal" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
