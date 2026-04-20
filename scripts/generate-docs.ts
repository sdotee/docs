import * as OpenAPI from 'fumadocs-openapi';
import { rimraf } from 'rimraf';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { load as parseYaml, dump as dumpYaml } from 'js-yaml';
import { openapi } from '@/lib/openapi';
import { i18n } from '@/lib/i18n';

const out = './content/docs/api';
const translationsDir = './scripts/api-translations';

interface ApiTranslation {
  title?: string;
  description?: string;
}

type TranslationMap = Record<string, ApiTranslation>;

async function loadTranslations(lang: string): Promise<TranslationMap> {
  try {
    const content = await readFile(join(translationsDir, `${lang}.json`), 'utf-8');
    return JSON.parse(content) as TranslationMap;
  } catch {
    return {};
  }
}

interface Frontmatter {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

function splitFrontmatter(content: string): {
  frontmatter: Frontmatter;
  rest: string;
} | null {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const yaml = content.slice(4, end);
  const rest = content.slice(end + 5);
  const frontmatter = parseYaml(yaml) as Frontmatter;
  return { frontmatter, rest };
}

function applyTranslation(content: string, t: ApiTranslation): string {
  const split = splitFrontmatter(content);
  if (!split) return content;
  const { frontmatter, rest } = split;
  if (t.title) frontmatter.title = t.title;
  if (t.description) frontmatter.description = t.description;
  const newYaml = dumpYaml(frontmatter, { lineWidth: 0, noRefs: true });
  return `---\n${newYaml}---\n${rest}`;
}

async function generateLocalizedApiDocs(lang: string) {
  const translations = await loadTranslations(lang);
  const files = await readdir(out);
  const sourceFiles = files.filter((f) => {
    if (!f.endsWith('.mdx')) return false;
    // Skip files that are already locale-suffixed (foo.zh-CN.mdx)
    const parts = f.slice(0, -'.mdx'.length).split('.');
    return parts.length === 1;
  });

  let count = 0;
  for (const file of sourceFiles) {
    const operationId = file.slice(0, -'.mdx'.length);
    const t = translations[operationId];
    if (!t || (!t.title && !t.description)) continue;
    const content = await readFile(join(out, file), 'utf-8');
    const localized = applyTranslation(content, t);
    await writeFile(join(out, `${operationId}.${lang}.mdx`), localized);
    count++;
  }
  if (count > 0) console.log(`Generated ${count} ${lang} API pages`);
}

async function generate() {
  // Clean generated files (preserve meta.json variants)
  await rimraf(out, {
    filter(v) {
      return !/meta(\.[^./\\]+)?\.json$/.test(v);
    },
  });

  // Generate English (default) API docs from OpenAPI spec
  await OpenAPI.generateFiles({
    input: openapi,
    output: out,
  });

  // Generate localized API pages from translation files
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue;
    await generateLocalizedApiDocs(lang);
  }
}

void generate();
