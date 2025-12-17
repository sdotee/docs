import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'S.EE Docs',
    },
    links: [
      {
        text: 'Dashboard',
        url: 'https://s.ee/user/dashboard/',
        external: true,
      },
    ],
  };
}
