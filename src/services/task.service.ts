import { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { prisma } from '../config/database';

/** Datos necesarios para crear una tarea */
interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/** Todos los campos de una tarea son opcionales al actualizar */
interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * Verifica que el proyecto pertenezca al usuario autenticado antes de
 * operar sobre sus tareas. Centraliza la lógica de autorización de tareas
 * evitando repetirla en cada función del servicio.
 */
async function assertProjectOwnership(projectId: string, userId: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    const error = new Error('Proyecto no encontrado') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }

  if (project.userId !== userId) {
    const error = new Error('No tienes permiso para acceder a este proyecto') as Error & {
      statusCode: number;
    };
    error.statusCode = 403;
    throw error;
  }
}

/**
 * Helper que busca una tarea por ID dentro de un proyecto.
 * Lanza 404 si no existe o no pertenece al proyecto dado.
 */
async function findTaskInProject(taskId: string, projectId: string): Promise<Task> {
  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId },
  });

  if (!task) {
    const error = new Error('Tarea no encontrada') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }

  return task;
}

/** Lista todas las tareas de un proyecto verificando la propiedad */
export async function getTasksByProject(projectId: string, userId: string): Promise<Task[]> {
  await assertProjectOwnership(projectId, userId);
  return prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  });
}

/** Devuelve una tarea específica dentro de un proyecto del usuario */
export async function getTaskById(
  taskId: string,
  projectId: string,
  userId: string
): Promise<Task> {
  await assertProjectOwnership(projectId, userId);
  return findTaskInProject(taskId, projectId);
}

/** Crea una tarea dentro del proyecto indicado */
export async function createTask(
  projectId: string,
  userId: string,
  input: CreateTaskInput
): Promise<Task> {
  await assertProjectOwnership(projectId, userId);

  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? TaskStatus.PENDING,
      priority: input.priority ?? TaskPriority.MEDIUM,
      projectId,
    },
  });
}

/** Actualiza los campos enviados de una tarea, sin tocar los omitidos */
export async function updateTask(
  taskId: string,
  projectId: string,
  userId: string,
  input: UpdateTaskInput
): Promise<Task> {
  await assertProjectOwnership(projectId, userId);
  await findTaskInProject(taskId, projectId);

  return prisma.task.update({
    where: { id: taskId },
    data: input,
  });
}

/** Elimina una tarea verificando que el proyecto pertenezca al usuario */
export async function deleteTask(
  taskId: string,
  projectId: string,
  userId: string
): Promise<void> {
  await assertProjectOwnership(projectId, userId);
  await findTaskInProject(taskId, projectId);
  await prisma.task.delete({ where: { id: taskId } });
}
