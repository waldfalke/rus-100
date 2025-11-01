/**
 * Spacing and dimension token contracts
 */

import type { DimensionTokenContract, ThemeContext } from '../../theme-contracts';

// ============================================================================
// BASE SPACING SCALE
// ============================================================================

/**
 * Base spacing unit - all spacing derives from this
 */
const BASE_SPACING = 4; // 4px base unit

/**
 * Spacing scale multipliers
 */
const SPACING_SCALE = {
  xs: 0.5,   // 2px
  sm: 1,     // 4px
  md: 2,     // 8px
  lg: 4,     // 16px
  xl: 6,     // 24px
  '2xl': 8,  // 32px
  '3xl': 12, // 48px
  '4xl': 16, // 64px
  '5xl': 24, // 96px
} as const;

/**
 * Create a spacing token with context-aware scaling
 */
function createSpacingToken(
  baseMultiplier: number,
  description: string
): DimensionTokenContract {
  return {
    resolve: (context: ThemeContext) => {
      const { platform, accessibility, viewport, component } = context;
      
      let multiplier = baseMultiplier;
      let unit = 'rem';
      let baseValue = BASE_SPACING / 16; // Convert px to rem (assuming 16px = 1rem)
      
      // Platform-specific adjustments
      if (platform === 'ios' || platform === 'android') {
        // Mobile platforms might need larger touch targets
        if (component?.size) {
          const sizeMultipliers = {
            xs: 0.8,
            sm: 0.9,
            md: 1.0,
            lg: 1.2,
            xl: 1.4,
          };
          multiplier *= sizeMultipliers[component.size] || 1.0;
        }
        
        // Use px for mobile for more precise control
        unit = 'px';
        baseValue = BASE_SPACING;
      }
      
      // Accessibility adjustments
      if (accessibility.largeText) {
        multiplier *= 1.25; // Increase spacing for large text
      }
      
      // Viewport-based adjustments for responsive design
      if (viewport.width < 768) {
        // Mobile: slightly reduce spacing to maximize content area
        multiplier *= 0.9;
      } else if (viewport.width > 1920) {
        // Large screens: increase spacing for better visual hierarchy
        multiplier *= 1.1;
      }
      
      const finalValue = baseValue * multiplier;
      
      // Round to reasonable precision
      const rounded = unit === 'px' 
        ? Math.round(finalValue)
        : Math.round(finalValue * 1000) / 1000;
      
      return `${rounded}${unit}`;
    },
    
    fallback: `${(BASE_SPACING * baseMultiplier) / 16}rem`,
    
    base: BASE_SPACING,
    scale: () => baseMultiplier,
    unit: 'rem',
    
    validate: (value: string) => {
      const dimensionPattern = /^[\d.]+(?:px|rem|em)$/;
      return dimensionPattern.test(value);
    },
    
    description,
    
    meta: {
      category: 'spacing',
      type: 'dimension',
      version: '1.0.0',
    },
  };
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacingXs = createSpacingToken(
  SPACING_SCALE.xs,
  'Extra small spacing - 2px base, used for fine adjustments'
);

export const spacingSm = createSpacingToken(
  SPACING_SCALE.sm,
  'Small spacing - 4px base, used for tight layouts'
);

export const spacingMd = createSpacingToken(
  SPACING_SCALE.md,
  'Medium spacing - 8px base, default spacing unit'
);

export const spacingLg = createSpacingToken(
  SPACING_SCALE.lg,
  'Large spacing - 16px base, used for component separation'
);

export const spacingXl = createSpacingToken(
  SPACING_SCALE.xl,
  'Extra large spacing - 24px base, used for section separation'
);

export const spacing2Xl = createSpacingToken(
  SPACING_SCALE['2xl'],
  '2X large spacing - 32px base, used for major layout sections'
);

export const spacing3Xl = createSpacingToken(
  SPACING_SCALE['3xl'],
  '3X large spacing - 48px base, used for page-level separation'
);

// ============================================================================
// COMPONENT-SPECIFIC SPACING
// ============================================================================

/**
 * Button padding with size-aware scaling
 */
export const buttonPadding: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { component, platform, accessibility } = context;
    
    const sizeMultipliers = {
      xs: 0.5,   // 2px 6px
      sm: 0.75,  // 3px 9px
      md: 1.0,   // 4px 12px
      lg: 1.5,   // 6px 18px
      xl: 2.0,   // 8px 24px
    };
    
    const size = component?.size || 'md';
    let multiplier = sizeMultipliers[size] || 1.0;
    
    // Platform adjustments for touch targets
    if (platform === 'ios' || platform === 'android') {
      multiplier = Math.max(multiplier, 0.75); // Minimum touch target
    }
    
    // Accessibility adjustments
    if (accessibility.largeText) {
      multiplier *= 1.2;
    }
    
    const verticalPadding = Math.round(BASE_SPACING * multiplier);
    const horizontalPadding = Math.round(BASE_SPACING * multiplier * 3);
    
    return `${verticalPadding / 16}rem ${horizontalPadding / 16}rem`;
  },
  
  fallback: '0.25rem 0.75rem',
  
  validate: (value: string) => {
    // Check for valid padding format (vertical horizontal)
    const paddingPattern = /^[\d.]+(?:px|rem|em)\s+[\d.]+(?:px|rem|em)$/;
    return paddingPattern.test(value);
  },
  
  description: 'Context-aware button padding',
};

