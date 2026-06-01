import type { TaskCounts } from '../../types';

interface ProjectTaskCountersProps {
  counts: TaskCounts;
  showTitle?: boolean;
  compact?: boolean;
}

export function ProjectTaskCounters({
  counts,
  showTitle = true,
  compact = false,
}: ProjectTaskCountersProps) {
  const items = [
    {
      key: 'PENDING' as const,
      label: 'Pendiente',
      color: 'border-gopass-500/30 bg-gopass-500/15 text-gopass-300 hover:bg-gopass-500/25',
      dot: 'bg-gopass-400',
    },
    {
      key: 'IN_PROGRESS' as const,
      label: 'En progreso',
      color: 'border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25',
      dot: 'bg-amber-400',
    },
    {
      key: 'DONE' as const,
      label: 'Completado',
      color: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25',
      dot: 'bg-emerald-400',
    },
  ];

  return (
    <div className={compact ? 'mt-2' : 'mb-5'}>
      {showTitle && (
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gopass-500">
          Estados de tareas
        </p>
      )}
      <div className={`flex flex-wrap ${compact ? 'gap-2' : 'gap-2.5 sm:gap-3'}`}>
        {items.map(({ key, label, color, dot }) => (
          <span
            key={key}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${color} ${compact ? '!px-2.5 !py-1' : ''}`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <span className="font-bold tabular-nums">{counts[key]}</span>
            <span className="opacity-90">{label}</span>
          </span>
        ))}
        <span
          className={`inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-gopass-200 transition hover:border-gopass-400/30 hover:bg-white/10 ${compact ? '!px-2.5 !py-1' : ''}`}
        >
          <span className="font-bold tabular-nums">{counts.total}</span>
          <span className="opacity-90">Total</span>
        </span>
      </div>
    </div>
  );
}
