# S.EE Documentation

Official documentation site for [S.EE](https://s.ee) - A modern URL shortener service.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Documentation**: [Fumadocs](https://fumadocs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Runtime**: [Bun](https://bun.com/)

## Features

- MDX-based documentation
- OpenAPI documentation auto-generation
- Full-text search
- Dark/Light mode
- Copy Markdown for LLM
- Open in ChatGPT/Claude integration
- Clerk-style Table of Contents
- Responsive design

## Getting Started

### Prerequisites

- [Bun](https://bun.com/) (v1.0 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/sdotee/docs.git
cd docs

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun dev
```

Open [http://localhost:3000/docs/](http://localhost:3000/docs/) in your browser.

### Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── docs/              # Documentation pages
│   └── llms.mdx/          # LLM markdown API routes
├── content/
│   └── docs/              # MDX documentation files
│       └── api/           # Auto-generated API docs
├── components/            # React components
├── lib/                   # Utility functions
├── scripts/               # Build scripts
│   ├── generate-docs.ts   # OpenAPI docs generator
│   └── generate-sitemap.ts
├── openapi_swagger.yaml   # OpenAPI specification
└── source.config.ts       # Fumadocs MDX config
```

## Documentation

Documentation is written in MDX format in the `content/docs/` directory.

### Adding a New Page

1. Create a new `.mdx` file in `content/docs/`
2. Add frontmatter with `title` and `description`
3. Write your content in MDX

Example:

```mdx
---
title: My Page
description: A description of my page
icon: FileText
---

# My Page

Your content here...
```

### API Documentation

API documentation is auto-generated from `openapi_swagger.yaml` during the build process. To update API docs:

1. Edit `openapi_swagger.yaml`
2. Run `bun run build:pre` or `bun run build`

## Docker

```bash
# Build image
docker build -t see-docs .

# Run container
docker run -p 3000:3000 see-docs
```

## License

MIT
