/**
 * Functional Context-Aware Elevation Tokens
 * 
 * Provides dynamic elevation calculations expressed as soft shadows that adapt
 * to theme mode, component hierarchy, platform, and accessibility preferences.
 * Integrates with OKLCH color system for consistent shadow colors.
 */

import type { ThemeContext } from '../theme-contracts/types';
import { 
  oklch, 
  parseOKLCH, 
  resolveContextualColor,
  generateSemanticPalettes,
  type OKLCHColor 
} from '../color/oklch';

// ============================================================================
// ELEVATION TYPES
// ============================================================================

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type ShadowType = 'ambient' | 'directional' | 'combined';
export type ElevationVariant = 'subtle' | 'moderate' | 'prominent' | 'dramatic';

export interface ElevationContext {
  /** Elevation level (0-5) */
  level: ElevationLevel;
  /** Component size affects shadow scale */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Shadow variant intensity */
  variant?: ElevationVariant;
  /** Platform-specific adjustments */
  platform?: 'web' | 'mobile' | 'desktop';
  /** Theme context for color and accessibility */
  themeContext?: ThemeContext;
  /** Accessibility considerations */
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
}

export interface ShadowParameters {
  /** Horizontal offset */
  offsetX: number;
  /** Vertical offset */
  offsetY: number;
  /** Blur radius */
  blur: number;
  /** Spread radius */
  spread: number;
  /** Shadow color (OKLCH or CSS) */
  color: string;
  /** Shadow opacity */
  opacity: number;
}

export interface ElevationShadow {
  /** CSS box-shadow value */
  css: string;
  /** Ambient shadow parameters */
  ambient: ShadowParameters;
  directional: ShadowParameters;
  /** Combined shadow parameters */
  combined: ShadowParameters;
}

// Alias for compatibility with tests
export type ElevationShadowValues = ElevationShadow;

// ============================================================================
// BASE ELEVATION SCALES
// ============================================================================

/** Base shadow parameters for each elevation level */
export const BASE_ELEVATION_SCALE: Record<ElevationLevel, {
  ambient: { blur: number; spread: number; opacity: number };
  directional: { offsetY: number; blur: number; spread: number; opacity: number };
}> = {
  0: {
    ambient: { blur: 0, spread: 0, opacity: 0 },
    directional: { offsetY: 0, blur: 0, spread: 0, opacity: 0 }
  },
  1: {
    ambient: { blur: 2, spread: 0, opacity: 0.05 },
    directional: { offsetY: 1, blur: 3, spread: 0, opacity: 0.1 }
  },
  2: {
    ambient: { blur: 4, spread: 0, opacity: 0.07 },
    directional: { offsetY: 2, blur: 6, spread: 0, opacity: 0.12 }
  },
  3: {
    ambient: { blur: 8, spread: 0, opacity: 0.09 },
    directional: { offsetY: 4, blur: 12, spread: 0, opacity: 0.14 }
  },
  4: {
    ambient: { blur: 16, spread: 0, opacity: 0.11 },
    directional: { offsetY: 8, blur: 24, spread: 0, opacity: 0.16 }
  },
  5: {
    ambient: { blur: 32, spread: 0, opacity: 0.13 },
    directional: { offsetY: 16, blur: 48, spread: 0, opacity: 0.18 }
  }
};

/** Size multipliers for shadow scaling */
export const SIZE_MULTIPLIERS = {
  xs: 0.75,
  sm: 0.875,
  md: 1,
  lg: 1.125,
  xl: 1.25
};

/** Variant multipliers for shadow intensity */
export const VARIANT_MULTIPLIERS = {
  subtle: 0.6,
  moderate: 1,
  prominent: 1.4,
  dramatic: 1.8
};

/** Platform-specific adjustments */
export const PLATFORM_ADJUSTMENTS = {
  web: {
    blur: 1.0,
    spread: 1.0,
    offsetY: 1.0,
    opacity: 1.0
  },
  mobile: {
    blur: 0.8,
    spread: 0.9,
    offsetY: 0.9,
    opacity: 1.1
  },
  desktop: {
    blur: 1.1,
    spread: 1.0,
    offsetY: 1.0,
    opacity: 0.9
  }
} as const;

/** Accessibility multipliers */
export const ACCESSIBILITY_MULTIPLIERS = {
  highContrast: { opacity: 1.5, blur: 0.9 },
  reducedMotion: { opacity: 1, blur: 1 },
  prefersReducedData: { opacity: 0.8, blur: 0.8 }
};

// ============================================================================
// CORE ELEVATION FUNCTIONS
// ============================================================================

/**
 * Calculate shadow color using OKLCH color system
 */
