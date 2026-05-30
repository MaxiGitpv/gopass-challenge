import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useRegister } from '../hooks/useAuth';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate({ name: name || undefined, email, password });
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Empieza a organizar tus proyectos hoy"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth isLoading={register.isPending}>
          Crear cuenta
        </Button>
        <p className="text-center text-sm text-gopass-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-gopass-400 hover:text-gopass-300">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
