'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
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
    <html>
      <body>
        <div className="bg-chalk-50 flex min-h-screen items-center justify-center px-5">
          <div className="max-w-sm text-center">
            <div className="bg-alert-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <AlertTriangle className="text-alert-600 h-7 w-7" />
            </div>
            <h1 className="font-display text-ink-900 mt-6 text-2xl font-semibold">
              Something broke
            </h1>
            <p className="text-ink-500 mt-2 text-sm">
              An unexpected error occurred. You can try again, or head back to the homepage.
            </p>
            <Button variant="signal" className="mt-6" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
