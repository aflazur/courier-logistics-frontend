import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

// A real, server-validated endpoint (not a client-side-only fake success). There's no mail
// service wired up for a coursework contact form, so this logs the validated submission
// server-side - swap this for a real email/ticket integration in production.
export async function POST(req: NextRequest) {
  const payload = await req.json();
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
      { status: 400 },
    );
  }

  console.log('[contact-form submission]', parsed.data);

  return NextResponse.json({ success: true, message: 'Message received', data: null });
}
