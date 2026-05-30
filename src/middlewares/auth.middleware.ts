import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.util';

/**
 * Middleware de autenticación JWT.
 * Extrae el token del header Authorization (Bearer <token>),
 * lo valida y adjunta el userId al objeto Request para que los
 * controladores lo usen sin repetir la lógica de verificación.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token de autenticación no proporcionado' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ success: false, message: 'El token ha expirado' });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Token inválido' });
      return;
    }
    next(error);
  }
}
