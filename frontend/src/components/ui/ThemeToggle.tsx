import React from 'react';
import { useTheme, Theme } from '@/context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC<{ showLabel?: boolean; className?: string }> = ({
  showLabel = false,
  className = '',
}) => {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 ${className}`}
      role="radiogroup"
      aria-label="Theme preference selector"
    >
      {themes.map((t) => {
        const isActive = theme === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            title={`Switch to ${t.label} mode`}
            aria-checked={isActive}
            role="radio"
          >
            {t.icon}
            {showLabel && <span>{t.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
