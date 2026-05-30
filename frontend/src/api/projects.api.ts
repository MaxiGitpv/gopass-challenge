import { apiClient } from './axios';
import type { ApiResponse, Project } from '../types';

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ApiResponse<Project[]>>('/projects');
  return data.data;
}

export async function fetchProject(id: string): Promise<Project> {
  const { data } = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
  return data.data;
}

export async function createProject(name: string): Promise<Project> {
  const { data } = await apiClient.post<ApiResponse<Project>>('/projects', { name });
  return data.data;
}

export async function updateProject(id: string, name: string): Promise<Project> {
  const { data } = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, { name });
  return data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
