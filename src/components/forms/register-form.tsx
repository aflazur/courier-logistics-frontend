'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, Truck } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';

export function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });

  const onSubmit = async (data: RegisterInput) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();

    if (!res.ok || !body.success) {
      toast.error(body.message || 'Registration failed');
      return;
    }

    const user = body.data.user;
    setUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    toast.success('Account created');
    router.push(roleHomePath(user.role));
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label>I am a</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'CUSTOMER' as const, label: 'Customer', icon: User },
                { value: 'COURIER' as const, label: 'Courier', icon: Truck },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors',
                    field.value === value
                      ? 'border-signal-500 bg-signal-100 text-signal-600'
                      : 'border-ink-300 text-ink-700 hover:bg-ink-100',
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" {...register('name')} placeholder="Karim Rahman" />
        {errors.name && <p className="text-alert-600 text-xs">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
        {errors.email && <p className="text-alert-600 text-xs">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" {...register('phone')} placeholder="01700000000" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          placeholder="At least 6 characters"
        />
        {errors.password && <p className="text-alert-600 text-xs">{errors.password.message}</p>}
      </div>
      <Button type="submit" variant="signal" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
