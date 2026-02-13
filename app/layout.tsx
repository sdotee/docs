import { RootProvider } from 'fumadocs-ui/provider/next';
import { Agentation } from 'agentation';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://s.ee/docs';
const ogImage = 'https://assets.seecdn.com/og-image.webp';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'S.EE Documentation',
  description: 'Official documentation for S.EE - Link management and QR code platform',
  url: siteUrl,
  publisher: {
    '@type': 'Organization',
    name: 'S.EE',
    url: 'https://s.ee',
    logo: {
      '@type': 'ImageObject',
      url: 'https://assets.seecdn.com/logo.png',
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'S.EE Documentation',
    template: '%s | S.EE Docs',
  },
  description: 'Official documentation for S.EE - Link management and QR code platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'S.EE Documentation',
    title: 'S.EE Documentation',
    description: 'Official documentation for S.EE - Link management and QR code platform',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'S.EE Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S.EE Documentation',
    description: 'Official documentation for S.EE - Link management and QR code platform',
    images: [ogImage],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          src="https://stat.s.ee/js/pa-_nUYN3IVizvVrt2AoShF2.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              api: '/docs/api-search',
            },
          }}
        >
          {children}
        </RootProvider>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  );
}
