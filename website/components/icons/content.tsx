import { SharpIcon, type SharpIconProps } from './base';

/* ── Content, library & editor glyphs ── */

export function Bookmark(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M6.2 3.4h11.6v17.2L12 16.2l-5.8 4.4Z" />
      <path className="sf-tone2" d="M6.2 3.4h3v14.9l-3 2.3Z" />
    </SharpIcon>
  );
}

export function FileText(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.8 2.8H14l4.2 4.2v14.2H5.8Zm2 2v14.4h8.4V7h-3.2V4.8Z"
      />
      <path className="sf-tone2" d="M13.9 3.1 17.1 6.3h-3.2Z" />
      <path className="sf-tone2" d="M8.4 10.4h7.4v1.7H8.4z" />
      <path className="sf-tone2" d="M8.4 13.6h7.4v1.7H8.4z" />
      <path className="sf-tone2" d="M8.4 16.8h4.8v1.7H8.4z" />
    </SharpIcon>
  );
}

export function FolderOpen(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.4 4.8h6.6l2.2 2.7h8.4v2.2H3.4Z" />
      <path className="sf-tone2" d="M3.4 11.6h17.2v7.8H3.4z" />
      <path fill="currentColor" d="M5.4 13.6h9.4v3.8H5.4z" />
    </SharpIcon>
  );
}

export function FolderPlus(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.4 4.8h6.2l2.4 2.9h8.6v11.7H3.4Z" />
      <path className="sf-tone2" d="M5.4 10h13.4v7.3H5.4z" />
      <path fill="currentColor" d="M11 12h2v2.6h2.6v2H13v2.6h-2v-2.6H8.4v-2H11Z" />
    </SharpIcon>
  );
}

export function Library(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.4 4h2.6v13H3.4z" />
      <path fill="currentColor" d="M7.4 4H10v13H7.4z" />
      <path className="sf-tone2" d="M11.4 4H14v13h-2.6z" />
      <path className="sf-tone2" d="M15.4 6.2h2.6V17h-2.6z" />
      <path fill="currentColor" d="M3.4 18.6h17.2v2H3.4z" />
    </SharpIcon>
  );
}

export function ListPlus(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.4 5h12v2.2H3.4z" />
      <path fill="currentColor" d="M3.4 10.4h12v2.2H3.4z" />
      <path fill="currentColor" d="M3.4 15.8h8v2.2h-8z" />
      <path className="sf-tone2" d="M16.6 14.2h2.2v2.6h2.6v2.2h-2.6v2.6h-2.2v-2.6H14v-2.2h2.6Z" />
    </SharpIcon>
  );
}

export function ListVideo(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.4 5h10v2.2H3.4z" />
      <path fill="currentColor" d="M3.4 10.4h10v2.2H3.4z" />
      <path fill="currentColor" d="M3.4 15.8h10V18H3.4z" />
      <path className="sf-tone2" d="M15.8 4.6h4.8v14.8h-4.8z" />
      <path fill="currentColor" d="M17.1 8.5l3.1 3.5-3.1 3.5Z" />
    </SharpIcon>
  );
}

export function Highlighter(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      {/* fat chisel marker, diagonal */}
      <path fill="currentColor" d="M4.9 14.9 12.3 7.5l4.2 4.2-7.4 7.4Z" />
      <path fill="currentColor" d="M9.1 19.1l-5.7 2 2-5.7Z" />
      {/* the highlight stroke it leaves */}
      <path className="sf-tone2" d="M3.4 20.6h17.2v2.4H3.4z" />
    </SharpIcon>
  );
}

export function PenLine(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      {/* slim pen with cap band */}
      <path fill="currentColor" d="M5.4 14.3 13.1 6.6l3.3 3.3-7.7 7.7Z" />
      <path className="sf-tone2" d="M13.1 6.6 14.8 4.9l3.3 3.3-1.7 1.7Z" />
      <path fill="currentColor" d="M8.7 17.6l-5 1.7 1.7-5Z" />
      {/* writing line */}
      <path fill="currentColor" d="M4 21.4h16v1.7H4z" />
    </SharpIcon>
  );
}

export function History(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 5.4a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6Zm0 2.2a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z"
      />
      <path className="sf-tone2" d="M11 8.6h2v4.2l3 1.8-1 1.7-4-2.4Z" />
      <path fill="currentColor" d="M6.2 1.7 2.2 3.5l4 1.8Z" />
      <path fill="currentColor" d="M6.2 2.4h3.4v2.2H6.2z" />
    </SharpIcon>
  );
}

export function ImageIcon(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.4 4.6h17.2v14.8H3.4Zm2.2 2.2v10.4h12.8V6.8Z"
      />
      <path className="sf-tone2" d="M8.8 9.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
      <path className="sf-tone2" d="M5.6 17.2 10 11.6l3.2 3.2 2.4-2.6 2.8 5Z" />
    </SharpIcon>
  );
}

export function Tags(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.8 3.2h7.4l5 5v7.4H2.8Zm6.2 6.6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
      />
      <path className="sf-tone2" d="M16.4 15.4l4.6 4.6-2.3 2.3-4.6-4.6Z" />
    </SharpIcon>
  );
}

export function Package(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4.2 7.4 12 3.4l7.8 4v9.2L12 20.6l-7.8-4Z" />
      <path className="sf-tone2" d="M12 3.4 19.8 7.4 12 11.4 4.2 7.4Z" />
      <path className="sf-tone2" d="M10.9 11.4h2.2v8.5h-2.2z" />
    </SharpIcon>
  );
}
