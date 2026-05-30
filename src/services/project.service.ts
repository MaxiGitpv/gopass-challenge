import { Project } from '@prisma/client';
import { prisma } from '../config/database';

/** Datos requeridos para crear un proyecto */
interface CreateProjectInput {
  name: string;
  userId: string;
}

/** Datos opcionales para actualizar un proyecto */
interface UpdateProjectInput {
  name?: string;
}

/**
 * Helper interno que lanza 404 si el proyecto no existe
 * o 403 si pertenece a otro usuario.
 * Centraliza la lógica de autorización para no repetirla en cada operación.
 */
async function findOwnedProject(projectId: string, userId: string): Promise<Project> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    const error = new Error('Proyecto no encontrado') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }

  // El recurso existe pero pertenece a otro usuario — 403 Forbidden
  if (project.userId !== userId) {
    const error = new Error('No tienes permiso para acceder a este proyecto') as Error & {
      statusCode: number;
    };
    error.statusCode = 403;
    throw error;
  }

  return project;
}

/** Devuelve todos los proyectos del usuario autenticado */
export async function getProjectsByUser(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/** Devuelve un proyecto específico validando que pertenezca al usuario */
export async function getProjectById(projectId: string, userId: string): Promise<Project> {
  return findOwnedProject(projectId, userId);
}

/** Crea un proyecto y lo asocia al usuario autenticado */
export async function createProject(input: CreateProjectInput): Promise<Project> {
  return prisma.project.create({
    data: {
      name: input.name,
      userId: input.userId,
    },
  });
}

/** Actualiza el nombre de un proyecto verificando la propiedad */
export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput
): Promise<Project> {
  // Verificar existencia y propiedad antes de modificar
  await findOwnedProject(projectId, userId);

  return prisma.project.update({
    where: { id: projectId },
    data: input,
  });
}

/** Elimina un proyecto y sus tareas en cascada (definido en schema.prisma) */
export async function deleteProject(projectId: string, userId: string): Promise<void> {
  await findOwnedProject(projectId, userId);
  await prisma.project.delete({ where: { id: projectId } });
}
