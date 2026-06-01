import dotenv from 'dotenv';

// Carga .env en local; en Railway las variables ya están en process.env
dotenv.config();

export interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OPENAI_API_KEY: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // Loguear el nombre de la variable faltante para diagnosticar en Railway Logs
    console.error(`[env] FALTA variable obligatoria: ${key}`);
    throw new Error(`Variable de entorno obligatoria no definida: ${key}`);
  }
  return value;
}

// Exportamos el objeto de configuración tipado
// PORT: Railway inyecta el número de puerto dinámicamente; 3000 es el fallback local
// DATABASE_URL / JWT_SECRET: obligatorias — el servidor no arranca sin ellas
// OPENAI_API_KEY: opcional para auth; solo requerida para el módulo de sugerencias IA
export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};
