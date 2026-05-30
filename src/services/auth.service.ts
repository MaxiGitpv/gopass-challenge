import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateToken } from '../utils/jwt.util';

/** Datos requeridos para crear un nuevo usuario */
interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

/** Datos requeridos para iniciar sesión */
interface LoginInput {
  email: string;
  password: string;
}

/** Respuesta que devuelve el servicio tras autenticación exitosa */
interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Registra un nuevo usuario en la base de datos.
 * Lanza un error con statusCode 409 si el email ya está en uso,
 * de modo que el errorHandler global lo convierta en respuesta HTTP.
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  // Verificar unicidad del email antes de intentar insertar
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    const error = new Error('El email ya está registrado') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  // Nunca almacenamos la contraseña en texto plano
  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
    },
    // Seleccionar solo los campos que se expondrán al cliente
    select: { id: true, email: true, name: true },
  });

  const token = generateToken({ userId: user.id });
  return { token, user };
}

/**
 * Autentica a un usuario existente comparando su contraseña con el hash.
 * Lanza 401 si el email no existe o la contraseña es incorrecta.
 * Intencionalmente el mensaje es ambiguo para no revelar si el email existe.
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Mensaje genérico para no filtrar información sobre qué campo es incorrecto
  const authError = new Error('Credenciales inválidas') as Error & { statusCode: number };
  authError.statusCode = 401;

  if (!user) throw authError;

  const passwordMatch = await comparePassword(input.password, user.password);
  if (!passwordMatch) throw authError;

  const token = generateToken({ userId: user.id });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
