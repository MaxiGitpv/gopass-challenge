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

export const taskRoutes: Router = Router();

taskRoutes.use(authenticate);

taskRoutes.post('/:projectId/tasks/suggestions', getTaskSuggestions);

taskRoutes.get('/:projectId/tasks', listTasks);
taskRoutes.post('/:projectId/tasks', createTaskHandler);
taskRoutes.get('/:projectId/tasks/:taskId', getTask);
taskRoutes.put('/:projectId/tasks/:taskId', updateTaskHandler);
taskRoutes.delete('/:projectId/tasks/:taskId', deleteTaskHandler);
