import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

console.log('[start] GoPass backend starting...');
console.log('[start] PORT:', process.env.PORT ?? '(not set)');
console.log('[start] DATABASE_URL set:', Boolean(process.env.DATABASE_URL));

if (!existsSync('dist/server.js')) {
  console.error('[start] FATAL: dist/server.js not found. Build step may have failed.');
  process.exit(1);
}

console.log('[start] Running migrations...');
try {
  execSync('node_modules/.bin/prisma migrate deploy', { stdio: 'inherit' });
  console.log('[start] Migrations OK.');
} catch {
  console.error('[start] Migration failed. Check DATABASE_URL.');
  process.exit(1);
}

console.log('[start] Launching server...');
const child = spawn('node', ['dist/server.js'], { stdio: 'inherit', env: process.env });

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
