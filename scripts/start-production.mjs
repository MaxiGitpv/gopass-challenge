import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

console.log('[start] GoPass backend boot sequence');
console.log('[start] cwd:', process.cwd());
console.log('[start] NODE_ENV:', process.env.NODE_ENV ?? 'undefined');
console.log('[start] PORT:', process.env.PORT ?? 'undefined');
console.log('[start] DATABASE_URL set:', Boolean(process.env.DATABASE_URL));
console.log('[start] JWT_SECRET set:', Boolean(process.env.JWT_SECRET));
console.log('[start] dist/server.js exists:', existsSync('dist/server.js'));

if (!existsSync('dist/server.js')) {
  console.error('[start] dist/server.js not found — build step may have failed.');
  process.exit(1);
}

console.log('[start] Running database migrations...');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('[start] Migrations applied successfully.');
} catch {
  console.error('[start] Migration failed — check DATABASE_URL in Railway backend service.');
  process.exit(1);
}

console.log('[start] Starting server...');

const server = spawn('node', ['dist/server.js'], { stdio: 'inherit' });

server.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGTERM', () => server.kill('SIGTERM'));
process.on('SIGINT', () => server.kill('SIGINT'));
