import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { ApiErrorResponse } from '../types';

/**
 * Instancia centralizada de Axios.
 * Todas las peticiones al backend pasan por aquí para mantener
 * una única fuente de verdad sobre headers, baseURL y manejo de errores.
 */
export const apiClient = axios.create({
  // En dev usamos el proxy de Vite (/api → localhost:3000); en prod, la URL completa
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

/**
 * Interceptor de petición — inyecta el JWT en cada llamada autenticada.
 * Lee el token de localStorage para que persista entre recargas de página.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Interceptor de respuesta — centraliza el manejo de errores HTTP.
 * Muestra un toast al usuario y redirige a login si el token expiró (401).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Ocurrió un error inesperado';

    // Token inválido o expirado — limpiar sesión y forzar re-login
    if (status === 401) {
      const isAuthRoute =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register');

      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.');
      } else {
        // En login/register solo mostramos el error del backend (ej. credenciales inválidas)
        toast.error(message);
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
