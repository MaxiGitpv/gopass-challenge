import { Task, TaskStatus, TaskPriority } from '../generated/prisma/client';
import { prisma } from '../config/database';

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

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

export async function getTasksByProject(projectId: string, userId: string): Promise<Task[]> {
  await assertProjectOwnership(projectId, userId);
  return prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getTaskById(
  taskId: string,
  projectId: string,
  userId: string
): Promise<Task> {
  await assertProjectOwnership(projectId, userId);
  return findTaskInProject(taskId, projectId);
}

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

export async function deleteTask(
  taskId: string,
  projectId: string,
  userId: string
): Promise<void> {
  await assertProjectOwnership(projectId, userId);
  await findTaskInProject(taskId, projectId);
  await prisma.task.delete({ where: { id: taskId } });
}
