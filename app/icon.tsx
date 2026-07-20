import { ImageResponse } from 'next/og';

// The logo itself is a wide wordmark, which doesn't crop into a legible
// 32x32 favicon. This generates a small standalone mark instead — the
// double-slash motif on the same dark background — so the browser tab
// icon still reads as "this brand" at a glance. Swap for a real designed
// mark any time; this is a reasonable placeholder that costs nothing to
// keep as-is.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#12151A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 3, transform: 'skewX(-12deg)' }}>
          <div style={{ width: 5, height: 18, background: '#3654FF' }} />
          <div style={{ width: 5, height: 18, background: '#3654FF' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
