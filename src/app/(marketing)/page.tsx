import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, ShieldCheck, Truck, Clock, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default async function HomePage() {
  const hubs = await getHubs();
  return (
    <>
      {/* Hero */}
      <section className="border-ink-100 bg-ink-900 text-chalk-50 border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <span className="bg-ink-800 text-signal-500 inline-flex items-center gap-2 rounded-sm px-3 py-1 font-mono text-xs tracking-wide uppercase">
              <Truck className="h-3.5 w-3.5" /> Now booking city-wide deliveries
            </span>
            <h1 className="font-display mt-6 text-4xl leading-tight font-semibold sm:text-5xl">
              Parcels moved with a paper trail you can actually see.
            </h1>
            <p className="text-ink-300 mt-5 max-w-lg text-lg">
              Book a pickup, watch it move hub to hub, and know the moment it&apos;s signed for -
              every shipment logged step by step, from your dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="signal">
                <Link href="/register">
                  Book your first shipment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ink-600 text-chalk-50 hover:bg-ink-800"
              >
                <Link href="/services">See how it works</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Image
              src="/route-illustration.svg"
              alt="A parcel route from pickup through an origin hub and a destination hub to the recipient's doorstep"
              width={640}
              height={260}
              priority
              unoptimized
              className="border-ink-700 h-auto w-full rounded-sm border"
            />
            <div className="border-ink-700 bg-ink-800 rounded-sm border p-6 font-mono text-sm">
              <p className="text-ink-300 mb-4 text-xs tracking-wide uppercase">Our hub network</p>
              {hubs.length === 0 ? (
                <p className="text-ink-300">Hubs will appear here once the network is published.</p>
              ) : (
                <ul className="space-y-3">
                  {hubs.slice(0, 5).map((h) => (
                    <li key={h.id} className="border-ink-700 flex justify-between border-b pb-2">
                      <span className="text-chalk-50">{h.name}</span>
                      <span className="text-ink-400">
                        {h.zone}, {h.city}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-ink-900 text-2xl font-semibold">
          Built around one shipment&apos;s whole journey
        </h2>
        <p className="text-ink-500 mt-2 max-w-2xl">
          Every status change is written to an audit trail, every courier assignment is
          transaction-safe, and every delivery fee is paid through a verified gateway.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
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
              desc: 'A shipment can\u2019t skip steps - invalid transitions are rejected before they touch the database.',
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
          ].map((f) => (
            <div key={f.title} className="border-ink-100 rounded-sm border bg-white p-6">
              <f.icon className="text-signal-600 h-5 w-5" />
              <h3 className="font-display text-ink-900 mt-4 font-semibold">{f.title}</h3>
              <p className="text-ink-500 mt-1.5 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-ink-100 bg-chalk-100 border-t">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-ink-900 text-2xl font-semibold">How a shipment moves</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
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
            ].map((s) => (
              <div key={s.step}>
                <span className="text-signal-600 font-mono text-sm">{s.step}</span>
                <h3 className="font-display text-ink-900 mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-ink-500 mt-1.5 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="font-display text-ink-900 text-3xl font-semibold">
          Three roles, one shared manifest
        </h2>
        <p className="text-ink-500 mx-auto mt-3 max-w-xl">
          Whether you&apos;re sending a parcel, delivering one, or running the operation -
          there&apos;s a dashboard built for exactly that.
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
