import { loader, type LoaderPlugin, type InferPageType } from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from 'fumadocs-mdx:collections/server';
import { LinkIcon } from '@/components/ui/link';
import { EarthIcon } from '@/components/ui/earth';
import { LayoutPanelTopIcon } from '@/components/ui/layout-panel-top';
import { BookTextIcon } from '@/components/ui/book-text';
import { UserRoundPlusIcon } from '@/components/ui/user-round-plus';
import { FileTextIcon } from '@/components/ui/file-text';
import { RocketIcon } from '@/components/ui/rocket';
import { BoxesIcon } from '@/components/ui/boxes';
import QrcodeIcon from '@/components/ui/qrcode-icon';
import QuestionMark from '@/components/ui/question-mark';
import { ChromeIcon } from '@/components/ui/chrome';
import { LogInIcon } from '@/components/ui/log-in';
import { ServerIcon } from '@/components/ui/server';
import { ShieldCheckIcon } from '@/components/ui/shield-check';
import { PlugZapIcon } from '@/components/ui/plug-zap';

// Mapping from MDX icon names to animated icon components
const animatedIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Link: LinkIcon,
  Globe: EarthIcon,
  LayoutDashboard: LayoutPanelTopIcon,
  BookOpen: BookTextIcon,
  UserPlus: UserRoundPlusIcon,
  FileText: FileTextIcon,
  Rocket: RocketIcon,
  Package: BoxesIcon,
  QrCode: QrcodeIcon,
  CircleQuestionMark: QuestionMark,
  Puzzle: ChromeIcon,
  LogIn: LogInIcon,
  Server: ServerIcon,
  ShieldCheck: ShieldCheckIcon,
  PlugZap: PlugZapIcon,
};

function createLucideIconsPlugin(): LoaderPlugin {
  return {
    name: 'lucide-icons',
    transformPageTree: {
      file(node) {
        if (typeof node.icon === 'string') {
          const iconName = node.icon;
          // Check for animated icon first
          const AnimatedIcon = animatedIcons[iconName];
          if (AnimatedIcon) {
            node.icon = createElement(AnimatedIcon, { key: `icon-${node.url}`, size: 16 });
          } else {
            // Fallback to lucide-react
            const Icon = icons[iconName as keyof typeof icons];
            if (Icon) {
              node.icon = createElement(Icon, { key: `icon-${node.url}` });
            }
          }
        }
        return node;
      },
      folder(node) {
        if (typeof node.icon === 'string') {
          const iconName = node.icon;
          // Check for animated icon first
          const AnimatedIcon = animatedIcons[iconName];
          if (AnimatedIcon) {
            node.icon = createElement(AnimatedIcon, { key: `icon-${node.index?.url ?? node.name}`, size: 16 });
          } else {
            // Fallback to lucide-react
            const Icon = icons[iconName as keyof typeof icons];
            if (Icon) {
              node.icon = createElement(Icon, { key: `icon-${node.index?.url ?? node.name}` });
            }
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
