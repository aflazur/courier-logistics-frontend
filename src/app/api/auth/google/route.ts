import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

// Starts the Google sign-in: the browser is sent to the backend, which redirects on to
// Google's consent screen. (The backend URL is server-side config, so the button links here
// instead of embedding it in client code.)
export function GET(req: NextRequest) {
  if (!process.env.BACKEND_API_URL && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/login?error=google', req.url));
  }
  return NextResponse.redirect(`${BACKEND_URL}/auth/google`);
}
