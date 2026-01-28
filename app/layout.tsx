import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

// Force dynamic rendering to prevent build-time database queries
// This ensures pages are rendered at request time, not build time
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LFL Logistics - Reliable Freight Transport & Logistics',
  description: 'Longs Freight Load Logistics LLC - Professional trucking and logistics services across North America. FTL, LTL, and expedited shipping solutions.',
  keywords: 'freight logistics, trucking services, LTL shipping, FTL shipping, North America logistics, carrier services, shipping solutions',
  authors: [{ name: 'LFL Logistics' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'LFL Logistics - Reliable Freight Transport & Logistics',
    description: 'Professional trucking and logistics services across North America',
    url: 'https://www.lfllogistics.com',
    siteName: 'LFL Logistics',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="/custom.css" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
