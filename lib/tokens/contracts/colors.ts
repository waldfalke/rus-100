/**
 * Color token contracts with OKLCH-based generation
 */

import type { ColorTokenContract, ThemeContext } from '../../theme-contracts';
import { 
  resolveContextualColor, 
  generateSemanticPalettes, 
  generateAccessiblePairs,
  type OKLCHColor 
} from '../../color';

// ============================================================================
// BASE OKLCH COLORS
// ============================================================================

/**
 * Base OKLCH color definitions for the design system
 */
const BASE_COLORS: Record<string, OKLCHColor> = {
  // Brand colors
  brandPrimary: { l: 0.6, c: 0.12, h: 220 },
  brandSecondary: { l: 0.65, c: 0.1, h: 260 },
  
  // Semantic colors
  success: { l: 0.55, c: 0.11, h: 140 },
  warning: { l: 0.7, c: 0.13, h: 45 },
  error: { l: 0.55, c: 0.15, h: 15 },
  info: { l: 0.6, c: 0.1, h: 200 },
  
  // Neutral colors
  neutral: { l: 0.5, c: 0.015, h: 220 },
};

/**
 * Generate OKLCH color string
 */
function oklch(l: number, c: number, h: number, a: number = 1): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)}${a < 1 ? ` / ${a.toFixed(3)}` : ''})`;
}

// ============================================================================
// BRAND COLORS
// ============================================================================

export const brandPrimary: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    return resolveContextualColor(BASE_COLORS.brandPrimary, context);
  },
  
  fallback: oklch(0.6, 0.12, 220),
  
  oklch: {
    lightness: (context) => {
      const base = BASE_COLORS.brandPrimary.l;
      return context.mode === 'dark' ? Math.min(1, base + 0.1) : base;
    },
    chroma: (context) => {
      const base = BASE_COLORS.brandPrimary.c;
      return context.accessibility.highContrast ? base * 1.2 : base;
    },
    hue: () => BASE_COLORS.brandPrimary.h,
  },
  
  accessibility: {
    wcagLevel: 'AA',
    contrastRequirement: 4.5,
  },
  
  validate: (value: string) => {
    return /^oklch\([\d.]+ [\d.]+ [\d.]+(?:\s*\/\s*[\d.]+)?\)$/.test(value);
  },
  
  description: 'Primary brand color with context-aware OKLCH generation',
  
  meta: {
    category: 'brand',
    type: 'color',
    version: '1.0.0',
  },
};

export const brandSecondary: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    return resolveContextualColor(BASE_COLORS.brandSecondary, context);
  },
  
  fallback: oklch(0.65, 0.1, 260),
  
  oklch: {
    lightness: (context) => {
      const base = BASE_COLORS.brandSecondary.l;
      return context.mode === 'dark' ? Math.min(1, base + 0.08) : base;
    },
    chroma: (context) => {
      const base = BASE_COLORS.brandSecondary.c;
      return context.accessibility.highContrast ? base * 1.15 : base;
    },
    hue: () => BASE_COLORS.brandSecondary.h,
  },
  
  accessibility: {
    wcagLevel: 'AA',
    contrastRequirement: 4.5,
  },
  
  validate: (value: string) => {
    return /^oklch\([\d.]+ [\d.]+ [\d.]+(?:\s*\/\s*[\d.]+)?\)$/.test(value);
  },
  
  description: 'Secondary brand color with adaptive OKLCH properties',
};

// ============================================================================
// SURFACE COLORS
// ============================================================================

export const background: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast, component } = context;
    
    let lightness = mode === 'dark' ? 0.08 : 0.98;
    const chroma = 0.005;
    const hue = 220;
    
    // Adjust for high contrast
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.02 : 1.0;
    }
    
    // Depth-based adjustments for layered surfaces
    if (component?.depth && component.depth > 0) {
      const depthAdjustment = component.depth * 0.02;
      lightness = mode === 'dark' 
        ? Math.min(0.2, lightness + depthAdjustment)
        : Math.max(0.9, lightness - depthAdjustment);
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#ffffff',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.08 : 0.98,
    chroma: 0.005,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Primary background color with depth awareness',
};

export const foreground: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    let lightness = mode === 'dark' ? 0.9 : 0.1;
    const chroma = 0.01;
    const hue = 220;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.98 : 0.02;
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#000000',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.9 : 0.1,
    chroma: 0.01,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Primary foreground/text color',
};

export const foregroundMuted: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    let lightness = mode === 'dark' ? 0.65 : 0.45;
    const chroma = 0.008;
    const hue = 220;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.75 : 0.35;
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#6b7280',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.65 : 0.45,
    chroma: 0.008,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Muted foreground/text color for secondary content',
};

export const surfacePrimary: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast, component } = context;
    
    let lightness = mode === 'dark' ? 0.12 : 0.95;
    const chroma = 0.008;
    const hue = 220;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.06 : 0.98;
    }
    
    // Interactive state adjustments
    if (component?.state === 'hover') {
      lightness = mode === 'dark' ? lightness + 0.02 : lightness - 0.02;
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#f8fafc',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.12 : 0.95,
    chroma: 0.008,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Primary surface color for cards and containers',
};

export const surfaceSecondary: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    let lightness = mode === 'dark' ? 0.16 : 0.92;
    const chroma = 0.01;
    const hue = 220;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.1 : 0.96;
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#f1f5f9',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.16 : 0.92,
    chroma: 0.01,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Secondary surface color for subtle backgrounds',
};

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

export const semanticSuccess: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast, component } = context;
    
    const baseHue = 140; // Green hue
    let lightness = mode === 'dark' ? 0.6 : 0.4;
    let chroma = 0.15;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.75 : 0.25;
      chroma = 0.2;
    }
    
    // State adjustments
    if (component?.state === 'hover') {
      lightness = mode === 'dark' ? lightness + 0.1 : lightness - 0.1;
    }
    
    return oklch(lightness, chroma, baseHue);
  },
  
  fallback: '#10b981',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.6 : 0.4,
    chroma: 0.15,
    hue: 140,
  },
  
  accessibility: {
    minContrast: 4.5,
    wcagLevel: 'AA',
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Success state color',
};

export const semanticWarning: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    const baseHue = 45; // Orange/yellow hue
    let lightness = mode === 'dark' ? 0.65 : 0.45;
    let chroma = 0.18;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.8 : 0.3;
      chroma = 0.22;
    }
    
    return oklch(lightness, chroma, baseHue);
  },
  
  fallback: '#f59e0b',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.65 : 0.45,
    chroma: 0.18,
    hue: 45,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Warning state color',
};

export const semanticError: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    const baseHue = 15; // Red hue
    let lightness = mode === 'dark' ? 0.65 : 0.45;
    let chroma = 0.16;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.8 : 0.3;
      chroma = 0.2;
    }
    
    return oklch(lightness, chroma, baseHue);
  },
  
  fallback: '#ef4444',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.65 : 0.45,
    chroma: 0.16,
    hue: 15,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Error state color',
};

export const semanticInfo: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    const baseHue = 200; // Light blue hue
    let lightness = mode === 'dark' ? 0.65 : 0.45;
    let chroma = 0.14;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.8 : 0.3;
      chroma = 0.18;
    }
    
    return oklch(lightness, chroma, baseHue);
  },
  
  fallback: '#3b82f6',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.65 : 0.45,
    chroma: 0.14,
    hue: 200,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Info state color',
};

// ============================================================================
// BORDER COLORS
// ============================================================================

export const borderDefault: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    const { mode, contrast } = context;
    
    let lightness = mode === 'dark' ? 0.25 : 0.85;
    const chroma = 0.01;
    const hue = 220;
    
    if (contrast === 'high') {
      lightness = mode === 'dark' ? 0.4 : 0.7;
    }
    
    return oklch(lightness, chroma, hue);
  },
  
  fallback: '#e2e8f0',
  
  oklch: {
    lightness: (context) => context.mode === 'dark' ? 0.25 : 0.85,
    chroma: 0.01,
    hue: 220,
  },
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Default border color',
};

export const borderFocus: ColorTokenContract = {
  resolve: (context: ThemeContext) => {
    // Use brand primary with adjusted opacity/lightness for focus rings
    return brandPrimary.resolve({
      ...context,
      component: { ...context.component, state: 'focus' },
    });
  },
  
  fallback: '#3b82f6',
  
  validate: (value: string) => typeof value === 'string' && value.startsWith('oklch('),
  
  description: 'Focus ring border color',
};