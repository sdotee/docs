import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> },
) {
  const { lang, slug: rawSlug } = await params;
  const slug = rawSlug?.length === 1 && rawSlug[0] === 'index' ? [] : rawSlug;
  const page =
    source.getPage(slug, lang) ??
    source.getPage(slug, i18n.defaultLanguage);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    source.getPages(lang).map((page) => ({
      lang,
      slug: page.slugs,
    })),
  );
}
