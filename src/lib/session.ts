import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, type SessionUser } from './auth-shared';

// Server-only cookie I/O. The `server-only` import makes it a hard build error (not just a
// bundling mistake) if any Client Component ever tries to import this file - see
// lib/auth-shared.ts for the pure, client-safe pieces (SESSION_COOKIE, roleHomePath).
export const ACCESS_TOKEN_COOKIE = 'courier_at';
export const REFRESH_TOKEN_COOKIE = 'courier_rt';
export { SESSION_COOKIE };
export type { SessionUser };

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // matches backend JWT_ACCESS_EXPIRES_IN default (15m)
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // matches backend JWT_REFRESH_EXPIRES_IN default (30d)

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(payload: {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  cookieStore.set(SESSION_COOKIE, JSON.stringify(payload.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(SESSION_COOKIE);
}

// Server Components / Server Actions only - reads the readable session cookie for display
// purposes (name, role for conditional rendering). Never contains the JWT.
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
