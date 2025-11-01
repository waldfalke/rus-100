/**
 * useTheme hook for accessing functional design tokens
 */

import { useContext, useMemo, useCallback, useRef, useEffect } from 'react';
import type { 
  ThemeContext, 
  TokenContract, 
  ColorTokenContract,
  DimensionTokenContract,
  TypographyTokenContract,
  ComponentSpacingContext,
  ComponentBorderRadiusContext,
  SpacingValues,
  BorderRadiusValues,
  SpacingSize,
  ComponentType,
  BorderRadiusVariant,
  BorderRadiusCorner
} from '../theme-contracts';
import { ThemeProviderContext } from '../providers/ThemeProvider';
import { 
  spacingGetOuter, 
  spacingGetInner, 
  spacingGetGap, 
  spacingGetValues,
  borderRadiusGet,
  borderRadiusGetValues,
  borderRadiusGetCorner,
  borderRadiusGetNested
} from '../tokens/contracts';

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseThemeReturn {
  /** Current theme context */
  context: ThemeContext;
  
  /** Get a resolved token value */
  get: <T = string>(tokenPath: string, contextOverride?: Partial<ThemeContext>) => T;
  
  /** Get multiple token values at once */
  getTokens: <T extends Record<string, any>>(
    tokens: Record<keyof T, string>,
    contextOverride?: Partial<ThemeContext>
  ) => T;
  
  /** Subscribe to token changes */
  subscribe: (tokenPath: string, callback: (value: any) => void) => () => void;
  
  /** Update theme context */
  updateContext: (updates: Partial<ThemeContext>) => void;
  
  /** Check if a token exists */
  hasToken: (tokenPath: string) => boolean;
  
  /** Get token metadata */
  getTokenMeta: (tokenPath: string) => any;
  
  /** Validate token value */
  validateToken: (tokenPath: string, value: any) => boolean;
  
  /** Functional spacing API */
  spacing: {
    /** Get outer spacing for a component */
    getOuter: (size: SpacingSize, component: ComponentType, context?: ComponentSpacingContext) => number;
    /** Get inner spacing for a component */
    getInner: (size: SpacingSize, component: ComponentType, context?: ComponentSpacingContext) => number;
    /** Get gap spacing for a component */
    getGap: (size: SpacingSize, component: ComponentType, context?: ComponentSpacingContext) => number;
    /** Get all spacing values for a component */
    getValues: (size: SpacingSize, component: ComponentType, context?: ComponentSpacingContext) => SpacingValues;
  };
  
  /** Functional border-radius API */
  borderRadius: {
    /** Get border-radius for a component */
    get: (variant: BorderRadiusVariant, component: ComponentType, context?: ComponentBorderRadiusContext) => number;
    /** Get all border-radius values for a component */
    getValues: (variant: BorderRadiusVariant, component: ComponentType, context?: ComponentBorderRadiusContext) => BorderRadiusValues;
    /** Get corner-specific border-radius */
    getCorner: (variant: BorderRadiusVariant, corner: BorderRadiusCorner, component: ComponentType, context?: ComponentBorderRadiusContext) => number;
    /** Get nested border-radius (for child components) */
    getNested: (variant: BorderRadiusVariant, component: ComponentType, context?: ComponentBorderRadiusContext) => number;
  };
}

export interface UseTokenOptions {
  /** Default value if token doesn't exist */
  fallback?: any;
  
  /** Context overrides for this specific token */
  context?: Partial<ThemeContext>;
  
  /** Whether to subscribe to changes */
  subscribe?: boolean;
  
