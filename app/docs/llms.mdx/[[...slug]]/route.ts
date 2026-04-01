import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const rawSlug = (await params).slug;
  const slug = rawSlug?.length === 1 && rawSlug[0] === 'index' ? [] : rawSlug;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
