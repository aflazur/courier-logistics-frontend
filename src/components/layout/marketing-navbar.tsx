'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { ProfileMenu } from './profile-menu';

// Six public routes for everyone; logged-in users also get their Dashboard link (7 routes).
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/help', label: 'Help' },
  { href: '/contact', label: 'Contact' },
];

export function MarketingNavbar() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = user
    ? [...NAV_LINKS, { href: roleHomePath(user.role), label: 'Dashboard' }]
    : NAV_LINKS;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="border-ink-100 bg-chalk-50/95 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-display text-ink-900 flex items-center gap-2 font-semibold">
          <span className="bg-ink-900 text-signal-500 flex h-8 w-8 items-center justify-center rounded-sm">
            <Package className="h-4 w-4" />
          </span>
          Courier<span className="text-signal-600">&</span>Logistics
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'text-sm font-medium',
                isActive(link.href) ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
            <ProfileMenu user={user} />
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

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="text-ink-900 p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-ink-100 bg-chalk-50 flex flex-col gap-4 border-t px-5 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-700 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-3">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" variant="signal" className="flex-1">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          )}
          {user && (
            <div className="border-ink-100 flex items-center justify-between border-t pt-4">
              <span className="text-ink-500 truncate text-sm">{user.email}</span>
              <ProfileMenu user={user} />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
