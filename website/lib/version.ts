export function getVersion(): { version: string; commit: string; builtAt: string } {
  return { version: '1.1.0', commit: 'local', builtAt: '' };
}

export async function getVersionInfo(): Promise<{ version: string; commit: string; builtAt: string }> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || '';
    const res = await fetch(`${base}/version.json`, { cache: 'no-store' });
    if (res.ok) return (await res.json()) as { version: string; commit: string; builtAt: string };
  } catch {
    // ignore — fall through to default
  }
  return getVersion();
}
