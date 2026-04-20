import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  output: 'standalone',
  assetPrefix: '/docs',
  async rewrites() {
    return [
      {
        source: '/docs/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/docs/llms.txt',
        destination: '/llms.txt',
      },
      {
        source: '/docs/llms-full.txt',
        destination: '/llms-full.txt',
      },
      {
        source: '/docs/og/:path*',
        destination: '/og/docs/:path*',
      },
      {
        source:
          '/docs/:lang(en-US|zh-CN|zh-TW|ja|ko|id|vi|de|fr|es|pt-PT|pt-BR|ru|pl|et|nl|tr|sv|it|fi)/:path*.mdx',
        destination: '/docs/:lang/llms.mdx/:path*',
      },
      {
        source:
          '/docs/:lang(en-US|zh-CN|zh-TW|ja|ko|id|vi|de|fr|es|pt-PT|pt-BR|ru|pl|et|nl|tr|sv|it|fi).mdx',
        destination: '/docs/:lang/llms.mdx',
      },
      {
        source: '/docs/:path*.mdx',
        destination: '/docs/en-US/llms.mdx/:path*',
      },
    ];
  },
  async redirects() {
    return [
      // /docs/developers/api/* redirects
      {
        source: '/docs/developers/api/create-short-url/',
        destination: '/docs/api/CreateShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/developers/api/create-short-url-simple-mode/',
        destination: '/docs/api/CreateShortUrlSimpleMode/',
        permanent: true,
      },
      {
        source: '/docs/developers/api/delete-short-url/',
        destination: '/docs/api/DeleteShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/developers/api/get-available-domains/',
        destination: '/docs/api/GetAvailableDomains/',
        permanent: true,
      },
      {
        source: '/docs/developers/api/update-short-url/',
        destination: '/docs/api/UpdateShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/developers/api/get-available-tags/',
        destination: '/docs/api/GetTags/',
        permanent: true,
      },
      // /docs/development/api/* redirects (old URL format)
      {
        source: '/docs/development/api/create-short-url/',
        destination: '/docs/api/CreateShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/development/api/create-short-url-simple-mode/',
        destination: '/docs/api/CreateShortUrlSimpleMode/',
        permanent: true,
      },
      {
        source: '/docs/development/api/delete-short-url/',
        destination: '/docs/api/DeleteShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/development/api/get-available-domains/',
        destination: '/docs/api/GetAvailableDomains/',
        permanent: true,
      },
      {
        source: '/docs/development/api/update-short-url/',
        destination: '/docs/api/UpdateShortUrl/',
        permanent: true,
      },
      {
        source: '/docs/development/api/get-available-tags/',
        destination: '/docs/api/GetTags/',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
