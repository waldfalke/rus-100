/**
 * Token Contracts Implementation
 * 
 * Implements the functional token contracts for spacing and border-radius
 * that integrate with the theme system and provide runtime resolution.
 */

import type { 
  ThemeContext, 
  ComponentSpacingContext, 
  ComponentBorderRadiusContext,
  SpacingValues,
  BorderRadiusValues,
  BorderRadiusCorner
} from '../theme-contracts/types';

import {
  getOuterSpacing,
  getInnerSpacing,
  getGapSpacing,
  getSpacingValues,
  validateSpacingHierarchy,
  generateTailwindSpacing,
  type SpacingContext
} from './spacing';

import {
  getBorderRadius,
  getBorderRadiusValues,
  getCornerRadius,
  getNestedBorderRadius,
  validateRadiusHierarchy,
  generateTailwindRadius,
  type BorderRadiusContext
} from './border-radius';

// ============================================================================
// SPACING CONTRACT IMPLEMENTATIONS
// ============================================================================

/**
 * Get outer spacing (margins) for a component
 */
export function spacingGetOuter(
  component: ComponentSpacingContext, 
  context: ThemeContext
): string {
  const spacingContext: SpacingContext = {
    ...component,
    themeContext: context
  };
  
  const value = getOuterSpacing(spacingContext);
  return `${value}px`;
}

/**
 * Get inner spacing (padding) for a component
 */
export function spacingGetInner(
  component: ComponentSpacingContext, 
  context: ThemeContext
): string {
  const spacingContext: SpacingContext = {
    ...component,
    themeContext: context
  };
  
  const value = getInnerSpacing(spacingContext);
  return `${value}px`;
}

/**
 * Get gap spacing between sibling elements
 */
export function spacingGetGap(
  component: ComponentSpacingContext, 
  context: ThemeContext
): string {
  const spacingContext: SpacingContext = {
    ...component,
    themeContext: context
  };
  
  const value = getGapSpacing(spacingContext);
  return `${value}px`;
}

/**
 * Get all spacing values for a component
 */
export function spacingGetValues(
  component: ComponentSpacingContext, 
  context: ThemeContext
): SpacingValues {
  const spacingContext: SpacingContext = {
    ...component,
    themeContext: context
  };
  
  return getSpacingValues(spacingContext);
}

// ============================================================================
// BORDER-RADIUS CONTRACT IMPLEMENTATIONS
// ============================================================================

/**
 * Get border-radius for a component
 */
export function borderRadiusGet(
  component: ComponentBorderRadiusContext, 
  context: ThemeContext
): string {
  const radiusContext: BorderRadiusContext = {
    ...component,
    themeContext: context
  };
  
  const value = getBorderRadius(radiusContext);
  return `${value}px`;
}

/**
 * Get complete border-radius values for a component
 */
export function borderRadiusGetValues(
  component: ComponentBorderRadiusContext, 
  context: ThemeContext
): BorderRadiusValues {
  const radiusContext: BorderRadiusContext = {
    ...component,
    themeContext: context
  };
  
  return getBorderRadiusValues(radiusContext);
}

/**
 * Get border-radius for specific corners
 */
export function borderRadiusGetCorner(
  component: ComponentBorderRadiusContext, 
  corner: BorderRadiusCorner,
  context: ThemeContext
): string {
  const radiusContext: BorderRadiusContext = {
    ...component,
    themeContext: context
  };
  
  const result = getCornerRadius(radiusContext, corner);
  
  if (typeof result === 'number') {
    return `${result}px`;
  }
  
  // Return CSS property string for multiple corners
  return Object.entries(result)
    .map(([prop, value]) => `${prop}: ${value}px`)
    .join('; ');
}

/**
 * Get nested border-radius values
 */
