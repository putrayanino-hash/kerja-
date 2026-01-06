import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId } from '../types';

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define color palettes
// For Light themes: Slate 50 is light BG, Slate 900 is dark Text.
// For Dark themes: Slate 50 is dark BG, Slate 900 is light Text (Inverted).
const THEMES: Record<ThemeId, Record<string, string>> = {
  'emerald-light': {
    '--color-surface': '#ffffff',
    '--slate-50': '#f8fafc',
    '--slate-100': '#f1f5f9',
    '--slate-200': '#e2e8f0',
    '--slate-300': '#cbd5e1',
    '--slate-400': '#94a3b8',
    '--slate-500': '#64748b',
    '--slate-600': '#475569',
    '--slate-700': '#334155',
    '--slate-800': '#1e293b',
    '--slate-900': '#0f172a',
    // Primary: Emerald
    '--primary-50': '#ecfdf5',
    '--primary-100': '#d1fae5',
    '--primary-200': '#a7f3d0',
    '--primary-300': '#6ee7b7',
    '--primary-400': '#34d399',
    '--primary-500': '#10b981',
    '--primary-600': '#059669',
    '--primary-700': '#047857',
    '--primary-800': '#065f46',
    '--primary-900': '#064e3b',
  },
  'ocean-light': {
    '--color-surface': '#ffffff',
    '--slate-50': '#f0f9ff', // Sky 50
    '--slate-100': '#e0f2fe',
    '--slate-200': '#bae6fd',
    '--slate-300': '#7dd3fc',
    '--slate-400': '#38bdf8', // Muted text maps to blueish
    '--slate-500': '#0ea5e9',
    '--slate-600': '#0284c7', // Text
    '--slate-700': '#0369a1',
    '--slate-800': '#075985',
    '--slate-900': '#0c4a6e',
    // Primary: Blue
    '--primary-50': '#eff6ff',
    '--primary-100': '#dbeafe',
    '--primary-200': '#bfdbfe',
    '--primary-300': '#93c5fd',
    '--primary-400': '#60a5fa',
    '--primary-500': '#3b82f6',
    '--primary-600': '#2563eb',
    '--primary-700': '#1d4ed8',
    '--primary-800': '#1e40af',
    '--primary-900': '#1e3a8a',
  },
  'sunset-light': {
    '--color-surface': '#ffffff',
    '--slate-50': '#fff7ed', // Orange 50
    '--slate-100': '#ffedd5',
    '--slate-200': '#fed7aa',
    '--slate-300': '#fdba74',
    '--slate-400': '#fb923c',
    '--slate-500': '#f97316',
    '--slate-600': '#ea580c',
    '--slate-700': '#c2410c',
    '--slate-800': '#9a3412',
    '--slate-900': '#7c2d12',
    // Primary: Red/Orange
    '--primary-50': '#fef2f2',
    '--primary-100': '#fee2e2',
    '--primary-200': '#fecaca',
    '--primary-300': '#fca5a5',
    '--primary-400': '#f87171',
    '--primary-500': '#ef4444',
    '--primary-600': '#dc2626',
    '--primary-700': '#b91c1c',
    '--primary-800': '#991b1b',
    '--primary-900': '#7f1d1d',
  },
  'berry-light': {
    '--color-surface': '#ffffff',
    '--slate-50': '#faf5ff', // Purple 50
    '--slate-100': '#f3e8ff',
    '--slate-200': '#e9d5ff',
    '--slate-300': '#d8b4fe',
    '--slate-400': '#c084fc',
    '--slate-500': '#a855f7',
    '--slate-600': '#9333ea',
    '--slate-700': '#7e22ce',
    '--slate-800': '#6b21a8',
    '--slate-900': '#581c87',
    // Primary: Fuchsia
    '--primary-50': '#fdf4ff',
    '--primary-100': '#fae8ff',
    '--primary-200': '#f5d0fe',
    '--primary-300': '#f0abfc',
    '--primary-400': '#e879f9',
    '--primary-500': '#d946ef',
    '--primary-600': '#c026d3',
    '--primary-700': '#a21caf',
    '--primary-800': '#86198f',
    '--primary-900': '#701a75',
  },
  'midnight-dark': {
    '--color-surface': '#1e293b', // Slate 800 (Card BG)
    // Inverted Slate Scale
    '--slate-50': '#0f172a', // Slate 900 (Main BG)
    '--slate-100': '#1e293b', // Slate 800
    '--slate-200': '#334155', // Slate 700
    '--slate-300': '#475569', // Slate 600
    '--slate-400': '#64748b', // Slate 500
    '--slate-500': '#94a3b8', // Slate 400
    '--slate-600': '#cbd5e1', // Slate 300 (Text)
    '--slate-700': '#e2e8f0', // Slate 200 (Headings)
    '--slate-800': '#f1f5f9', // Slate 100
    '--slate-900': '#f8fafc', // Slate 50 (High Contrast Text)
    // Primary: Indigo
    '--primary-50': '#312e81', // Darkest Indigo
    '--primary-100': '#3730a3',
    '--primary-200': '#4338ca',
    '--primary-300': '#4f46e5',
    '--primary-400': '#6366f1',
    '--primary-500': '#818cf8', // Lighter for Dark Mode
    '--primary-600': '#6366f1',
    '--primary-700': '#a5b4fc', // Very Light
    '--primary-800': '#c7d2fe',
    '--primary-900': '#e0e7ff',
  },
  'forest-dark': {
    '--color-surface': '#064e3b', // Emerald 900
    // Inverted Slate Scale
    '--slate-50': '#022c22', // Emerald 950
    '--slate-100': '#064e3b',
    '--slate-200': '#065f46',
    '--slate-300': '#047857',
    '--slate-400': '#059669',
    '--slate-500': '#10b981',
    '--slate-600': '#34d399',
    '--slate-700': '#6ee7b7',
    '--slate-800': '#a7f3d0',
    '--slate-900': '#ecfdf5',
    // Primary: Lime/Green
    '--primary-50': '#14532d',
    '--primary-100': '#166534',
    '--primary-200': '#15803d',
    '--primary-300': '#16a34a',
    '--primary-400': '#22c55e',
    '--primary-500': '#4ade80',
    '--primary-600': '#22c55e',
    '--primary-700': '#86efac',
    '--primary-800': '#bbf7d0',
    '--primary-900': '#dcfce7',
  },
  'cyber-dark': {
    '--color-surface': '#171717', // Neutral 900
    // Inverted Neutral Scale
    '--slate-50': '#000000', // Black
    '--slate-100': '#171717',
    '--slate-200': '#262626',
    '--slate-300': '#404040',
    '--slate-400': '#525252',
    '--slate-500': '#737373',
    '--slate-600': '#a3a3a3',
    '--slate-700': '#d4d4d4',
    '--slate-800': '#e5e5e5',
    '--slate-900': '#ffffff',
    // Primary: Neon Yellow/Cyber
    '--primary-50': '#422006',
    '--primary-100': '#713f12',
    '--primary-200': '#854d0e',
    '--primary-300': '#a16207',
    '--primary-400': '#ca8a04',
    '--primary-500': '#eab308',
    '--primary-600': '#facc15', // Bright Yellow
    '--primary-700': '#fde047',
    '--primary-800': '#fef08a',
    '--primary-900': '#fef9c3',
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('emerald-light');

  useEffect(() => {
    const root = document.documentElement;
    const colors = THEMES[currentTheme];

    // Apply CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });

  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};