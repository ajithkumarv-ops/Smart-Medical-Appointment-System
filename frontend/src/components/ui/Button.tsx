import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeMap = {
  sm:   'px-4 py-2 text-xs rounded-lg gap-1.5',
  md:   'px-6 py-3 text-sm rounded-xl gap-2',
  lg:   'px-8 py-4 text-base rounded-xl gap-2.5',
  icon: 'p-2.5 rounded-xl',
};

const variantMap = {
  primary:  'btn-primary',
  secondary:'btn-secondary',
  ghost:    'btn-ghost',
  danger:   'btn-danger',
  outline:  'inline-flex items-center justify-center font-semibold border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-300',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold tracking-wide select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        sizeMap[size],
        variantMap[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children && <span className="relative z-10">{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
