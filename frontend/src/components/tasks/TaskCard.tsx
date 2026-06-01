import { Trash2, GripVertical } from 'lucide-react';
import type { Task, TaskPriority } from '../../types';
import { TASK_PRIORITY_LABELS } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  HIGH: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function TaskCard({ task, onClick, onDelete, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onClick={() => onClick?.(task)}
      className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:border-gopass-400/30 hover:bg-white/10 active:cursor-grabbing sm:p-4"
    >
      <div className="flex items-start gap-2">
        <GripVertical
          className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-gopass-600 opacity-0 transition group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gopass-100">{task.title}</h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gopass-500">{task.description}</p>
          )}
          <span
            className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs ${priorityColors[task.priority]}`}
          >
            {TASK_PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="rounded-lg p-1 text-gopass-600 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
            aria-label="Eliminar tarea"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
