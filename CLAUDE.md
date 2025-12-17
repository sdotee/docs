# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for S.EE, a URL shortener service. Built with Next.js 16 and Fumadocs, using Bun as the package manager and runtime.

## Development Commands

```bash
# Install dependencies
bun install

# Run development server (localhost:3000)
bun run dev

# Build for production (runs pre-build script + next build)
bun run build

# Pre-build only (regenerates API docs from OpenAPI spec)
bun run build:pre

# Start production server
bun run start
```

## Architecture

### Content Pipeline
- **MDX Documentation**: `content/docs/**/*.mdx` - Manual documentation pages
- **OpenAPI Generation**: `scripts/generate-docs.ts` generates API docs from `openapi_swagger.yaml` into `content/docs/api/`
- **Source Config**: `source.config.ts` defines Fumadocs MDX configuration

### Key Files
- `lib/source.tsx` - Document loader with OpenAPI integration and custom Lucide icons plugin
- `lib/openapi.ts` - OpenAPI configuration pointing to `openapi_swagger.yaml`
- `app/docs/[[...slug]]/page.tsx` - Catch-all docs page renderer
- `app/docs/layout.tsx` - Docs layout with sidebar navigation

### Sidebar Icons
Icons in sidebar are configured via `icon` frontmatter in MDX files. The custom `createLucideIconsPlugin()` in `lib/source.tsx` transforms icon names to Lucide React components. Icon names must match exports from `lucide-react`'s `icons` object (e.g., `Home`, `BookOpen`, `CircleQuestionMark`).

### Docker
```bash
docker build -t see-docs .
docker run -p 3000:3000 see-docs
```

## Bun Usage

Always use Bun instead of Node.js/npm:
- `bun install` instead of `npm install`
- `bun run <script>` instead of `npm run <script>`
- `bun <file>` instead of `node <file>`
