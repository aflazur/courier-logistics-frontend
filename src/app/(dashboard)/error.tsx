'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border-alert-100 bg-alert-100/40 flex flex-col items-center justify-center rounded-sm border px-6 py-16 text-center">
      <AlertTriangle className="text-alert-600 h-8 w-8" />
      <h2 className="font-display text-ink-900 mt-4 text-lg font-semibold">
        Couldn&apos;t load this page
      </h2>
      <p className="text-ink-500 mt-1 max-w-sm text-sm">
        {error.message || 'Something went wrong talking to the server.'}
      </p>
      <Button variant="outline" className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
