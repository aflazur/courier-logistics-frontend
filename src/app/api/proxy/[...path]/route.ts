import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from '@/lib/session';
import { cookies } from 'next/headers';

// Every authenticated request a Client Component makes goes through here instead of straight to
// the backend. Two reasons: (1) the access token lives in an httpOnly cookie, so client JS has
// no way to read it and attach an Authorization header itself, and (2) this is the one place
// that can transparently refresh an expired token (a Route Handler CAN mutate cookies, unlike a
// Server Component render) and retry the original request once, so an interactive session
// doesn't die the moment a 15-minute access token expires.
async function forward(req: NextRequest, path: string[]) {
  const backendPath = `/${path.join('/')}${req.nextUrl.search}`;
  const accessToken = await getAccessToken();

  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

  const doFetch = (token?: string) =>
    fetch(`${BACKEND_URL}${backendPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      cache: 'no-store',
    });

  let backendRes = await doFetch(accessToken);

  if (backendRes.status === 401 && accessToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      backendRes = await doFetch(refreshed);
    } else {
      await clearAuthCookies();
    }
  }

  const responseBody = await backendRes.text();
  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;

  const body = await res.json();
  const newAccessToken: string | undefined = body?.data?.accessToken;
  if (!newAccessToken) return null;

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });

  return newAccessToken;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
