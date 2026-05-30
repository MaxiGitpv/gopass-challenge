import { Request } from 'express';

/**
 * Normaliza un parámetro de ruta de Express 5 (string | string[]) a string.
 * Express 5 tipa params como union; este helper evita casts repetidos en controladores.
 */
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

/**
 * Devuelve el userId inyectado por el middleware de autenticación.
 * Lanza error si se invoca en una ruta sin JWT (fallo de configuración de rutas).
 */
export function getAuthUserId(req: Request): string {
  if (!req.userId) {
    throw new Error('Usuario no autenticado');
  }
  return req.userId;
}
