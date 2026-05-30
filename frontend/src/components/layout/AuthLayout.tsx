import { ReactNode } from 'react';
import { Layers } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/** Layout compartido para Login y Register con branding glassmorphism */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gopass-500/20 shadow-neon">
            <Layers className="h-7 w-7 text-gopass-400" />
          </div>
          <h1 className="text-2xl font-bold text-gopass-100">{title}</h1>
          <p className="mt-1 text-sm text-gopass-500">{subtitle}</p>
        </div>
        <div className="glass-panel p-8">{children}</div>
      </div>
    </div>
  );
}
