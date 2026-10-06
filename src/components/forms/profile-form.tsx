'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMyProfile, useUpdateProfile } from '@/hooks/use-profile';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileForm() {
  const { data, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: data ? { name: data.data.name, phone: data.data.phone ?? '' } : undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const onSubmit = (values: UpdateProfileInput) => {
    updateProfile.mutate(values, { onSuccess: () => reset(values) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={data?.data.email} disabled />
        <p className="text-ink-400 text-xs">Email can&apos;t be changed.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-alert-600 text-xs">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register('phone')} placeholder="01700000000" />
        {errors.phone && <p className="text-alert-600 text-xs">{errors.phone.message}</p>}
      </div>
      <Button type="submit" variant="signal" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
