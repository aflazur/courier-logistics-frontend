import Link from 'next/link';
import { Package } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-ink-100 bg-ink-900 text-chalk-100 mt-auto border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <div className="font-display text-chalk-50 flex items-center gap-2 font-semibold">
            <span className="bg-signal-500 text-ink-950 flex h-7 w-7 items-center justify-center rounded-sm">
              <Package className="h-3.5 w-3.5" />
            </span>
            Courier & Logistics
          </div>
          <p className="text-ink-300 mt-3 max-w-xs text-sm">
            Reliable parcel pickup, delivery, and real-time tracking across the city.
          </p>
        </div>
        <div>
          <p className="text-ink-300 mb-3 font-mono text-xs tracking-wide uppercase">Company</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-signal-500">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-signal-500">
                Services
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-signal-500">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-signal-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-ink-300 mb-3 font-mono text-xs tracking-wide uppercase">Account</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/login" className="hover:text-signal-500">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-signal-500">
                Create account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-ink-800 text-ink-500 border-t py-4 text-center text-xs">
        &copy; {new Date().getFullYear()} Courier & Logistics Platform. Built for B7A7.
      </div>
    </footer>
  );
}
