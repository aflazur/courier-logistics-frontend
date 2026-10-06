'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_BY_ROLE } from '@/lib/nav-items';
import type { Role } from '@/types/api';

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="border-ink-100 hidden w-60 shrink-0 flex-col border-r bg-white md:flex">
      <div className="border-ink-100 border-b p-5">
        <Link href="/" className="font-display text-ink-900 flex items-center gap-2 font-semibold">
          <span className="bg-ink-900 text-signal-500 flex h-7 w-7 items-center justify-center rounded-sm">
            <Package className="h-3.5 w-3.5" />
          </span>
          Courier
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
      {role === 'ADMIN' && (
        <div className="border-ink-100 border-t p-3">
          <Link
            href="/admin/manage?status=PENDING"
            className="text-ink-500 hover:bg-ink-100 flex items-center gap-3 rounded-sm px-3 py-2 text-sm"
          >
            <Users className="h-4 w-4" /> Unassigned shipments
          </Link>
        </div>
      )}
    </aside>
  );
}