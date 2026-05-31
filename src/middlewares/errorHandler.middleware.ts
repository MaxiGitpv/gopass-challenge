import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'Error interno del servidor' : err.message;

  if (statusCode === 500) {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
