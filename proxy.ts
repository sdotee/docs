import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import Negotiator from 'negotiator';
import { i18n, LOCALE_COOKIE } from '@/lib/i18n';

const PREFIX = '/docs';

function stripPrefix(pathname: string): string {
  if (pathname === PREFIX) return '/';
  if (pathname.startsWith(PREFIX + '/')) return pathname.slice(PREFIX.length);
  return pathname;
}

const i18nMiddleware = createI18nMiddleware({
  ...i18n,
  format: {
    get(url) {
      const pathname = stripPrefix(url.pathname);
      const segs = pathname.split('/');
      return segs[1] || undefined;
    },
    add(url, locale) {
      const next = new URL(url);
      const pathname = stripPrefix(url.pathname);
      const rest = pathname === '/' ? '' : pathname;
      next.pathname = `${PREFIX}/${locale}${rest}`.replaceAll(/\/+/g, '/');
      return next;
    },
    remove(url) {
      const next = new URL(url);
      const pathname = stripPrefix(url.pathname);
      const segs = pathname.split('/');
      const rest = segs.slice(2).join('/');
      next.pathname = `${PREFIX}${rest ? '/' + rest : '/'}`.replaceAll(/\/+/g, '/');
      return next;
    },
  },
});

function negotiateFromHeader(req: NextRequest): string | undefined {
  const header = req.headers.get('accept-language');
  if (!header) return undefined;
  const requested = new Negotiator({
    headers: { 'accept-language': header },
  }).languages();
  if (requested.length === 0 || requested[0] === '*') return undefined;

  const supported = i18n.languages as readonly string[];

  for (const tag of requested) {
    const lower = tag.toLowerCase();
    // Exact match
    const exact = supported.find((s) => s.toLowerCase() === lower);
    if (exact) return exact;
    // Primary-subtag match: follows declared list order, so generic "pt"
    // picks the first supported "pt-*" (pt-PT before pt-BR in our list).
    const primary = lower.split('-')[0];
    const byPrimary = supported.find(
      (s) => s.toLowerCase().split('-')[0] === primary,
    );
    if (byPrimary) return byPrimary;
  }
  return undefined;
}

function setLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const stripped = stripPrefix(req.nextUrl.pathname);
  const segs = stripped.split('/').filter(Boolean);
  const firstSeg = segs[0];
  const urlHasLocale =
    !!firstSeg && (i18n.languages as readonly string[]).includes(firstSeg);

  // URL already carries a locale prefix → respect it, no redirect.
  if (urlHasLocale) {
    const result = await i18nMiddleware(req, event);
    const response = result instanceof NextResponse ? result : NextResponse.next();
    response.headers.set('x-locale', firstSeg);
    return response;
  }

  // URL has no locale prefix: decide preferred locale.
  const cookieValue = req.cookies.get(LOCALE_COOKIE)?.value;
  const cookieValid =
    !!cookieValue && (i18n.languages as readonly string[]).includes(cookieValue);

  let preferred: string | undefined;
  let writeCookie = false;

  if (cookieValid) {
    preferred = cookieValue;
  } else {
    preferred = negotiateFromHeader(req);
    writeCookie = true;
  }

  // Redirect to the preferred non-default locale so the URL reflects it.
  if (preferred && preferred !== i18n.defaultLanguage) {
    const target = new URL(req.nextUrl);
    const rest = stripped === '/' ? '' : stripped;
    target.pathname = `${PREFIX}/${preferred}${rest}`.replaceAll(/\/+/g, '/');
    const response = NextResponse.redirect(target);
    if (writeCookie) setLocaleCookie(response, preferred);
    response.headers.set('x-locale', preferred);
    return response;
  }

  // Default locale path: internal rewrite to /docs/<default>/...
  const result = await i18nMiddleware(req, event);
  const response = result instanceof NextResponse ? result : NextResponse.next();
  response.headers.set('x-locale', i18n.defaultLanguage);
  if (writeCookie) setLocaleCookie(response, i18n.defaultLanguage);
  return response;
}

export const config = {
  matcher: [
    '/docs',
    '/docs/((?!api-search|sitemap\\.xml|llms\\.txt|llms-full\\.txt|og/|og$|_next/).*)',
  ],
};
