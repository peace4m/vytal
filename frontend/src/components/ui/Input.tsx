import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, errorMessage, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100',
              errorMessage
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              className
            )
          )}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          {...props}
        />
        {errorMessage ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
