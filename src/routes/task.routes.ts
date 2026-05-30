import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  listTasks,
  getTask,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getTaskSuggestions,
} from '../controllers/task.controller';

/**
 * Rutas de tareas anidadas bajo /:projectId.
 * Se montan en server.ts bajo /api/projects para obtener
 * la ruta completa: /api/projects/:projectId/tasks/...
 *
 * La ruta de sugerencias va antes de /:taskId para que Express
 * no interprete "suggestions" como un taskId de tipo UUID.
 */
export const taskRoutes: Router = Router();

// Todas las rutas de tareas requieren autenticación JWT
taskRoutes.use(authenticate);

// Sugerencias IA — debe declararse antes de /:taskId (conflicto de params)
taskRoutes.post('/:projectId/tasks/suggestions', getTaskSuggestions);

taskRoutes.get('/:projectId/tasks', listTasks);
taskRoutes.post('/:projectId/tasks', createTaskHandler);
taskRoutes.get('/:projectId/tasks/:taskId', getTask);
taskRoutes.put('/:projectId/tasks/:taskId', updateTaskHandler);
taskRoutes.delete('/:projectId/tasks/:taskId', deleteTaskHandler);
