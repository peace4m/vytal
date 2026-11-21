import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#111726] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-shadow',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(clsx('p-5 sm:p-6 pb-3 sm:pb-4', className))}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={twMerge(
        clsx('text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight', className)
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={twMerge(clsx('text-sm text-slate-500 dark:text-slate-400 mt-1', className))}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={twMerge(clsx('p-5 sm:p-6 pt-0', className))} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx('p-5 sm:p-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
