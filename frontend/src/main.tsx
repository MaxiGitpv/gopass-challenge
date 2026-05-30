import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './router/AppRouter';
import './index.css';

/**
 * Punto de entrada de la aplicación React.
 * Orden de providers (de afuera hacia adentro):
 * 1. StrictMode — detecta efectos secundarios en desarrollo.
 * 2. QueryProvider — cache y estado asíncrono (React Query).
 * 3. AppRouter — enrutamiento; el auth store (Zustand) no necesita provider.
 * 4. Toaster — notificaciones globales disparadas desde interceptores y mutaciones.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'backdrop-blur-md bg-white/90 border border-gopass-200 shadow-glass',
          },
        }}
      />
    </QueryProvider>
  </StrictMode>
);
