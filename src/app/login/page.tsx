import type { Metadata } from 'next';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { LoginForm } from '@/components/forms/login-form';
import { DemoLoginButtons } from '@/components/forms/demo-login-buttons';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your Courier & Logistics Platform account.',
};

export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className="text-ink-500 mt-1 text-center text-sm">Log in to your account</p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="bg-ink-100 h-px flex-1" />
            <span className="text-ink-400 font-mono text-xs uppercase">or</span>
            <div className="bg-ink-100 h-px flex-1" />
          </div>

          <p className="text-ink-500 mb-3 text-center font-mono text-xs tracking-wide uppercase">
            Quick demo login
          </p>
          <DemoLoginButtons />

          <p className="text-ink-500 mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-ink-900 hover:text-signal-600 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
