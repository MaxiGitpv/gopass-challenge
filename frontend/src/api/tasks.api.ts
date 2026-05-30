import { apiClient } from './axios';
import type { ApiResponse, Task, TaskPriority, TaskStatus, TaskSuggestion } from '../types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export async function fetchTasks(projectId: string): Promise<Task[]> {
  const { data } = await apiClient.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
  return data.data;
}

export async function createTask(projectId: string, payload: CreateTaskPayload): Promise<Task> {
  const { data } = await apiClient.post<ApiResponse<Task>>(
    `/projects/${projectId}/tasks`,
    payload
  );
  return data.data;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  payload: UpdateTaskPayload
): Promise<Task> {
  const { data } = await apiClient.put<ApiResponse<Task>>(
    `/projects/${projectId}/tasks/${taskId}`,
    payload
  );
  return data.data;
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
}

export async function fetchAiSuggestions(
  projectId: string,
  projectName: string
): Promise<TaskSuggestion[]> {
  const { data } = await apiClient.post<ApiResponse<TaskSuggestion[]>>(
    `/projects/${projectId}/tasks/suggestions`,
    { projectName }
  );
  return data.data;
}
