/** Usuario autenticado — coincide con la respuesta del backend */
export interface User {
  id: string;
  email: string;
  name: string | null;
}

/** Respuesta estándar del backend para operaciones exitosas */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/** Respuesta de error del backend */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

/** Resultado de login/registro */
export interface AuthData {
  token: string;
  user: User;
}

/** Contadores de tareas por estado en un proyecto */
export interface TaskCounts {
  PENDING: number;
  IN_PROGRESS: number;
  DONE: number;
  total: number;
}

/** Proyecto — entidad del dashboard */
export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  taskCounts?: TaskCounts;
}

/** Estados y prioridades alineados con el schema Prisma del backend */
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

/** Sugerencia devuelta por el endpoint de IA */
export interface TaskSuggestion {
  title: string;
  description: string;
}

/** Etiquetas en español para las columnas del tablero Kanban */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  DONE: 'Completado',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};
