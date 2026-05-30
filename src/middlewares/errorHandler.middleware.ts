import { Request, Response, NextFunction } from 'express';

/** Formato estándar de error que devuelve la API al cliente */
export interface ApiError extends Error {
  statusCode?: number;
}

/**
 * Middleware global de errores — captura excepciones de controladores y servicios.
 * Debe registrarse al final del pipeline de Express (ver server.ts).
 */
export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'Error interno del servidor' : err.message;

  // Log en consola para diagnóstico; en producción conviene un logger estructurado
  if (statusCode === 500) {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
