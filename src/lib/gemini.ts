import 'server-only';

// Model is configurable so it can be swapped without a code change (see .env.example).
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export class GeminiError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

export interface GeminiTurn {
  role: 'user' | 'model';
  text: string;
}

/** Calls Gemini over REST (no SDK needed). The key is read server-side only. */
export async function generateText(opts: {
  system: string;
  turns: GeminiTurn[];
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError('The AI assistant is not configured yet.', 503);

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: opts.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        generationConfig: {
          temperature: opts.temperature ?? 0.4,
          maxOutputTokens: opts.maxOutputTokens ?? 1024,
        },
      }),
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    });
  } catch {
    throw new GeminiError('The AI service did not respond in time. Please try again.', 504);
  }

  if (res.status === 429) {
    throw new GeminiError('The AI service is busy right now. Please try again shortly.', 429);
  }
  if (!res.ok) {
    console.error('[gemini]', MODEL, res.status, (await res.text()).slice(0, 500));
    throw new GeminiError('The AI service returned an error.', 502);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim();
  if (!text) throw new GeminiError('The AI service returned an empty answer.', 502);
  return text;
}

// Best-effort limiter (per server instance). Enough to stop a single client hammering the
// free-tier quota; it is not a substitute for a shared store on multi-instance deployments.
const hits = new Map<string, number[]>();
export function rateLimited(id: string, max = 20, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(id, recent);
    return true;
  }
  recent.push(now);
  hits.set(id, recent);
  return false;
}
