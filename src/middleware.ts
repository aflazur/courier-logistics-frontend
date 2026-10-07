import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, type SessionUser } from '@/lib/auth-shared';
import { BACKEND_URL } from '@/lib/config';

const ACCESS_COOKIE = 'courier_at';
const REFRESH_COOKIE = 'courier_rt';

const ROLE_GUARDS: { prefix: string; roles: SessionUser['role'][] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/provider', roles: ['COURIER'] },
  { prefix: '/dashboard', roles: ['CUSTOMER'] },
];

const AUTH_PAGES = ['/login', '/register'];

const homeOf = (role: SessionUser['role']) =>
  role === 'ADMIN' ? '/admin' : role === 'COURIER' ? '/provider' : '/dashboard';

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { accessToken?: string } };
    return body.data?.accessToken ?? null;
  } catch {
    return null;
  }
}

function clearSession(res: NextResponse) {
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  let session: SessionUser | null = raw ? safeParse(raw) : null;

  // Access token cookie lives 15 min. If it is gone but a refresh token exists, renew it here
  // so Server Components never see a missing token (this removes the redirect loop).
  let renewed: string | null = null;
  const hasAccess = !!req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (session && !hasAccess) {
    renewed = refreshToken ? await refreshAccessToken(refreshToken) : null;
    if (!renewed) session = null;
  }

  const guard = ROLE_GUARDS.find((g) => pathname.startsWith(g.prefix));
  let res: NextResponse;

  if (guard && !session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    res = clearSession(NextResponse.redirect(url));
  } else if (guard && session && !guard.roles.includes(session.role)) {
    res = NextResponse.redirect(new URL(homeOf(session.role), req.url));
  } else if (session && AUTH_PAGES.includes(pathname)) {
    res = NextResponse.redirect(new URL(homeOf(session.role), req.url));
  } else if (!session && raw) {
    res = clearSession(NextResponse.next());
  } else if (renewed) {
    const headers = new Headers(req.headers);
    const others = req.cookies.getAll().filter((c) => c.name !== ACCESS_COOKIE);
    headers.set(
      'cookie',
      [...others.map((c) => `${c.name}=${c.value}`), `${ACCESS_COOKIE}=${renewed}`].join('; '),
    );
    res = NextResponse.next({ request: { headers } });
  } else {
    res = NextResponse.next();
  }

  if (renewed && session) {
    res.cookies.set(ACCESS_COOKIE, renewed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });
  }
  return res;
}

function safeParse(raw: string): SessionUser | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/provider/:path*', '/dashboard/:path*', '/login', '/register'],
};
