import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { source } from '@/lib/source';
import { i18n, ogLocaleMap, localePrefix } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import {
  LanguageSelect,
  LanguageSelectText,
} from '@/components/language-switcher';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    openGraph: {
      locale: ogLocaleMap[lang] ?? 'en_US',
      alternateLocale: i18n.languages
        .filter((l) => l !== lang)
        .map((l) => ogLocaleMap[l] ?? l),
    },
    alternates: {
      canonical: `/docs${localePrefix(lang)}/`,
    },
  };
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function LangDocsLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      {...baseOptions(lang)}
      slots={{
        languageSelect: {
          root: LanguageSelect,
          text: LanguageSelectText,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
