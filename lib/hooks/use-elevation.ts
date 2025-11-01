/**
 * React Hook for Elevation Tokens
 * 
 * Provides context-aware elevation token resolution with accessibility features
 * and integration with the existing theme system.
 */

import { useMemo, useCallback } from 'react';
import { useTheme } from './useTheme'; // Fix import path
import type { 
  ThemeContext, 
  ComponentElevationContext,
  ElevationShadowValues,
  ElevationLevel
} from '../theme-contracts/types';
import {
  getElevationShadow,
  getSemanticElevation,
  generateElevationCSS,
  generateTailwindElevation,
  validateElevationHierarchy,
  type ElevationContext
} from '../tokens/elevation';

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseElevationOptions {
  /** Component elevation context */
  component?: Partial<ComponentElevationContext>;
  /** Enable accessibility features */
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
  /** Platform override */
  platform?: 'web' | 'mobile' | 'desktop';
  /** Enable CSS custom properties generation */
  generateCSS?: boolean;
  /** CSS custom properties prefix */
  cssPrefix?: string;
  /** Enable Tailwind utilities generation */
  generateTailwind?: boolean;
}

export interface ElevationTokens {
  /** Get elevation shadow for specific level */
  getLevel: (level: ElevationLevel, options?: Partial<ComponentElevationContext>) => string;
  /** Get complete shadow values */
  getShadow: (level: ElevationLevel, options?: Partial<ComponentElevationContext>) => ElevationShadowValues;
  /** Get semantic elevation for component type */
  getSemantic: (componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar') => string;
  /** Generate CSS custom properties */
  generateCSS: (level: ElevationLevel, options?: Partial<ComponentElevationContext>) => Record<string, string>;
  /** Generate Tailwind utilities */
  generateTailwind: (level: ElevationLevel, options?: Partial<ComponentElevationContext>) => { boxShadow: string; dropShadow: string };
  /** Validate elevation hierarchy */
  validateHierarchy: (contexts: ComponentElevationContext[]) => { isValid: boolean; violations: string[] };
  /** Current theme context */
  themeContext: ThemeContext;
  /** Accessibility settings */
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    prefersReducedData: boolean;
  };
}

// ============================================================================
// ACCESSIBILITY DETECTION
// ============================================================================

/**
 * Detect user accessibility preferences
 */
function detectAccessibilityPreferences(): {
  highContrast: boolean;
  reducedMotion: boolean;
  prefersReducedData: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      highContrast: false,
      reducedMotion: false,
      prefersReducedData: false
    };
  }

  return {
    highContrast: window.matchMedia('(prefers-contrast: high)').matches ||
                  window.matchMedia('(-ms-high-contrast: active)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches
  };
}

// ============================================================================
// ELEVATION HOOK
// ============================================================================

/**
 * Hook for consuming elevation tokens with context-aware resolution
 */
