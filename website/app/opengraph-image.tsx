import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#09090B',
          color: 'white',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800 }}>
          tech<span style={{ color: '#4F7DFF' }}>//</span>site
        </div>
        <div style={{ fontSize: 30, color: '#a1a1aa', marginTop: 16 }}>
          Practical answers, not filler — across code, devices, and money.
        </div>
      </div>
    ),
    { ...size }
  );
}
