import type { Metadata } from 'next';
import { Users, Truck, Package, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { DashboardChart } from '@/components/shared/dashboard-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { serverFetch } from '@/lib/server-api';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats } from '@/types/api';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminOverviewPage() {
  const { data: stats } = await serverFetch<DashboardStats>('/admin/dashboard-stats');

  const chartData = [
    { label: 'Pending', value: stats.pendingCount },
    { label: 'Delivered', value: stats.deliveredCount },
    {
      label: 'Other',
      value: Math.max(stats.totalShipments - stats.pendingCount - stats.deliveredCount, 0),
    },
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Shipment breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
