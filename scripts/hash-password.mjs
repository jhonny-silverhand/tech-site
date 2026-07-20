#!/usr/bin/env node
// Generates the value for ADMIN_PASSWORD_HASH_B64 in .env.local.
// Usage: npm run hash-password -- "your-real-password"
//
// The hash itself is base64-encoded before printing. This is deliberate:
// bcrypt hashes look like $2a$10$..., and that leading $2a$10$ is
// routinely mangled by .env parsers (including Next.js's own loader),
// which treat $word as variable-expansion syntax and silently strip it.
// Base64 has no characters that trigger that, so it round-trips safely
// no matter how it's pasted.
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-real-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const encoded = Buffer.from(hash, 'utf-8').toString('base64');
console.log('\nAdd this line to website/.env.local:\n');
console.log(`ADMIN_PASSWORD_HASH_B64=${encoded}\n`);

