import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Guard de rutas protegidas.
 * Si no hay sesión activa, redirige a /login preservando la URL de destino
 * para que el usuario vuelva al dashboard tras autenticarse.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
