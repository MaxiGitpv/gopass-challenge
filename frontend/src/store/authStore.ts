import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

/**
 * Estado global de autenticación con Zustand.
 *
 * ¿Por qué Zustand y no Context API?
 * - Menos boilerplate que Context + useReducer.
 * - No provoca re-renders innecesarios en componentes que no consumen auth.
 * - El middleware `persist` sincroniza automáticamente con localStorage.
 *
 * React Query NO se usa aquí porque el auth es estado síncrono del cliente,
 * no datos remotos que requieran cache, refetch o invalidación.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  /** Guarda credenciales tras login/registro exitoso */
  setAuth: (user: User, token: string) => void;

  /** Limpia la sesión (logout o token expirado) */
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Mantener localStorage en sync con el interceptor de Axios
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'gopass-auth',
      // Solo persistir user y token; isAuthenticated se deriva al hidratar
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          state.isAuthenticated = true;
          localStorage.setItem('token', state.token);
        }
      },
    }
  )
);
