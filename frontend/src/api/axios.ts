import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { ApiErrorResponse } from '../types';

function resolveApiUrl(): string {
  // 1. Variable de entorno de build (Railway: VITE_API_URL en el servicio frontend)
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // 2. Producción sin env var → URL directa del backend en Railway
  if (import.meta.env.PROD) return 'https://backend-production-3158.up.railway.app/api';
  // 3. Desarrollo local → proxy de Vite redirige /api → localhost:3000
  return '/api';
}

export const apiClient = axios.create({
  baseURL: resolveApiUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? 'Ocurrió un error inesperado';

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

        toast.error(message);
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
