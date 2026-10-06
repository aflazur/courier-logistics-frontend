import type { Metadata } from 'next';
import { Package, Truck, Building2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'What you can do on the Courier & Logistics Platform, by role.',
};

const SERVICES = [
  {
    icon: Package,
    title: 'Parcel booking',
    desc: 'Customers create a shipment with pickup and delivery addresses, package weight, and parcel type. The delivery fee is calculated automatically from weight.',
  },
  {
    icon: Truck,
    title: 'Courier assignment & delivery',
    desc: 'Admins assign an available courier to a shipment. Couriers update its status through pickup, hub transit, and delivery, with each step logged to an audit trail.',
  },
  {
    icon: Building2,
    title: 'Hub management',
    desc: 'Shipments route through origin and destination hubs, giving a clear picture of where a parcel physically is at each stage.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified payments',
    desc: 'Delivery fees are paid through SSLCommerz. Every payment is independently verified server-side before a shipment is marked as paid.',
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Services</h1>
      <p className="text-ink-500 mt-3 max-w-xl">
        A single platform covering the full journey from booking to delivery.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="border-ink-100 rounded-sm border bg-white p-6">
            <s.icon className="text-signal-600 h-5 w-5" />
            <h2 className="font-display text-ink-900 mt-4 font-semibold">{s.title}</h2>
            <p className="text-ink-500 mt-1.5 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
