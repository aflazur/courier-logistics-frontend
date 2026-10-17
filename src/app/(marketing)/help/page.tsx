import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqList } from '@/components/home/faq-list';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Answers to common questions about booking, paying for and tracking shipments.',
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Help Center</h1>
      <p className="text-ink-500 mt-3">
        Quick answers about booking, paying for and tracking your shipments.
      </p>
      <div className="mt-10">
        <FaqList />
      </div>
      <div className="border-ink-100 mt-10 rounded-sm border bg-white p-6">
        <h2 className="font-display text-ink-900 font-semibold">Still need help?</h2>
        <p className="text-ink-500 mt-1.5 text-sm">
          Send us a message and include your tracking code if the question is about a shipment.
        </p>
        <Link
          href="/contact"
          className="text-ink-900 hover:text-signal-600 mt-3 inline-block text-sm font-medium underline"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
