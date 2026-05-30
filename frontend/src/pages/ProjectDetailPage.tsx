import { DragEvent, FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Plus } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AiLoadingOverlay } from '../components/ui/AiLoadingOverlay';
import { KanbanColumn } from '../components/tasks/KanbanColumn';
import { ProjectTaskCounters } from '../components/projects/ProjectTaskCounters';
import { useProject } from '../hooks/useProjects';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useAiTaskSuggestions,
} from '../hooks/useTasks';
import type { TaskCounts, TaskStatus } from '../types';

const KANBAN_COLUMNS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export function ProjectDetailPage() {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: tasks, isLoading: loadingTasks } = useTasks(projectId);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const aiSuggestions = useAiTaskSuggestions(projectId, project?.name ?? '');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setShowCreateModal(false);
        },
      }
    );
  };

  const handleDragStart = (_e: DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = tasks?.find((t) => t.id === draggedTaskId);
    if (task && task.status !== newStatus) {
      updateTask.mutate({ taskId: draggedTaskId, payload: { status: newStatus } });
    }
    setDraggedTaskId(null);
  };

  const tasksByStatus = (status: TaskStatus) =>
    tasks?.filter((t) => t.status === status) ?? [];

  const taskCounts: TaskCounts = {
    PENDING: tasksByStatus('PENDING').length,
    IN_PROGRESS: tasksByStatus('IN_PROGRESS').length,
    DONE: tasksByStatus('DONE').length,
    total: tasks?.length ?? 0,
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen">
        <Navbar title="Cargando..." showBack />
        <LoadingSpinner message="Cargando proyecto..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar title={project?.name ?? 'Proyecto'} showBack />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {!loadingTasks && <ProjectTaskCounters counts={taskCounts} />}

        {/* Barra de acciones del proyecto */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
          <Button
            variant="neon"
            onClick={() => aiSuggestions.mutate()}
            isLoading={aiSuggestions.isPending}
            disabled={!project?.name}
          >
            <Sparkles className="h-4 w-4" />
            Generar Tareas con IA
          </Button>
        </div>

        {loadingTasks ? (
          <LoadingSpinner message="Cargando tareas..." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {KANBAN_COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus(status)}
                onDeleteTask={(id) => deleteTask.mutate(id)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />
            ))}
          </div>
        )}
      </main>

      {aiSuggestions.isPending && <AiLoadingOverlay />}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva tarea">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Título"
            placeholder="Ej: Diseñar wireframes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Descripción (opcional)"
            placeholder="Detalles de la tarea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" fullWidth isLoading={createTask.isPending}>
            Crear tarea
          </Button>
        </form>
      </Modal>
    </div>
  );
}
