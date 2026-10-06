'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      toast.error(body.message || 'Could not send your message');
      return;
    }
    toast.success('Message sent - we\u2019ll get back to you soon.');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="Your name" />
        {errors.name && <p className="text-alert-600 text-xs">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
        {errors.email && <p className="text-alert-600 text-xs">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register('message')} placeholder="How can we help?" />
        {errors.message && <p className="text-alert-600 text-xs">{errors.message.message}</p>}
      </div>
      <Button type="submit" variant="signal" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
