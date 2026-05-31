import { Request } from 'express';

export function getRouteParam(
  params: Record<string, string | string[]>,
  key: string
): string {
  const value = params[key];

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }

  throw new Error(`Parámetro de ruta inválido o ausente: ${key}`);
}

export function getAuthUserId(req: Request): string {
  if (!req.userId) {
    throw new Error('Usuario no autenticado');
  }
  return req.userId;
}