/**
 * Card padding with depth awareness
 */
export const cardPadding: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { component, viewport, accessibility } = context;
    
    let basePadding = BASE_SPACING * 4; // 16px base
    
    // Depth-based adjustments
    if (component?.depth) {
      basePadding += component.depth * BASE_SPACING;
    }
    
    // Viewport adjustments
    if (viewport.width < 768) {
      basePadding *= 0.75; // Reduce on mobile
    }
    
    // Accessibility adjustments
    if (accessibility.largeText) {
      basePadding *= 1.15;
    }
    
    return `${basePadding / 16}rem`;
  },
  
  fallback: '1rem',
  
  validate: (value: string) => {
    const dimensionPattern = /^[\d.]+(?:px|rem|em)$/;
    return dimensionPattern.test(value);
  },
  
  description: 'Card padding with depth and viewport awareness',
};

// ============================================================================
// LAYOUT SPACING
// ============================================================================

/**
 * Container max width with responsive scaling
 */
export const containerMaxWidth: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    
    // Responsive container widths
    if (viewport.width >= 1536) return '1280px'; // 2xl
    if (viewport.width >= 1280) return '1024px'; // xl
    if (viewport.width >= 1024) return '768px';  // lg
    if (viewport.width >= 768) return '640px';   // md
    
    return '100%'; // sm and below
  },
  
  fallback: '1280px',
  
  validate: (value: string) => {
    return value === '100%' || /^\d+px$/.test(value);
  },
  
  description: 'Responsive container max width',
};

/**
 * Grid gap with density awareness
 */
export const gridGap: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport, component } = context;
    
    let baseGap = BASE_SPACING * 4; // 16px base
    
    // Component size adjustments
    if (component?.size === 'xs') baseGap *= 0.5;
    else if (component?.size === 'sm') baseGap *= 0.75;
    else if (component?.size === 'lg') baseGap *= 1.5;
    else if (component?.size === 'xl') baseGap *= 2;
    
    // Viewport adjustments
    if (viewport.width < 768) {
      baseGap *= 0.75; // Tighter on mobile
    } else if (viewport.width > 1920) {
      baseGap *= 1.25; // More spacious on large screens
    }
    
    return `${baseGap / 16}rem`;
  },
  
  fallback: '1rem',
  
  validate: (value: string) => {
    const dimensionPattern = /^[\d.]+(?:px|rem|em)$/;
    return dimensionPattern.test(value);
  },
  
  description: 'Grid gap with responsive and size awareness',
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const radiusNone: DimensionTokenContract = {
  resolve: () => '0',
  fallback: '0',
  validate: (value: string) => value === '0',
  description: 'No border radius',
};

export const radiusSm: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    // iOS prefers slightly larger radius
    if (platform === 'ios') return '0.25rem';
    
    return '0.125rem'; // 2px
  },
  fallback: '0.125rem',
  validate: (value: string) => /^[\d.]+rem$/.test(value),
  description: 'Small border radius',
};

export const radiusMd: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    if (platform === 'ios') return '0.5rem';
    if (platform === 'android') return '0.25rem';
    
    return '0.375rem'; // 6px
  },
  fallback: '0.375rem',
  validate: (value: string) => /^[\d.]+rem$/.test(value),
  description: 'Medium border radius',
};

export const radiusLg: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    if (platform === 'ios') return '0.75rem';
    if (platform === 'android') return '0.5rem';
    
    return '0.5rem'; // 8px
  },
  fallback: '0.5rem',
  validate: (value: string) => /^[\d.]+rem$/.test(value),
  description: 'Large border radius',
};

export const radiusFull: DimensionTokenContract = {
  resolve: () => '9999px',
  fallback: '9999px',
  validate: (value: string) => value === '9999px',
  description: 'Full border radius for circular elements',
};