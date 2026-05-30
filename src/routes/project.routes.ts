import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  listProjects,
  getProject,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/project.controller';

/**
 * Rutas CRUD de proyectos — todas protegidas con JWT.
 * El middleware authenticate se aplica al nivel del router para no repetirlo
 * en cada ruta individualmente (principio DRY).
 */
export const projectRoutes: Router = Router();

// Aplica autenticación a todas las rutas de este router
projectRoutes.use(authenticate);

projectRoutes.get('/', listProjects);
projectRoutes.post('/', createProjectHandler);
projectRoutes.get('/:id', getProject);
projectRoutes.put('/:id', updateProjectHandler);
projectRoutes.delete('/:id', deleteProjectHandler);
