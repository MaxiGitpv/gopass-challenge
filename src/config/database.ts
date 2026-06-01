import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from './env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function shouldUseSsl(databaseUrl: string): boolean {
  if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    return false;
  }
  // Host interno de Railway — conexión sin TLS
  if (databaseUrl.includes('.railway.internal')) {
    return false;
  }
  if (databaseUrl.includes('sslmode=disable')) {
    return false;
  }
  return (
    databaseUrl.includes('railway.app') ||
    databaseUrl.includes('sslmode=require') ||
    process.env.NODE_ENV === 'production'
  );
}

function createPrismaClient(): PrismaClient {
  const useSsl = shouldUseSsl(env.DATABASE_URL);

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ...(useSsl && { ssl: { rejectUnauthorized: false } }),
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

// Evita múltiples instancias en hot-reload (tsx watch)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