export function calculateShadowColor(
  level: ElevationLevel,
  context: ElevationContext
): { color: string; opacity: number } {
  const { themeContext } = context;
  
  if (!themeContext) {
    // Default shadow color
    return {
      color: oklch(0.2, 0.02, 220, 0.15),
      opacity: 0.15
    };
  }

  // Get semantic color palettes for the current theme
  const palettes = generateSemanticPalettes(themeContext);
  
  // Base shadow color depends on theme mode
  let baseShadowColor: OKLCHColor;
  
  if (themeContext.mode === 'dark') {
    // In dark mode, use a lighter shadow for contrast
    baseShadowColor = {
      l: 0.15 + (level * 0.02), // Slightly lighter with elevation
      c: 0.02, // Low chroma for neutral shadows
      h: 220, // Cool blue-gray hue
      a: 1
    };
  } else {
    // In light mode, use darker shadows
    baseShadowColor = {
      l: 0.25 - (level * 0.03), // Darker with higher elevation
      c: 0.015, // Very low chroma for subtle shadows
      h: 220, // Cool blue-gray hue
      a: 1
    };
  }
  
  // Apply contextual adjustments using OKLCH system
  const adjustedColor = resolveContextualColor(
    baseShadowColor,
    themeContext,
    {
      lightnessShift: themeContext.mode === 'dark' ? 0.05 : -0.05,
      chromaMultiplier: themeContext.contrast === 'high' ? 0.5 : 1,
      hueShift: 0
    }
  );
  
  // Calculate opacity based on elevation level and accessibility
  let baseOpacity = 0.12 + (level * 0.04);
  
  // Accessibility adjustments
  if (context.accessibility?.highContrast) {
    baseOpacity *= 0.7; // Reduce shadow intensity for high contrast
  }
  
  if (context.accessibility?.reducedMotion) {
    baseOpacity *= 0.8; // Slightly reduce for reduced motion preference
  }
  
  // Platform-specific opacity adjustments
  const platformMultiplier = PLATFORM_ADJUSTMENTS[context.platform || 'web'];
  baseOpacity *= platformMultiplier.opacity;
  
  return {
    color: adjustedColor,
    opacity: Math.min(0.4, Math.max(0.05, baseOpacity))
  };
}

/**
 * Calculate shadow parameters for a given elevation level and context
 */
export function getElevationShadow(context: ElevationContext): ElevationShadow {
  const { level, size = 'md', variant = 'moderate', platform = 'web' } = context;
  
  // Get base parameters
  const baseParams = BASE_ELEVATION_SCALE[level];
  
  // Apply multipliers
  const sizeMultiplier = SIZE_MULTIPLIERS[size];
  const variantMultiplier = VARIANT_MULTIPLIERS[variant];
  const platformAdjustment = PLATFORM_ADJUSTMENTS[platform];
  
  // Get shadow color using OKLCH system
  const { color: shadowColor, opacity: shadowOpacity } = calculateShadowColor(level, context);
  
  // Calculate accessibility adjustments
  let accessibilityMultiplier = { opacity: 1, blur: 1 };
  if (context.accessibility) {
    if (context.accessibility.highContrast) {
      accessibilityMultiplier.opacity *= ACCESSIBILITY_MULTIPLIERS.highContrast.opacity;
      accessibilityMultiplier.blur *= ACCESSIBILITY_MULTIPLIERS.highContrast.blur;
    }
    if (context.accessibility.prefersReducedData) {
      accessibilityMultiplier.opacity *= ACCESSIBILITY_MULTIPLIERS.prefersReducedData.opacity;
      accessibilityMultiplier.blur *= ACCESSIBILITY_MULTIPLIERS.prefersReducedData.blur;
    }
  }
  
  // Calculate ambient shadow
  const ambientBlur = Math.round(
    baseParams.ambient.blur * sizeMultiplier * variantMultiplier * platformAdjustment.blur * accessibilityMultiplier.blur
  );
  const ambientSpread = Math.round(
    baseParams.ambient.spread * sizeMultiplier * variantMultiplier
  );
  const ambientOpacity = Math.min(1, 
    baseParams.ambient.opacity * variantMultiplier * platformAdjustment.opacity * accessibilityMultiplier.opacity * shadowOpacity
  );
  
  // Calculate directional shadow
  const directionalOffsetY = Math.round(
    baseParams.directional.offsetY * sizeMultiplier * variantMultiplier * platformAdjustment.offsetY
  );
  const directionalBlur = Math.round(
    baseParams.directional.blur * sizeMultiplier * variantMultiplier * platformAdjustment.blur * accessibilityMultiplier.blur
  );
  const directionalSpread = Math.round(
    baseParams.directional.spread * sizeMultiplier * variantMultiplier
  );
  const directionalOpacity = Math.min(1,
    baseParams.directional.opacity * variantMultiplier * platformAdjustment.opacity * accessibilityMultiplier.opacity * shadowOpacity
  );
  
  // Create shadow parameters
  const ambient: ShadowParameters = {
    offsetX: 0,
    offsetY: 0,
    blur: ambientBlur,
    spread: ambientSpread,
    color: shadowColor,
    opacity: ambientOpacity
  };
  
  const directional: ShadowParameters = {
    offsetX: 0,
    offsetY: directionalOffsetY,
    blur: directionalBlur,
    spread: directionalSpread,
    color: shadowColor,
    opacity: directionalOpacity
  };
  
  // Combined shadow (ambient + directional)
  const combined: ShadowParameters = {
    offsetX: 0,
    offsetY: directionalOffsetY,
    blur: Math.max(ambientBlur, directionalBlur),
    spread: Math.max(ambientSpread, directionalSpread),
    color: shadowColor,
    opacity: Math.min(1, ambientOpacity + directionalOpacity * 0.7)
  };
  
  // Generate CSS strings
  const ambientCSS = ambient.opacity > 0 
    ? `0 0 ${ambient.blur}px ${ambient.spread}px ${ambient.color.replace(')', `, ${ambient.opacity})`)}`
    : 'none';
    
  const directionalCSS = directional.opacity > 0
    ? `0 ${directional.offsetY}px ${directional.blur}px ${directional.spread}px ${directional.color.replace(')', `, ${directional.opacity})`)}`
    : 'none';
    
  const combinedCSS = combined.opacity > 0
    ? `${ambientCSS !== 'none' ? ambientCSS + ', ' : ''}${directionalCSS}`
    : 'none';
  
  return {
    css: combinedCSS,
    ambient,
    directional,
    combined
  };
}

