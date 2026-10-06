import type { Role, User } from '@/types/api';

// Split out from lib/session.ts deliberately: that file imports next/headers (cookies()),
// which can only ever run server-side. Client Components (navbar, login form, auth store) only
// need the cookie NAME and the pure roleHomePath() helper, not the cookie-reading functions
// themselves - importing those from the same module as next/headers would pull server-only code
// into the client bundle and break the build.
export const SESSION_COOKIE = 'courier_session';

export type SessionUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export function roleHomePath(role: Role): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'COURIER') return '/provider';
  return '/dashboard';
}
