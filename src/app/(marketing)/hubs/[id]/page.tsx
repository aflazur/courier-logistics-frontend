import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubCard } from '@/components/hubs/hub-card';
import { HubIllustration } from '@/components/hubs/hub-illustration';
import { fetchHub, fetchHubs } from '@/lib/hubs';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hub = await fetchHub(id);
  if (!hub) return { title: 'Hub not found' };
  return {
    title: hub.name,
    description: `${hub.name} in ${hub.zone}, ${hub.city}: part of the Courier & Logistics hub network.`,
  };
}

export default async function HubDetailsPage({ params }: Props) {
  const { id } = await params;
  const [hub, all] = await Promise.all([fetchHub(id), fetchHubs()]);
  if (!hub) notFound();

  // Same-city hubs first, then any others, never the hub itself.
  const others = all.filter((h) => h.id !== hub.id);
  const related = [
    ...others.filter((h) => h.city === hub.city),
    ...others.filter((h) => h.city !== hub.city),
  ].slice(0, 4);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hub.address}, ${hub.city}`,
  )}`;

  const info = [
    { label: 'City', value: hub.city },
    { label: 'Zone', value: hub.zone },
    { label: 'Address', value: hub.address },
    { label: 'Hub ID', value: hub.id.slice(0, 8).toUpperCase() },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href="/hubs"
        className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> All hubs
      </Link>

      <div className="border-ink-100 mt-6 overflow-hidden rounded-sm border bg-white">
        <div className="h-48 sm:h-64">
          <HubIllustration id={hub.id} className="h-full" />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <h1 className="font-display text-ink-900 text-2xl font-semibold">{hub.name}</h1>
            <p className="text-ink-500 mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="text-signal-600 h-4 w-4" />
              {hub.zone}, {hub.city}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-display text-ink-900 text-lg font-semibold">Overview</h2>
          <div className="text-ink-700 mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              {hub.name} serves the {hub.zone} zone of {hub.city} and is located at {hub.address}.
              It is one of the hubs that parcels pass through on the way from pickup to doorstep.
            </p>
            <p>
              A shipment shows <strong>At origin hub</strong> when it reaches the hub nearest to
              the sender, and <strong>At destination hub</strong> when it reaches the hub serving
              the recipient. Each of those changes is recorded with a timestamp in the shipment
              timeline.
            </p>
          </div>

          <div className="mt-8">
            <Button asChild variant="signal">
              <Link href="/register">Book a shipment</Link>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-ink-900 text-lg font-semibold">Key information</h2>
          <dl className="border-ink-100 mt-3 divide-y rounded-sm border bg-white text-sm">
            {info.map((row) => (
              <div key={row.label} className="border-ink-100 flex justify-between gap-4 px-4 py-3">
                <dt className="text-ink-500">{row.label}</dt>
                <dd className="text-ink-900 text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-ink-900 text-lg font-semibold">Related hubs</h2>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((h) => (
              <li key={h.id}>
                <HubCard hub={h} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
