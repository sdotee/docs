import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import type { ImageResponseOptions } from '@takumi-rs/image-response';

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
}

const font = readFile('./lib/og/JetBrainsMono-Regular.ttf').then((data) => ({
  name: 'Mono' as const,
  data,
  weight: 400 as const,
}));
const fontBold = readFile('./lib/og/JetBrainsMono-Bold.ttf').then((data) => ({
  name: 'Mono' as const,
  data,
  weight: 600 as const,
}));

// CJK fallback fonts. When a glyph isn't in JetBrains Mono, the renderer falls
// back to whichever font has it. Variable TTFs registered at weight 400; bold
// CJK text degrades to regular weight rather than tofu.
const cjkFonts = [
  { file: 'NotoSerifSC-VF.ttf', name: 'CJK-SC' as const },
  { file: 'NotoSerifTC-VF.ttf', name: 'CJK-TC' as const },
  { file: 'NotoSerifJP-VF.ttf', name: 'CJK-JP' as const },
  { file: 'NotoSerifKR-VF.ttf', name: 'CJK-KR' as const },
].map(({ file, name }) =>
  readFile(`./lib/og/${file}`).then((data) => ({
    name,
    data,
    weight: 400 as const,
  })),
);

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    format: 'webp',
    fonts: await Promise.all([font, fontBold, ...cjkFonts]),
  };
}

export function generate({ title, description, logo, site = 'My App' }: GenerateProps) {
  const primaryTextColor = 'rgb(240,240,240)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: 'rgb(10,10,10)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: 'auto',
            color: primaryTextColor,
          }}
        >
          {logo}
          <p
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {site}
          </p>
        </div>
      </div>
    </div>
  );
}
