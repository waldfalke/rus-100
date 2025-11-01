/**
 * Functional Context-Aware Border-Radius Tokens
 * 
 * Provides dynamic border-radius calculations based on component nesting level,
 * semantic grouping, and size categories. Creates visually harmonious rounding
 * that reflects UI hierarchy intuitively.
 */

import type { ThemeContext } from '../theme-contracts';
import type { ComponentType, SpacingSize } from './spacing';

// ============================================================================
// BORDER-RADIUS TYPES
// ============================================================================

export type BorderRadiusVariant = 'none' | 'subtle' | 'moderate' | 'prominent' | 'pill';
export type BorderRadiusCorner = 'all' | 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

export interface BorderRadiusContext {
  /** Nesting level (0 = root, 1 = first child, etc.) */
  level: number;
  /** Component size category */
  size: SpacingSize;
  /** Component semantic type */
  componentType: ComponentType;
  /** Border radius variant style */
  variant?: BorderRadiusVariant;
  /** Theme context for platform/mode adaptations */
  themeContext?: ThemeContext;
  /** Platform-specific adjustments */
  platform?: 'web' | 'mobile' | 'desktop';
  /** Parent component context for inheritance */
  parentRadius?: number;
}

export interface BorderRadiusValues {
  /** Main border radius value in pixels */
  radius: number;
  /** CSS border-radius string */
  css: string;
  /** Individual corner values */
  corners: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

// ============================================================================
// BASE BORDER-RADIUS SCALES
// ============================================================================

/** Base border-radius values in pixels for each size category */
const BASE_RADIUS_SCALE: Record<SpacingSize, number> = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  responsive: 6 // Will be calculated based on viewport
};

/** Variant multipliers for different radius styles */
const VARIANT_MULTIPLIERS: Record<BorderRadiusVariant, number> = {
  none: 0,
  subtle: 0.5,
  moderate: 1,
  prominent: 1.5,
  pill: 999 // Will be clamped to create pill shape
};

/** Component-specific radius adjustments */
const COMPONENT_RADIUS_ADJUSTMENTS: Record<ComponentType, { 
  multiplier: number; 
  minRadius: number; 
  maxRadius: number;
  levelDecay: number; // How much radius decreases per nesting level
}> = {
  badge: { 
    multiplier: 0.75, 
    minRadius: 2, 
    maxRadius: 8,
    levelDecay: 0.8 
  },
  button: { 
    multiplier: 1, 
    minRadius: 2, 
    maxRadius: 12,
    levelDecay: 0.85 
  },
  card: { 
    multiplier: 1.25, 
    minRadius: 4, 
    maxRadius: 16,
    levelDecay: 0.9 
  },
  panel: { 
    multiplier: 1.5, 
    minRadius: 6, 
    maxRadius: 20,
    levelDecay: 0.9 
  },
  block: { 
    multiplier: 1.75, 
    minRadius: 8, 
    maxRadius: 24,
    levelDecay: 0.95 
  },
  container: { 
    multiplier: 2, 
    minRadius: 8, 
    maxRadius: 32,
    levelDecay: 0.95 
  }
};

/** Platform-specific adjustments */
const PLATFORM_MULTIPLIERS = {
  web: 1,
  mobile: 1.2, // Slightly larger for touch interfaces
  desktop: 0.9  // Slightly smaller for precise mouse interaction
};

// ============================================================================
// CORE BORDER-RADIUS FUNCTIONS
// ============================================================================

/**
 * Calculate border-radius for a component based on context
 * Radius generally decreases with nesting level to maintain visual hierarchy
 */
