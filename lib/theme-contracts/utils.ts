/**
 * Utility functions for theme contracts and OKLCH color manipulation
 */

import type { ThemeContext, ColorTokenContract } from './types';

// ============================================================================
// OKLCH COLOR UTILITIES
// ============================================================================

/**
 * Convert OKLCH values to CSS oklch() string
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  return `oklch(${lightness} ${chroma} ${hue})`;
}

/**
 * Generate OKLCH color palette from base parameters
 */
export function generateOklchPalette(
  baseHue: number,
  context: ThemeContext
): Record<string, string> {
  const { mode, contrast } = context;
  
  // Base lightness depends on theme mode
  const baseLightness = mode === 'dark' ? 0.3 : 0.7;
  
  // Contrast adjustment multiplier
  const contrastMultiplier = contrast === 'high' ? 1.3 : contrast === 'low' ? 0.8 : 1.0;
  
  // Base chroma (saturation)
  const baseChroma = 0.15;
  
  return {
    50: oklch(
      Math.min(0.98, baseLightness * 1.4 * contrastMultiplier),
      baseChroma * 0.2,
      baseHue
    ),
    100: oklch(
      Math.min(0.95, baseLightness * 1.3 * contrastMultiplier),
      baseChroma * 0.3,
      baseHue
    ),
    200: oklch(
      Math.min(0.9, baseLightness * 1.2 * contrastMultiplier),
      baseChroma * 0.5,
      baseHue
    ),
    300: oklch(
      Math.min(0.85, baseLightness * 1.1 * contrastMultiplier),
      baseChroma * 0.7,
      baseHue
    ),
    400: oklch(
      Math.min(0.8, baseLightness * 1.05 * contrastMultiplier),
      baseChroma * 0.9,
      baseHue
    ),
    500: oklch(
      baseLightness * contrastMultiplier,
      baseChroma,
      baseHue
    ),
    600: oklch(
      baseLightness * 0.9 * contrastMultiplier,
      baseChroma * 1.1,
      baseHue
    ),
    700: oklch(
      baseLightness * 0.7 * contrastMultiplier,
      baseChroma * 1.2,
      baseHue
    ),
    800: oklch(
      baseLightness * 0.5 * contrastMultiplier,
      baseChroma * 1.3,
      baseHue
    ),
    900: oklch(
      Math.max(0.1, baseLightness * 0.3 * contrastMultiplier),
      baseChroma * 1.4,
      baseHue
    ),
    950: oklch(
      Math.max(0.05, baseLightness * 0.2 * contrastMultiplier),
      baseChroma * 1.5,
      baseHue
    ),
  };
}

/**
 * Adjust color for platform-specific requirements
 */
export function adjustColorForPlatform(color: string, platform: string): string {
  // iOS tends to prefer slightly more saturated colors
  if (platform === 'ios') {
    // This is a simplified example - in reality you'd parse the OKLCH and adjust chroma
    return color;
  }
  
  // Android Material Design adjustments
  if (platform === 'android') {
    return color;
  }
  
  return color;
}

/**
 * Increase color contrast for accessibility
 */
export function increaseContrast(color: string, multiplier: number): string {
  // Simplified implementation - would need proper OKLCH parsing
  return color;
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function meetsWCAGContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // Simplified implementation - would need proper contrast calculation
  return true;
}

// ============================================================================
// CONTEXT UTILITIES
// ============================================================================

/**
 * Create a hash from theme context for caching
 */
export function createContextHash(context: ThemeContext): string {
  const contextString = JSON.stringify({
    mode: context.mode,
    platform: context.platform,
    contrast: context.contrast,
    motion: context.motion,
    viewport: context.viewport,
    accessibility: context.accessibility,
    component: context.component,
  });
  
  // Simple hash function (in production, use a proper hash library)
  let hash = 0;
  for (let i = 0; i < contextString.length; i++) {
    const char = contextString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString(36);
}

/**
 * Merge partial context with default context
 */
export function mergeContext(
  baseContext: ThemeContext,
  partialContext?: Partial<ThemeContext>
): ThemeContext {
  if (!partialContext) return baseContext;
  
  return {
    ...baseContext,
    ...partialContext,
    viewport: {
      ...baseContext.viewport,
      ...partialContext.viewport,
    },
    accessibility: {
      ...baseContext.accessibility,
      ...partialContext.accessibility,
    },
    component: {
      ...baseContext.component,
      ...partialContext.component,
    },
  };
}

/**
 * Get default theme context
 */
export function getDefaultContext(): ThemeContext {
  return {
    mode: 'light',
    platform: 'web',
    contrast: 'normal',
    motion: 'full',
    viewport: {
      width: 1920,
      height: 1080,
      density: 1,
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      prefersReducedData: false,
    },
    component: {
      state: 'default',
      size: 'md',
      variant: 'primary',
      depth: 0,
    },
  };
}

// ============================================================================
// TOKEN PATH UTILITIES
// ============================================================================

/**
 * Resolve nested object path (e.g., "colors.brand.primary")
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Set nested object value
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}

/**
 * Validate token path format
 */
export function isValidTokenPath(path: string): boolean {
  // Token paths should be dot-separated and contain only alphanumeric characters and underscores
  const pathRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;
  return pathRegex.test(path);
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Simple memoization decorator for token resolution
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Debounce function for batching theme updates
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}