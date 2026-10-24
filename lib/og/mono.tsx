import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import type { ImageResponseOptions } from '@takumi-rs/image-response';

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
}

// Same card as the blog and changelog OG images: s.ee light palette, Space
// Grotesk for Latin, Noto Sans SC/TC for CJK.
const COLOR = { bg: '#fafafa', fg: '#171717', body: '#525252', accent: '#047857' };

const fontFiles = [
  { file: 'space-grotesk-latin-400-normal.woff2', name: 'Space Grotesk', weight: 400 },
  { file: 'space-grotesk-latin-700-normal.woff2', name: 'Space Grotesk', weight: 700 },
  // CJK fallbacks: glyphs missing from Space Grotesk fall through to these
  { file: 'NotoSansSC-Regular.ttf', name: 'Noto Sans SC', weight: 400 },
  { file: 'NotoSansSC-Bold.ttf', name: 'Noto Sans SC', weight: 700 },
  { file: 'NotoSansTC-Regular.otf', name: 'Noto Sans TC', weight: 400 },
  { file: 'NotoSansTC-Bold.otf', name: 'Noto Sans TC', weight: 700 },
] as const;

const fonts = fontFiles.map(({ file, name, weight }) =>
  readFile(`./lib/og/${file}`).then((data) => ({ name, data, weight })),
);

const logoSrc = readFile('./lib/og/logo.svg').then(
  (data) => `data:image/svg+xml;base64,${data.toString('base64')}`,
);

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    format: 'webp',
    fonts: await Promise.all(fonts),
  };
}

export async function generate({ title, description, site = 'S.EE Docs' }: GenerateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        backgroundColor: COLOR.bg,
        color: COLOR.fg,
        fontFamily: 'Space Grotesk',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={await logoSrc} width={64} height={64} style={{ width: 64, height: 64, marginRight: 20 }} />
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: '-0.01em' }}>{site}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          {title}
        </div>
        {description && (
          <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.4, color: COLOR.body, marginTop: 28, maxWidth: 960 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: COLOR.accent }}>s.ee/docs</div>
    </div>
  );
}
