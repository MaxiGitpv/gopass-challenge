import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Configuración global de React Query.
 *
 * ¿Por qué React Query para el estado asíncrono?
 * - Cache automático: al volver al dashboard no re-fetch innecesario.
 * - Estados loading/error/success listos sin useEffect manual.
 * - Invalidación declarativa tras mutaciones (crear tarea → refrescar lista).
 * - Deduplicación de peticiones concurrentes al mismo recurso.
 *
 * El auth NO va aquí — es estado local del cliente (Zustand).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Datos considerados frescos por 30s antes de un refetch en background
      staleTime: 30 * 1000,
      // Reintentar una vez ante fallos de red transitorios
      retry: 1,
      // No refetch automático al cambiar de pestaña (evita parpadeos en Kanban)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools solo en desarrollo — útil para depurar cache e invalidaciones */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