export function getBorderRadius(context: BorderRadiusContext): number {
  const { 
    level, 
    size, 
    componentType, 
    variant = 'moderate', 
    platform = 'web',
    parentRadius 
  } = context;
  
  // Base radius value
  let baseRadius = BASE_RADIUS_SCALE[size];
  
  // Apply responsive scaling if needed
  if (size === 'responsive') {
    baseRadius = getResponsiveRadius();
  }
  
  // Handle pill variant specially
  if (variant === 'pill') {
    return 9999; // Will be handled in CSS as 50% or large value
  }
  
  // Handle none variant
  if (variant === 'none') {
    return 0;
  }
  
  // Component-specific adjustments
  const componentConfig = COMPONENT_RADIUS_ADJUSTMENTS[componentType];
  const componentMultiplier = componentConfig.multiplier;
  
  // Variant multiplier
  const variantMultiplier = VARIANT_MULTIPLIERS[variant];
  
  // Level decay - radius decreases with nesting depth
  const levelMultiplier = Math.pow(componentConfig.levelDecay, level);
  
  // Platform adjustment
  const platformMultiplier = PLATFORM_MULTIPLIERS[platform];
  
  // Calculate base result
  let result = Math.round(
    baseRadius * 
    componentMultiplier * 
    variantMultiplier * 
    levelMultiplier * 
    platformMultiplier
  );
  
  // Apply parent radius constraint if provided
  // Child radius should be smaller than parent to avoid visual conflicts
  if (parentRadius !== undefined && parentRadius > 0) {
    result = Math.min(result, Math.max(parentRadius - 2, componentConfig.minRadius));
  }
  
  // Enforce component-specific bounds
  result = Math.max(result, componentConfig.minRadius);
  result = Math.min(result, componentConfig.maxRadius);
  
  return result;
}

/**
 * Get complete border-radius values including CSS string and corner values
 */
export function getBorderRadiusValues(context: BorderRadiusContext): BorderRadiusValues {
  const radius = getBorderRadius(context);
  
  // Handle pill variant
  if (context.variant === 'pill') {
    return {
      radius: 9999,
      css: '9999px',
      corners: {
        topLeft: 9999,
        topRight: 9999,
        bottomRight: 9999,
        bottomLeft: 9999
      }
    };
  }
  
  return {
    radius,
    css: `${radius}px`,
    corners: {
      topLeft: radius,
      topRight: radius,
      bottomRight: radius,
      bottomLeft: radius
    }
  };
}

/**
 * Get border-radius for specific corners
 */
export function getCornerRadius(
  context: BorderRadiusContext,
  corner: BorderRadiusCorner = 'all'
): Record<string, number> | number {
  const baseRadius = getBorderRadius(context);
  
  switch (corner) {
    case 'all':
      return baseRadius;
    case 'top':
      return { 
        'border-top-left-radius': baseRadius, 
        'border-top-right-radius': baseRadius 
      };
    case 'right':
      return { 
        'border-top-right-radius': baseRadius, 
        'border-bottom-right-radius': baseRadius 
      };
    case 'bottom':
      return { 
        'border-bottom-left-radius': baseRadius, 
        'border-bottom-right-radius': baseRadius 
      };
    case 'left':
      return { 
        'border-top-left-radius': baseRadius, 
        'border-bottom-left-radius': baseRadius 
      };
    case 'top-left':
      return { 'border-top-left-radius': baseRadius };
    case 'top-right':
      return { 'border-top-right-radius': baseRadius };
    case 'bottom-right':
      return { 'border-bottom-right-radius': baseRadius };
    case 'bottom-left':
      return { 'border-bottom-left-radius': baseRadius };
    default:
      return baseRadius;
  }
}

// ============================================================================
// HIERARCHICAL UTILITIES
// ============================================================================

/**
 * Calculate border-radius for nested components
 * Ensures visual harmony between parent and child elements
 */
export function getNestedBorderRadius(
  parentContext: BorderRadiusContext,
  childContext: Omit<BorderRadiusContext, 'level' | 'parentRadius'>
): BorderRadiusValues {
  const parentRadius = getBorderRadius(parentContext);
  
  const fullChildContext: BorderRadiusContext = {
    ...childContext,
    level: parentContext.level + 1,
    parentRadius
  };
  
  return getBorderRadiusValues(fullChildContext);
}

/**
 * Generate border-radius values for a component hierarchy
 */
export function generateHierarchicalRadius(
  baseContext: BorderRadiusContext,
  maxDepth: number = 3
): Record<number, BorderRadiusValues> {
  const results: Record<number, BorderRadiusValues> = {};
  
  for (let level = 0; level <= maxDepth; level++) {
    const context: BorderRadiusContext = {
      ...baseContext,
      level,
      parentRadius: level > 0 ? results[level - 1]?.radius : undefined
    };
    
    results[level] = getBorderRadiusValues(context);
  }
  
  return results;
}

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Calculate responsive border-radius based on viewport
 */
function getResponsiveRadius(): number {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 640) return 4; // sm
    if (width < 768) return 6; // md
    if (width < 1024) return 8; // lg
    return 10; // xl
  }
  return 6; // Default for SSR
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate border-radius hierarchy
 */
