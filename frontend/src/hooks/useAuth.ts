import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginRequest, registerRequest, type LoginPayload, type RegisterPayload } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {

      setAuth(data.user, data.token);
      toast.success(`Bienvenido, ${data.user.name ?? data.user.email}`);
      navigate('/dashboard');
    },

  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Cuenta creada correctamente');
      navigate('/dashboard');
    },
  });
}
