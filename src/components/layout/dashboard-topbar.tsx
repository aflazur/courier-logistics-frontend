import { LogoutButton } from './logout-button';
import { MobileNav } from './mobile-nav';
import { Badge } from '@/components/ui/badge';
import type { SessionUser } from '@/lib/auth-shared';

export function DashboardTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="border-ink-100 flex items-center justify-between gap-3 border-b bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav role={user.role} />
        <p className="font-display text-ink-900 text-base sm:text-lg font-semibold truncate">
          Welcome back, {user.name.split(' ')[0]}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden text-right sm:block">
          <p className="text-ink-900 text-sm font-medium">{user.name}</p>
          <Badge variant="dark" className="mt-0.5">
            {user.role}
          </Badge>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}