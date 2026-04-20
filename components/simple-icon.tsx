import type { SimpleIcon as SimpleIconData } from 'simple-icons';

/**
 * Renders a Simple Icons brand SVG. The svg uses `currentColor` so it inherits
 * color from the wrapping element (e.g. a fumadocs sidebar icon button).
 */
export function SimpleIcon({
  icon,
  size = 16,
}: {
  icon: SimpleIconData;
  size?: number;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}
