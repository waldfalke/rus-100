/**
 * Elevation Token Contracts Implementation
 * 
 * Implements the functional elevation token contracts that integrate with
 * the theme system and provide runtime shadow resolution.
 */

import type { 
  ThemeContext, 
  ComponentElevationContext,
  ElevationShadowValues,
  TokenContract,
  ElevationLevel
} from '../../theme-contracts/types';

import {
  getElevationShadow,
  getSemanticElevation,
  validateElevationHierarchy,
  generateElevationCSS,
  generateTailwindElevation,
  type ElevationContext
} from '../elevation';

// ============================================================================
// ELEVATION CONTRACT IMPLEMENTATIONS
// ============================================================================

/**
 * Convert ComponentElevationContext to internal ElevationContext
 */
function mapToElevationContext(
  component: ComponentElevationContext, 
  themeContext: ThemeContext
): ElevationContext {
  return {
    level: component.level,
    size: component.size,
    variant: component.variant,
    platform: component.platform,
    themeContext,
    accessibility: component.accessibility
  };
}

/**
 * Static elevation level contracts
 */
export const elevationLevelContracts: Record<ElevationLevel, TokenContract<string>> = {
  0: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 0 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: 'none',
    validate: (value: string) => typeof value === 'string',
    description: 'No elevation - flat surface',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  },
  
  1: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 1 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: '0 1px 3px rgba(0, 0, 0, 0.1)',
    validate: (value: string) => typeof value === 'string' && value !== 'none',
    description: 'Subtle elevation for cards and buttons',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  },
  
  2: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 2 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: '0 2px 6px rgba(0, 0, 0, 0.12)',
    validate: (value: string) => typeof value === 'string' && value !== 'none',
    description: 'Moderate elevation for dropdowns and menus',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  },
  
  3: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 3 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: '0 4px 12px rgba(0, 0, 0, 0.14)',
    validate: (value: string) => typeof value === 'string' && value !== 'none',
    description: 'Prominent elevation for tooltips and floating elements',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  },
  
  4: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 4 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: '0 8px 24px rgba(0, 0, 0, 0.16)',
    validate: (value: string) => typeof value === 'string' && value !== 'none',
    description: 'High elevation for modals and overlays',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  },
  
  5: {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext({ level: 5 }, context);
      return getElevationShadow(elevationContext).css;
    },
    fallback: '0 16px 48px rgba(0, 0, 0, 0.18)',
    validate: (value: string) => typeof value === 'string' && value !== 'none',
    description: 'Maximum elevation for critical overlays',
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  }
};

/**
 * Get elevation level shadow with full context awareness
 */
export function getLevel(
  component: ComponentElevationContext, 
  context: ThemeContext
): string {
  const elevationContext = mapToElevationContext(component, context);
  return getElevationShadow(elevationContext).css;
}

/**
 * Get complete shadow values with ambient, directional, and combined shadows
 */
export function getShadow(
  component: ComponentElevationContext, 
  context: ThemeContext
): ElevationShadowValues {
  const elevationContext = mapToElevationContext(component, context);
  return getElevationShadow(elevationContext);
}

/**
 * Get semantic elevation based on component type
 */
export function getSemantic(
  componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar',
  context: ThemeContext
): string {
  const level = getSemanticElevation(componentType);
  const elevationContext = mapToElevationContext({ level }, context);
  return getElevationShadow(elevationContext).css;
}

/**
 * Validate elevation hierarchy across multiple components
 */
export function validateHierarchy(
  contexts: ComponentElevationContext[], 
  themeContext: ThemeContext
): { isValid: boolean; violations: string[] } {
  const elevationContexts = contexts.map(component => 
    mapToElevationContext(component, themeContext)
  );
  return validateElevationHierarchy(elevationContexts);
}

// ============================================================================
// ELEVATION CONTRACTS OBJECT
// ============================================================================

export const elevationContracts = {
  // Static level contracts
  ...elevationLevelContracts,
  
  // Functional contracts
  getLevel,
  getShadow,
  getSemantic,
  validateHierarchy
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate CSS custom properties for elevation
 */
export function generateElevationCSSProperties(
  component: ComponentElevationContext,
  context: ThemeContext,
  prefix = '--elevation'
): Record<string, string> {
  const elevationContext = mapToElevationContext(component, context);
  return generateElevationCSS(elevationContext, prefix);
}

/**
 * Generate Tailwind-compatible elevation utilities
 */
export function generateTailwindElevationUtilities(
  component: ComponentElevationContext,
  context: ThemeContext
): { boxShadow: string; dropShadow: string } {
  const elevationContext = mapToElevationContext(component, context);
  return generateTailwindElevation(elevationContext);
}

/**
 * Create elevation token with context-aware resolution
 */
export function createElevationToken(
  level: ElevationLevel,
  options?: {
    description?: string;
    fallback?: string;
    variant?: ComponentElevationContext['variant'];
  }
): TokenContract<string> {
  return {
    resolve: (context: ThemeContext) => {
      const elevationContext = mapToElevationContext(
        { 
          level, 
          variant: options?.variant 
        }, 
        context
      );
      return getElevationShadow(elevationContext).css;
    },
    fallback: options?.fallback || 'none',
    validate: (value: string) => typeof value === 'string',
    description: options?.description || `Elevation level ${level}`,
    meta: {
      category: 'elevation',
      type: 'shadow',
      version: '1.0.0'
    }
  };
}

// ============================================================================
// ELEVATION PRESETS
// ============================================================================

export const ELEVATION_TOKEN_PRESETS = {
  /** Minimal elevation for subtle layering */
  minimal: {
    variant: 'subtle' as const,
    description: 'Minimal shadows for subtle layering'
  },
  
  /** Standard elevation for most components */
  standard: {
    variant: 'moderate' as const,
    description: 'Standard elevation for most use cases'
  },
  
  /** Enhanced elevation for important elements */
  enhanced: {
    variant: 'prominent' as const,
    description: 'Enhanced shadows for important elements'
  },
  
  /** Maximum elevation for critical overlays */
  maximum: {
    variant: 'dramatic' as const,
    description: 'Maximum elevation for critical overlays'
  }
} as const;