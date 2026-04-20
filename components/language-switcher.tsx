'use client';

import { usePathname } from 'next/navigation';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { cn } from '@/lib/cn';
import { i18n, flagMap as flags, LOCALE_COOKIE } from '@/lib/i18n';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

const PREFIX = '/docs';

function writeLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function buildLocaleUrl(pathname: string, newLocale: string): string {
  let path = pathname;
  if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);

  if (path === PREFIX) path = '';
  else if (path.startsWith(PREFIX + '/')) path = path.slice(PREFIX.length);

  const segs = path.split('/').filter(Boolean);
  if (segs.length > 0 && (i18n.languages as readonly string[]).includes(segs[0])) {
    segs.shift();
  }

  const restPath = segs.length > 0 ? '/' + segs.join('/') : '';
  const localeSegment =
    newLocale === i18n.defaultLanguage ? '' : `/${newLocale}`;
  return `${PREFIX}${localeSegment}${restPath}/`;
}

interface LanguageSelectProps extends ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export function LanguageSelect({
  className,
  variant = 'ghost',
  children,
  ...rest
}: LanguageSelectProps) {
  const context = useI18n();
  const pathname = usePathname();
  if (!context.locales) throw new Error('Missing `<I18nProvider />`');

  const handleChange = (newLocale: string) => {
    writeLocaleCookie(newLocale);
    // Full reload so the root layout re-runs and picks up the new x-locale
    // header; a client-side router.push() would keep the stale I18n context.
    window.location.href = buildLocaleUrl(pathname, newLocale);
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={context.text.chooseLanguage}
        className={cn(
          buttonVariants({ variant }),
          'gap-1.5 p-1.5 data-[state=open]:bg-fd-accent',
          className,
        )}
        {...rest}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-0.5 p-1">
        <p className="p-2 text-xs font-medium text-fd-muted-foreground">
          {context.text.chooseLanguage}
        </p>
        {context.locales.map((item) => (
          <button
            key={item.locale}
            type="button"
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 text-start text-sm rounded-lg transition-colors',
              item.locale === context.locale
                ? 'bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            )}
            onClick={() => handleChange(item.locale)}
          >
            {flags[item.locale] && (
              <img
                src={flags[item.locale]}
                alt=""
                width={20}
                height={15}
                className="rounded-sm"
              />
            )}
            {item.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function LanguageSelectText(props: ComponentProps<'span'>) {
  const { locales, locale } = useI18n();
  const flag = flags[locale ?? 'en'];
  const name = locales?.find((item) => item.locale === locale)?.name;
  return (
    <span {...props} className={cn('flex items-center gap-1.5', props.className)}>
      {flag && (
        <img
          src={flag}
          alt=""
          width={20}
          height={15}
          className="rounded-sm"
        />
      )}
      <span className="hidden md:inline">{name}</span>
    </span>
  );
}
