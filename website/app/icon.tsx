import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0b0f',
          color: 'white',
          fontSize: 200,
          fontWeight: 800,
          fontFamily: 'monospace',
        }}
      >
        t<span style={{ color: '#FF6B3D' }}>//</span>s
      </div>
    ),
    { ...size }
  );
}
