import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-chalk-50 flex min-h-screen items-center justify-center px-5">
      <div className="max-w-sm text-center">
        <div className="bg-ink-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <PackageX className="text-ink-500 h-7 w-7" />
        </div>
        <p className="text-signal-600 mt-6 font-mono text-xs tracking-wide uppercase">Error 404</p>
        <h1 className="font-display text-ink-900 mt-2 text-2xl font-semibold">
          This shipment doesn&apos;t exist
        </h1>
        <p className="text-ink-500 mt-2 text-sm">
          The page you&apos;re looking for was moved, deleted, or never existed.
        </p>
        <Button asChild variant="signal" className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
