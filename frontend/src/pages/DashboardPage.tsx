import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Trash2, Pencil } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProjectTaskCounters } from '../components/projects/ProjectTaskCounters';
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '../hooks/useProjects';
import type { Project } from '../types';

export function DashboardPage() {
  const { data: projects, isLoading, isError } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    createProject.mutate(projectName.trim(), {
      onSuccess: () => {
        setProjectName('');
        setShowCreateModal(false);

      },
    });
  };

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject || !projectName.trim()) return;
    updateProject.mutate(
      { id: editingProject.id, name: projectName.trim() },
      {
        onSuccess: () => {
          setEditingProject(null);
          setProjectName('');
          setShowEditModal(false);
        },
      }
    );
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar title="Mis Proyectos" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gopass-100">Dashboard</h2>
            <p className="text-sm text-gopass-500">Organiza y gestiona tus proyectos</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>

        {}
        {isLoading && <LoadingSpinner message="Cargando proyectos..." />}

        {isError && (
          <div className="glass-panel p-8 text-center text-red-400">
            No se pudieron cargar los proyectos. Verifica que el backend esté corriendo.
          </div>
        )}

        {projects && projects.length === 0 && (
          <div className="glass-panel flex flex-col items-center gap-4 p-12 text-center">
            <FolderKanban className="h-12 w-12 text-gopass-600" />
            <p className="text-gopass-400">Aún no tienes proyectos. ¡Crea el primero!</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Crear proyecto
            </Button>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="glass-panel group p-5 transition hover:border-gopass-400/20">
                {}
                <Link to={`/projects/${project.id}`} className="block">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gopass-500/20">
                    <FolderKanban className="h-5 w-5 text-gopass-400" />
                  </div>
                  <h3 className="font-semibold text-gopass-100 group-hover:text-gopass-300">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-gopass-600">
                    {new Date(project.createdAt).toLocaleDateString('es-CO')}
                  </p>
                  {project.taskCounts && (
                    <ProjectTaskCounters counts={project.taskCounts} />
                  )}
                </Link>
                <div className="mt-4 flex gap-2 border-t border-white/5 pt-3">
                  <Button
                    variant="ghost"
                    className="!px-2 !py-1.5 text-xs"
                    onClick={() => openEdit(project)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="!px-2 !py-1.5 text-xs"
                    onClick={() => deleteProject.mutate(project.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo proyecto">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Nombre del proyecto"
            placeholder="Ej: App móvil GoPass"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" fullWidth isLoading={createProject.isPending}>
            Crear
          </Button>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar proyecto">
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <Input
            label="Nombre del proyecto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            autoFocus
          />
          <Button type="submit" fullWidth isLoading={updateProject.isPending}>
            Guardar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
