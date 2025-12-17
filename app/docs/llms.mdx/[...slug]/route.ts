import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const slug = (await params).slug;
  // Handle 'index' as the root page
  const pageSlug = slug.length === 1 && slug[0] === 'index' ? [] : slug;
  const page = source.getPage(pageSlug);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  const params = source.generateParams();
  // Add 'index' for the root page, filter empty slugs for others
  return [
    { slug: ['index'] },
    ...params.filter((p) => p.slug.length > 0),
  ];
}
