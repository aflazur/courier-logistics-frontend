import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';
import { ProfileMenu } from './profile-menu';
import { Badge } from '@/components/ui/badge';
import type { SessionUser } from '@/lib/auth-shared';

export function DashboardTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="border-ink-100 flex items-center justify-between gap-3 border-b bg-white px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav role={user.role} />
        <p className="font-display text-ink-900 truncate text-base font-semibold sm:text-lg">
          Welcome back, {user.name.split(' ')[0]}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge variant="dark" className="hidden sm:inline-flex">
          {user.role}
        </Badge>
        <ThemeToggle />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
