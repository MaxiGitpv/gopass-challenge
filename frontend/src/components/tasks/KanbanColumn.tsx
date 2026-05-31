import type { Task, TaskStatus } from '../../types';
import { TASK_STATUS_LABELS } from '../../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const columnColors: Record<TaskStatus, string> = {
  PENDING: 'border-gopass-600/30 bg-gopass-900/40',
  IN_PROGRESS: 'border-amber-500/30 bg-amber-950/20',
  DONE: 'border-emerald-500/30 bg-emerald-950/20',
};

const dotColors: Record<TaskStatus, string> = {
  PENDING: 'bg-gopass-500',
  IN_PROGRESS: 'bg-amber-400',
  DONE: 'bg-emerald-400',
};

export function KanbanColumn({
  status,
  tasks,
  onDeleteTask,
  onDragStart,
  onDrop,
  onDragOver,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex min-h-[400px] flex-1 flex-col rounded-2xl border p-4 ${columnColors[status]}`}
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColors[status]}`} />
        <h3 className="font-semibold text-gopass-200">{TASK_STATUS_LABELS[status]}</h3>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs text-gopass-400">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-xs text-gopass-600">Arrastra tareas aquí</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
