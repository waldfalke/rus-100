/**
 * Minimal theme configuration for demo pages
 */

import type { ThemeProviderConfig, ThemeContractSchema, ColorTokenContract, DimensionTokenContract } from './theme-contracts';

// Simple color token contract
const createColorToken = (fallback: string): ColorTokenContract => ({
  resolve: (context) => fallback,
  fallback,
  validate: (value: string) => typeof value === 'string',
  description: 'Basic color token',
});

// Simple dimension token contract
const createDimensionToken = (fallback: string): DimensionTokenContract => ({
  resolve: (context) => fallback,
  fallback,
  validate: (value: string) => typeof value === 'string',
  description: 'Basic dimension token',
});

// Minimal theme contract schema
const minimalContracts: ThemeContractSchema = {
  colors: {
    background: createColorToken('#ffffff'),
    foreground: createColorToken('#000000'),
    surface: {
      primary: createColorToken('#f8fafc'),
      secondary: createColorToken('#f1f5f9'),
      tertiary: createColorToken('#e2e8f0'),
    },
    brand: {
      primary: createColorToken('#3b82f6'),
      secondary: createColorToken('#6366f1'),
    },
    semantic: {
      success: createColorToken('#10b981'),
      warning: createColorToken('#f59e0b'),
      error: createColorToken('#ef4444'),
      info: createColorToken('#3b82f6'),
    },
    interactive: {
      primary: {
        default: createColorToken('#3b82f6'),
        hover: createColorToken('#2563eb'),
        active: createColorToken('#1d4ed8'),
        disabled: createColorToken('#9ca3af'),
      },
      secondary: {
        default: createColorToken('#6b7280'),
        hover: createColorToken('#4b5563'),
        active: createColorToken('#374151'),
        disabled: createColorToken('#d1d5db'),
      },
    },
    border: {
      default: createColorToken('#e2e8f0'),
      subtle: createColorToken('#f1f5f9'),
      strong: createColorToken('#cbd5e1'),
      focus: createColorToken('#3b82f6'),
    },
  },
  spacing: {
    xs: createDimensionToken('0.25rem'),
    sm: createDimensionToken('0.5rem'),
    md: createDimensionToken('1rem'),
    lg: createDimensionToken('1.5rem'),
    xl: createDimensionToken('2rem'),
    '2xl': createDimensionToken('3rem'),
    '3xl': createDimensionToken('4rem'),
    getOuter: () => '1rem',
    getInner: () => '0.5rem',
    getGap: () => '0.75rem',
    getValues: () => ({ outer: 16, inner: 8, gap: 12 }),
  },
  typography: {
    fontSize: {
      xs: createDimensionToken('0.75rem'),
      sm: createDimensionToken('0.875rem'),
      base: createDimensionToken('1rem'),
      lg: createDimensionToken('1.125rem'),
      xl: createDimensionToken('1.25rem'),
      '2xl': createDimensionToken('1.5rem'),
      '3xl': createDimensionToken('1.875rem'),
    },
    fontWeight: {
      light: { resolve: () => 300, fallback: 300 },
      normal: { resolve: () => 400, fallback: 400 },
      medium: { resolve: () => 500, fallback: 500 },
      semibold: { resolve: () => 600, fallback: 600 },
      bold: { resolve: () => 700, fallback: 700 },
    },
    lineHeight: {
      tight: { resolve: () => 1.25, fallback: 1.25 },
      normal: { resolve: () => 1.5, fallback: 1.5 },
      relaxed: { resolve: () => 1.75, fallback: 1.75 },
    },
  },
  radius: {
    none: createDimensionToken('0'),
    sm: createDimensionToken('0.125rem'),
    md: createDimensionToken('0.375rem'),
    lg: createDimensionToken('0.5rem'),
    full: createDimensionToken('9999px'),
    get: () => '0.375rem',
    getValues: () => ({ radius: 6, css: 'border-radius: 6px', corners: { topLeft: 6, topRight: 6, bottomRight: 6, bottomLeft: 6 } }),
    getCorner: () => '0.375rem',
    getNested: () => ({ radius: 4, css: 'border-radius: 4px', corners: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } }),
  },
  elevation: {
    0: { resolve: () => 'none', fallback: 'none' },
    1: { resolve: () => '0 1px 2px 0 rgb(0 0 0 / 0.05)', fallback: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    2: { resolve: () => '0 1px 3px 0 rgb(0 0 0 / 0.1)', fallback: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
    3: { resolve: () => '0 4px 6px -1px rgb(0 0 0 / 0.1)', fallback: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    4: { resolve: () => '0 10px 15px -3px rgb(0 0 0 / 0.1)', fallback: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    5: { resolve: () => '0 25px 50px -12px rgb(0 0 0 / 0.25)', fallback: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
    getLevel: () => 'none',
    getShadow: () => ({ css: 'none', ambient: { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: 'transparent', opacity: 0 }, directional: { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: 'transparent', opacity: 0 }, combined: { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: 'transparent', opacity: 0 } }),
    getSemantic: () => 'none',
    validateHierarchy: () => ({ isValid: true, violations: [] }),
  },
};

// Export the minimal theme configuration
export const minimalThemeConfig: ThemeProviderConfig = {
  defaultMode: 'light',
  contracts: minimalContracts,
  cache: {
    enabled: true,
    maxSize: 100,
    ttl: 300000, // 5 minutes
  },
  performance: {
    enableMemoization: true,
    enableBatching: true,
  },
};