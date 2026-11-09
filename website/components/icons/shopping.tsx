import { SharpIcon, type SharpIconProps } from './base';

/* ── Commerce, comparison & device glyphs ── */

export function Store(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.2 4h17.6v3.8H3.2z" />
      <path fill="currentColor" d="M3.2 7.8h4.4L5.4 10.4 3.2 7.8Z" />
      <path className="sf-tone2" d="M7.6 7.8H12l-2.2 2.6-2.2-2.6Z" />
      <path fill="currentColor" d="M12 7.8h4.4l-2.2 2.6L12 7.8Z" />
      <path className="sf-tone2" d="M16.4 7.8h4.4l-2.2 2.6-2.2-2.6Z" />
      <path className="sf-tone2" d="M4.6 12.2h14.8v8.2H4.6z" />
      <path fill="currentColor" d="M10.9 15h2.2v5.4h-2.2z" />
    </SharpIcon>
  );
}

export function Cpu(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M9 3.4h2v3.4H9z" />
      <path fill="currentColor" d="M13 3.4h2v3.4h-2z" />
      <path fill="currentColor" d="M9 17.2h2v3.4H9z" />
      <path fill="currentColor" d="M13 17.2h2v3.4h-2z" />
      <path fill="currentColor" d="M3.4 9h3.4v2H3.4z" />
      <path fill="currentColor" d="M3.4 13h3.4v2H3.4z" />
      <path fill="currentColor" d="M17.2 9h3.4v2h-3.4z" />
      <path fill="currentColor" d="M17.2 13h3.4v2h-3.4z" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.4 7.4h9.2v9.2H7.4Zm2.2 2.2v4.8h4.8V9.6Z"
      />
      <path className="sf-tone2" d="M10.2 10.2h3.6v3.6h-3.6z" />
    </SharpIcon>
  );
}

export function IndianRupee(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M5.6 4.6h12.8v2.3H5.6z" />
      <path className="sf-tone2" d="M5.6 4.6h2.3v6.9H5.6z" />
      <path fill="currentColor" d="M5.6 9h12.8v2.2H5.6z" />
      <path fill="currentColor" d="M9.2 11.2h2.2l4.4 8.2h-2.4z" />
      <path fill="currentColor" d="M12.9 11.2h2.2l4.4 8.2h-2.4z" />
    </SharpIcon>
  );
}

export function Scale(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M10.6 2.2h2.8v1.8h-2.8z" />
      <path fill="currentColor" d="M10.9 3.4h2.2v16.2h-2.2z" />
      <path fill="currentColor" d="M3.4 5.4h17.2v2H3.4z" />
      <path fill="currentColor" d="M5.2 7.6 7.9 14.2H2.5Z" />
      <path className="sf-tone2" d="M2.2 14.2h6l-1.4 4H3.6Z" />
      <path fill="currentColor" d="M18.8 7.6l2.7 6.6h-5.4Z" />
      <path className="sf-tone2" d="M15.8 14.2h6.4l-1.4 4h-3.6Z" />
      <path fill="currentColor" d="M6.6 19.8h10.8v1.8H6.6z" />
    </SharpIcon>
  );
}

export function Trophy(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M7 3.4h10v4c0 3.1-2.2 5.4-5 5.4S7 10.5 7 7.4Z" />
      <path className="sf-tone2" d="M7 4.6H4.8a2.2 2.2 0 0 0 0 4.4H7Z" />
      <path className="sf-tone2" d="M17 4.6h2.2a2.2 2.2 0 1 1 0 4.4H17Z" />
      <path fill="currentColor" d="M10.9 12.6h2.2v3.2h-2.2z" />
      <path fill="currentColor" d="M6.6 16.6h10.8V19H6.6z" />
      <path fill="currentColor" d="M5.6 19.6h12.8v1.8H5.6z" />
    </SharpIcon>
  );
}

export function ThumbsUp(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path className="sf-tone2" d="M3.4 10.6h3.6v10H3.4z" />
      <path
        fill="currentColor"
        d="M8.6 10.6 11.9 4c1.9-.4 3.4 1 3 2.9l-.6 3.1h4.5c1.3 0 2.3 1.2 2 2.5l-1.7 6.6c-.3 1-1.1 1.6-2.1 1.6H8.6Z"
      />
    </SharpIcon>
  );
}

export function ThumbsDown(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path className="sf-tone2" d="M3.4 3.4h3.6v10H3.4z" />
      <path
        fill="currentColor"
        d="M8.6 13.4 11.9 20c1.9.4 3.4-1 3-2.9l-.6-3.1h4.5c1.3 0 2.3-1.2 2-2.5l-1.7-6.6c-.3-1-1.1-1.6-2.1-1.6H8.6Z"
      />
    </SharpIcon>
  );
}

export function TrendingDown(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        d="M3.2 4.4H8.2V9H13V13.6H17.8V18.2H21.8V20.6H15.4V16H10.6V11.4H5.8V6.8H3.2Z"
      />
      <path fill="currentColor" d="M19 18.9h3.3v3.3Z" />
      <path className="sf-tone2" d="M3.2 21.6h14.6v1.8H3.2z" />
    </SharpIcon>
  );
}

export function BarChart3(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M4 14h3.4v5.6H4z" />
      <path className="sf-tone2" d="M9.2 10h3.4v9.6H9.2z" />
      <path fill="currentColor" d="M14.4 6.2h3.4v13.4h-3.4z" />
      <path className="sf-tone2" d="M3.4 20.8h17.2v1.6H3.4z" />
    </SharpIcon>
  );
}

