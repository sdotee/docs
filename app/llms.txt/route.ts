import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { i18n } from '@/lib/i18n';

const OPENAPI_URL =
  'https://raw.githubusercontent.com/sdotee/docs/refs/heads/main/openapi_swagger.yaml';

export const revalidate = false;

export function GET() {
  let text = llms(source).index(i18n.defaultLanguage);

  // Point non-API page links at the raw Markdown route so AI crawlers can
  // fetch the page content directly. API pages stay at their HTML URL since
  // we refer crawlers to the OpenAPI spec for machine-readable API reference.
  text = text.replace(/\]\((\/docs(?:\/[^)]*)?)\)/g, (_m, url: string) => {
    if (url.startsWith('/docs/api/')) return `](${url})`;
    if (url === '/docs') return '](/docs/index.mdx)';
    return `](${url}.mdx)`;
  });

  // Insert the OpenAPI pointer right after the title.
  text = text.replace(
    /^(# [^\n]+\n)/,
    `$1\n> For the API reference, see the OpenAPI spec: ${OPENAPI_URL}\n`,
  );

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
