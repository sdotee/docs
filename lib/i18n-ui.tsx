import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n, langNameMap } from '@/lib/i18n';
import { getMessages } from '@/messages';

/**
 * Fumadocs UI strings (search, TOC, navigation labels, etc.) per locale.
 * Strings are sourced from `messages/{lang}.json` under the `fumadocs` key,
 * with `displayName` taken from `langNameMap` in `lib/i18n.ts`.
 */
const translations = Object.fromEntries(
  i18n.languages.map((lang) => [
    lang,
    {
      displayName: langNameMap[lang] ?? lang,
      ...getMessages(lang).fumadocs,
    },
  ]),
) as Parameters<typeof defineI18nUI>[1];

export const i18nUI = defineI18nUI(i18n, translations);
