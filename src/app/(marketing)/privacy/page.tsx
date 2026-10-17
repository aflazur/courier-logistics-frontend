import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What information the Courier & Logistics Platform collects and how it is used.',
};

const SECTIONS = [
  {
    title: 'Information we collect',
    body: 'When you register we store your name, email address, phone number and a hashed password. When you book a shipment we store the pickup and delivery details you enter, the parcel weight and type, and the resulting payment record.',
  },
  {
    title: 'How we use it',
    body: 'Your details are used to create and deliver shipments, calculate and verify fees, show your history to you, and let an assigned courier contact the recipient. We do not sell your information.',
  },
  {
    title: 'Payments',
    body: 'Payments are handled by SSLCommerz. Card and mobile banking details are entered on the gateway and are never stored by this platform; we keep only the transaction reference and status.',
  },
  {
    title: 'Sessions and cookies',
    body: 'We use httpOnly cookies to keep you signed in and to refresh your session. A small readable cookie holds your name and role so pages can greet you. We also remember your light or dark theme choice in your browser.',
  },
  {
    title: 'Who can see your data',
    body: 'Customers see only their own shipments and payments. Couriers see only the parcels assigned to them. Administrators can see platform records in order to run the service and review the audit trail.',
  },
  {
    title: 'Your choices',
    body: 'You can update your name and phone number from your profile at any time. To ask for your account to be corrected or removed, use the contact page.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-ink-900 text-3xl font-semibold">Privacy Policy</h1>
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
