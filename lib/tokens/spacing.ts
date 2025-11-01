/**
 * Functional Context-Aware Spacing Tokens
 * 
 * Provides dynamic spacing calculations based on component nesting level,
 * semantic grouping, and size categories. Enforces the principle that
 * outer margins are always larger than inner paddings.
 */

import type { ThemeContext } from '../theme-contracts';

// ============================================================================
// SPACING TYPES
// ============================================================================

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
export type ComponentType = 'badge' | 'button' | 'card' | 'panel' | 'block' | 'container';
export type SpacingDirection = 'all' | 'horizontal' | 'vertical' | 'top' | 'right' | 'bottom' | 'left';

export interface SpacingContext {
  /** Nesting level (0 = root, 1 = first child, etc.) */
  level: number;
  /** Component size category */
  size: SpacingSize;
  /** Component semantic type */
  componentType: ComponentType;
  /** Theme context for platform/accessibility adaptations */
  themeContext?: ThemeContext;
  /** Display density preference */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Accessibility considerations */
  accessibility?: {
    largeText?: boolean;
    reducedMotion?: boolean;
    highContrast?: boolean;
  };
}

export interface SpacingValues {
  outer: number;
  inner: number;
  gap: number;
}

// ============================================================================
// BASE SPACING SCALES
// ============================================================================

/** Base spacing values in pixels for each size category */
const BASE_SPACING_SCALE: Record<SpacingSize, number> = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  responsive: 8 // Will be calculated based on viewport
};

/** Component-specific spacing multipliers */
const COMPONENT_MULTIPLIERS: Record<ComponentType, { outer: number; inner: number; gap: number }> = {
  badge: { outer: 0.5, inner: 0.25, gap: 0.125 },
  button: { outer: 1, inner: 0.75, gap: 0.5 },
  card: { outer: 1.5, inner: 1, gap: 0.75 },
  panel: { outer: 2, inner: 1.25, gap: 1 },
  block: { outer: 2.5, inner: 1.5, gap: 1.25 },
  container: { outer: 3, inner: 2, gap: 1.5 }
};

/** Density adjustments */
const DENSITY_MULTIPLIERS = {
  compact: 0.75,
  comfortable: 1,
  spacious: 1.25
};

/** Accessibility adjustments */
const ACCESSIBILITY_MULTIPLIERS = {
  largeText: 1.2,
  reducedMotion: 1,
  highContrast: 1.1
};

// ============================================================================
// CORE SPACING FUNCTIONS
// ============================================================================

/**
 * Calculate outer spacing (margins) for a component
 * Outer spacing increases with nesting level to maintain visual hierarchy
 */
export function getOuterSpacing(context: SpacingContext): number {
  const { level, size, componentType, density = 'comfortable', accessibility = {} } = context;
  
  // Base spacing value
  let baseSpacing = BASE_SPACING_SCALE[size];
  
  // Apply responsive scaling if needed
  if (size === 'responsive') {
    baseSpacing = getResponsiveSpacing();
  }
  
  // Component-specific multiplier
  const componentMultiplier = COMPONENT_MULTIPLIERS[componentType].outer;
  
  // Level scaling - outer spacing increases with depth
  const levelMultiplier = Math.pow(1.4, level);
  
  // Density adjustment
  const densityMultiplier = DENSITY_MULTIPLIERS[density];
  
  // Accessibility adjustments
  let accessibilityMultiplier = 1;
  if (accessibility.largeText) accessibilityMultiplier *= ACCESSIBILITY_MULTIPLIERS.largeText;
  if (accessibility.highContrast) accessibilityMultiplier *= ACCESSIBILITY_MULTIPLIERS.highContrast;
  
  const result = Math.round(
    baseSpacing * 
    componentMultiplier * 
    levelMultiplier * 
    densityMultiplier * 
    accessibilityMultiplier
  );
  
  return Math.max(result, 1); // Minimum 1px
}

/**
 * Calculate inner spacing (padding) for a component
 * Inner spacing is always smaller than outer spacing and increases more gradually
 */
export function getInnerSpacing(context: SpacingContext): number {
  const { level, size, componentType, density = 'comfortable', accessibility = {} } = context;
  
  // Base spacing value
  let baseSpacing = BASE_SPACING_SCALE[size];
  
  // Apply responsive scaling if needed
  if (size === 'responsive') {
    baseSpacing = getResponsiveSpacing();
  }
  
  // Component-specific multiplier
  const componentMultiplier = COMPONENT_MULTIPLIERS[componentType].inner;
  
  // Level scaling - inner spacing increases more gradually
  const levelMultiplier = Math.pow(1.2, level);
  
  // Density adjustment
  const densityMultiplier = DENSITY_MULTIPLIERS[density];
  
  // Accessibility adjustments
  let accessibilityMultiplier = 1;
  if (accessibility.largeText) accessibilityMultiplier *= ACCESSIBILITY_MULTIPLIERS.largeText;
  if (accessibility.highContrast) accessibilityMultiplier *= ACCESSIBILITY_MULTIPLIERS.highContrast;
  
  let result = Math.round(
    baseSpacing * 
    componentMultiplier * 
    levelMultiplier * 
    densityMultiplier * 
    accessibilityMultiplier
  );
  
  // Enforce the rule: inner < outer - 1
  const outerSpacing = getOuterSpacing(context);
  result = Math.min(result, outerSpacing - 1);
  
  return Math.max(result, 1); // Minimum 1px
}

/**
 * Calculate gap spacing between sibling elements
 * Gap is typically smaller than inner padding
 */
