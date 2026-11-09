import type { SVGProps } from 'react';

/**
 * tech//site — sharp-flat icon system
 *
 * Visual language modeled on Streamline "Sharp Flat":
 *  - 24×24 grid, fills only (no strokes), mitered sharp corners
 *  - two-tone artwork: primary = currentColor, secondary = class sf-tone2
 *    (defaults to a 34% tint of currentColor; contexts may override)
 *
 * API mirrors lucide-react (`size`, `className`, svg props) so call sites
 * can migrate by changing the import path only.
 */
export type SharpIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SharpIcon({ size = 24, children, ...props }: SharpIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
