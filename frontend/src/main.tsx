import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/QueryProvider';
import { AppRouter } from './router/AppRouter';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {}
    <QueryProvider>
      <AppRouter />
      {}
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
