'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingNavbar() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  return (
    <header className="border-ink-100 bg-chalk-50/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-ink-900 flex items-center gap-2 font-semibold">
          <span className="bg-ink-900 text-signal-500 flex h-8 w-8 items-center justify-center rounded-sm">
            <Package className="h-4 w-4" />
          </span>
          Courier<span className="text-signal-600">&</span>Logistics
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-700 hover:text-ink-900 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button asChild size="sm" variant="signal">
              <Link href={roleHomePath(user.role)}>Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" variant="signal">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="text-ink-900 md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-ink-100 bg-chalk-50 flex flex-col gap-4 border-t px-5 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-700 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button asChild size="sm" variant="signal">
              <Link href={roleHomePath(user.role)}>Go to dashboard</Link>
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" variant="signal" className="flex-1">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
