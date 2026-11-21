import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emergency' | 'warning' | 'info' | 'success';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  ...props
}) => {
  const variantStyles = {
    emergency: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
    warning: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    info: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
  };

  const icons = {
    emergency: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'p-4 rounded-xl border flex items-start gap-3',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1 leading-snug">{title}</h5>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
