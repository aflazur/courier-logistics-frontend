import type { Metadata } from 'next';
import { Users, Truck, Package, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { DashboardChart, TrendChart, type ChartDatum } from '@/components/shared/dashboard-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { serverFetch } from '@/lib/server-api';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats, Shipment, ShipmentStatus } from '@/types/api';

export const metadata: Metadata = { title: 'Admin Overview' };

const DAY_MS = 86_400_000;

// Order follows the shipment journey; colour groups: amber = in progress, green = done, red = problem.
const STATUS_ORDER: { status: ShipmentStatus; label: string; color: string }[] = [
  { status: 'PENDING', label: 'Pending', color: '#9aa3af' },
  { status: 'PICKUP_SCHEDULED', label: 'Pickup scheduled', color: '#f0a202' },
  { status: 'PICKED_UP', label: 'Picked up', color: '#f0a202' },
  { status: 'AT_ORIGIN_HUB', label: 'Origin hub', color: '#f0a202' },
  { status: 'IN_TRANSIT', label: 'In transit', color: '#f0a202' },
  { status: 'AT_DESTINATION_HUB', label: 'Destination hub', color: '#f0a202' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for delivery', color: '#f0a202' },
  { status: 'DELIVERED', label: 'Delivered', color: '#2f8f5b' },
  { status: 'FAILED_DELIVERY', label: 'Failed', color: '#c0392b' },
  { status: 'RETURNED', label: 'Returned', color: '#c0392b' },
  { status: 'CANCELLED', label: 'Cancelled', color: '#c0392b' },
];

export default async function AdminOverviewPage() {
  const [{ data: stats }, { data: shipments }] = await Promise.all([
    serverFetch<DashboardStats>('/admin/dashboard-stats'),
    serverFetch<Shipment[]>('/shipments?limit=100&sortBy=createdAt&sortOrder=desc'),
  ]);

  // One bar per status that actually has shipments (no catch-all "Other" bucket).
  const statusData: ChartDatum[] = STATUS_ORDER.map((s) => ({
    label: s.label,
    value: shipments.filter((x) => x.status === s.status).length,
    color: s.color,
  })).filter((d) => d.value > 0);

  // New shipments per day for the last 7 days.
  const today = new Date().setHours(0, 0, 0, 0);
  const trendData: ChartDatum[] = Array.from({ length: 7 }, (_, i) => {
    const start = today - (6 - i) * DAY_MS;
    return {
      label: new Date(start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      value: shipments.filter((x) => {
        const t = new Date(x.createdAt).getTime();
        return t >= start && t < start + DAY_MS;
      }).length,
    };
  });

  const sampled = stats.totalShipments > shipments.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Active Couriers" value={stats.totalCouriers} icon={Truck} />
        <StatCard label="Total Shipments" value={stats.totalShipments} icon={Package} accent />
        <StatCard label="Delivered" value={stats.deliveredCount} icon={CheckCircle2} />
        <StatCard label="Pending" value={stats.pendingCount} icon={Clock} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipments by status</CardTitle>
            {sampled && (
              <p className="text-ink-500 text-xs">Based on the latest {shipments.length} shipments.</p>
            )}
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-ink-500 py-16 text-center text-sm">No shipments yet.</p>
            ) : (
              <DashboardChart data={statusData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New shipments, last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
