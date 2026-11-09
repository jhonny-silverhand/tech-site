import { SharpIcon, type SharpIconProps } from './base';

/* ── System / UI glyphs ── */

export function X(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4.3 6.4 6.4 4.3 19.7 17.6 17.6 19.7Z" />
      <path fill="currentColor" d="M17.6 4.3 19.7 6.4 6.4 19.7 4.3 17.6Z" />
    </SharpIcon>
  );
}

export function Check(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M9.6 18.7 3.3 12.4 5.5 10.2 9.6 14.3 18.5 5.4 20.7 7.6Z" />
    </SharpIcon>
  );
}

export function Plus(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M10.9 4h2.2v6.9H20v2.2h-6.9V20h-2.2v-6.9H4v-2.2h6.9Z" />
    </SharpIcon>
  );
}

export function Menu(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4 5.4h16v2.3H4z" />
      <path className="sf-tone2" d="M4 10.85h16v2.3H4z" />
      <path fill="currentColor" d="M4 16.3h16v2.3H4z" />
    </SharpIcon>
  );
}

export function Search(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.5 3.2a7.3 7.3 0 1 0 0 14.6 7.3 7.3 0 0 0 0-14.6Zm0 2.4a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Z"
      />
      <path className="sf-tone2" d="M10.5 5.6a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Z" />
      <path fill="currentColor" d="M14.51 16.49 16.49 14.51 21.49 19.51 19.51 21.49Z" />
    </SharpIcon>
  );
}

export function Loader2(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        className="sf-tone2"
        fillRule="evenodd"
        d="M12 4.7a7.3 7.3 0 1 0 0 14.6 7.3 7.3 0 0 0 0-14.6Zm0 2.6a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Z"
      />
      <path fill="currentColor" d="M12 4.7a7.3 7.3 0 0 1 7.3 7.3h-2.6a4.7 4.7 0 0 0-4.7-4.7Z" />
    </SharpIcon>
  );
}

export function Settings(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.76 3.17 15.5 6.76 19.48 7 18.18 10.77 20.83 13.76 17.24 15.5 17 19.48 13.23 18.18 10.24 20.83 8.5 17.24 4.52 17 5.82 13.23 3.17 10.24 6.76 8.5 7 4.52 10.77 5.82ZM12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
      />
    </SharpIcon>
  );
}

export function User(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M12 3.4a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Z" />
      <path className="sf-tone2" d="M3.6 20.6 6.2 13.9h11.6l2.6 6.7Z" />
    </SharpIcon>
  );
}

export function LayoutDashboard(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4 4h7.2v16H4z" />
      <path className="sf-tone2" d="M12.8 4h7.2v7h-7.2z" />
      <path className="sf-tone2" d="M12.8 12.4h7.2v7.6h-7.2z" />
    </SharpIcon>
  );
}

export function LayoutGrid(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4 4h7.2v7.2H4z" />
      <path className="sf-tone2" d="M12.8 4H20v7.2h-7.2z" />
      <path className="sf-tone2" d="M4 12.8h7.2V20H4z" />
      <path fill="currentColor" d="M12.8 12.8H20V20h-7.2z" />
    </SharpIcon>
  );
}

export function Compass(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Z"
      />
      <path fill="currentColor" d="M16.3 7.7 13.27 13.27 12 12Z" />
      <path className="sf-tone2" d="M7.7 16.3 10.73 10.73 12 12Z" />
    </SharpIcon>
  );
}

export function Sparkles(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M12 2.8 14.4 9.6 21.2 12 14.4 14.4 12 21.2 9.6 14.4 2.8 12 9.6 9.6Z" />
      <path className="sf-tone2" d="M18.8 14.6 20 16 21.4 17.2 20 18.4 18.8 19.8 17.6 18.4 16.2 17.2 17.6 16Z" />
    </SharpIcon>
  );
}

export function Moon(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        d="M12.4 3.2a6.2 6.2 0 0 0 8.4 8.4 8.8 8.8 0 1 1-8.4-8.4Z"
      />
    </SharpIcon>
  );
}

