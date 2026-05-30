import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

/**
 * Controladores de autenticación.
 * Responsabilidad única: extraer datos del request, delegar al servicio
 * y devolver la respuesta HTTP. Sin lógica de negocio aquí.
 */

/**
 * POST /api/auth/register
 * Crea un usuario nuevo y devuelve un JWT listo para usar.
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };

    const result = await registerUser({ email, password, name });

    // 201 Created — recurso generado correctamente
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    // Delegar al middleware global de errores
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Valida credenciales y devuelve JWT + datos básicos del usuario.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await loginUser({ email, password });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
