import { loader, type LoaderPlugin, type InferPageType } from 'fumadocs-core/source';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from 'fumadocs-mdx:collections/server';
import { i18n } from '@/lib/i18n';
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
import { AttachFileIcon } from '@/components/ui/attach-file';
import { UploadIcon } from '@/components/ui/upload';
import { BananaIcon } from '@/components/ui/banana';
import { TerminalIcon } from '@/components/ui/terminal';
import { MonitorIcon } from '@/components/ui/monitor';
import { RefreshCwIcon } from '@/components/ui/refresh-cw';
import { ImageIcon } from '@/components/ui/image-icon';
import { ImageUploadIcon } from '@/components/ui/image-upload-icon';
import { LinkShareIcon } from '@/components/ui/link-share-icon';
import { AwesomeFaceIcon } from '@/components/ui/awesome-face';
import { WordPressIcon } from '@/components/ui/wordpress-icon';
import { SmartphoneIcon } from '@/components/ui/smartphone';
import { LinkInBioIcon } from '@/components/ui/link-in-bio';
import { MaterialIcon, hasMaterialIcon } from '@/components/ui/material-icon';

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
  AttachFile: AttachFileIcon,
  Upload: UploadIcon,
  Banana: BananaIcon,
  Terminal: TerminalIcon,
  Monitor: MonitorIcon,
  RefreshCw: RefreshCwIcon,
  ImageUp: ImageIcon,
  ImageUpload: ImageUploadIcon,
  LinkShare: LinkShareIcon,
  AwesomeFace: AwesomeFaceIcon,
  WordPress: WordPressIcon,
  Smartphone: SmartphoneIcon,
  LinkInBio: LinkInBioIcon,
};

function resolveIcon(iconName: string, key: string) {
  // Material Symbols, e.g. `md:add_link`
  if (iconName.startsWith('md:')) {
    const name = iconName.slice('md:'.length);
    return hasMaterialIcon(name) ? createElement(MaterialIcon, { key, name }) : undefined;
  }
  // Check for animated icon first
  const AnimatedIcon = animatedIcons[iconName];
  if (AnimatedIcon) return createElement(AnimatedIcon, { key, size: 16 });
  // Fallback to lucide-react
  const Icon = icons[iconName as keyof typeof icons];
  return Icon ? createElement(Icon, { key }) : undefined;
}

function createLucideIconsPlugin(): LoaderPlugin {
  return {
    name: 'lucide-icons',
    transformPageTree: {
      file(node) {
        if (typeof node.icon === 'string') {
          node.icon = resolveIcon(node.icon, `icon-${node.url}`) ?? node.icon;
        }
        return node;
      },
      folder(node) {
        if (typeof node.icon === 'string') {
          node.icon = resolveIcon(node.icon, `icon-${node.index?.url ?? node.name}`) ?? node.icon;
        }
        return node;
      },
    },
  };
}

export const source = loader({
  baseUrl: '/docs',
  i18n,
  url(slugs, locale) {
    const localeSegment =
      locale && locale !== i18n.defaultLanguage ? `/${locale}` : '';
    const slugPath = slugs.length > 0 ? `/${slugs.join('/')}` : '';
    return `/docs${localeSegment}${slugPath}`;
  },
  source: docs.toFumadocsSource(),
  plugins: [createLucideIconsPlugin(), openapiPlugin()],
});

export type Page = InferPageType<typeof source>;

export function getPageImage(page: Page, lang?: string) {
  const localePrefix =
    lang && lang !== i18n.defaultLanguage ? [lang] : [];
  const segments = [...localePrefix, ...page.slugs, 'image.webp'];
  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}

export async function getLLMText(page: Page) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
