'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { newsletterSchema, type NewsletterInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (data: NewsletterInput) => {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.success) {
      toast.error(body.message || 'Could not subscribe right now');
      return;
    }
    reset();
    setDone(true);
  };

  if (done) {
    return (
      <p className="text-route-600 flex items-center justify-center gap-2 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" /> You&apos;re subscribed. Delivery updates are on their way.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 text-left">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        <Button type="submit" variant="signal" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      {errors.email && <p className="text-alert-600 mt-2 text-left text-xs">{errors.email.message}</p>}
    </form>
  );
}