export function useElevation(options: UseElevationOptions = {}): ElevationTokens {
  const themeContext = useTheme(); // Get current theme context
  
  // Detect accessibility preferences
  const detectedAccessibility = useMemo(() => 
    detectAccessibilityPreferences(), 
    []
  );
  
  // Merge accessibility settings
  const accessibility = useMemo(() => ({
    highContrast: options.accessibility?.highContrast ?? detectedAccessibility.highContrast,
    reducedMotion: options.accessibility?.reducedMotion ?? detectedAccessibility.reducedMotion,
    prefersReducedData: options.accessibility?.prefersReducedData ?? detectedAccessibility.prefersReducedData
  }), [options.accessibility, detectedAccessibility]);
  
  // Create base elevation context
  const createElevationContext = useCallback((
    level: ElevationLevel,
    componentOptions?: Partial<ComponentElevationContext>
  ): ElevationContext => {
    return {
      level,
      size: componentOptions?.size || options.component?.size || 'md',
      variant: componentOptions?.variant || options.component?.variant || 'moderate',
      platform: componentOptions?.platform || options.platform || themeContext.platform || 'web',
      themeContext,
      accessibility
    };
  }, [options, themeContext, accessibility]);
  
  // Get elevation level shadow
  const getLevel = useCallback((
    level: ElevationLevel, 
    componentOptions?: Partial<ComponentElevationContext>
  ): string => {
    const context = createElevationContext(level, componentOptions);
    return getElevationShadow(context).css;
  }, [createElevationContext]);
  
  // Get complete shadow values
  const getShadow = useCallback((
    level: ElevationLevel,
    componentOptions?: Partial<ComponentElevationContext>
  ): ElevationShadowValues => {
    const context = createElevationContext(level, componentOptions);
    const shadow = getElevationShadow(context);
    
    return {
      offsetX: shadow.combined.offsetX,
      offsetY: shadow.combined.offsetY,
      blur: shadow.combined.blur,
      spread: shadow.combined.spread,
      color: shadow.combined.color,
      opacity: shadow.combined.opacity
    };
  }, [createElevationContext]);
  
  // Get semantic elevation
  const getSemantic = useCallback((
    componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar'
  ): string => {
    const level = getSemanticElevation(componentType, options.component);
    return getLevel(level);
  }, [getLevel, options.component]);
  
  // Generate CSS custom properties
  const generateCSSProperties = useCallback((
    level: ElevationLevel,
    componentOptions?: Partial<ComponentElevationContext>
  ): Record<string, string> => {
    if (!options.generateCSS) return {};
    
    const context = createElevationContext(level, componentOptions);
    return generateElevationCSS(context, options.cssPrefix);
  }, [createElevationContext, options.generateCSS, options.cssPrefix]);
  
  // Generate Tailwind utilities
  const generateTailwindUtilities = useCallback((
    level: ElevationLevel,
    componentOptions?: Partial<ComponentElevationContext>
  ): { boxShadow: string; dropShadow: string } => {
    if (!options.generateTailwind) {
      return { boxShadow: '', dropShadow: '' };
    }
    
    const context = createElevationContext(level, componentOptions);
    return generateTailwindElevation(context);
  }, [createElevationContext, options.generateTailwind]);
  
  // Validate elevation hierarchy
  const validateHierarchyCallback = useCallback((
    contexts: ComponentElevationContext[]
  ): { isValid: boolean; violations: string[] } => {
    const elevationContexts = contexts.map(component => ({
      level: component.level,
      size: component.size || 'md',
      variant: component.variant || 'moderate',
      platform: component.platform || themeContext.platform || 'web',
      themeContext,
      accessibility
    }));
    
    return validateElevationHierarchy(elevationContexts);
  }, [themeContext, accessibility]);
  
  return {
    getLevel,
    getShadow,
    getSemantic,
    generateCSS: generateCSSProperties,
    generateTailwind: generateTailwindUtilities,
    validateHierarchy: validateHierarchyCallback,
    themeContext,
    accessibility
  };
}

// ============================================================================
// ELEVATION COMPONENT HOOK
// ============================================================================

/**
 * Simplified hook for component-specific elevation
 */
export function useComponentElevation(
  componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar',
  options?: {
    variant?: ComponentElevationContext['variant'];
    size?: ComponentElevationContext['size'];
    accessibility?: UseElevationOptions['accessibility'];
  }
) {
  const elevation = useElevation({
    component: {
      variant: options?.variant,
      size: options?.size
    },
    accessibility: options?.accessibility,
    generateCSS: true,
    generateTailwind: true
  });
  
  const shadowCSS = useMemo(() => 
    elevation.getSemantic(componentType), 
    [elevation, componentType]
  );
  
  const level = useMemo(() => 
    getSemanticElevation(componentType, { 
      variant: options?.variant, 
      size: options?.size 
    }), 
    [componentType, options?.variant, options?.size]
  );
  
  const cssProperties = useMemo(() => 
    elevation.generateCSS(level, { 
      variant: options?.variant, 
      size: options?.size 
    }), 
    [elevation, level, options?.variant, options?.size]
  );
  
  const tailwindUtilities = useMemo(() => 
    elevation.generateTailwind(level, { 
      variant: options?.variant, 
      size: options?.size 
    }), 
    [elevation, level, options?.variant, options?.size]
  );
  
  return {
    shadowCSS,
    level,
    cssProperties,
    tailwindUtilities,
    accessibility: elevation.accessibility
  };
}

// ============================================================================
// ELEVATION PRESETS HOOK
// ============================================================================

/**
 * Hook for accessing elevation presets
 */
export function useElevationPresets() {
  const elevation = useElevation({ generateCSS: true, generateTailwind: true });
  
  return useMemo(() => ({
    minimal: {
      css: elevation.getLevel(1, { variant: 'subtle' }),
      level: 1,
      variant: 'subtle' as const
    },
    standard: {
      css: elevation.getLevel(2, { variant: 'moderate' }),
      level: 2,
      variant: 'moderate' as const
    },
    enhanced: {
      css: elevation.getLevel(3, { variant: 'prominent' }),
      level: 3,
      variant: 'prominent' as const
    },
    maximum: {
      css: elevation.getLevel(4, { variant: 'dramatic' }),
      level: 4,
      variant: 'dramatic' as const
    }
  }), [elevation]);
}