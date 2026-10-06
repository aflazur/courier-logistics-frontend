import type { Metadata } from 'next';
import { Scale, PackageCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'How delivery fees are calculated on the Courier & Logistics Platform.',
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Pricing</h1>
      <p className="text-ink-500 mt-3">
        Every delivery fee is calculated automatically the moment you create a shipment - no hidden
        charges, no manual quotes.
      </p>

      <div className="border-ink-100 mt-10 rounded-sm border bg-white p-8">
        <div className="flex items-center gap-3">
          <Scale className="text-signal-600 h-5 w-5" />
          <h2 className="font-display text-ink-900 font-semibold">The formula</h2>
        </div>
        <div className="mt-6 flex flex-col items-center gap-4 font-mono text-sm sm:flex-row">
          <div className="bg-ink-100 rounded-sm px-4 py-3 text-center">
            <span className="text-ink-900 block text-2xl font-semibold">৳60</span>
            <span className="text-ink-500">base fee</span>
          </div>
          <span className="text-ink-400 text-xl">+</span>
          <div className="bg-ink-100 rounded-sm px-4 py-3 text-center">
            <span className="text-ink-900 block text-2xl font-semibold">৳25</span>
            <span className="text-ink-500">per kilogram</span>
          </div>
          <span className="text-ink-400 text-xl">=</span>
          <div className="bg-signal-100 rounded-sm px-4 py-3 text-center">
            <span className="text-signal-600 block text-2xl font-semibold">Total fee</span>
            <span className="text-ink-500">shown before you pay</span>
          </div>
        </div>
        <p className="text-ink-500 mt-6 text-sm">
          Example: a 2.5 kg parcel costs 60 + (2.5 &times; 25) ={' '}
          <strong className="text-ink-900">৳122.50</strong>.
        </p>
      </div>

      <div className="border-ink-100 mt-6 flex gap-4 rounded-sm border bg-white p-8">
        <PackageCheck className="text-route-600 mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h3 className="font-display text-ink-900 font-semibold">
            Payment is required to schedule pickup
          </h3>
          <p className="text-ink-500 mt-1.5 text-sm">
            Once you book a shipment, you&apos;ll be taken to a secure SSLCommerz checkout for the
            calculated fee. Pickup is scheduled automatically once payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
