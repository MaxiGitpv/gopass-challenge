import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/** Estructura del payload que se firma dentro del JWT */
export interface JwtPayload {
  userId: string;
}

/**
 * Genera un JWT firmado con el userId del usuario autenticado.
 * La expiración se lee de variables de entorno para poder ajustarse sin recompilar.
 */
export function generateToken(payload: JwtPayload): string {
  // El cast a string es seguro porque env.JWT_EXPIRES_IN siempre tiene valor por defecto
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifica y decodifica un JWT.
 * Lanza JsonWebTokenError si el token es inválido o ha expirado.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
