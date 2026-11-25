import React, { forwardRef } from 'react';
import { cn } from '@/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, hint, leftIcon, rightIcon, containerClassName, className, id, ...props },
    ref
  ) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-field',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="input-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-400 mt-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

// ─── Password Input ──────────────────────────────────────────────────────────
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = React.useState(false);
  return (
    <Input
      {...props}
      type={show ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

// ─── Select ─────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  containerClassName?: string;
}

export function Select({ label, error, options, containerClassName, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'input-field appearance-none cursor-pointer',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
