import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
}

export function Navbar({ title = 'GoPass', showBack = false, backTo = '/dashboard' }: NavbarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gopass-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to={backTo} className="rounded-lg p-2 text-gopass-400 transition hover:bg-white/10 hover:text-gopass-200">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div>
            <h1 className="text-lg font-bold text-gopass-300">{title}</h1>
            {user && <p className="text-xs text-gopass-500">{user.email}</p>}
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="!px-3">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
}
