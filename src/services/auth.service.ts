import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateToken } from '../utils/jwt.util';

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: { id: string; email: string; name: string | null };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {

    const error = new Error('El email ya está registrado') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: { email: input.email, password: hashedPassword, name: input.name },

    select: { id: true, email: true, name: true },
  });

  const token = generateToken({ userId: user.id });
  return { token, user };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  const authError = new Error('Credenciales inválidas') as Error & { statusCode: number };
  authError.statusCode = 401;

  if (!user) throw authError;

  const passwordMatch = await comparePassword(input.password, user.password);
  if (!passwordMatch) throw authError;

  const token = generateToken({ userId: user.id });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
