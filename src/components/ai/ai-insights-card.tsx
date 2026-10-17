'use client';

import { useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Result {
  insights: string;
  flags: { unusualDays: number; stuck: number; unassigned: number };
  sampleSize: number;
}

export function AiInsightsCard() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/insights', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        setError(body.message || 'Could not generate insights.');
        return;
      }
      setResult(body.data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const flagged = result && (result.flags.unusualDays || result.flags.stuck || result.flags.unassigned);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-signal-600 h-4 w-4" /> AI insights
        </CardTitle>
        <Button size="sm" variant="signal" onClick={run} disabled={loading}>
          {loading ? 'Analysing...' : result ? 'Refresh' : 'Generate insights'}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2" role="status" aria-label="Generating insights">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {error && (
          <p className="text-alert-600 text-sm" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && !result && (
          <p className="text-ink-500 text-sm">
            Summarises recent shipment activity, flags unusual days and highlights risks using the
            latest platform data.
          </p>
        )}
        {!loading && result && (
          <div className="space-y-4">
            {flagged ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {result.flags.unusualDays > 0 && (
                  <span className="bg-alert-100 text-alert-600 inline-flex items-center gap-1 rounded-sm px-2 py-1">
                    <AlertTriangle className="h-3 w-3" /> {result.flags.unusualDays} unusual day(s)
                  </span>
                )}
                {result.flags.stuck > 0 && (
                  <span className="bg-alert-100 text-alert-600 inline-flex items-center gap-1 rounded-sm px-2 py-1">
                    <AlertTriangle className="h-3 w-3" /> {result.flags.stuck} stalled 3+ days
                  </span>
                )}
                {result.flags.unassigned > 0 && (
                  <span className="bg-signal-100 text-ink-900 inline-flex items-center gap-1 rounded-sm px-2 py-1">
                    {result.flags.unassigned} awaiting a courier
                  </span>
                )}
              </div>
            ) : null}
            <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
              {result.insights}
            </p>
            <p className="text-ink-500 text-xs">
              Based on the latest {result.sampleSize} shipments. AI-generated, so verify before acting.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
