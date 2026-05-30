import { Sparkles } from 'lucide-react';

interface AiLoadingOverlayProps {
  message?: string;
}

/** Estado de carga especial para el botón de IA — efecto neón animado */
export function AiLoadingOverlay({
  message = 'Generando tareas con inteligencia artificial...',
}: AiLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gopass-950/80 backdrop-blur-md">
      <div className="glass-panel flex max-w-sm flex-col items-center gap-4 p-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-gopass-400/30" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gopass-400 to-emerald-500 shadow-neon">
            <Sparkles className="h-8 w-8 animate-pulse text-gopass-950" />
          </div>
        </div>
        <p className="text-sm font-medium text-gopass-200">{message}</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-gopass-400"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
