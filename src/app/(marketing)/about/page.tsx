import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'What the Courier & Logistics Platform is and how it\u2019s built.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">About this platform</h1>
      <div className="waybill-rule my-6" />
      <div className="prose prose-sm text-ink-700 max-w-none space-y-4 leading-relaxed">
        <p>
          This platform was built as a fullstack academic project covering the complete lifecycle of
          a courier and logistics operation: a customer books a shipment, an admin assigns it to a
          courier, and the courier moves it through hub-to-hub transit until it&apos;s delivered -
          with every step recorded.
        </p>
        <p>
          The backend is a Node.js and Express API with PostgreSQL via Prisma, handling
          authentication, role-based authorization, transaction-safe courier assignment, and
          server-verified SSLCommerz payments. This frontend is the Next.js client that consumes
          that API - every shipment, every status change, and every payment you see here comes from
          real requests to that backend, not mock data.
        </p>
        <p>
          Three roles share the same manifest: customers book and track shipments, couriers update
          delivery status and see their earnings, and admins oversee the whole operation - assigning
          couriers, managing hubs, and reviewing the audit trail.
        </p>
      </div>
    </div>
  );
}
