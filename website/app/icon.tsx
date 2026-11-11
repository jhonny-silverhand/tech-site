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
          background: '#09090B',
          color: 'white',
          fontSize: 200,
          fontWeight: 800,
          fontFamily: 'monospace',
        }}
      >
        t<span style={{ color: '#4F7DFF' }}>//</span>s
      </div>
    ),
    { ...size }
  );
}
