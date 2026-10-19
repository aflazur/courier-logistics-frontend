import 'server-only';

// Model is configurable so it can be swapped without a code change (see .env.example).
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
// Optional second model tried when the first keeps failing (e.g. 'gemini-2.5-flash-lite').
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL;
const endpoint = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const RETRYABLE = new Set([429, 500, 503, 504]);
const TIME_BUDGET_MS = 30_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: opts.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
    },
  });

  // The free tier is shared and the model is sometimes overloaded (429 / 503). These are
  // usually gone within a second or two, so retry a couple of times before giving up, and
  // fall back to a second model if one is configured.
  const models = [MODEL, ...(FALLBACK_MODEL && FALLBACK_MODEL !== MODEL ? [FALLBACK_MODEL] : [])];
  const startedAt = Date.now();
  let lastStatus = 502;
  let res: Response | null = null;

  outer: for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await sleep(attempt * 1200);
      if (Date.now() - startedAt > TIME_BUDGET_MS) break outer;

      try {
        const r = await fetch(endpoint(model), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body,
          signal: AbortSignal.timeout(20_000),
          cache: 'no-store',
        });
        if (r.ok) {
          res = r;
          break outer;
        }
        lastStatus = r.status;
        console.error(`[gemini] ${model} -> ${r.status}`, (await r.text()).slice(0, 300));
        if (!RETRYABLE.has(r.status)) break; // e.g. 400/403/404: try the next model, not again
      } catch {
        lastStatus = 504;
        console.error(`[gemini] ${model} request failed or timed out`);
      }
    }
  }

  if (!res) {
    if (lastStatus === 429) {
      throw new GeminiError('The AI service is busy right now. Please try again shortly.', 429);
    }
    if (lastStatus === 503 || lastStatus === 504) {
      throw new GeminiError('The AI service is overloaded. Please try again in a moment.', 503);
    }
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
