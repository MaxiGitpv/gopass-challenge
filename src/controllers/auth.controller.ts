import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {

    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };

    const result = await registerUser({ email, password, name });

    res.status(201).json({ success: true, data: result });
  } catch (error) {

    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await loginUser({ email, password });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
