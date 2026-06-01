import { execSync, spawn } from 'node:child_process';

console.log('[start] Running database migrations...');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('[start] Migrations applied successfully.');
} catch {
  console.error('[start] Migration failed — check DATABASE_URL and Railway PostgreSQL plugin.');
  process.exit(1);
}

console.log('[start] Starting server...');

const server = spawn('node', ['dist/server.js'], { stdio: 'inherit' });

server.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGTERM', () => server.kill('SIGTERM'));
process.on('SIGINT', () => server.kill('SIGINT'));
