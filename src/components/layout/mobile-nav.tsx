'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_BY_ROLE } from '@/lib/nav-items';
import type { Role } from '@/types/api';

export function MobileNav({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="text-ink-700 flex h-9 w-9 items-center justify-center rounded-sm hover:bg-ink-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-950/60" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl">
          <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>
          <div className="border-ink-100 flex items-center justify-between border-b p-5">
            <Link
              href="/"
              className="font-display text-ink-900 flex items-center gap-2 font-semibold"
              onClick={() => setOpen(false)}
            >
              <span className="bg-ink-900 text-signal-500 flex h-7 w-7 items-center justify-center rounded-sm">
                <Package className="h-3.5 w-3.5" />
              </span>
              Courier
            </Link>
            <DialogPrimitive.Close className="text-ink-500">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-ink-900 text-chalk-50' : 'text-ink-700 hover:bg-ink-100',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}