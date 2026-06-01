import { Project, TaskStatus } from '../generated/prisma/client';
import { prisma } from '../config/database';

export interface TaskCounts {
  PENDING: number;
  IN_PROGRESS: number;
  DONE: number;
  total: number;
}

export interface ProjectWithTaskCounts extends Project {
  taskCounts: TaskCounts;
}

const emptyTaskCounts = (): TaskCounts => ({
  PENDING: 0,
  IN_PROGRESS: 0,
  DONE: 0,
  total: 0,
});

interface CreateProjectInput {
  name: string;
  userId: string;
}

interface UpdateProjectInput {
  name?: string;
}

async function findOwnedProject(projectId: string, userId: string): Promise<Project> {
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

  return project;
}

export async function getProjectsByUser(userId: string): Promise<ProjectWithTaskCounts[]> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  // Una sola query agregada — evita N+1 por proyecto
  const grouped = await prisma.task.groupBy({
    by: ['projectId', 'status'],
    where: { projectId: { in: projectIds } },
    _count: { _all: true },
  });

  const countsMap = new Map<string, TaskCounts>();
  for (const id of projectIds) {
    countsMap.set(id, emptyTaskCounts());
  }

  for (const row of grouped) {
    const counts = countsMap.get(row.projectId)!;
    const amount = row._count._all;
    counts[row.status as TaskStatus] = amount;
    counts.total += amount;
  }

  return projects.map((project) => ({
    ...project,
    taskCounts: countsMap.get(project.id) ?? emptyTaskCounts(),
  }));
}

export async function getProjectById(projectId: string, userId: string): Promise<Project> {
  return findOwnedProject(projectId, userId);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  return prisma.project.create({
    data: { name: input.name, userId: input.userId },
  });
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput
): Promise<Project> {
  await findOwnedProject(projectId, userId);
  return prisma.project.update({ where: { id: projectId }, data: input });
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  await findOwnedProject(projectId, userId);

  await prisma.project.delete({ where: { id: projectId } });
}
