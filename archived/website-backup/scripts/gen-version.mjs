/**
 * Generates version.json for the footer display
 * Run via: node scripts/gen-version.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

let commit = '';
let commitMessage = '';
let branch = '';

try {
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  commitMessage = execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim();
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
} catch (e) {
  // git not available
}

const version = {
  version: pkg.version,
  commit,
  commitMessage,
  branch,
  builtAt: new Date().toISOString(),
};

const out = join(__dirname, '..', 'public', 'version.json');
writeFileSync(out, JSON.stringify(version, null, 2) + '\n');
console.log(`Version info written: v${pkg.version} (${commit})`);
