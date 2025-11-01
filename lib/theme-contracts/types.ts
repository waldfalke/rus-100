/**
 * Context-Aware Functional Design Tokens System
 * Core TypeScript interfaces for theme contracts
 */

// ============================================================================
// CORE CONTEXT TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'auto';
export type Platform = 'web' | 'ios' | 'android' | 'desktop';
export type ContrastLevel = 'normal' | 'high' | 'low';
export type MotionPreference = 'full' | 'reduced' | 'none';
export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

// ============================================================================
// ELEVATION TYPES
// ============================================================================

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type ElevationVariant = 'subtle' | 'moderate' | 'prominent' | 'dramatic';
export type ShadowType = 'ambient' | 'directional' | 'combined';

// ============================================================================
// SPACING AND BORDER-RADIUS TYPES
// ============================================================================

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
export type ComponentType = 'badge' | 'button' | 'card' | 'panel' | 'block' | 'container';
export type BorderRadiusVariant = 'none' | 'subtle' | 'moderate' | 'prominent' | 'pill';
export type BorderRadiusCorner = 'all' | 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

export interface ComponentSpacingContext {
  level: number;
  size: SpacingSize;
  componentType: ComponentType;
  density?: 'compact' | 'comfortable' | 'spacious';
  accessibility?: {
    largeText?: boolean;
    reducedMotion?: boolean;
    highContrast?: boolean;
  };
}

export interface ComponentBorderRadiusContext {
  level: number;
  size: SpacingSize;
  componentType: ComponentType;
  variant?: BorderRadiusVariant;
  platform?: 'web' | 'mobile' | 'desktop';
  parentRadius?: number;
}

export interface SpacingValues {
  outer: number;
  inner: number;
  gap: number;
}

export interface BorderRadiusValues {
  radius: number;
  css: string;
  corners: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

export interface ComponentElevationContext {
  level: ElevationLevel;
  size?: ComponentSize;
  variant?: ElevationVariant;
  platform?: 'web' | 'mobile' | 'desktop';
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
}

export interface ElevationShadowValues {
  css: string;
  ambient: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };
  directional: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };
  combined: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };
}

/**
 * Runtime context for token resolution
 */
export interface ThemeContext {
  mode: ThemeMode;
  platform: Platform;
  contrast: ContrastLevel;
  motion: MotionPreference;
  viewport: {
    width: number;
    height: number;
    density: number;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    prefersReducedData: boolean;
  };
  component?: {
    state?: ComponentState;
    size?: ComponentSize;
    variant?: ComponentVariant;
    depth?: number; // For layering/elevation
  };
}

// ============================================================================
// TOKEN CONTRACT TYPES
// ============================================================================

/**
 * Base token contract interface
 */
export interface TokenContract<T = any> {
  /**
   * Function that resolves token value based on context
   */
  resolve: (context: ThemeContext) => T;
  
  /**
   * Fallback value when resolution fails
   */
  fallback: T;
  
  /**
   * Validation function for resolved values
   */
  validate?: (value: T) => boolean;
  
  /**
   * Human-readable description
   */
  description?: string;
  
  /**
   * Token metadata
   */
  meta?: {
    category: string;
    type: string;
    deprecated?: boolean;
    version?: string;
  };
}

/**
 * Specialized color token contract
 */
export interface ColorTokenContract extends TokenContract<string> {
  resolve: (context: ThemeContext) => string;
  fallback: string;
  
  /**
   * OKLCH color generation parameters
   */
  oklch?: {
    lightness: number | ((context: ThemeContext) => number);
    chroma: number | ((context: ThemeContext) => number);
    hue: number | ((context: ThemeContext) => number);
  };
  
  /**
   * Accessibility requirements
   */
  accessibility?: {
    minContrast?: number;
    wcagLevel?: 'AA' | 'AAA';
  };
}

/**
 * Spacing/dimension token contract
 */
export interface DimensionTokenContract extends TokenContract<string> {
  resolve: (context: ThemeContext) => string;
  fallback: string;
  
  /**
   * Base value and scaling function
   */
  base?: number;
  scale?: (context: ThemeContext) => number;
  unit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
}

/**
 * Typography token contract
 */
export interface TypographyTokenContract extends TokenContract<string> {
  resolve: (context: ThemeContext) => string;
  fallback: string;
  
  /**
   * Typography scale parameters
   */
  scale?: {
    base: number;
    ratio: number | ((context: ThemeContext) => number);
    step: number;
  };
}

// ============================================================================
// THEME CONTRACT SCHEMA
// ============================================================================

/**
 * Complete theme contract schema
 */
