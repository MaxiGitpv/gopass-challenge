import { Request, Response, NextFunction } from 'express';
import { TaskStatus, TaskPriority } from '../generated/prisma/client';
import { getAuthUserId, getRouteParam } from '../utils/params.util';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/task.service';
import { suggestTasks } from '../services/ai.service';

export async function listTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tasks = await getTasksByProject(getRouteParam(req.params, 'projectId'), getAuthUserId(req));
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await getTaskById(
      getRouteParam(req.params, 'taskId'),
      getRouteParam(req.params, 'projectId'),
      getAuthUserId(req)
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function createTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority } = req.body as {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    };

    const task = await createTask(getRouteParam(req.params, 'projectId'), getAuthUserId(req), {
      title,
      description,
      status,
      priority,
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority } = req.body as {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    };

    const task = await updateTask(
      getRouteParam(req.params, 'taskId'),
      getRouteParam(req.params, 'projectId'),
      getAuthUserId(req),
      { title, description, status, priority }
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteTask(
      getRouteParam(req.params, 'taskId'),
      getRouteParam(req.params, 'projectId'),
      getAuthUserId(req)
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getTaskSuggestions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { projectName } = req.body as { projectName: string };
    const suggestions = await suggestTasks(projectName);
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
}
