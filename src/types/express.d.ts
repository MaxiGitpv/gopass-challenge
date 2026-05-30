/**
 * Augmentación del tipo Request de Express.
 * El middleware JWT asigna userId; los controladores lo leen desde aquí.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
