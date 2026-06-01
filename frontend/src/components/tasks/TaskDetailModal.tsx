import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, payload: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
  }) => void;
  onDelete?: (taskId: string) => void;
  isSaving?: boolean;
}

const selectClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gopass-50 focus:border-gopass-400 focus:outline-none focus:ring-2 focus:ring-gopass-400/30';

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isSaving = false,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setPriority(task.priority);
      setIsEditing(false);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
    });
    setIsEditing(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar tarea' : 'Detalle de tarea'} size="lg">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles de la tarea..."
            rows={5}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gopass-300">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={selectClass}
              >
                {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                  <option key={s} value={s} className="bg-gopass-950">
                    {TASK_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gopass-300">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={selectClass}
              >
                {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                  <option key={p} value={p} className="bg-gopass-950">
                    {TASK_PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving} className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gopass-100">{task.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gopass-300">
                {TASK_STATUS_LABELS[task.status]}
              </span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gopass-300">
                {TASK_PRIORITY_LABELS[task.priority]}
              </span>
            </div>
          </div>
          {task.description ? (
            <div className="max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gopass-300">
                {task.description}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-gopass-600">Sin descripción</p>
          )}
          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
            <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            {onDelete && (
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