export interface ThemeContractSchema {
  colors: {
    // Surface colors
    background: ColorTokenContract;
    foreground: ColorTokenContract;
    surface: {
      primary: ColorTokenContract;
      secondary: ColorTokenContract;
      tertiary: ColorTokenContract;
    };
    
    // Brand colors
    brand: {
      primary: ColorTokenContract;
      secondary: ColorTokenContract;
    };
    
    // Semantic colors
    semantic: {
      success: ColorTokenContract;
      warning: ColorTokenContract;
      error: ColorTokenContract;
      info: ColorTokenContract;
    };
    
    // Interactive colors
    interactive: {
      primary: {
        default: ColorTokenContract;
        hover: ColorTokenContract;
        active: ColorTokenContract;
        disabled: ColorTokenContract;
      };
      secondary: {
        default: ColorTokenContract;
        hover: ColorTokenContract;
        active: ColorTokenContract;
        disabled: ColorTokenContract;
      };
    };
    
    // Border and outline colors
    border: {
      default: ColorTokenContract;
      subtle: ColorTokenContract;
      strong: ColorTokenContract;
      focus: ColorTokenContract;
    };
  };
  
  spacing: {
    xs: DimensionTokenContract;
    sm: DimensionTokenContract;
    md: DimensionTokenContract;
    lg: DimensionTokenContract;
    xl: DimensionTokenContract;
    '2xl': DimensionTokenContract;
    '3xl': DimensionTokenContract;
    
    // Functional spacing contracts
    getOuter: (component: ComponentSpacingContext, context: ThemeContext) => string;
    getInner: (component: ComponentSpacingContext, context: ThemeContext) => string;
    getGap: (component: ComponentSpacingContext, context: ThemeContext) => string;
    getValues: (component: ComponentSpacingContext, context: ThemeContext) => SpacingValues;
  };
  
  typography: {
    fontSize: {
      xs: TypographyTokenContract;
      sm: TypographyTokenContract;
      base: TypographyTokenContract;
      lg: TypographyTokenContract;
      xl: TypographyTokenContract;
      '2xl': TypographyTokenContract;
      '3xl': TypographyTokenContract;
    };
    
    fontWeight: {
      light: TokenContract<number>;
      normal: TokenContract<number>;
      medium: TokenContract<number>;
      semibold: TokenContract<number>;
      bold: TokenContract<number>;
    };
    
    lineHeight: {
      tight: TokenContract<number>;
      normal: TokenContract<number>;
      relaxed: TokenContract<number>;
    };
  };
  
  radius: {
    none: DimensionTokenContract;
    sm: DimensionTokenContract;
    md: DimensionTokenContract;
    lg: DimensionTokenContract;
    full: DimensionTokenContract;
    
    // Functional border-radius contracts
    get: (component: ComponentBorderRadiusContext, context: ThemeContext) => string;
    getValues: (component: ComponentBorderRadiusContext, context: ThemeContext) => BorderRadiusValues;
    getCorner: (component: ComponentBorderRadiusContext, corner: BorderRadiusCorner, context: ThemeContext) => string;
    getNested: (parent: ComponentBorderRadiusContext, child: ComponentBorderRadiusContext, context: ThemeContext) => BorderRadiusValues;
  };
  
  elevation: {
    // Static elevation levels
    0: TokenContract<string>;
    1: TokenContract<string>;
    2: TokenContract<string>;
    3: TokenContract<string>;
    4: TokenContract<string>;
    5: TokenContract<string>;
    
    // Functional elevation contracts
    getLevel: (component: ComponentElevationContext, context: ThemeContext) => string;
    getShadow: (component: ComponentElevationContext, context: ThemeContext) => ElevationShadowValues;
    getSemantic: (componentType: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar', context: ThemeContext) => string;
    validateHierarchy: (contexts: ComponentElevationContext[], themeContext: ThemeContext) => { isValid: boolean; violations: string[] };
  };
}

// ============================================================================
// THEME PROVIDER TYPES
// ============================================================================

/**
 * Theme provider configuration
 */
export interface ThemeProviderConfig {
  defaultMode: ThemeMode;
  contracts: ThemeContractSchema;
  cache?: {
    enabled: boolean;
    maxSize: number;
    ttl: number; // Time to live in milliseconds
  };
  performance?: {
    enableMemoization: boolean;
    enableBatching: boolean;
  };
}

/**
 * Resolved theme values cache entry
 */
export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  contextHash: string;
}

/**
 * Theme resolver interface
 */
export interface ThemeResolver {
  get<T>(tokenPath: string, context?: Partial<ThemeContext>): T;
  getMany(tokenPaths: string[], context?: Partial<ThemeContext>): Record<string, any>;
  invalidateCache(tokenPath?: string): void;
  subscribe(tokenPath: string, callback: (value: any) => void): () => void;
}