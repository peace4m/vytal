/**
 * VYTAL Design Tokens: Colors
 * Human-centered, accessible, calm healthcare palette for Light and Dark modes.
 */

export const lightColors = {
  // Brand Primary: Teal
  primary: '#0d9488',
  primaryDark: '#0f766e',
  primaryLight: '#14b8a6',
  primaryBg: '#f0fdfa',
  primaryBorder: '#ccfbf1',

  // Accent: Emerald
  accent: '#10b981',
  accentDark: '#059669',
  accentBg: '#ecfdf5',

  // Neutrals: Slate
  white: '#ffffff',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSubtle: '#f1f5f9',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',

  // Typography
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textInverse: '#ffffff',

  // Clinical Status & Alerts
  emergency: '#dc2626',
  emergencyBg: '#fef2f2',
  emergencyBorder: '#fecaca',

  warning: '#d97706',
  warningBg: '#fffbeb',
  warningBorder: '#fde68a',

  info: '#0284c7',
  infoBg: '#f0f9ff',
  infoBorder: '#bae6fd',

  success: '#16a34a',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
};

export const darkColors = {
  // Brand Primary: Teal (Higher contrast for dark background)
  primary: '#14b8a6',
  primaryDark: '#2dd4bf',
  primaryLight: '#5eead4',
  primaryBg: '#134e4a',
  primaryBorder: '#0f766e',

  // Accent: Emerald
  accent: '#34d399',
  accentDark: '#10b981',
  accentBg: '#064e3b',

  // Neutrals: Deep Charcoal & Midnight
  white: '#ffffff',
  background: '#090d16',
  surface: '#111827',
  surfaceSubtle: '#1f2937',
  border: '#374151',
  borderStrong: '#4b5563',

  // Typography
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textInverse: '#0f172a',

  // Clinical Status & Alerts
  emergency: '#f87171',
  emergencyBg: '#450a0a',
  emergencyBorder: '#7f1d1d',

  warning: '#fbbf24',
  warningBg: '#451a03',
  warningBorder: '#78350f',

  info: '#38bdf8',
  infoBg: '#082f49',
  infoBorder: '#075985',

  success: '#4ade80',
  successBg: '#052e16',
  successBorder: '#14532d',
};

// Default export is lightColors for backward compatibility
export const colors = lightColors;
