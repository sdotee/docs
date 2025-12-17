import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'S.EE Documentation',
  description: 'Official documentation for S.EE - Link management and QR code platform',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://stat.s.ee/js/pa-t6Oo-rwzMWYrqE-0Gx4Vp.js"
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
      </body>
    </html>
  );
}
