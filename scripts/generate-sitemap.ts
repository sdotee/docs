import { readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { i18n } from '@/lib/i18n';

const BASE_URL = 'https://s.ee/docs';
const DOCS_DIR = './content/docs';
const OUTPUT_FILE = './public/sitemap.xml';

/** hreflang for the default locale is shortened from "en-US" to "en". */
function hreflangFor(locale: string): string {
  return locale === i18n.defaultLanguage ? 'en' : locale;
}

function urlFor(slug: string, locale: string): string {
  const prefix = locale === i18n.defaultLanguage ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${slug}`;
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(fullPath)));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

interface ParsedFile {
  slug: string;
  locale: string;
}

/**
 * Parse a content path into { slug, locale }, e.g.:
 *   content/docs/index.mdx               → { slug: '/',              locale: 'en-US' }
 *   content/docs/index.zh-CN.mdx         → { slug: '/',              locale: 'zh-CN' }
 *   content/docs/signup.mdx              → { slug: '/signup/',       locale: 'en-US' }
 *   content/docs/api/CreateShortUrl.mdx  → { slug: '/api/CreateShortUrl/', locale: 'en-US' }
 */
function parseFile(filePath: string): ParsedFile {
  let rel = filePath
    .replace(/^\.?\/?content\/docs/, '')
    .replace(/\.mdx$/, '');

  let locale: string = i18n.defaultLanguage;
  const suffix = rel.match(/\.([^./\\]+)$/);
  if (suffix && (i18n.languages as readonly string[]).includes(suffix[1])) {
    locale = suffix[1];
    rel = rel.slice(0, -suffix[0].length);
  }

  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  if (rel === '') rel = '/';
  else if (!rel.endsWith('/')) rel = rel + '/';

  return { slug: rel, locale };
}

interface PageEntry {
  locales: Set<string>;
  latestMtime: number;
}

async function generateSitemap() {
  const mdxFiles = await collectMdxFiles(DOCS_DIR);

  const pages = new Map<string, PageEntry>();
  for (const file of mdxFiles) {
    const { slug, locale } = parseFile(file);
    const mtime = (await stat(file)).mtime.getTime();
    const existing = pages.get(slug);
    if (existing) {
      existing.locales.add(locale);
      if (mtime > existing.latestMtime) existing.latestMtime = mtime;
    } else {
      pages.set(slug, { locales: new Set([locale]), latestMtime: mtime });
    }
  }

  const sortedSlugs = [...pages.keys()].sort();
  const urlBlocks = sortedSlugs.map((slug) => {
    const info = pages.get(slug)!;
    const lastmod = new Date(info.latestMtime).toISOString().split('T')[0];
    const loc = urlFor(slug, i18n.defaultLanguage);

    // Emit hreflang entries for every supported language (even those without
    // translation files) since the page renderer falls back to English — the
    // URL is still reachable and Google should know it exists.
    const alternates = i18n.languages.map(
      (l) =>
        `<xhtml:link rel="alternate" hreflang="${hreflangFor(l)}" href="${urlFor(slug, l)}" />`,
    );
    alternates.push(
      `<xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
    );

    return [
      `<url>`,
      `<loc>${loc}</loc>`,
      `<lastmod>${lastmod}</lastmod>`,
      `<changefreq>weekly</changefreq>`,
      `<priority>${slug === '/' ? '1.0' : '0.8'}</priority>`,
      ...alternates,
      `</url>`,
    ].join('\n');
  });

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urlBlocks.join('\n') +
    `\n</urlset>\n`;

  await writeFile(OUTPUT_FILE, sitemap, 'utf-8');
  console.log(
    `Generated: ${OUTPUT_FILE} (${pages.size} pages × ${i18n.languages.length} locales)`,
  );
}

void generateSitemap();
