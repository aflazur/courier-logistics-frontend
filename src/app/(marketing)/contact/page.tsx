import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Courier & Logistics Platform team.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-ink-900 text-3xl font-semibold">Get in touch</h1>
        <p className="text-ink-500 mt-3">
          Questions about a shipment, a courier partnership, or the platform itself - send us a
          message.
        </p>
        <div className="mt-8 space-y-5">
          <div className="text-ink-700 flex items-center gap-3 text-sm">
            <Mail className="text-signal-600 h-4 w-4" /> support@courier-platform.example
          </div>
          <div className="text-ink-700 flex items-center gap-3 text-sm">
            <Phone className="text-signal-600 h-4 w-4" /> +880 1700-000000
          </div>
          <div className="text-ink-700 flex items-center gap-3 text-sm">
            <MapPin className="text-signal-600 h-4 w-4" /> Motijheel C/A, Dhaka, Bangladesh
          </div>
        </div>
      </div>
      <div className="border-ink-100 rounded-sm border bg-white p-6">
        <ContactForm />
      </div>
    </div>
  );
}