export function validateRadiusHierarchy(
  contexts: BorderRadiusContext[]
): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Sort by level to check hierarchy
  const sortedContexts = [...contexts].sort((a, b) => a.level - b.level);
  
  for (let i = 1; i < sortedContexts.length; i++) {
    const parent = sortedContexts[i - 1];
    const child = sortedContexts[i];
    
    if (child.level === parent.level + 1) {
      const parentRadius = getBorderRadius(parent);
      const childRadius = getBorderRadius(child);
      
      // Child radius should generally be smaller than or equal to parent
      // (with some tolerance for different component types)
      if (childRadius > parentRadius + 2) {
        violations.push(
          `Child radius (${childRadius}px at level ${child.level}) should not exceed parent radius (${parentRadius}px at level ${parent.level}) by more than 2px`
        );
      }
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

// ============================================================================
// CSS UTILITIES
// ============================================================================

/**
 * Generate CSS custom properties for border-radius values
 */
export function generateRadiusCSS(
  context: BorderRadiusContext, 
  prefix = '--radius'
): Record<string, string> {
  const values = getBorderRadiusValues(context);
  const { componentType, level } = context;
  
  return {
    [`${prefix}-${componentType}-${level}`]: values.css,
    [`${prefix}-${componentType}-${level}-tl`]: `${values.corners.topLeft}px`,
    [`${prefix}-${componentType}-${level}-tr`]: `${values.corners.topRight}px`,
    [`${prefix}-${componentType}-${level}-br`]: `${values.corners.bottomRight}px`,
    [`${prefix}-${componentType}-${level}-bl`]: `${values.corners.bottomLeft}px`
  };
}

/**
 * Generate Tailwind CSS classes for border-radius
 */
export function generateTailwindRadius(context: BorderRadiusContext): string {
  const radius = getBorderRadius(context);
  
  // Handle special cases
  if (context.variant === 'none') return 'rounded-none';
  if (context.variant === 'pill') return 'rounded-full';
  
  // Convert px values to Tailwind radius scale approximations
  if (radius <= 0) return 'rounded-none';
  if (radius <= 2) return 'rounded-sm';
  if (radius <= 4) return 'rounded';
  if (radius <= 6) return 'rounded-md';
  if (radius <= 8) return 'rounded-lg';
  if (radius <= 12) return 'rounded-xl';
  if (radius <= 16) return 'rounded-2xl';
  if (radius <= 24) return 'rounded-3xl';
  return 'rounded-full';
}

// ============================================================================
// PRESETS
// ============================================================================

export const RADIUS_PRESETS = {
  /** Sharp, minimal radius */
  sharp: {
    variant: 'subtle' as const,
    platform: 'web' as const
  },
  
  /** Standard moderate radius */
  standard: {
    variant: 'moderate' as const,
    platform: 'web' as const
  },
  
  /** Soft, prominent radius */
  soft: {
    variant: 'prominent' as const,
    platform: 'web' as const
  },
  
  /** Mobile-optimized radius */
  mobile: {
    variant: 'moderate' as const,
    platform: 'mobile' as const
  },
  
  /** Pill-shaped elements */
  pill: {
    variant: 'pill' as const,
    platform: 'web' as const
  }
} as const;

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Generate CSS transition for smooth radius changes
 */
export function getRadiusTransition(duration = '200ms', easing = 'ease-out'): string {
  return `border-radius ${duration} ${easing}`;
}

/**
 * Create hover/focus radius variants
 */
export function getInteractiveRadius(
  baseContext: BorderRadiusContext,
  state: 'hover' | 'focus' | 'active' = 'hover'
): BorderRadiusValues {
  const multiplier = state === 'hover' ? 1.1 : state === 'focus' ? 1.15 : 0.95;
  
  const adjustedContext: BorderRadiusContext = {
    ...baseContext,
    // Temporarily adjust size for interactive state
    size: baseContext.size === 'xs' ? 'sm' : 
          baseContext.size === 'sm' ? 'md' :
          baseContext.size === 'md' ? 'lg' :
          baseContext.size === 'lg' ? 'xl' : 'xl'
  };
  
  const baseRadius = getBorderRadius(baseContext);
  const interactiveRadius = Math.round(baseRadius * multiplier);
  
  return {
    radius: interactiveRadius,
    css: `${interactiveRadius}px`,
    corners: {
      topLeft: interactiveRadius,
      topRight: interactiveRadius,
      bottomRight: interactiveRadius,
      bottomLeft: interactiveRadius
    }
  };
}