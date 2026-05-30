import dotenv from 'dotenv';

// Carga variables desde .env antes de que cualquier módulo las consuma
dotenv.config();

/** Variables de entorno tipadas — falla al arrancar si falta alguna obligatoria */
interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OPENAI_API_KEY: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variable de entorno obligatoria no definida: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  OPENAI_API_KEY: requireEnv('OPENAI_API_KEY'),
};
