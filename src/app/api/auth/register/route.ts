import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { setAuthCookies } from '@/lib/session';
import type { ApiResponse, AuthPayload } from '@/types/api';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = (await res.json()) as ApiResponse<AuthPayload>;

  if (!res.ok || !body.success) {
    return NextResponse.json(
      { success: false, message: body.message, errors: body.errors ?? [] },
      { status: res.status },
    );
  }

  await setAuthCookies({
    accessToken: body.data.accessToken,
    refreshToken: body.data.refreshToken,
    user: {
      id: body.data.user.id,
      name: body.data.user.name,
      email: body.data.user.email,
      role: body.data.user.role,
    },
  });

  return NextResponse.json({
    success: true,
    message: body.message,
    data: { user: body.data.user },
  });
}
