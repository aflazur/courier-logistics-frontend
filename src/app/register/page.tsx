import type { Metadata } from 'next';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { RegisterForm } from '@/components/forms/register-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a Courier & Logistics Platform account.',
};

export default function RegisterPage() {
  return (
    <div className="bg-chalk-100 flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-display text-ink-900 mb-8 flex items-center justify-center gap-2 font-semibold"
        >
          <span className="bg-ink-900 text-signal-500 flex h-8 w-8 items-center justify-center rounded-sm">
            <Package className="h-4 w-4" />
          </span>
          Courier & Logistics
        </Link>

        <div className="border-ink-100 rounded-sm border bg-white p-8">
          <h1 className="font-display text-ink-900 text-center text-2xl font-semibold">
            Create your account
          </h1>
          <p className="text-ink-500 mt-1 text-center text-sm">Join as a customer or courier</p>

          <div className="mt-6">
            <RegisterForm />
          </div>

          <p className="text-ink-500 mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-ink-900 hover:text-signal-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
