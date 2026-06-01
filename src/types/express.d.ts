declare global {
  namespace Express {
    interface Request {
      userId?: string; // Asignado en auth.middleware tras validar JWT
    }
  }
}

export {};
