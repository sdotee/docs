import { getPageImage, source } from '@/lib/source';
import { generate, getImageResponseOptions } from '@/lib/og/mono';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    generate({
      title: page.data.title,
      description: page.data.description,
      site: 'S.EE',
    }),
    {
      ...(await getImageResponseOptions()),
      headers: {
        'Content-Type': 'image/webp',
      },
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
