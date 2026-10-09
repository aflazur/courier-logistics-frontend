import type { Metadata } from 'next';
import Link from 'next/link';
import { Banknote, CheckCircle2, Star, Truck, Wallet } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { DashboardChart, type ChartDatum } from '@/components/shared/dashboard-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { serverFetch } from '@/lib/server-api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { CourierProfile, Shipment } from '@/types/api';

export const metadata: Metadata = { title: 'Earnings' };

// Mirrors COURIER_EARNING_SHARE in the backend shipment service.
const COURIER_SHARE = 0.7;

export default async function ProviderEarningsPage() {
  const [{ data: profile }, { data: delivered }] = await Promise.all([
    serverFetch<CourierProfile>('/couriers/me'),
    serverFetch<Shipment[]>(
      '/shipments/my-assigned?status=DELIVERED&limit=100&sortBy=updatedAt&sortOrder=desc',
    ),
  ]);

  const total = Number(profile.totalEarnings);
  const average = delivered.length ? total / delivered.length : 0;

  // Earnings per delivery day, oldest to newest, last 10 days that have deliveries.
  const perDay = new Map<string, number>();
  [...delivered].reverse().forEach((s) => {
    const day = new Date(s.updatedAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    perDay.set(day, (perDay.get(day) ?? 0) + Number(s.deliveryFee) * COURIER_SHARE);
  });
  const chartData: ChartDatum[] = [...perDay]
    .slice(-10)
    .map(([label, value]) => ({ label, value: Math.round(value), color: '#2f8f5b' }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Earnings</h2>
        <p className="text-ink-500 text-sm">
          You keep {COURIER_SHARE * 100}% of the delivery fee on every completed delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Earnings" value={formatCurrency(total)} icon={Wallet} accent />
        <StatCard label="Deliveries completed" value={delivered.length} icon={CheckCircle2} />
        <StatCard label="Average per delivery" value={formatCurrency(average)} icon={Banknote} />
        <StatCard
          label="Rating"
          value={profile.rating > 0 ? profile.rating.toFixed(1) : 'No ratings yet'}
          icon={Star}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Earnings by delivery day (BDT)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-ink-500 py-16 text-center text-sm">
                Complete a delivery to see your earnings chart.
              </p>
            ) : (
              <DashboardChart data={chartData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="text-ink-500 h-4 w-4" />
              <span className="text-ink-900 font-medium">
                {profile.isAvailable ? 'Available for new assignments' : 'Currently on a delivery'}
              </span>
            </div>
            <p className="text-ink-500">
              Vehicle: {profile.vehicleType ?? 'Not set'}
              {profile.currentHub ? ` · Hub: ${profile.currentHub.name}` : ''}
            </p>
            <p className="text-ink-500">
              Earnings are credited the moment a shipment is marked as delivered.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed deliveries</CardTitle>
        </CardHeader>
        {delivered.length === 0 ? (
          <EmptyState
            icon={Banknote}
            title="No completed deliveries yet"
            description="Delivered parcels and your share of each fee will be listed here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-ink-100 text-ink-500 border-b font-mono text-xs tracking-wide uppercase">
                  <th className="px-5 py-3 font-medium">Tracking</th>
                  <th className="px-5 py-3 font-medium">Recipient</th>
                  <th className="px-5 py-3 font-medium">Delivered</th>
                  <th className="px-5 py-3 font-medium">Delivery fee</th>
                  <th className="px-5 py-3 text-right font-medium">Your share</th>
                </tr>
              </thead>
              <tbody>
                {delivered.slice(0, 20).map((s) => (
                  <tr key={s.id} className="border-ink-100 border-b last:border-0">
                    <td className="px-5 py-3">
                      <Link
                        href={`/provider/shipments/${s.id}`}
                        className="text-ink-900 hover:text-signal-600 font-mono text-xs underline underline-offset-4"
                      >
                        {s.trackingCode}
                      </Link>
                    </td>
                    <td className="text-ink-700 px-5 py-3">{s.recipientName}</td>
                    <td className="text-ink-500 px-5 py-3">{formatDate(s.updatedAt)}</td>
                    <td className="text-ink-700 px-5 py-3 font-mono">
                      {formatCurrency(s.deliveryFee)}
                    </td>
                    <td className="text-ink-900 px-5 py-3 text-right font-mono font-semibold">
                      {formatCurrency(Number(s.deliveryFee) * COURIER_SHARE)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
