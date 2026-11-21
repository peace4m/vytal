import React from 'react';

export interface VytalSymbolProps {
  size?: number | string;
  className?: string;
  variant?: 'color' | 'mono' | 'white';
}

export const VytalSymbol: React.FC<VytalSymbolProps> = ({
  size = 36,
  className = '',
  variant = 'color',
}) => {
  const isMono = variant === 'mono';
  const isWhite = variant === 'white';

  const strokeColor = isMono
    ? 'currentColor'
    : isWhite
    ? '#ffffff'
    : 'url(#vytalGradDirect)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="VYTAL Symbol"
      role="img"
    >
      <defs>
        <linearGradient id="vytalGradDirect" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="45%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="vytalShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Rounded Squircle Container Background */}
      <rect
        width="100"
        height="100"
        rx="26"
        className="fill-teal-50 dark:fill-teal-950/60 stroke-teal-200/80 dark:stroke-teal-800/80"
        strokeWidth="2"
      />

      {/* Geometric V With Cardiometabolic Waveform */}
      <path
        d="M22 26 L40 70 L47 79 L54 34 L62 68 L68 58 L78 26"
        stroke={strokeColor}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#vytalShadow)"
      />

      {/* Diagnostic Apex Element */}
      <circle
        cx="54"
        cy="34"
        r="4.5"
        fill={isMono ? 'currentColor' : isWhite ? '#ffffff' : '#10b981'}
      />
      <circle
        cx="54"
        cy="34"
        r="2"
        fill={isMono ? '#ffffff' : '#ffffff'}
      />
    </svg>
  );
};
