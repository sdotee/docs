import { source, getPageImage } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { LLMCopyButton, ViewOptions } from '@/components/page-actions';
import { i18n, ogLocaleMap, langNameMap, localePrefix } from '@/lib/i18n';

const owner = 'sdotee';
const repo = 'docs';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://s.ee';

function generateBreadcrumbList(slugs: string[], title: string, pageUrl: string, prefix: string) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Documentation',
      item: `${baseUrl}/docs${prefix}/`,
    },
  ];

  let path = `/docs${prefix}`;
  slugs.forEach((slug, index) => {
    path += `/${slug}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: index === slugs.length - 1 ? title : slug.charAt(0).toUpperCase() + slug.slice(1),
      item: `${baseUrl}${path}/`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function generateTechArticle(title: string, description: string, url: string, lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: url,
    inLanguage: lang,
    availableLanguage: i18n.languages.map((l) => ({
      '@type': 'Language',
      name: langNameMap[l] ?? l,
      alternateName: l,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'S.EE',
      url: 'https://s.ee',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page =
    source.getPage(params.slug, params.lang) ??
    source.getPage(params.slug, i18n.defaultLanguage);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const pageUrl = `${baseUrl}${page.url}`;
  const prefix = localePrefix(params.lang);
  const markdownUrl = page.slugs.length > 0 ? `${page.url}.mdx` : `/docs${prefix}/index.mdx`;

  const breadcrumbSchema = generateBreadcrumbList(page.slugs, page.data.title, pageUrl, prefix);
  const articleSchema = generateTechArticle(page.data.title, page.data.description ?? '', pageUrl, params.lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <DocsPage
        toc={page.data.toc ?? []}
        full={page.data.full}
        tableOfContent={{
          style: 'clerk',
        }}
      >
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">
        {page.data.description}
      </p>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/docs/${page.path}`}
          pageUrl={page.url}
        />
      </div>
      <DocsBody>
        <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams('slug', 'lang');
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page =
    source.getPage(params.slug, params.lang) ??
    source.getPage(params.slug, i18n.defaultLanguage);
  if (!page) notFound();

  const pageUrl = `${baseUrl}${page.url}`;
  const ogImage = getPageImage(page, params.lang).url;
  const slugPath = params.slug && params.slug.length > 0 ? `/${params.slug.join('/')}` : '';

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries([
        ...i18n.languages.map((l) => [l, `${localePrefix(l)}${slugPath}/` || '/']),
        ['x-default', `${slugPath}/` || '/'],
      ]),
    },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: page.data.title,
      description: page.data.description,
      siteName: 'S.EE Documentation',
      locale: ogLocaleMap[params.lang] ?? 'en_US',
      alternateLocale: i18n.languages
        .filter((l) => l !== params.lang)
        .map((l) => ogLocaleMap[l] ?? l),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [ogImage],
    },
  };
}
