import { readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_URL = 'https://s.ee/docs';
const DOCS_DIR = './content/docs';
const OUTPUT_FILE = './public/sitemap.xml';

async function getAllMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getAllMdxFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function mdxPathToUrl(filePath: string): string {
  // Remove content/docs prefix and .mdx extension
  let url = filePath
    .replace(/^\.?\/?(content\/docs)/, '')
    .replace(/\.mdx$/, '');

  // Handle index files
  if (url.endsWith('/index')) {
    url = url.replace(/\/index$/, '/');
  }

  // Ensure trailing slash
  if (!url.endsWith('/')) {
    url = url + '/';
  }

  // Handle root (just /)
  if (url === '/') {
    return BASE_URL + '/';
  }

  return BASE_URL + url;
}

async function getLastModified(filePath: string): Promise<string> {
  const stats = await stat(filePath);
  return stats.mtime.toISOString().split('T')[0];
}

async function generateSitemap() {
  const mdxFiles = await getAllMdxFiles(DOCS_DIR);

  const urls: { loc: string; lastmod: string }[] = [];

  for (const file of mdxFiles) {
    const url = mdxPathToUrl(file);
    const lastmod = await getLastModified(file);
    urls.push({ loc: url, lastmod });
  }

  // Sort URLs alphabetically
  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc === BASE_URL + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;

  await writeFile(OUTPUT_FILE, sitemap, 'utf-8');
  console.log(`Generated: ${OUTPUT_FILE} with ${urls.length} URLs`);
}

void generateSitemap();
