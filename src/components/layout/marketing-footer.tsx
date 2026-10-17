import Link from 'next/link';
import { Mail, MapPin, Package, Phone } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

// Add more entries (LinkedIn, Facebook...) here once the real profile URLs exist.
const SOCIALS = [
  { href: 'https://github.com/aflazur', label: 'GitHub', icon: GithubIcon },
  { href: 'mailto:mdaflazurrahaman2022@gmail.com', label: 'Email', icon: Mail },
];

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help', label: 'Help Center' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Log in' },
      { href: '/register', label: 'Create account' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="surface-dark border-ink-700 text-chalk-100 mt-auto border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="font-display text-chalk-50 flex items-center gap-2 font-semibold">
            <span className="bg-signal-500 text-[#0a1420] flex h-7 w-7 items-center justify-center rounded-sm">
              <Package className="h-3.5 w-3.5" />
            </span>
            Courier & Logistics
          </div>
          <p className="text-ink-300 mt-3 max-w-xs text-sm">
            Reliable parcel pickup, delivery, and real-time tracking across the city.
          </p>
          <ul className="text-ink-300 mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="text-signal-500 h-4 w-4" /> mdaflazurrahaman2022@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="text-signal-500 h-4 w-4" /> +880 1879-877653
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="text-signal-500 h-4 w-4" /> Motijheel C/A, Dhaka, Bangladesh
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="border-ink-700 text-ink-300 hover:border-signal-500 hover:text-signal-500 flex h-9 w-9 items-center justify-center rounded-sm border"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-ink-300 mb-3 font-mono text-xs tracking-wide uppercase">
              {col.title}
            </p>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-signal-500">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-ink-800 text-ink-300 border-t py-4 text-center text-xs">
        &copy; {new Date().getFullYear()} Courier & Logistics Platform.
      </div>
    </footer>
  );
}
