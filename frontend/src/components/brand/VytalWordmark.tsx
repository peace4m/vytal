import React from 'react';

export interface VytalWordmarkProps {
  showTagline?: boolean;
  taglineText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const VytalWordmark: React.FC<VytalWordmarkProps> = ({
  showTagline = true,
  taglineText = 'Your Health, Decoded.',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      brand: 'text-lg font-black tracking-[0.14em]',
      tagline: 'text-[9px] tracking-[0.12em]',
      dot: 'w-1 h-1',
    },
    md: {
      brand: 'text-xl font-black tracking-[0.18em]',
      tagline: 'text-[10px] tracking-[0.16em]',
      dot: 'w-1.5 h-1.5',
    },
    lg: {
      brand: 'text-3xl font-black tracking-[0.2em]',
      tagline: 'text-xs tracking-[0.18em]',
      dot: 'w-2 h-2',
    },
    xl: {
      brand: 'text-4xl sm:text-5xl font-black tracking-[0.22em]',
      tagline: 'text-sm tracking-[0.2em]',
      dot: 'w-2.5 h-2.5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col select-none leading-none ${className}`}>
      {/* VYTAL Main Heading with Precision Kerning */}
      <div className="flex items-baseline gap-1">
        <span
          className={`font-sans uppercase text-slate-900 dark:text-slate-50 transition-colors ${currentSize.brand}`}
          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          VYTAL
        </span>
        <span className={`rounded-full bg-teal-500 shrink-0 ${currentSize.dot}`} />
      </div>

      {/* Subtle Healthcare Subtitle / Tagline */}
      {showTagline && (
        <span
          className={`font-semibold uppercase text-slate-500 dark:text-teal-400/90 mt-1 transition-colors ${currentSize.tagline}`}
        >
          {taglineText}
        </span>
      )}
    </div>
  );
};
