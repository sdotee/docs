import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en-US',
  languages: [
    'en-US',
    'zh-CN',
    'zh-TW',
    'ja',
    'ko',
    'id',
    'vi',
    'de',
    'fr',
    'es',
    'pt-PT',
    'pt-BR',
    'ru',
    'pl',
    'et',
    'nl',
    'tr',
    'sv',
    'it',
    'fi',
  ],
  hideLocale: 'default-locale',
});

/** Native-language display name shown in the language switcher and metadata */
export const langNameMap: Record<string, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  'pt-PT': 'Português (Portugal)',
  'pt-BR': 'Português (Brasil)',
  ru: 'Русский',
  pl: 'Polski',
  et: 'Eesti',
  nl: 'Nederlands',
  tr: 'Türkçe',
  sv: 'Svenska',
  it: 'Italiano',
  fi: 'Suomi',
};

/** Open Graph locale (BCP 47 with underscore) */
export const ogLocaleMap: Record<string, string> = {
  'en-US': 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
  id: 'id_ID',
  vi: 'vi_VN',
  de: 'de_DE',
  fr: 'fr_FR',
  es: 'es_ES',
  'pt-PT': 'pt_PT',
  'pt-BR': 'pt_BR',
  ru: 'ru_RU',
  pl: 'pl_PL',
  et: 'et_EE',
  nl: 'nl_NL',
  tr: 'tr_TR',
  sv: 'sv_SE',
  it: 'it_IT',
  fi: 'fi_FI',
};

/** Country flag SVG (ISO 3166-1 alpha-2 region) */
export const flagMap: Record<string, string> = {
  'en-US': 'https://assets.seecdn.com/images/flags/4x3/us.svg',
  'zh-CN': 'https://assets.seecdn.com/images/flags/4x3/cn.svg',
  'zh-TW': 'https://assets.seecdn.com/images/flags/4x3/tw.svg',
  ja: 'https://assets.seecdn.com/images/flags/4x3/jp.svg',
  ko: 'https://assets.seecdn.com/images/flags/4x3/kr.svg',
  id: 'https://assets.seecdn.com/images/flags/4x3/id.svg',
  vi: 'https://assets.seecdn.com/images/flags/4x3/vn.svg',
  de: 'https://assets.seecdn.com/images/flags/4x3/de.svg',
  fr: 'https://assets.seecdn.com/images/flags/4x3/fr.svg',
  es: 'https://assets.seecdn.com/images/flags/4x3/es.svg',
  'pt-PT': 'https://assets.seecdn.com/images/flags/4x3/pt.svg',
  'pt-BR': 'https://assets.seecdn.com/images/flags/4x3/br.svg',
  ru: 'https://assets.seecdn.com/images/flags/4x3/ru.svg',
  pl: 'https://assets.seecdn.com/images/flags/4x3/pl.svg',
  et: 'https://assets.seecdn.com/images/flags/4x3/ee.svg',
  nl: 'https://assets.seecdn.com/images/flags/4x3/nl.svg',
  tr: 'https://assets.seecdn.com/images/flags/4x3/tr.svg',
  sv: 'https://assets.seecdn.com/images/flags/4x3/se.svg',
  it: 'https://assets.seecdn.com/images/flags/4x3/it.svg',
  fi: 'https://assets.seecdn.com/images/flags/4x3/fi.svg',
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