export function Sun(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M12 7.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Z" />
      <path fill="currentColor" d="M11 2.4h2v3.4h-2z" />
      <path fill="currentColor" d="M11 18.2h2v3.4h-2z" />
      <path fill="currentColor" d="M2.4 11h3.4v2H2.4z" />
      <path fill="currentColor" d="M18.2 11h3.4v2h-3.4z" />
      <path className="sf-tone2" d="M4.2 4.2h2.4v2.4H4.2z" />
      <path className="sf-tone2" d="M17.4 4.2h2.4v2.4h-2.4z" />
      <path className="sf-tone2" d="M4.2 17.4h2.4v2.4H4.2z" />
      <path className="sf-tone2" d="M17.4 17.4h2.4v2.4h-2.4z" />
    </SharpIcon>
  );
}

export function LogOut(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path className="sf-tone2" d="M3.6 3.4h6.2v17.2H3.6Zm2.2 2.2v12.8h1.8V5.6Z" />
      <path fill="currentColor" d="M14.8 7.4 21 12l-6.2 4.6Z" />
      <path fill="currentColor" d="M9.4 10.9h6v2.2h-6z" />
    </SharpIcon>
  );
}

export function Pencil(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M5.2 14.7 12.9 7l3.5 3.5-7.7 7.7Z" />
      <path className="sf-tone2" d="M12.9 7 14.6 5.3l3.5 3.5-1.7 1.7Z" />
      <path fill="currentColor" d="M8.7 18.2l-5.2 1.8 1.8-5.2Z" />
    </SharpIcon>
  );
}

export function Trash2(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M9.4 2h5.2v1.8H9.4z" />
      <path fill="currentColor" d="M3.4 3.8h17.2v2H3.4z" />
      <path fill="currentColor" d="M4.6 6.4h14.8l-1.2 14.2H5.8Z" />
      <path className="sf-tone2" d="M9.4 9.2h2.2v8.4H9.4z" />
      <path className="sf-tone2" d="M12.4 9.2h2.2v8.4h-2.2z" />
    </SharpIcon>
  );
}

export function Upload(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M6.6 11 12 4.4 17.4 11Z" />
      <path fill="currentColor" d="M10.9 9.4h2.2v5.8h-2.2z" />
      <path className="sf-tone2" d="M3.4 15.6h2.4v3h12.4v-3h2.4v5.4H3.4z" />
    </SharpIcon>
  );
}

/* ── Status ── */

export function AlertCircle(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Zm0 2.3a6.3 6.3 0 1 1 0 12.6 6.3 6.3 0 0 1 0-12.6Z"
      />
      <path fill="currentColor" d="M10.9 7.2h2.2v6.4h-2.2z" />
      <path fill="currentColor" d="M12 15.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
    </SharpIcon>
  );
}

export function CheckCircle2(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Zm0 2.3a6.3 6.3 0 1 1 0 12.6 6.3 6.3 0 0 1 0-12.6Z"
      />
      <path className="sf-tone2" d="M12 5.7a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6Z" />
      <path fill="currentColor" d="M8.6 12.4l2.4 2.4 4.4-4.6 1.6 1.6-6 6.2-4-4Z" />
    </SharpIcon>
  );
}

export function Info(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Zm0 2.3a6.3 6.3 0 1 1 0 12.6 6.3 6.3 0 0 1 0-12.6Z"
      />
      <path fill="currentColor" d="M12 6.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
      <path fill="currentColor" d="M10.9 10.4h2.2v6.6h-2.2z" />
    </SharpIcon>
  );
}

export function TriangleAlert(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3 22.4 20.4H1.6Zm0 3.2L4.4 18.6h15.2Z"
      />
      <path fill="currentColor" d="M10.9 10.4h2.2v4.4h-2.2z" />
      <path fill="currentColor" d="M12 16.4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
    </SharpIcon>
  );
}

/* ── Ratings ── */

export function Star(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        d="M12 3l2.7 5.7 6.3.7-4.6 4.3 1.2 6.2-5.6-3.1-5.6 3.1 1.2-6.2L3 9.4l6.3-.7Z"
      />
    </SharpIcon>
  );
}

export function Heart(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
      />
    </SharpIcon>
  );
}
