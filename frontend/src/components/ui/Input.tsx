import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gopass-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gopass-50',
            'placeholder:text-gopass-600 backdrop-blur-sm',
            'focus:border-gopass-400 focus:outline-none focus:ring-2 focus:ring-gopass-400/30',
            'transition-all duration-200',
            error ? 'border-red-400/50 focus:ring-red-400/30' : '',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
