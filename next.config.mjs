import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
