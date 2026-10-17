import { cn } from '@/lib/utils';

function seed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Route-map illustration generated from the hub id, so each hub has its own recognisable
 * picture without needing uploaded photos. Colours come from theme tokens (works in dark mode).
 */
export function HubIllustration({ id, className }: { id: string; className?: string }) {
  const s = seed(id);
  const r = (n: number, min: number, max: number) => min + ((s >> n) % (max - min));

  // A route with three bends, ending at the hub pin.
  const pts: [number, number][] = [
    [20, r(0, 70, 100)],
    [r(3, 80, 120), r(6, 45, 65)],
    [r(9, 160, 200), r(12, 70, 95)],
    [r(15, 230, 270), r(18, 45, 65)],
  ];
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const [px, py] = pts[3];

  return (
    <svg
      viewBox="0 0 320 128"
      className={cn('bg-chalk-100 block w-full', className)}
      role="img"
      aria-label="Route map illustration of the hub"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="128" className="stroke-ink-100" />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} className="stroke-ink-100" />
      ))}
      <path
        d={path}
        fill="none"
        strokeWidth="3"
        strokeDasharray="7 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-ink-500"
      />
      {pts.slice(0, 3).map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          className="fill-chalk-50 stroke-ink-500"
          strokeWidth="2"
        />
      ))}
      <circle cx={px} cy={py} r="13" className="fill-signal-500" opacity="0.25" />
      <circle cx={px} cy={py} r="7" className="fill-signal-500 stroke-ink-900" strokeWidth="2" />
    </svg>
  );
}
