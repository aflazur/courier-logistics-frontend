import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { getSession } from '@/lib/session';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Courier & Logistics Platform',
    template: '%s | Courier & Logistics Platform',
  },
  description:
    'Book, track, and manage parcel deliveries across the city - real-time status, courier assignment, and secure payments.',
  openGraph: {
    title: 'Courier & Logistics Platform',
    description: 'Book, track, and manage parcel deliveries across the city.',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="bg-chalk-50 text-ink-900 flex min-h-full flex-col">
        <Providers initialUser={session}>{children}</Providers>
      </body>
    </html>
  );
}
