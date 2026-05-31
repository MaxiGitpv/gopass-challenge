import { Request, Response, NextFunction } from 'express';
import { getAuthUserId, getRouteParam } from '../utils/params.util';
import {
  getProjectsByUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../services/project.service';

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

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await getProjectById(getRouteParam(req.params, 'id'), getAuthUserId(req));
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

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
