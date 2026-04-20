import { getPageImage, source } from '@/lib/source';
import { generate, getImageResponseOptions } from '@/lib/og/mono';
import { notFound } from 'next/navigation';
import { ImageResponse } from '@takumi-rs/image-response';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;

  const firstSeg = slug[0];
  const isLocale =
    !!firstSeg && (i18n.languages as readonly string[]).includes(firstSeg);
  const lang = isLocale ? firstSeg : i18n.defaultLanguage;
  const pageSlug = (isLocale ? slug.slice(1) : slug).slice(0, -1);

  const page =
    source.getPage(pageSlug, lang) ??
    source.getPage(pageSlug, i18n.defaultLanguage);
  if (!page) notFound();

  return new ImageResponse(
    generate({
      title: page.data.title,
      description: page.data.description,
      site: 'S.EE',
    }),
    await getImageResponseOptions(),
  );
}

export function generateStaticParams() {
  const defaultPages = source.getPages(i18n.defaultLanguage);
  return i18n.languages.flatMap((lang) =>
    defaultPages.map((page) => ({
      slug: getPageImage(page, lang).segments,
    })),
  );
}
