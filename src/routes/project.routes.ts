import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  listProjects,
  getProject,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/project.controller';

export const projectRoutes: Router = Router();

projectRoutes.use(authenticate);

projectRoutes.get('/', listProjects);
projectRoutes.post('/', createProjectHandler);
projectRoutes.get('/:id', getProject);
projectRoutes.put('/:id', updateProjectHandler);
projectRoutes.delete('/:id', deleteProjectHandler);
