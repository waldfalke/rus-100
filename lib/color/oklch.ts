/**
 * Advanced OKLCH color palette generation with context-aware resolution
 */

import type { ThemeContext } from '../theme-contracts';

// ============================================================================
// OKLCH COLOR TYPES
// ============================================================================

export interface OKLCHColor {
  /** Lightness (0-1) */
  l: number;
  /** Chroma (0-0.4+) */
  c: number;
  /** Hue (0-360) */
  h: number;
  /** Alpha (0-1) */
  a?: number;
}

export interface ColorPaletteConfig {
  /** Base hue for the palette */
  baseHue: number;
  /** Base chroma intensity */
  baseChroma: number;
  /** Number of shades to generate */
  steps: number;
  /** Lightness range */
  lightnessRange: [number, number];
  /** Chroma variation */
  chromaVariation?: number;
  /** Hue shift across the palette */
  hueShift?: number;
}

export interface PlatformColorAdjustments {
  /** iOS-specific adjustments */
  ios: {
    lightnessBoost: number;
    chromaReduction: number;
    hueShift: number;
  };
  /** Android Material Design adjustments */
  android: {
    lightnessAdjustment: number;
    chromaBoost: number;
    contrastEnhancement: number;
  };
  /** Web-specific optimizations */
  web: {
    gamutMapping: boolean;
    sRGBFallback: boolean;
  };
}

// ============================================================================
// OKLCH UTILITIES
// ============================================================================

/**
 * Create an OKLCH color string
 */
