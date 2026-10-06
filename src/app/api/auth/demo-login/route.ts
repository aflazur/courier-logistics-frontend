import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { setAuthCookies } from '@/lib/session';
import type { ApiResponse, AuthPayload, Role } from '@/types/api';

// These map to accounts that must already exist in the backend - the backend's own seed script
// only creates the admin account, so the customer/courier demo accounts need to be registered
// once (see README "Demo accounts" section) before these buttons will work.
const DEMO_ACCOUNTS: Record<Role, { email: string; password: string }> = {
  ADMIN: {
    email: process.env.DEMO_ADMIN_EMAIL ?? 'admin@courier.com',
    password: process.env.DEMO_ADMIN_PASSWORD ?? 'Admin123!',
  },
  CUSTOMER: {
    email: process.env.DEMO_CUSTOMER_EMAIL ?? 'customer@test.com',
    password: process.env.DEMO_CUSTOMER_PASSWORD ?? 'password123',
  },
  COURIER: {
    email: process.env.DEMO_COURIER_EMAIL ?? 'courier@test.com',
    password: process.env.DEMO_COURIER_PASSWORD ?? 'password123',
  },
};

export async function POST(req: NextRequest) {
  const { role } = (await req.json()) as { role: Role };
  const credentials = DEMO_ACCOUNTS[role];

  if (!credentials) {
    return NextResponse.json({ success: false, message: 'Unknown demo role' }, { status: 400 });
  }

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const body = (await res.json()) as ApiResponse<AuthPayload>;

  if (!res.ok || !body.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Demo ${role.toLowerCase()} account isn't set up on this backend yet. ${body.message}`,
      },
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
