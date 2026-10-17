'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { roleHomePath } from '@/lib/auth-shared';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/lib/auth-shared';

const PROFILE_PATH: Record<SessionUser['role'], string> = {
  ADMIN: '/admin/profile',
  COURIER: '/provider/profile',
  CUSTOMER: '/dashboard/profile',
};

const ITEM =
  'text-ink-700 hover:bg-ink-100 flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm';

/** Avatar button + dropdown (Dashboard, Profile, Log out). Closes on outside click and Escape. */
export function ProfileMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out');
      router.push('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  const initial = user.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="hover:bg-ink-100 focus-visible:ring-signal-500 flex items-center gap-2 rounded-sm p-1 pr-2 focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="bg-signal-500 text-[#0a1420] flex h-8 w-8 items-center justify-center rounded-sm text-sm font-semibold">
          {initial}
        </span>
        <ChevronDown className={cn('text-ink-500 h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          className="border-ink-100 absolute right-0 z-50 mt-2 w-60 rounded-sm border bg-white p-2 shadow-lg"
        >
          <div className="border-ink-100 mb-1 border-b px-3 pt-1 pb-3">
            <p className="text-ink-900 truncate text-sm font-medium">{user.name}</p>
            <p className="text-ink-500 truncate text-xs">{user.email}</p>
          </div>
          <Link
            href={roleHomePath(user.role)}
            role="menuitem"
            className={ITEM}
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href={PROFILE_PATH[user.role]}
            role="menuitem"
            className={ITEM}
            onClick={() => setOpen(false)}
          >
            <UserIcon className="h-4 w-4" /> Profile
          </Link>
          <button type="button" role="menuitem" className={ITEM} onClick={logout} disabled={loggingOut}>
            <LogOut className="h-4 w-4" /> {loggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}
