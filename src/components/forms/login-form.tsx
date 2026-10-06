'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';
import type { Role } from '@/types/api';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();

    if (!res.ok || !body.success) {
      toast.error(body.message || 'Invalid email or password');
      return;
    }

    const user = body.data.user;
    setUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
    const next = searchParams.get('next');
    router.push(next || roleHomePath(user.role as Role));
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
        {errors.email && <p className="text-alert-600 text-xs">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} placeholder="••••••••" />
        {errors.password && <p className="text-alert-600 text-xs">{errors.password.message}</p>}
      </div>
      <Button type="submit" variant="signal" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
