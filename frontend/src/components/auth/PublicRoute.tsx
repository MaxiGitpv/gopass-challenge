import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Guard inverso para rutas públicas (login/register).
 * Si el usuario ya está autenticado, lo envía al dashboard
 * para evitar que vea el formulario de login innecesariamente.
 */
export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
