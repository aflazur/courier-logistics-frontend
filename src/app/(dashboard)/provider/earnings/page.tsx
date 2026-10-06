import { Wallet, Star, Truck } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { serverFetch } from '@/lib/server-api';
import { formatCurrency } from '@/lib/utils';
import type { CourierProfile } from '@/types/api';

export default async function ProviderEarningsPage() {
  const { data: profile } = await serverFetch<CourierProfile>('/couriers/me');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Earnings</h2>
        <p className="text-ink-500 text-sm">Your delivery earnings and rating at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Earnings"
          value={formatCurrency(profile.totalEarnings)}
          icon={Wallet}
          accent
        />
        <StatCard label="Rating" value={profile.rating.toFixed(1)} icon={Star} />
        <StatCard
          label="Status"
          value={profile.isAvailable ? 'Available' : 'On delivery'}
          icon={Truck}
        />
      </div>

      <div className="border-ink-100 text-ink-500 rounded-sm border bg-white p-5 text-sm">
        You earn 70% of the delivery fee for every shipment you mark as delivered. Earnings update
        automatically the moment a status changes to Delivered.
      </div>
    </div>
  );
}
