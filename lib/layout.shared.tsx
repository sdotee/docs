import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siX, siBluesky, siMastodon, siDiscord } from 'simple-icons';
import { i18n, localePrefix } from '@/lib/i18n';
import { getMessages } from '@/messages';
import { SimpleIcon } from '@/components/simple-icon';

export function baseOptions(lang: string = i18n.defaultLanguage): BaseLayoutProps {
  const prefix = localePrefix(lang);
  const m = getMessages(lang);
  return {
    nav: {
      title: 'S.EE Docs',
      url: `/docs${prefix}/`,
    },
    links: [
      {
        text: m.nav.dashboard,
        url: 'https://s.ee/user/dashboard/',
        external: true,
      },
      {
        type: 'icon',
        label: 'X',
        url: 'https://s.ee/x',
        icon: <SimpleIcon icon={siX} />,
        text: 'X',
      },
      {
        type: 'icon',
        label: 'Bluesky',
        url: 'https://s.ee/bluesky',
        icon: <SimpleIcon icon={siBluesky} />,
        text: 'Bluesky',
      },
      {
        type: 'icon',
        label: 'Mastodon',
        url: 'https://c.im/@see',
        icon: <SimpleIcon icon={siMastodon} />,
        text: 'Mastodon',
      },
      {
        type: 'icon',
        label: 'Discord',
        url: 'https://s.ee/discord',
        icon: <SimpleIcon icon={siDiscord} />,
        text: 'Discord',
      },
    ],
  };
}
