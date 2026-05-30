import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

/**
 * Rutas de autenticación — endpoints públicos, no requieren JWT.
 * El router solo conecta verbo HTTP + ruta con su controlador.
 */
export const authRoutes: Router = Router();

// POST /api/auth/register — crea usuario y devuelve token
authRoutes.post('/register', register);

// POST /api/auth/login — valida credenciales y devuelve token
authRoutes.post('/login', login);
