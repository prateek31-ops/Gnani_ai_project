import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
            'bg-slate-800 text-slate-100 hover:bg-slate-700': variant === 'secondary',
            'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200': variant === 'outline',
            'bg-red-500/10 text-red-500 hover:bg-red-500/20': variant === 'danger',
            'bg-transparent hover:bg-slate-800 text-slate-300': variant === 'ghost',
            'h-9 px-4 py-2 text-sm': size === 'md',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-md px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
