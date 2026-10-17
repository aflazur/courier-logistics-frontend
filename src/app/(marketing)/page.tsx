import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSlider } from '@/components/home/hero-slider';
import { FaqList } from '@/components/home/faq-list';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { BACKEND_URL } from '@/lib/config';

interface Hub {
  id: string;
  name: string;
  city: string;
  zone: string;
}

async function getHubs(): Promise<Hub[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/hubs`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return ((await res.json()) as { data?: Hub[] }).data ?? [];
  } catch {
    return [];
  }
}

const FEATURES = [
  {
    icon: MapPin,
    title: 'Live status timeline',
    desc: 'From pickup scheduled through delivered - each transition is logged with a timestamp.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-separated access',
    desc: 'Customers, couriers, and admins each see exactly the tools their role needs.',
  },
  {
    icon: CreditCard,
    title: 'Verified payments',
    desc: 'Delivery fees are settled through SSLCommerz, confirmed server-side before anything is marked paid.',
  },
  {
    icon: Clock,
    title: 'Guarded status changes',
    desc: 'A shipment can’t skip steps - invalid transitions are rejected before they touch the database.',
  },
  {
    icon: Truck,
    title: 'Courier assignment',
    desc: 'Admins assign available couriers to shipments; earnings are tracked per completed delivery.',
  },
  {
    icon: Users,
    title: 'Personal shipment history',
    desc: 'Customers see their own shipments and payments; couriers see only the parcels assigned to them.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Book & pay',
    desc: 'Enter pickup and delivery details, then settle the delivery fee to schedule pickup.',
  },
  {
    step: '02',
    title: 'Hub to hub',
    desc: 'An admin assigns a courier; your parcel moves through origin and destination hubs in transit.',
  },
  {
    step: '03',
    title: 'Delivered',
    desc: 'Out for delivery, then signed for - the full history stays on your dashboard.',
  },
];

const ROLES = [
  {
    icon: Package,
    title: 'Customers',
    points: ['Book a shipment in three steps', 'Pay securely and track every status', 'Review shipment and payment history'],
    href: '/register',
    cta: 'Create a customer account',
  },
  {
    icon: Truck,
    title: 'Couriers',
    points: ['See only the parcels assigned to you', 'Update delivery status step by step', 'Track earnings per completed delivery'],
    href: '/register',
    cta: 'Join as a courier',
  },
  {
    icon: Building2,
    title: 'Admins',
    points: ['Assign available couriers', 'Manage users and hubs', 'Review the full audit trail'],
    href: '/login',
    cta: 'Admin login',
  },
];

export default async function HomePage() {
  const hubs = await getHubs();
  const cities = new Set(hubs.map((h) => h.city)).size;
  const zones = new Set(hubs.map((h) => `${h.city}/${h.zone}`)).size;

  const stats = [
    { label: 'Active hubs', value: hubs.length ? String(hubs.length) : '-' },
    { label: 'Cities covered', value: hubs.length ? String(cities) : '-' },
    { label: 'Delivery zones', value: hubs.length ? String(zones) : '-' },
    { label: 'Tracked status stages', value: '11' },
  ];

  return (
    <>
      {/* 1. Hero: 60-70% of the viewport on desktop */}
      <section className="surface-dark border-ink-700 border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:h-[65vh] lg:max-h-[40rem] lg:min-h-[28rem] lg:grid-cols-2 lg:py-0">
          <HeroSlider />
          <Image
            src="/route-illustration.svg"
            alt="A parcel route from pickup through an origin hub and a destination hub to the recipient's doorstep"
            width={640}
            height={260}
            priority
            unoptimized
            className="border-ink-700 hidden h-auto w-full rounded-sm border lg:block"
          />
        </div>
        <a
          href="#stats"
          className="text-ink-300 hover:text-signal-500 flex items-center justify-center gap-1 pb-4 font-mono text-xs tracking-wide uppercase"
        >
          Scroll to explore <ArrowRight className="h-3 w-3 rotate-90" />
        </a>
      </section>

      {/* 2. Stats */}
      <section id="stats" className="border-ink-100 border-b bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-display text-ink-900 text-3xl font-semibold">{s.value}</dd>
              <dt className="text-ink-500 mt-1 font-mono text-xs tracking-wide uppercase">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* 3. Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-ink-900 text-2xl font-semibold">
          Built around one shipment&apos;s whole journey
        </h2>
        <p className="text-ink-500 mt-2 max-w-2xl">
          Every status change is written to an audit trail, every courier assignment is
          transaction-safe, and every delivery fee is paid through a verified gateway.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border-ink-100 h-full rounded-sm border bg-white p-6">
              <f.icon className="text-signal-600 h-5 w-5" />
              <h3 className="font-display text-ink-900 mt-4 font-semibold">{f.title}</h3>
              <p className="text-ink-500 mt-1.5 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How it works */}
      <section className="border-ink-100 bg-chalk-100 border-y">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-ink-900 text-2xl font-semibold">How a shipment moves</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step}>
                <span className="text-signal-600 font-mono text-sm">{s.step}</span>
                <h3 className="font-display text-ink-900 mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-ink-500 mt-1.5 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Hub network (live from the backend) */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-ink-900 text-2xl font-semibold">Our hub network</h2>
            <p className="text-ink-500 mt-2 max-w-xl">
              Parcels route through origin and destination hubs. This list is read live from the
              platform.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hubs">
              Explore all hubs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {hubs.length === 0 ? (
          <p className="border-ink-100 text-ink-500 mt-8 rounded-sm border bg-white p-8 text-center text-sm">
            Hubs will appear here once the network is published.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hubs.slice(0, 8).map((h) => (
              <li
                key={h.id}
                className="border-ink-100 flex h-full flex-col gap-2 rounded-sm border bg-white p-5"
              >
                <Building2 className="text-signal-600 h-5 w-5" />
                <p className="font-display text-ink-900 font-semibold">{h.name}</p>
                <p className="text-ink-500 font-mono text-xs">
                  {h.zone}, {h.city}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 6. Who it's for */}
      <section className="border-ink-100 bg-chalk-100 border-y">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-ink-900 text-2xl font-semibold">
            Three roles, one shared manifest
          </h2>
          <p className="text-ink-500 mt-2 max-w-2xl">
            Whether you&apos;re sending a parcel, delivering one, or running the operation, there is
            a dashboard built for exactly that.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div
                key={r.title}
                className="border-ink-100 flex h-full flex-col rounded-sm border bg-white p-6"
              >
                <r.icon className="text-signal-600 h-5 w-5" />
                <h3 className="font-display text-ink-900 mt-4 font-semibold">{r.title}</h3>
                <ul className="mt-3 flex-1 space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="text-ink-500 flex gap-2 text-sm">
                      <CheckCircle2 className="text-route-600 mt-0.5 h-4 w-4 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-6 self-start">
                  <Link href={r.href}>{r.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing preview */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-ink-900 text-2xl font-semibold">
              One formula, no hidden charges
            </h2>
            <p className="text-ink-500 mt-2">
              The fee is calculated automatically the moment you create a shipment and shown before
              you pay. No manual quotes.
            </p>
            <Button asChild variant="primary" className="mt-6">
              <Link href="/pricing">
                Full pricing details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="border-ink-100 rounded-sm border bg-white p-8">
            <div className="flex flex-col items-center gap-4 font-mono text-sm sm:flex-row">
              <div className="bg-ink-100 rounded-sm px-4 py-3 text-center">
                <span className="text-ink-900 block text-2xl font-semibold">৳60</span>
                <span className="text-ink-500">base fee</span>
              </div>
              <span className="text-ink-500 text-xl">+</span>
              <div className="bg-ink-100 rounded-sm px-4 py-3 text-center">
                <span className="text-ink-900 block text-2xl font-semibold">৳25</span>
                <span className="text-ink-500">per kg</span>
              </div>
              <span className="text-ink-500 text-xl">=</span>
              <div className="bg-signal-100 rounded-sm px-4 py-3 text-center">
                <span className="text-signal-600 block text-2xl font-semibold">Total</span>
                <span className="text-ink-500">before you pay</span>
              </div>
            </div>
            <p className="text-ink-500 mt-5 text-sm">
              A 2.5 kg parcel costs 60 + (2.5 &times; 25) ={' '}
              <strong className="text-ink-900">৳122.50</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Payments & security */}
      <section className="surface-dark border-ink-700 border-y">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {[
            {
              icon: Wallet,
              title: 'SSLCommerz checkout',
              desc: 'Card and mobile banking details are entered on the gateway, never on this site.',
            },
            {
              icon: ShieldCheck,
              title: 'Server-side verification',
              desc: 'A payment is confirmed independently by the backend before a shipment is marked paid.',
            },
            {
              icon: Lock,
              title: 'Protected sessions',
              desc: 'Login tokens live in httpOnly cookies and refresh automatically, out of reach of page scripts.',
            },
          ].map((i) => (
            <div key={i.title}>
              <i.icon className="text-signal-500 h-5 w-5" />
              <h3 className="font-display mt-4 font-semibold">{i.title}</h3>
              <p className="text-ink-300 mt-1.5 text-sm">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-ink-900 text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-8">
          <FaqList limit={5} />
        </div>
        <p className="text-ink-500 mt-6 text-sm">
          More answers in the{' '}
          <Link href="/help" className="text-ink-900 hover:text-signal-600 font-medium underline">
            Help Center
          </Link>
          .
        </p>
      </section>

      {/* 10. Newsletter */}
      <section className="border-ink-100 bg-chalk-100 border-y">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="font-display text-ink-900 text-2xl font-semibold">
            Get delivery updates in your inbox
          </h2>
          <p className="text-ink-500 mx-auto mt-2 mb-6 max-w-lg text-sm">
            Platform news and service notices, no spam. Unsubscribe any time.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* 11. Call to action */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="font-display text-ink-900 text-3xl font-semibold">
          Ready to send your first parcel?
        </h2>
        <p className="text-ink-500 mx-auto mt-3 max-w-xl">
          Create an account in under a minute, or try a demo account to look around first.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="signal">
            <Link href="/register">Create a customer account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