export function Target(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Zm0 2.2a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4Z"
      />
      <path
        className="sf-tone2"
        fillRule="evenodd"
        d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z"
      />
      <path fill="currentColor" d="M12 10.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
    </SharpIcon>
  );
}

export function Zap(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M13.4 2 6 13.6h5.2L10.4 22l7.8-11.8h-5.4Z" />
    </SharpIcon>
  );
}

/* ── Devices (shopping categories) ── */

export function Camera(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M8.4 3.8h7.2v2.8H8.4z" />
      <path fill="currentColor" d="M2.6 6.6h18.8v13.2H2.6z" />
      <path
        className="sf-tone2"
        fillRule="evenodd"
        d="M12 8.6a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z"
      />
      <path fill="currentColor" d="M12 10.6a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z" />
      <path className="sf-tone2" d="M16.6 8.4h2.4v1.8h-2.4z" />
    </SharpIcon>
  );
}

export function Laptop(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.2 4.6h15.6v10.8H4.2Zm2.2 2.2v6.4h11.2V6.8Z"
      />
      <path className="sf-tone2" d="M6.4 6.8h11.2v6.4H6.4z" />
      <path fill="currentColor" d="M2.6 16.6h18.8v2.8H2.6z" />
      <path className="sf-tone2" d="M10.4 17.4h3.2v1h-3.2z" />
    </SharpIcon>
  );
}

export function Headphones(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M3.8 13.6a8.2 8.2 0 0 1 16.4 0h-2.2a6 6 0 0 0-12 0Z" />
      <path fill="currentColor" d="M2.6 12.2h4.8v8H2.6z" />
      <path fill="currentColor" d="M16.6 12.2h4.8v8h-4.8z" />
      <path className="sf-tone2" d="M3.4 14h3.4v5.4H3.4z" />
      <path className="sf-tone2" d="M17.4 14h3.4v5.4h-3.4z" />
    </SharpIcon>
  );
}

export function Monitor(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.8 4h18.4v12.4H2.8Zm2.2 2.2v8h14v-8Z"
      />
      <path className="sf-tone2" d="M5 6.2h14v8H5z" />
      <path fill="currentColor" d="M10.9 16.4h2.2v3h-2.2z" />
      <path fill="currentColor" d="M7.4 19.4h9.2v2H7.4z" />
    </SharpIcon>
  );
}

export function Watch(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M8.8 2.4h6.4v4.2H8.8z" />
      <path fill="currentColor" d="M8.8 17.4h6.4v4.2H8.8z" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7 6.6h10v10.8H7Zm2.2 2.2v6.4h5.6V8.8Z"
      />
      <path className="sf-tone2" d="M9.2 8.8h5.6v6.4H9.2z" />
      <path fill="currentColor" d="M11.5 10.4h1v2.4l2 1.2-.5.9-2.5-1.5Z" />
      <path fill="currentColor" d="M18 10.6h1.8v2.8H18z" />
    </SharpIcon>
  );
}

export function Keyboard(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.6 6.6h18.8v10.8H2.6Zm2.2 2.2v6.4h14.4V8.8Z"
      />
      <path className="sf-tone2" d="M4.8 8.8h14.4v6.4H4.8z" />
      <path fill="currentColor" d="M5.8 9.4h2v1.8h-2z" />
      <path fill="currentColor" d="M8.4 9.4h2v1.8h-2z" />
      <path fill="currentColor" d="M11 9.4h2v1.8h-2z" />
      <path fill="currentColor" d="M13.6 9.4h2v1.8h-2z" />
      <path fill="currentColor" d="M16.2 9.4h2v1.8h-2z" />
      <path fill="currentColor" d="M6.7 12h2v1.8h-2z" />
      <path fill="currentColor" d="M9.3 12h2v1.8h-2z" />
      <path fill="currentColor" d="M11.9 12h2v1.8h-2z" />
      <path fill="currentColor" d="M14.5 12h2v1.8h-2z" />
      <path fill="currentColor" d="M5.8 14.6h8v1.2h-8z" />
      <path fill="currentColor" d="M15.4 14.6h2.8v1.2h-2.8z" />
    </SharpIcon>
  );
}

export function Dumbbell(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M6.8 10.9h10.4v2.2H6.8z" />
      <path fill="currentColor" d="M3.6 6.8h2.6v10.4H3.6z" />
      <path className="sf-tone2" d="M6.2 8.8h1.6v6.4H6.2z" />
      <path fill="currentColor" d="M17.8 6.8h2.6v10.4h-2.6z" />
      <path className="sf-tone2" d="M16.2 8.8h1.6v6.4h-1.6z" />
    </SharpIcon>
  );
}

export function GraduationCap(props: SharpIconProps) {
  return (
    <SharpIcon {...props}>
      <path fill="currentColor" d="M12 3.2 21.6 8 12 12.8 2.4 8Z" />
      <path className="sf-tone2" d="M7.4 10.6 12 12.9l4.6-2.3v3.6c0 2-2.1 3.5-4.6 3.5s-4.6-1.5-4.6-3.5Z" />
      <path fill="currentColor" d="M20.6 8.6h1.8v5.4h-1.8z" />
      <path fill="currentColor" d="M20.3 14.2h2.4v2h-2.4z" />
    </SharpIcon>
  );
}
