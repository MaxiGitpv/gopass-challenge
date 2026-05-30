import { Request, Response, NextFunction } from 'express';
import { getAuthUserId, getRouteParam } from '../utils/params.util';
import {
  getProjectsByUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../services/project.service';

/** GET /api/projects — lista todos los proyectos del usuario autenticado */
export async function listProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const projects = await getProjectsByUser(getAuthUserId(req));
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
}

/** GET /api/projects/:id — devuelve un proyecto por su ID */
export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await getProjectById(getRouteParam(req.params, 'id'), getAuthUserId(req));
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

/** POST /api/projects — crea un proyecto asociado al usuario autenticado */
export async function createProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.body as { name: string };
    const project = await createProject({ name, userId: getAuthUserId(req) });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

/** PUT /api/projects/:id — actualiza el nombre del proyecto */
export async function updateProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.body as { name?: string };
    const project = await updateProject(getRouteParam(req.params, 'id'), getAuthUserId(req), {
      name,
    });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/projects/:id — elimina el proyecto y sus tareas en cascada */
export async function deleteProjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteProject(getRouteParam(req.params, 'id'), getAuthUserId(req));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
