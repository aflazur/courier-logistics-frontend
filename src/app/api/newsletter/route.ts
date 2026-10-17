import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';

// Server-validated like /api/contact. No mailing service is wired up for this project, so the
// validated address is logged server-side - swap in a real provider (Resend, Mailchimp...) later.
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid email address' },
      { status: 400 },
    );
  }

  console.log('[newsletter signup]', parsed.data.email);
  return NextResponse.json({ success: true, message: 'Subscribed', data: null });
}
