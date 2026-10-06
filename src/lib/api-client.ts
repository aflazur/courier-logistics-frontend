'use client';

import type { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  status: number;
  errors: { path: string; message: string }[];

  constructor(message: string, status: number, errors: { path: string; message: string }[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Every call here hits our own /api/proxy/* route handler, never the backend directly - the
// browser has no way to attach the httpOnly access token itself, so the proxy does it for us
// server-side and transparently refreshes an expired token when needed.
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new ApiError(body.message || 'Something went wrong', res.status, body.errors ?? []);
  }

  return body;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
