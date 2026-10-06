import { redirect, notFound } from 'next/navigation';
import { BACKEND_URL } from './config';
import { getAccessToken } from './session';
import type { ApiResponse } from '@/types/api';

/**
 * For use only inside Server Components / Server Actions. Calls the backend directly with the
 * httpOnly access token attached, since there's no CORS boundary to route around here - the
 * proxy route (api/proxy) exists specifically for the client-side TanStack Query layer, which
 * cannot read an httpOnly cookie to attach a Bearer header itself.
 *
 * On a 401 (expired token), we redirect to /login rather than attempting a refresh mid-render -
 * Next.js Server Components can't mutate cookies outside a Route Handler/Server Action, so a
 * silent refresh isn't possible here. The client-side proxy (api/proxy/[...path]/route.ts)
 * handles refreshing for the interactive, longer-lived parts of a session.
 */
export async function serverFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const token = await getAccessToken();

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    redirect('/login');
  }
  if (res.status === 404) {
    notFound();
  }

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new Error(body.message || 'Request failed');
  }

  return body;
}