export function getGapSpacing(context: SpacingContext): number {
  const { level, size, componentType, density = 'comfortable', accessibility = {} } = context;
  
  // Base spacing value
  let baseSpacing = BASE_SPACING_SCALE[size];
  
  // Apply responsive scaling if needed
  if (size === 'responsive') {
    baseSpacing = getResponsiveSpacing();
  }
  
  // Component-specific multiplier
  const componentMultiplier = COMPONENT_MULTIPLIERS[componentType].gap;
  
  // Level scaling - gap increases slightly with depth
  const levelMultiplier = Math.pow(1.15, level);
  
  // Density adjustment
  const densityMultiplier = DENSITY_MULTIPLIERS[density];
  
  // Accessibility adjustments
  let accessibilityMultiplier = 1;
  if (accessibility.largeText) accessibilityMultiplier *= ACCESSIBILITY_MULTIPLIERS.largeText;
  
  const result = Math.round(
    baseSpacing * 
    componentMultiplier * 
    levelMultiplier * 
    densityMultiplier * 
    accessibilityMultiplier
  );
  
  return Math.max(result, 1); // Minimum 1px
}

/**
 * Get all spacing values for a component context
 */
export function getSpacingValues(context: SpacingContext): SpacingValues {
  return {
    outer: getOuterSpacing(context),
    inner: getInnerSpacing(context),
    gap: getGapSpacing(context)
  };
}

// ============================================================================
// DIRECTIONAL SPACING FUNCTIONS
// ============================================================================

/**
 * Get spacing for specific directions
 */
export function getDirectionalSpacing(
  context: SpacingContext,
  type: 'outer' | 'inner' | 'gap',
  direction: SpacingDirection = 'all'
): Record<string, number> | number {
  const baseValue = type === 'outer' 
    ? getOuterSpacing(context)
    : type === 'inner' 
    ? getInnerSpacing(context)
    : getGapSpacing(context);
  
  switch (direction) {
    case 'all':
      return baseValue;
    case 'horizontal':
      return { left: baseValue, right: baseValue };
    case 'vertical':
      return { top: baseValue, bottom: baseValue };
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return { [direction]: baseValue };
    default:
      return baseValue;
  }
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Calculate responsive spacing based on viewport
 * This would typically use CSS custom properties or media queries
 */
function getResponsiveSpacing(): number {
  // In a real implementation, this would check viewport size
  // For now, return a reasonable default
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 640) return 4; // sm
    if (width < 768) return 6; // md
    if (width < 1024) return 8; // lg
    return 12; // xl
  }
  return 8; // Default for SSR
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate that spacing hierarchy is maintained
 */
export function validateSpacingHierarchy(context: SpacingContext): {
  isValid: boolean;
  violations: string[];
} {
  const values = getSpacingValues(context);
  const violations: string[] = [];
  
  // Check outer > inner rule
  if (values.outer <= values.inner) {
    violations.push(`Outer spacing (${values.outer}) must be greater than inner spacing (${values.inner})`);
  }
  
  // Check that gap is reasonable relative to inner
  if (values.gap > values.inner) {
    violations.push(`Gap spacing (${values.gap}) should not exceed inner spacing (${values.inner})`);
  }
  
  // Check minimum values
  if (values.outer < 1) violations.push('Outer spacing must be at least 1px');
  if (values.inner < 1) violations.push('Inner spacing must be at least 1px');
  if (values.gap < 1) violations.push('Gap spacing must be at least 1px');
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

// ============================================================================
// CSS UTILITIES
// ============================================================================

/**
 * Generate CSS custom properties for spacing values
 */
export function generateSpacingCSS(context: SpacingContext, prefix = '--spacing'): Record<string, string> {
  const values = getSpacingValues(context);
  const { componentType, level } = context;
  
  return {
    [`${prefix}-${componentType}-${level}-outer`]: `${values.outer}px`,
    [`${prefix}-${componentType}-${level}-inner`]: `${values.inner}px`,
    [`${prefix}-${componentType}-${level}-gap`]: `${values.gap}px`
  };
}

/**
 * Generate Tailwind CSS classes for spacing
 */
export function generateTailwindSpacing(context: SpacingContext): {
  margin: string;
  padding: string;
  gap: string;
} {
  const values = getSpacingValues(context);
  
  // Convert px values to Tailwind spacing scale approximations
  const pxToTailwind = (px: number): string => {
    if (px <= 1) return '0.5';
    if (px <= 2) return '1';
    if (px <= 4) return '2';
    if (px <= 6) return '3';
    if (px <= 8) return '4';
    if (px <= 12) return '5';
    if (px <= 16) return '6';
    if (px <= 20) return '7';
    if (px <= 24) return '8';
    if (px <= 32) return '10';
    if (px <= 40) return '12';
    if (px <= 48) return '16';
    return '20';
  };
  
  return {
    margin: `m-${pxToTailwind(values.outer)}`,
    padding: `p-${pxToTailwind(values.inner)}`,
    gap: `gap-${pxToTailwind(values.gap)}`
  };
}

// ============================================================================
// PRESETS
// ============================================================================

export const SPACING_PRESETS = {
  /** Compact spacing for dense layouts */
  compact: {
    density: 'compact' as const,
    accessibility: {}
  },
  
  /** Standard comfortable spacing */
  comfortable: {
    density: 'comfortable' as const,
    accessibility: {}
  },
  
  /** Spacious layout for better readability */
  spacious: {
    density: 'spacious' as const,
    accessibility: { largeText: true }
  },
  
  /** High contrast accessible spacing */
  accessible: {
    density: 'comfortable' as const,
    accessibility: {
      largeText: true,
      highContrast: true
    }
  }
} as const;