import React from 'react';
import { VytalSymbol } from './VytalSymbol';
import { VytalWordmark } from './VytalWordmark';

export interface VytalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
}

export const VytalLogo: React.FC<VytalLogoProps> = ({
  size = 'md',
  showTagline = true,
  taglineText,
  className = '',
}) => {
  const symbolSizes = {
    sm: 30,
    md: 38,
    lg: 48,
    xl: 64,
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-3.5',
    xl: 'gap-4',
  };

  return (
    <div className={`inline-flex items-center ${gapClasses[size]} ${className}`}>
      <VytalSymbol size={symbolSizes[size]} className="transition-transform duration-200 group-hover:scale-105" />
      <VytalWordmark
        size={size}
        showTagline={showTagline}
        taglineText={taglineText}
      />
    </div>
  );
};
