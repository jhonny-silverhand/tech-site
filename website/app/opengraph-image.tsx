import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  let pixelFont: ArrayBuffer | null = null;
  try {
    const buf = await readFile(join(process.cwd(), 'public', 'fonts', 'Pixels.ttf'));
    pixelFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    // fall back to monospace
  }
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
          fontFamily: pixelFont ? 'Pixels, monospace' : 'monospace',
        }}
      >
        <div style={{ fontSize: 100, display: 'flex' }}>
          tech<span style={{ color: '#4F7DFF' }}>//</span>site
        </div>
        <div style={{ fontSize: 30, color: '#a1a1aa', marginTop: 16, fontFamily: 'monospace' }}>
          Practical answers, not filler — across code, devices, and money.
        </div>
      </div>
    ),
    {
      ...size,
      ...(pixelFont ? { fonts: [{ name: 'Pixels', data: pixelFont, weight: 400, style: 'normal' }] } : {}),
    }
  );
}
