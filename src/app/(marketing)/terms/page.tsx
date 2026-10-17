import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using the Courier & Logistics Platform.',
};

const SECTIONS = [
  {
    title: 'Using the platform',
    body: 'You need an account to book or deliver shipments. Keep your login details private and provide accurate pickup, delivery and contact information.',
  },
  {
    title: 'Fees and payment',
    body: 'The delivery fee is a base fee plus a per-kilogram rate and is shown before you pay. Pickup is scheduled once the payment is confirmed by the payment gateway.',
  },
  {
    title: 'Cancellations',
    body: 'A shipment can be cancelled until it reaches the origin hub. Once a parcel is in the hub network it can no longer be cancelled from your account.',
  },
  {
    title: 'Prohibited items',
    body: 'Do not book shipments containing illegal, dangerous or restricted goods. We may refuse or return any parcel that breaks this rule.',
  },
  {
    title: 'Delivery attempts',
    body: 'If a delivery attempt fails, the courier may retry delivery or the parcel may be returned. Every status change is recorded in the shipment history.',
  },
  {
    title: 'Changes to these terms',
    body: 'We may update these terms as the platform evolves. Continued use after a change means you accept the updated terms.',
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Terms of Service</h1>
      <div className="waybill-rule my-6" />
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-ink-900 font-semibold">{s.title}</h2>
            <p className="text-ink-700 mt-2 text-sm leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