  /** Transform function for the resolved value */
  transform?: (value: any) => any;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Main theme hook for accessing functional design tokens
 */
export function useTheme(): UseThemeReturn {
  const themeContext = useContext(ThemeProviderContext);
  
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  const { context, resolver, updateContext } = themeContext;
  
  // Memoize the get function to prevent unnecessary re-renders
  const get = useCallback(<T = string>(
    tokenPath: string, 
    contextOverride?: Partial<ThemeContext>
  ): T => {
    const finalContext = contextOverride 
      ? { ...context, ...contextOverride }
      : context;
      
    return resolver.resolve(tokenPath, finalContext) as T;
  }, [context, resolver]);
  
  // Get multiple tokens at once
  const getTokens = useCallback(<T extends Record<string, any>>(
    tokens: Record<keyof T, string>,
    contextOverride?: Partial<ThemeContext>
  ): T => {
    const result = {} as T;
    const finalContext = contextOverride 
      ? { ...context, ...contextOverride }
      : context;
    
    for (const [key, tokenPath] of Object.entries(tokens)) {
      result[key as keyof T] = resolver.resolve(tokenPath, finalContext);
    }
    
    return result;
  }, [context, resolver]);
  
  // Subscribe to token changes
  const subscribe = useCallback((
    tokenPath: string, 
    callback: (value: any) => void
  ) => {
    return resolver.subscribe(tokenPath, callback);
  }, [resolver]);
  
  // Check if token exists
  const hasToken = useCallback((tokenPath: string) => {
    return resolver.hasToken(tokenPath);
  }, [resolver]);
  
  // Get token metadata
  const getTokenMeta = useCallback((tokenPath: string) => {
    return resolver.getTokenMeta(tokenPath);
  }, [resolver]);
  
  // Validate token value
  const validateToken = useCallback((tokenPath: string, value: any) => {
    return resolver.validateToken(tokenPath, value);
  }, [resolver]);
  
  // Functional spacing API
  const spacing = useMemo(() => ({
    getOuter: (size: SpacingSize, component: ComponentType, spacingContext?: ComponentSpacingContext) => {
      return spacingGetOuter(size, component, { ...context, ...spacingContext });
    },
    getInner: (size: SpacingSize, component: ComponentType, spacingContext?: ComponentSpacingContext) => {
      return spacingGetInner(size, component, { ...context, ...spacingContext });
    },
    getGap: (size: SpacingSize, component: ComponentType, spacingContext?: ComponentSpacingContext) => {
      return spacingGetGap(size, component, { ...context, ...spacingContext });
    },
    getValues: (size: SpacingSize, component: ComponentType, spacingContext?: ComponentSpacingContext) => {
      return spacingGetValues(size, component, { ...context, ...spacingContext });
    },
  }), [context]);
  
  // Functional border-radius API
  const borderRadius = useMemo(() => ({
    get: (variant: BorderRadiusVariant, component: ComponentType, radiusContext?: ComponentBorderRadiusContext) => {
      return borderRadiusGet(variant, component, { ...context, ...radiusContext });
    },
    getValues: (variant: BorderRadiusVariant, component: ComponentType, radiusContext?: ComponentBorderRadiusContext) => {
      return borderRadiusGetValues(variant, component, { ...context, ...radiusContext });
    },
    getCorner: (variant: BorderRadiusVariant, corner: BorderRadiusCorner, component: ComponentType, radiusContext?: ComponentBorderRadiusContext) => {
      return borderRadiusGetCorner(variant, corner, component, { ...context, ...radiusContext });
    },
    getNested: (variant: BorderRadiusVariant, component: ComponentType, radiusContext?: ComponentBorderRadiusContext) => {
      return borderRadiusGetNested(variant, component, { ...context, ...radiusContext });
    },
  }), [context]);

  return {
    context,
    get,
    getTokens,
    subscribe,
    updateContext,
    hasToken,
    getTokenMeta,
    validateToken,
    spacing,
    borderRadius,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for accessing a single token with options
 */
export function useToken<T = string>(
  tokenPath: string, 
  options: UseTokenOptions = {}
): T {
  const { get, subscribe } = useTheme();
  const { fallback, context: contextOverride, subscribe: shouldSubscribe, transform } = options;
  
  // Memoize the resolved value
  const value = useMemo(() => {
    try {
      const resolved = get<T>(tokenPath, contextOverride);
      return transform ? transform(resolved) : resolved;
    } catch (error) {
      console.warn(`Failed to resolve token "${tokenPath}":`, error);
      return fallback;
    }
  }, [get, tokenPath, contextOverride, transform, fallback]);
  
  // Subscribe to changes if requested
  const callbackRef = useRef<((value: T) => void) | null>(null);
  
  useEffect(() => {
    if (!shouldSubscribe) return;
    
    const unsubscribe = subscribe(tokenPath, (newValue) => {
      if (callbackRef.current) {
        const finalValue = transform ? transform(newValue) : newValue;
        callbackRef.current(finalValue);
      }
    });
    
    return unsubscribe;
  }, [subscribe, tokenPath, shouldSubscribe, transform]);
  
  return value;
}

/**
 * Hook for accessing multiple tokens
 */
export function useTokens<T extends Record<string, any>>(
  tokens: Record<keyof T, string>,
  options: UseTokenOptions = {}
): T {
  const { getTokens } = useTheme();
  const { context: contextOverride, transform } = options;
  
  return useMemo(() => {
    const resolved = getTokens<T>(tokens, contextOverride);
    return transform ? transform(resolved) : resolved;
  }, [getTokens, tokens, contextOverride, transform]);
}

/**
 * Hook for accessing color tokens with additional utilities
 */
export function useColorToken(
  tokenPath: string,
  options: UseTokenOptions = {}
) {
  const color = useToken<string>(tokenPath, options);
  
  const utilities = useMemo(() => ({
    /** Convert to CSS custom property */
    toCSSVar: () => `var(--${tokenPath.replace(/\./g, '-')})`,
    
    /** Get RGB values (if possible) */
    toRGB: () => {
      // Basic RGB extraction - could be enhanced
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
        };
      }
      return null;
    },
    
    /** Check if color is dark */
    isDark: () => {
      // Simple luminance check - could be enhanced with proper OKLCH parsing
      return color.includes('oklch') && color.includes('0.') && 
             parseFloat(color.match(/oklch\(([\d.]+)/)?.[1] || '1') < 0.5;
    },
  }), [color, tokenPath]);
  
  return {
    value: color,
    ...utilities,
  };
}

/**
 * Hook for accessing spacing tokens with utilities
 */
export function useSpacingToken(
  tokenPath: string,
  options: UseTokenOptions = {}
) {
  const spacing = useToken<string>(tokenPath, options);
  
  const utilities = useMemo(() => ({
    /** Convert to pixels (approximate) */
    toPx: () => {
      const remMatch = spacing.match(/([\d.]+)rem/);
      if (remMatch) {
        return parseFloat(remMatch[1]) * 16; // Assuming 16px base
      }
      const pxMatch = spacing.match(/([\d.]+)px/);
      if (pxMatch) {
        return parseFloat(pxMatch[1]);
      }
      return 0;
    },
    
    /** Get as CSS calc expression */
    asCalc: (operation: string, value: string) => `calc(${spacing} ${operation} ${value})`,
    
    /** Multiply spacing */
    multiply: (factor: number) => {
      const remMatch = spacing.match(/([\d.]+)rem/);
      if (remMatch) {
        return `${parseFloat(remMatch[1]) * factor}rem`;
      }
      return spacing;
    },
  }), [spacing]);
  
  return {
    value: spacing,
    ...utilities,
  };
}

/**
 * Hook for creating CSS-in-JS styles from tokens
 */
export function useTokenStyles<T extends Record<string, string>>(
  tokenMap: T,
  options: UseTokenOptions = {}
): Record<keyof T, string> {
  return useTokens(tokenMap, options);
}

// ============================================================================
// COMPONENT INTEGRATION HELPERS
// ============================================================================

/**
 * Create a styled component factory with theme integration
 */
export function createStyledComponent<P extends object = {}>(
  baseComponent: React.ComponentType<P>,
  tokenMap: Record<string, string>
) {
  return function StyledComponent(props: P & { themeOverride?: Partial<ThemeContext> }) {
    const { themeOverride, ...restProps } = props;
    const styles = useTokenStyles(tokenMap, { context: themeOverride });
    
    return React.createElement(baseComponent, {
      ...restProps,
      style: { ...styles, ...(restProps as any).style },
    } as P);
  };
}

/**
 * HOC for injecting theme tokens as props
 */
export function withThemeTokens<P extends object, T extends Record<string, string>>(
  Component: React.ComponentType<P & { tokens: Record<keyof T, string> }>,
  tokenMap: T
) {
  return function WithThemeTokens(props: P & { themeOverride?: Partial<ThemeContext> }) {
    const { themeOverride, ...restProps } = props;
    const tokens = useTokens(tokenMap, { context: themeOverride });
    
    return React.createElement(Component, {
      ...restProps,
      tokens,
    } as P & { tokens: Record<keyof T, string> });
  };
}