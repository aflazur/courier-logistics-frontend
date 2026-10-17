import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/lib/faq';

/** Native <details> accordion: keyboard accessible, no client JS needed. */
export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <details key={f.q} className="group border-ink-100 rounded-sm border bg-white">
          <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="text-ink-500 h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="text-ink-500 px-5 pb-5 text-sm leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
