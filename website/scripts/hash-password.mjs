import bcrypt from 'bcryptjs';

// Usage: node scripts/hash-password.mjs <password>
const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
const b64 = Buffer.from(hash, 'utf8').toString('base64');
console.log('bcrypt hash:', hash);
console.log('ADMIN_PASSWORD_HASH_B64=' + b64);
