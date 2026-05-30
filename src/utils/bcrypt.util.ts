import bcrypt from 'bcrypt';

// Número de rondas de sal — 12 ofrece buen balance entre seguridad y rendimiento
const SALT_ROUNDS = 12;

/**
 * Genera el hash bcrypt de una contraseña en texto plano.
 * Se usa al registrar un usuario; el hash se persiste en base de datos.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con su hash almacenado.
 * Devuelve true si coinciden; false en cualquier otro caso.
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
