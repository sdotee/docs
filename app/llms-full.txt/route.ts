import { getLLMText, source } from '@/lib/source';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages(i18n.defaultLanguage);
  const texts = await Promise.all(pages.map(getLLMText));
  return new Response(texts.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
