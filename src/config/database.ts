import { PrismaClient } from '@prisma/client';

/**
 * Instancia única de PrismaClient (patrón singleton).
 * Evita abrir múltiples conexiones a PostgreSQL en entornos con hot-reload.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/** Cierra la conexión al apagar el servidor */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
