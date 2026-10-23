import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en-US',
  languages: ['en-US', 'zh-CN', 'zh-TW'],
  hideLocale: 'default-locale',
});

/** Native-language display name shown in the language switcher and metadata */
export const langNameMap: Record<string, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

/** Open Graph locale (BCP 47 with underscore) */
export const ogLocaleMap: Record<string, string> = {
  'en-US': 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
};

/** Country flag SVG (ISO 3166-1 alpha-2 region) */
export const flagMap: Record<string, string> = {
  'en-US': 'https://assets.seecdn.com/images/flags/4x3/us.svg',
  'zh-CN': 'https://assets.seecdn.com/images/flags/4x3/cn.svg',
  'zh-TW': 'https://assets.seecdn.com/images/flags/4x3/tw.svg',
};

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function localePrefix(lang: string): string {
  return lang === i18n.defaultLanguage ? '' : `/${lang}`;
}

/**
 * `<html lang>` attribute value. Shortens `en-US` to `en` to match the site-wide
 * hreflang convention (and is the BCP 47 form most clients expect for English).
 */
export function htmlLang(lang: string): string {
  return lang === 'en-US' ? 'en' : lang;
}
