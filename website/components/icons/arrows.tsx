import { SharpIcon, type SharpIconProps } from './base';

/* ── Arrows & chevrons — solid heads (ink) on panel-tone shafts ── */

export function ArrowRight(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M13 6.4 19.6 12 13 17.6Z" />
      <path className="sf-tone2" d="M4 10.9h9v2.2H4z" />
    </SharpIcon>
  );
}

export function ArrowLeft(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M11 6.4 4.4 12 11 17.6Z" />
      <path className="sf-tone2" d="M11 10.9h9v2.2h-9z" />
    </SharpIcon>
  );
}

export function ArrowUp(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M6.4 11 12 4.4 17.6 11Z" />
      <path className="sf-tone2" d="M10.9 11h2.2v9h-2.2z" />
    </SharpIcon>
  );
}

export function ArrowDown(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M6.4 13 12 19.6 17.6 13Z" />
      <path className="sf-tone2" d="M10.9 4h2.2v9h-2.2z" />
    </SharpIcon>
  );
}

export function ArrowUpRight(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M11.9 3.6h8.5v8.5Z" />
      <path className="sf-tone2" d="M4.42 17.12 5.98 18.68 13.18 11.48 11.62 9.92Z" />
    </SharpIcon>
  );
}

export function ChevronRight(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M9 4.5 16.5 12 9 19.5v-3.6l3.9-3.9L9 8.1Z" />
    </SharpIcon>
  );
}

export function ChevronLeft(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M15 4.5 7.5 12 15 19.5v-3.6l-3.9-3.9L15 8.1Z" />
    </SharpIcon>
  );
}

export function ChevronDown(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4.5 9 12 16.5 19.5 9h-3.6L12 12.9 8.1 9Z" />
    </SharpIcon>
  );
}

export function ExternalLink(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M12.6 3.4h8v8Z" />
      <path fill="currentColor" d="M8.4 7.4H3.4v13.2h15.2v-7.2h-2.4v4.8H5.8V9.8h2.6Z" />
      <path className="sf-tone2" d="M8.82 14.62 10.38 16.18 15.98 10.58 14.42 9.02Z" />
    </SharpIcon>
  );
}

export function CornerDownLeft(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M17.4 3.4h2.4v12.8H9.6v-2.4h7.8Z" />
      <path fill="currentColor" d="M9.6 11.4 4 15l5.6 3.6Z" />
    </SharpIcon>
  );
}

export function RotateCcw(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        d="M5.7 5.7A8.9 8.9 0 1 1 3.1 12h2.4a6.5 6.5 0 1 0 1.9-4.6Z"
      />
      <path fill="currentColor" d="M3.1 12h2.4L4.3 17.2Z" />
    </SharpIcon>
  );
}