export function borderRadiusGetNested(
  parent: ComponentBorderRadiusContext,
  child: ComponentBorderRadiusContext,
  context: ThemeContext
): BorderRadiusValues {
  const parentContext: BorderRadiusContext = {
    ...parent,
    themeContext: context
  };
  
  const childContextBase = {
    ...child,
    themeContext: context
  };
  
  return getNestedBorderRadius(parentContext, childContextBase);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate spacing hierarchy for multiple components
 */
export function validateComponentSpacing(
  components: Array<{ component: ComponentSpacingContext; context: ThemeContext }>
): {
  isValid: boolean;
  violations: string[];
  components: Array<{ component: ComponentSpacingContext; validation: ReturnType<typeof validateSpacingHierarchy> }>;
} {
  const violations: string[] = [];
  const componentValidations: Array<{ 
    component: ComponentSpacingContext; 
    validation: ReturnType<typeof validateSpacingHierarchy> 
  }> = [];
  
  for (const { component, context } of components) {
    const spacingContext: SpacingContext = {
      ...component,
      themeContext: context
    };
    
    const validation = validateSpacingHierarchy(spacingContext);
    componentValidations.push({ component, validation });
    
    if (!validation.isValid) {
      violations.push(
        `Component ${component.componentType} at level ${component.level}: ${validation.violations.join(', ')}`
      );
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations,
    components: componentValidations
  };
}

/**
 * Validate border-radius hierarchy for multiple components
 */
export function validateComponentBorderRadius(
  components: Array<{ component: ComponentBorderRadiusContext; context: ThemeContext }>
): {
  isValid: boolean;
  violations: string[];
} {
  const radiusContexts = components.map(({ component, context }) => ({
    ...component,
    themeContext: context
  }));
  
  return validateRadiusHierarchy(radiusContexts);
}

/**
 * Generate CSS custom properties for a component's spacing and border-radius
 */
export function generateComponentCSS(
  component: {
    spacing?: ComponentSpacingContext;
    borderRadius?: ComponentBorderRadiusContext;
  },
  context: ThemeContext,
  prefix = '--component'
): Record<string, string> {
  const css: Record<string, string> = {};
  
  if (component.spacing) {
    const spacingValues = spacingGetValues(component.spacing, context);
    const { componentType, level } = component.spacing;
    
    css[`${prefix}-${componentType}-${level}-spacing-outer`] = `${spacingValues.outer}px`;
    css[`${prefix}-${componentType}-${level}-spacing-inner`] = `${spacingValues.inner}px`;
    css[`${prefix}-${componentType}-${level}-spacing-gap`] = `${spacingValues.gap}px`;
  }
  
  if (component.borderRadius) {
    const radiusValues = borderRadiusGetValues(component.borderRadius, context);
    const { componentType, level } = component.borderRadius;
    
    css[`${prefix}-${componentType}-${level}-radius`] = radiusValues.css;
    css[`${prefix}-${componentType}-${level}-radius-tl`] = `${radiusValues.corners.topLeft}px`;
    css[`${prefix}-${componentType}-${level}-radius-tr`] = `${radiusValues.corners.topRight}px`;
    css[`${prefix}-${componentType}-${level}-radius-br`] = `${radiusValues.corners.bottomRight}px`;
    css[`${prefix}-${componentType}-${level}-radius-bl`] = `${radiusValues.corners.bottomLeft}px`;
  }
  
  return css;
}

/**
 * Generate Tailwind CSS classes for a component
 */
export function generateComponentTailwind(
  component: {
    spacing?: ComponentSpacingContext;
    borderRadius?: ComponentBorderRadiusContext;
  },
  context: ThemeContext
): {
  spacing?: { margin: string; padding: string; gap: string };
  borderRadius?: string;
} {
  const result: {
    spacing?: { margin: string; padding: string; gap: string };
    borderRadius?: string;
  } = {};
  
  if (component.spacing) {
    const spacingContext: SpacingContext = {
      ...component.spacing,
      themeContext: context
    };
    
    result.spacing = generateTailwindSpacing(spacingContext);
  }
  
  if (component.borderRadius) {
    const radiusContext: BorderRadiusContext = {
      ...component.borderRadius,
      themeContext: context
    };
    
    result.borderRadius = generateTailwindRadius(radiusContext);
  }
  
  return result;
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Create spacing context from preset
 */
export function createSpacingFromPreset(
  componentType: ComponentSpacingContext['componentType'],
  level: number,
  size: ComponentSpacingContext['size'],
  preset: 'compact' | 'comfortable' | 'spacious' | 'accessible'
): ComponentSpacingContext {
  const presetConfigs = {
    compact: {
      density: 'compact' as const,
      accessibility: {}
    },
    comfortable: {
      density: 'comfortable' as const,
      accessibility: {}
    },
    spacious: {
      density: 'spacious' as const,
      accessibility: { largeText: true }
    },
    accessible: {
      density: 'comfortable' as const,
      accessibility: {
        largeText: true,
        highContrast: true
      }
    }
  };
  
  const config = presetConfigs[preset];
  
  return {
    level,
    size,
    componentType,
    density: config.density,
    accessibility: config.accessibility
  };
}

/**
 * Create border-radius context from preset
 */
export function createBorderRadiusFromPreset(
  componentType: ComponentBorderRadiusContext['componentType'],
  level: number,
  size: ComponentBorderRadiusContext['size'],
  preset: 'sharp' | 'standard' | 'soft' | 'mobile' | 'pill'
): ComponentBorderRadiusContext {
  const presetConfigs = {
    sharp: {
      variant: 'subtle' as const,
      platform: 'web' as const
    },
    standard: {
      variant: 'moderate' as const,
      platform: 'web' as const
    },
    soft: {
      variant: 'prominent' as const,
      platform: 'web' as const
    },
    mobile: {
      variant: 'moderate' as const,
      platform: 'mobile' as const
    },
    pill: {
      variant: 'pill' as const,
      platform: 'web' as const
    }
  };
  
  const config = presetConfigs[preset];
  
  return {
    level,
    size,
    componentType,
    variant: config.variant,
    platform: config.platform
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const spacingContracts = {
  getOuter: spacingGetOuter,
  getInner: spacingGetInner,
  getGap: spacingGetGap,
  getValues: spacingGetValues
};

export const borderRadiusContracts = {
  get: borderRadiusGet,
  getValues: borderRadiusGetValues,
  getCorner: borderRadiusGetCorner,
  getNested: borderRadiusGetNested
};

export const contractUtils = {
  validateSpacing: validateComponentSpacing,
  validateBorderRadius: validateComponentBorderRadius,
  generateCSS: generateComponentCSS,
  generateTailwind: generateComponentTailwind,
  createSpacingPreset: createSpacingFromPreset,
  createBorderRadiusPreset: createBorderRadiusFromPreset
};