'use client';

import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { getMessages } from '@/messages';
import { i18n } from '@/lib/i18n';

export function CookieBar() {
  const [visible, setVisible] = useState(false);
  const { locale } = useI18n();
  const activeLocale = locale ?? i18n.defaultLanguage;
  const t = getMessages(activeLocale).cookieBar;
  const privacyUrl =
    activeLocale === i18n.defaultLanguage
      ? 'https://s.ee/privacy/'
      : `https://s.ee/${activeLocale}/privacy/`;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const cardClasses =
    'flex flex-col gap-3 rounded-xl border border-border bg-popover/95 p-4 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4';

  return (
    <>
      <CookieConsent
        disableStyles
        location="bottom"
        cookieName="see.cookie.consent"
        buttonText={t.accept}
        declineButtonText={t.decline}
        enableDeclineButton
        expires={365}
        containerClasses={`fixed bottom-3 left-1/2 z-[9999] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 sm:bottom-4 animate-[cookie-slide-up_0.45s_cubic-bezier(0.22,1,0.36,1)_both] ${cardClasses}`}
        contentClasses="flex flex-1 items-center gap-3 text-sm leading-relaxed text-foreground"
        buttonWrapperClasses="flex shrink-0 items-center gap-2"
        buttonClasses="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        declineButtonClasses="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 12.3a9.5 9.5 0 1 1-9.8-9.8 4 4 0 0 0 5.5 5.5 4 4 0 0 0 4.3 4.3Z" />
            <circle cx="9" cy="10" r="0.8" fill="currentColor" />
            <circle cx="14.5" cy="14.5" r="0.8" fill="currentColor" />
            <circle cx="9.5" cy="15.5" r="0.8" fill="currentColor" />
          </svg>
        </span>
        <span className="flex-1 text-muted-foreground">
          {t.message}{' '}
          <a
            href={privacyUrl}
            className="font-medium text-foreground underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {t.privacyLink}
          </a>
        </span>
      </CookieConsent>
      <style jsx global>{`
        @keyframes cookie-slide-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
