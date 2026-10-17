'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    kicker: 'Book',
    title: 'Parcels moved with a paper trail you can actually see.',
    text: 'Enter pickup and delivery details and see the fee before you pay. Every shipment is logged step by step from your dashboard.',
    cta: { href: '/register', label: 'Book your first shipment' },
  },
  {
    kicker: 'Track',
    title: 'Watch it move hub to hub, status by status.',
    text: 'From pickup scheduled to signed for, each status change is written to an audit trail with a timestamp.',
    cta: { href: '/services', label: 'See how it works' },
  },
  {
    kicker: 'Pay',
    title: 'Pay once, securely, and pickup is scheduled automatically.',
    text: 'Delivery fees are settled through SSLCommerz and verified server-side before anything is marked paid.',
    cta: { href: '/pricing', label: 'See the pricing' },
  },
];

const INTERVAL_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* key re-mounts the block so the fade-up animation replays on every slide change */}
      <div key={index} className="hero-fade-up" aria-live="polite">
        <span className="bg-ink-800 text-signal-500 inline-flex items-center rounded-sm px-3 py-1 font-mono text-xs tracking-wide uppercase">
          {slide.kicker}
        </span>
        <h1 className="font-display mt-5 text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
          {slide.title}
        </h1>
        <p className="text-ink-300 mt-4 max-w-lg text-base sm:text-lg">{slide.text}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="signal">
            <Link href={slide.cta.href}>
              {slide.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-ink-600 text-chalk-50 hover:bg-ink-800"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-2" role="tablist" aria-label="Hero slides">
        {SLIDES.map((s, i) => (
          <button
            key={s.kicker}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide: ${s.kicker}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 rounded-sm transition-all',
              i === index ? 'bg-signal-500 w-10' : 'bg-ink-600 w-5 hover:bg-ink-300',
            )}
          />
        ))}
      </div>
    </div>
  );
}
