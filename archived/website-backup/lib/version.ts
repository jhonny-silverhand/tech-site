import { readFileSync } from 'fs';
import { join } from 'path';

export interface VersionInfo {
  version: string;
  commit: string;
  commitMessage: string;
  branch: string;
  builtAt: string;
}

let cached: VersionInfo | null = null;

export async function getVersionInfo(): Promise<VersionInfo | null> {
  if (cached) return cached;

  try {
    const data = readFileSync(join(process.cwd(), 'public', 'version.json'), 'utf8');
    cached = JSON.parse(data);
    return cached;
  } catch {
    return null;
  }
}