export function oklch(l: number, c: number, h: number, a: number = 1): string {
  const lightness = Math.max(0, Math.min(1, l));
  const chroma = Math.max(0, c);
  const hue = ((h % 360) + 360) % 360; // Normalize to 0-360
  const alpha = Math.max(0, Math.min(1, a));
  
  if (alpha < 1) {
    return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)} / ${alpha.toFixed(3)})`;
  }
  
  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
}

/**
 * Parse OKLCH string to components
 */
export function parseOKLCH(oklchString: string): OKLCHColor | null {
  const match = oklchString.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/
  );
  
  if (!match) return null;
  
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}

/**
 * Calculate relative luminance for WCAG contrast
 */
export function getRelativeLuminance(color: OKLCHColor): number {
  // Approximate conversion from OKLCH lightness to relative luminance
  // This is a simplified calculation - for production, use a proper color library
  return Math.pow(color.l, 2.2);
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: OKLCHColor, color2: OKLCHColor): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function meetsWCAGContrast(
  foreground: OKLCHColor,
  background: OKLCHColor,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

// ============================================================================
// PALETTE GENERATION
// ============================================================================

/**
 * Generate a color palette using OKLCH
 */
export function generateOKLCHPalette(config: ColorPaletteConfig): OKLCHColor[] {
  const {
    baseHue,
    baseChroma,
    steps,
    lightnessRange,
    chromaVariation = 0,
    hueShift = 0,
  } = config;
  
  const [minLightness, maxLightness] = lightnessRange;
  const palette: OKLCHColor[] = [];
  
  for (let i = 0; i < steps; i++) {
    const progress = steps === 1 ? 0 : i / (steps - 1);
    
    // Calculate lightness with easing
    const lightness = minLightness + (maxLightness - minLightness) * easeInOutCubic(progress);
    
    // Calculate chroma with variation
    const chroma = baseChroma + (chromaVariation * (0.5 - Math.abs(progress - 0.5)));
    
    // Calculate hue with shift
    const hue = baseHue + (hueShift * progress);
    
    palette.push({ l: lightness, c: chroma, h: hue });
  }
  
  return palette;
}

/**
 * Easing function for smoother lightness transitions
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Generate semantic color palettes (primary, secondary, etc.)
 */
export function generateSemanticPalettes(context: ThemeContext): Record<string, OKLCHColor[]> {
  const { mode, accessibility, platform } = context;
  const isDark = mode === 'dark';
  const highContrast = accessibility.highContrast;
  
  // Base configurations for different semantic colors
  const configs = {
    primary: {
      baseHue: 220, // Blue
      baseChroma: highContrast ? 0.15 : 0.12,
      steps: 11,
      lightnessRange: isDark ? [0.15, 0.85] : [0.1, 0.95] as [number, number],
      chromaVariation: 0.05,
      hueShift: -10,
    },
    secondary: {
      baseHue: 260, // Purple
      baseChroma: highContrast ? 0.12 : 0.1,
      steps: 11,
      lightnessRange: isDark ? [0.2, 0.8] : [0.15, 0.9] as [number, number],
      chromaVariation: 0.03,
      hueShift: 15,
    },
    success: {
      baseHue: 140, // Green
      baseChroma: highContrast ? 0.14 : 0.11,
      steps: 9,
      lightnessRange: isDark ? [0.25, 0.75] : [0.2, 0.85] as [number, number],
      chromaVariation: 0.04,
    },
    warning: {
      baseHue: 45, // Orange/Yellow
      baseChroma: highContrast ? 0.16 : 0.13,
      steps: 9,
      lightnessRange: isDark ? [0.3, 0.8] : [0.25, 0.9] as [number, number],
      chromaVariation: 0.06,
    },
    error: {
      baseHue: 15, // Red
      baseChroma: highContrast ? 0.18 : 0.15,
      steps: 9,
      lightnessRange: isDark ? [0.25, 0.75] : [0.2, 0.85] as [number, number],
      chromaVariation: 0.05,
      hueShift: -5,
    },
    neutral: {
      baseHue: 220, // Cool gray
      baseChroma: highContrast ? 0.02 : 0.015,
      steps: 11,
      lightnessRange: isDark ? [0.1, 0.9] : [0.05, 0.98] as [number, number],
      chromaVariation: 0.005,
    },
  };
  
  const palettes: Record<string, OKLCHColor[]> = {};
  
  for (const [name, config] of Object.entries(configs)) {
    let palette = generateOKLCHPalette(config);
    
    // Apply platform-specific adjustments
    palette = applyPlatformAdjustments(palette, platform);
    
    palettes[name] = palette;
  }
  
  return palettes;
}

/**
 * Apply platform-specific color adjustments
 */
export function applyPlatformAdjustments(
  palette: OKLCHColor[],
  platform: ThemeContext['platform']
): OKLCHColor[] {
  const adjustments: PlatformColorAdjustments = {
    ios: {
      lightnessBoost: 0.02,
      chromaReduction: 0.01,
      hueShift: 2,
    },
    android: {
      lightnessAdjustment: 0.01,
      chromaBoost: 0.005,
      contrastEnhancement: 1.05,
    },
    web: {
      gamutMapping: true,
      sRGBFallback: true,
    },
  };
  
  if (platform === 'web') {
    // Web doesn't need specific adjustments, but we could add gamut mapping
    return palette;
  }
  
  const platformAdjustment = adjustments[platform];
  if (!platformAdjustment) return palette;
  
  return palette.map(color => {
    if (platform === 'ios') {
      const adj = platformAdjustment as typeof adjustments.ios;
      return {
        ...color,
        l: Math.min(1, color.l + adj.lightnessBoost),
        c: Math.max(0, color.c - adj.chromaReduction),
        h: color.h + adj.hueShift,
      };
    }
    
    if (platform === 'android') {
      const adj = platformAdjustment as typeof adjustments.android;
      return {
        ...color,
        l: Math.min(1, color.l + adj.lightnessAdjustment),
        c: color.c + adj.chromaBoost,
      };
    }
    
    return color;
  });
}

/**
 * Generate accessible color pairs
 */
export function generateAccessiblePairs(
  context: ThemeContext
): Record<string, { foreground: OKLCHColor; background: OKLCHColor }> {
  const { mode, accessibility } = context;
  const isDark = mode === 'dark';
  const contrastLevel = accessibility.highContrast ? 'AAA' : 'AA';
  
  const pairs: Record<string, { foreground: OKLCHColor; background: OKLCHColor }> = {};
  
  // Generate text on background pairs
  const backgroundLightness = isDark ? 0.1 : 0.95;
  const foregroundLightness = isDark ? 0.9 : 0.15;
  
  const background: OKLCHColor = {
    l: backgroundLightness,
    c: 0.01,
    h: 220,
  };
  
  const foreground: OKLCHColor = {
    l: foregroundLightness,
    c: 0.02,
    h: 220,
  };
  
  // Adjust if contrast is insufficient
  let adjustedForeground = { ...foreground };
  while (!meetsWCAGContrast(adjustedForeground, background, contrastLevel)) {
    adjustedForeground.l = isDark 
      ? Math.min(1, adjustedForeground.l + 0.05)
      : Math.max(0, adjustedForeground.l - 0.05);
      
    // Prevent infinite loop
    if (adjustedForeground.l >= 1 || adjustedForeground.l <= 0) break;
  }
  
  pairs.textOnBackground = {
    foreground: adjustedForeground,
    background,
  };
  
  return pairs;
}

/**
 * Context-aware color resolver
 */
export function resolveContextualColor(
  baseColor: OKLCHColor,
  context: ThemeContext,
  adjustments?: {
    lightnessShift?: number;
    chromaMultiplier?: number;
    hueShift?: number;
  }
): string {
  let color = { ...baseColor };
  
  // Apply context-based adjustments
  if (context.mode === 'dark') {
    // Increase lightness for dark mode
    color.l = Math.min(1, color.l + 0.1);
  }
  
  if (context.accessibility.highContrast) {
    // Increase chroma and adjust lightness for high contrast
    color.c = Math.min(0.4, color.c * 1.3);
    color.l = context.mode === 'dark' 
      ? Math.min(1, color.l + 0.05)
      : Math.max(0, color.l - 0.05);
  }
  
  if (context.accessibility.reducedMotion) {
    // Slightly reduce chroma for reduced motion preference
    color.c = color.c * 0.95;
  }
  
  // Apply custom adjustments
  if (adjustments) {
    if (adjustments.lightnessShift) {
      color.l = Math.max(0, Math.min(1, color.l + adjustments.lightnessShift));
    }
    if (adjustments.chromaMultiplier) {
      color.c = color.c * adjustments.chromaMultiplier;
    }
    if (adjustments.hueShift) {
      color.h = color.h + adjustments.hueShift;
    }
  }
  
  // Apply platform adjustments
  const platformAdjusted = applyPlatformAdjustments([color], context.platform)[0];
  
  return oklch(platformAdjusted.l, platformAdjusted.c, platformAdjusted.h, color.a);
}

// ============================================================================
// PALETTE PRESETS
// ============================================================================

/**
 * Predefined color palettes for common use cases
 */
export const COLOR_PRESETS = {
  /** Modern blue palette */
  modernBlue: {
    baseHue: 220,
    baseChroma: 0.12,
    steps: 11,
    lightnessRange: [0.1, 0.95] as [number, number],
    chromaVariation: 0.04,
    hueShift: -8,
  },
  
  /** Warm orange palette */
  warmOrange: {
    baseHue: 35,
    baseChroma: 0.14,
    steps: 9,
    lightnessRange: [0.2, 0.9] as [number, number],
    chromaVariation: 0.06,
    hueShift: 10,
  },
  
  /** Cool gray palette */
  coolGray: {
    baseHue: 220,
    baseChroma: 0.015,
    steps: 11,
    lightnessRange: [0.05, 0.98] as [number, number],
    chromaVariation: 0.005,
  },
  
  /** Vibrant purple palette */
  vibrantPurple: {
    baseHue: 280,
    baseChroma: 0.16,
    steps: 9,
    lightnessRange: [0.15, 0.85] as [number, number],
    chromaVariation: 0.05,
    hueShift: 15,
  },
} as const;