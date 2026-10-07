'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateHub, useUpdateHub } from '@/hooks/use-hubs';
import { hubSchema, type HubInput } from '@/lib/hub-validation';
import type { Hub } from '@/types/api';

const FIELDS: { name: keyof HubInput; label: string; placeholder: string }[] = [
  { name: 'name', label: 'Hub name', placeholder: 'Dhaka Central Hub' },
  { name: 'city', label: 'City', placeholder: 'Dhaka' },
  { name: 'zone', label: 'Zone', placeholder: 'Motijheel' },
  { name: 'address', label: 'Address', placeholder: 'Motijheel C/A, Dhaka' },
];

export function HubFormDialog({ hub }: { hub?: Hub }) {
  const [open, setOpen] = useState(false);
  const createHub = useCreateHub();
  const updateHub = useUpdateHub();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HubInput>({
    resolver: zodResolver(hubSchema),
    defaultValues: {
      name: hub?.name ?? '',
      city: hub?.city ?? '',
      zone: hub?.zone ?? '',
      address: hub?.address ?? '',
    },
  });

  const pending = createHub.isPending || updateHub.isPending;

  const onSubmit = async (values: HubInput) => {
    try {
      if (hub) await updateHub.mutateAsync({ id: hub.id, data: values });
      else await createHub.mutateAsync(values);
      setOpen(false);
      if (!hub) reset();
    } catch {
      // The mutation hooks already show an error toast.
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {hub ? (
          <Button size="sm" variant="outline" aria-label={`Edit ${hub.name}`}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        ) : (
          <Button variant="signal">
            <Plus className="h-4 w-4" /> Add hub
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hub ? 'Edit hub' : 'Add a hub'}</DialogTitle>
          <DialogDescription>
            Hubs are where parcels are scanned in and out. Customers pick from these when booking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={`hub-${hub?.id ?? 'new'}-${f.name}`}>{f.label}</Label>
              <Input
                id={`hub-${hub?.id ?? 'new'}-${f.name}`}
                placeholder={f.placeholder}
                aria-invalid={!!errors[f.name]}
                {...register(f.name)}
              />
              {errors[f.name] && (
                <p className="text-alert-600 text-xs">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}
          <Button type="submit" variant="signal" disabled={pending} className="w-full">
            {pending ? 'Saving...' : hub ? 'Save changes' : 'Create hub'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
