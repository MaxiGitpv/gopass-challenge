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
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gopass-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-2.5">
        {showBack && (
          <Link
            to={backTo}
            className="shrink-0 rounded-lg p-1.5 text-gopass-400 transition hover:bg-white/10 hover:text-gopass-200 sm:p-2"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold leading-tight text-gopass-300 sm:text-base md:text-lg">
            {title}
          </h1>
          {user && (
            <p className="hidden truncate text-xs text-gopass-500 sm:block">{user.email}</p>
          )}
        </div>
        <Button variant="ghost" onClick={handleLogout} className="!shrink-0 !px-2 !py-1.5 sm:!px-3">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
}
