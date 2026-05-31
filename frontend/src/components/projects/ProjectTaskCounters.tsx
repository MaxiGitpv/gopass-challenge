import type { TaskCounts } from '../../types';

interface ProjectTaskCountersProps {
  counts: TaskCounts;
}

export function ProjectTaskCounters({ counts }: ProjectTaskCountersProps) {
  const items = [
    { key: 'PENDING' as const, label: 'Pendiente', color: 'bg-gopass-500/20 text-gopass-300' },
    { key: 'IN_PROGRESS' as const, label: 'En progreso', color: 'bg-amber-500/20 text-amber-300' },
    { key: 'DONE' as const, label: 'Completado', color: 'bg-emerald-500/20 text-emerald-300' },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map(({ key, label, color }) => (
        <span key={key} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${color}`}>
          <span className="font-semibold">{counts[key]}</span>
          <span className="opacity-80">{label}</span>
        </span>
      ))}
    </div>
  );
}
