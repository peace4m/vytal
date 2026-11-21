import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'high' | 'warning' | 'emergency' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    normal: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
    high: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60',
    emergency: 'bg-rose-600 text-white font-semibold animate-pulse',
    info: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60',
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
