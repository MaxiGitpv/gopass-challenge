import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createTask,
  deleteTask,
  fetchAiSuggestions,
  fetchTasks,
  updateTask,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '../api/tasks.api';
import { PROJECTS_KEY } from './useProjects';

export const tasksKey = (projectId: string) => ['tasks', projectId] as const;

function invalidateProjectCounts(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
}

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: tasksKey(projectId),
    queryFn: () => fetchTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(projectId) });
      invalidateProjectCounts(queryClient);
      toast.success('Tarea creada');
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) =>
      updateTask(projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(projectId) });
      invalidateProjectCounts(queryClient);
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey(projectId) });
      invalidateProjectCounts(queryClient);
      toast.success('Tarea eliminada');
    },
  });
}

export function useAiTaskSuggestions(projectId: string, projectName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const suggestions = await fetchAiSuggestions(projectId, projectName);

      for (const suggestion of suggestions) {
        await createTask(projectId, {
          title: suggestion.title,
          description: suggestion.description,
          status: 'PENDING',
        });
      }

      return suggestions;
    },
    onSuccess: (suggestions) => {
      queryClient.invalidateQueries({ queryKey: tasksKey(projectId) });
      invalidateProjectCounts(queryClient);
      if (suggestions.length === 0) {
        toast.info('No se generaron sugerencias');
      } else {
        toast.success(`${suggestions.length} tareas generadas con IA`);
      }
    },
  });
}
