import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, type SessionUser } from '@/lib/auth-shared';

// Route-prefix -> roles allowed to view it. Checked against the readable session cookie (which
// holds only { id, name, email, role } - never the JWT itself, so middleware never touches
// anything sensitive). The backend independently re-checks role on every request too - this is
// a UX guard (redirect before rendering), not the security boundary; that boundary is the
// backend's own auth() middleware, which can't be bypassed by tampering with this cookie.
const ROLE_GUARDS: { prefix: string; roles: SessionUser['role'][] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/provider', roles: ['COURIER'] },
  { prefix: '/dashboard', roles: ['CUSTOMER'] },
];

const AUTH_PAGES = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const session: SessionUser | null = raw ? safeParse(raw) : null;

  const guard = ROLE_GUARDS.find((g) => pathname.startsWith(g.prefix));

  if (guard) {
    if (!session) {
      const url = new URL('/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (!guard.roles.includes(session.role)) {
      // Logged in, but wrong role for this section - send them to their own home instead of a
      // dead end, rather than just a blanket 403 page.
      const home =
        session.role === 'ADMIN'
          ? '/admin'
          : session.role === 'COURIER'
            ? '/provider'
            : '/dashboard';
      return NextResponse.redirect(new URL(home, req.url));
    }
  }

  if (session && AUTH_PAGES.includes(pathname)) {
    const home =
      session.role === 'ADMIN' ? '/admin' : session.role === 'COURIER' ? '/provider' : '/dashboard';
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
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
