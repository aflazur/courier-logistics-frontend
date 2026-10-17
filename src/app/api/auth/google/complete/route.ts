import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { roleHomePath } from '@/lib/auth-shared';
import { setAuthCookies } from '@/lib/session';
import type { ApiResponse, Role, User } from '@/types/api';

// Landing point of the backend's Google callback. The tokens arrive in the query string, get
// moved into httpOnly cookies here, and the browser is redirected straight on - so they only
// ever appear in this one redirected request, never in a page the user sits on.
export async function GET(req: NextRequest) {
  const fail = () => NextResponse.redirect(new URL('/login?error=google', req.url));

  const accessToken = req.nextUrl.searchParams.get('accessToken');
  const refreshToken = req.nextUrl.searchParams.get('refreshToken');
  if (!accessToken || !refreshToken) return fail();

  try {
    const res = await fetch(`${BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    const body = (await res.json()) as ApiResponse<User>;
    if (!res.ok || !body.success) return fail();

    const user = body.data;
    await setAuthCookies({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    return NextResponse.redirect(new URL(roleHomePath(user.role as Role), req.url));
  } catch {
    return fail();
  }
}