/**
 * Get elevation level based on component hierarchy and semantic meaning
 */
export function getSemanticElevation(
  componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar',
  context?: Partial<ElevationContext>
): ElevationLevel {
  const semanticLevels: Record<string, ElevationLevel> = {
    surface: 0,
    card: 1,
    dropdown: 2,
    tooltip: 3,
    modal: 4,
    fab: 3,
    snackbar: 4
  };
  
  let baseLevel = semanticLevels[componentType] || 1;
  
  // Adjust based on variant
  if (context?.variant === 'subtle') baseLevel = Math.max(0, baseLevel - 1) as ElevationLevel;
  if (context?.variant === 'prominent') baseLevel = Math.min(5, baseLevel + 1) as ElevationLevel;
  if (context?.variant === 'dramatic') baseLevel = Math.min(5, baseLevel + 2) as ElevationLevel;
  
  return baseLevel;
}

/**
 * Generate CSS custom properties for elevation
 */
export function generateElevationCSS(context: ElevationContext, prefix = '--elevation'): Record<string, string> {
  const shadow = getElevationShadow(context);
  
  return {
    [`${prefix}-shadow`]: shadow.css,
    [`${prefix}-ambient`]: `${shadow.ambient.offsetX}px ${shadow.ambient.offsetY}px ${shadow.ambient.blur}px ${shadow.ambient.spread}px ${shadow.ambient.color}`,
    [`${prefix}-directional`]: `${shadow.directional.offsetX}px ${shadow.directional.offsetY}px ${shadow.directional.blur}px ${shadow.directional.spread}px ${shadow.directional.color}`,
    [`${prefix}-combined`]: `${shadow.combined.offsetX}px ${shadow.combined.offsetY}px ${shadow.combined.blur}px ${shadow.combined.spread}px ${shadow.combined.color}`,
    [`${prefix}-level`]: context.level.toString()
  };
}

/**
 * Generate Tailwind-compatible shadow utilities
 */
export function generateTailwindElevation(context: ElevationContext): {
  boxShadow: string;
  dropShadow: string;
} {
  const shadow = getElevationShadow(context);
  
  return {
    boxShadow: shadow.css,
    dropShadow: shadow.combined.css || 'none'
  };
}

/**
 * Validate elevation hierarchy - higher levels should have more prominent shadows
 */
export function validateElevationHierarchy(contexts: ElevationContext[]): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Sort by level
  const sorted = [...contexts].sort((a, b) => a.level - b.level);
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = getElevationShadow(sorted[i - 1]);
    const current = getElevationShadow(sorted[i]);
    
    // Check that blur increases with level
    if (current.combined.blur <= prev.combined.blur) {
      violations.push(`Level ${sorted[i].level} blur (${current.combined.blur}) should be greater than level ${sorted[i - 1].level} blur (${prev.combined.blur})`);
    }
    
    // Check that opacity increases with level
    if (current.combined.opacity <= prev.combined.opacity) {
      violations.push(`Level ${sorted[i].level} opacity (${current.combined.opacity}) should be greater than level ${sorted[i - 1].level} opacity (${prev.combined.opacity})`);
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

// ============================================================================
// ELEVATION PRESETS
// ============================================================================

export const ELEVATION_PRESETS = {
  /** Minimal shadows for subtle layering */
  minimal: {
    variant: 'subtle' as const,
    accessibility: {}
  },
  
  /** Standard elevation for most use cases */
  standard: {
    variant: 'moderate' as const,
    accessibility: {}
  },
  
  /** Enhanced shadows for important elements */
  enhanced: {
    variant: 'prominent' as const,
    accessibility: {}
  },
  
  /** Maximum elevation for critical overlays */
  maximum: {
    variant: 'dramatic' as const,
    accessibility: {}
  },
  
  /** Accessibility-optimized elevation */
  accessible: {
    variant: 'moderate' as const,
    accessibility: {
      highContrast: true,
      reducedMotion: true
    }
  },
  
  /** Performance-optimized for low-end devices */
  performance: {
    variant: 'subtle' as const,
    accessibility: {
      prefersReducedData: true
    }
  }
} as const;