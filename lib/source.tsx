import { loader, type LoaderPlugin, type InferPageType } from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from 'fumadocs-mdx:collections/server';

function createLucideIconsPlugin(): LoaderPlugin {
  return {
    name: 'lucide-icons',
    transformPageTree: {
      file(node) {
        if (typeof node.icon === 'string') {
          const Icon = icons[node.icon as keyof typeof icons];
          if (Icon) {
            node.icon = createElement(Icon);
          }
        }
        return node;
      },
      folder(node) {
        if (typeof node.icon === 'string') {
          const Icon = icons[node.icon as keyof typeof icons];
          if (Icon) {
            node.icon = createElement(Icon);
          }
        }
        return node;
      },
    },
  };
}

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [createLucideIconsPlugin(), openapiPlugin()],
});

export type Page = InferPageType<typeof source>;

export async function getLLMText(page: Page) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
