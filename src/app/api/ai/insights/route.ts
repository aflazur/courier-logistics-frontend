import { NextResponse } from 'next/server';
import { getAccessToken, getSession } from '@/lib/session';
import { BACKEND_URL } from '@/lib/config';
import { GeminiError, generateText, rateLimited } from '@/lib/gemini';
import type { ApiResponse, DashboardStats, Shipment } from '@/types/api';

const DAY_MS = 86_400_000;
const DAYS = 14;

async function backend<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) throw new Error(body.message || 'Backend request failed');
  return body.data;
}

/** Plain statistics done in code, so the model only has to explain numbers, not compute them. */
function analyse(shipments: Shipment[]) {
  const today = new Date().setHours(0, 0, 0, 0);
  const perDay = Array.from({ length: DAYS }, (_, i) => {
    const start = today - (DAYS - 1 - i) * DAY_MS;
    return {
      date: new Date(start).toISOString().slice(0, 10),
      count: shipments.filter((s) => {
        const t = new Date(s.createdAt).getTime();
        return t >= start && t < start + DAY_MS;
      }).length,
    };
  });

  const counts = perDay.map((d) => d.count);
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const sd = Math.sqrt(counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length);
  // A day is flagged when it is more than 2 standard deviations from the 14-day mean.
  const unusualDays = sd > 0 ? perDay.filter((d) => Math.abs(d.count - mean) > 2 * sd) : [];

  const byStatus: Record<string, number> = {};
  for (const s of shipments) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;

  const now = Date.now();
  const stuck = shipments.filter(
    (s) =>
      !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(s.status) &&
      now - new Date(s.updatedAt).getTime() > 3 * DAY_MS,
  ).length;
  const unassigned = shipments.filter(
    (s) => s.status === 'PICKUP_SCHEDULED' && !s.courierId,
  ).length;
  const closed = (byStatus.DELIVERED ?? 0) + (byStatus.FAILED_DELIVERY ?? 0);
  const failedRate = closed > 0 ? (byStatus.FAILED_DELIVERY ?? 0) / closed : 0;

  return { perDay, mean, unusualDays, byStatus, stuck, unassigned, failedRate };
}

export async function POST() {
  const session = await getSession();
  const token = await getAccessToken();
  if (!session || session.role !== 'ADMIN' || !token) {
    return NextResponse.json({ success: false, message: 'Admins only.' }, { status: 403 });
  }
  if (rateLimited(`insights:${session.id}`, 10)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please wait a few minutes.' },
      { status: 429 },
    );
  }

  try {
    const [stats, shipments] = await Promise.all([
      backend<DashboardStats>('/admin/dashboard-stats', token),
      backend<Shipment[]>('/shipments?limit=100&sortBy=createdAt&sortOrder=desc', token),
    ]);
    const a = analyse(shipments);

    const summary = {
      totals: stats,
      sampleSize: shipments.length,
      newShipmentsPerDayLast14: a.perDay,
      averagePerDay: Number(a.mean.toFixed(2)),
      unusualDays: a.unusualDays,
      statusCounts: a.byStatus,
      activeShipmentsNotUpdatedFor3Days: a.stuck,
      paidShipmentsWaitingForCourier: a.unassigned,
      failedDeliveryRatePercent: Number((a.failedRate * 100).toFixed(1)),
    };

    const text = await generateText({
      system:
        'You are an operations analyst for a courier platform. You receive pre-computed statistics as JSON. ' +
        'Write 3 to 5 short bullet points ("- " prefix) covering trends, anything unusual, and risks, then one final line starting with "Recommended action:". ' +
        'Use only the numbers given, never invent data, and say so plainly if the sample is too small to conclude anything. ' +
        'Plain text only, no headings, under 140 words.',
      turns: [{ role: 'user', text: JSON.stringify(summary) }],
      maxOutputTokens: 4096,
      temperature: 0.2,
    });

    return NextResponse.json({
      success: true,
      data: {
        insights: text,
        flags: {
          unusualDays: a.unusualDays.length,
          stuck: a.stuck,
          unassigned: a.unassigned,
        },
        sampleSize: shipments.length,
      },
    });
  } catch (err) {
    if (err instanceof GeminiError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { success: false, message: 'Could not load platform data for the analysis.' },
      { status: 502 },
    );
  }
}
