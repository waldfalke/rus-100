/**
 * Typography token contracts with responsive scaling
 */

import type { TypographyTokenContract, TokenContract, ThemeContext } from '../../theme-contracts';

// ============================================================================
// TYPOGRAPHY SCALE CONFIGURATION
// ============================================================================

/**
 * Base font size in pixels (16px = 1rem)
 */
const BASE_FONT_SIZE = 16;

/**
 * Modular scale ratios for different screen sizes
 */
const SCALE_RATIOS = {
  mobile: 1.2,    // Minor third
  tablet: 1.25,   // Major third
  desktop: 1.333, // Perfect fourth
  large: 1.414,   // Augmented fourth
} as const;

/**
 * Font size steps in the modular scale
 */
const FONT_SIZE_STEPS = {
  xs: -2,
  sm: -1,
  base: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
  '5xl': 6,
} as const;

/**
 * Calculate font size using modular scale
 */
function calculateFontSize(
  step: number,
  ratio: number,
  baseSize: number = BASE_FONT_SIZE
): number {
  return baseSize * Math.pow(ratio, step);
}

/**
 * Get appropriate scale ratio based on viewport
 */
function getScaleRatio(viewport: { width: number; height: number }): number {
  if (viewport.width >= 1920) return SCALE_RATIOS.large;
  if (viewport.width >= 1024) return SCALE_RATIOS.desktop;
  if (viewport.width >= 768) return SCALE_RATIOS.tablet;
  return SCALE_RATIOS.mobile;
}

/**
 * Create a font size token with responsive scaling
 */
function createFontSizeToken(
  step: number,
  description: string
): TypographyTokenContract {
  return {
    resolve: (context: ThemeContext) => {
      const { viewport, accessibility, platform } = context;
      
      const ratio = getScaleRatio(viewport);
      let fontSize = calculateFontSize(step, ratio);
      
      // Accessibility adjustments
      if (accessibility.largeText) {
        fontSize *= 1.2; // 20% larger for accessibility
      }
      
      // Platform-specific adjustments
      if (platform === 'ios') {
        // iOS prefers slightly larger text for readability
        fontSize *= 1.05;
      } else if (platform === 'android') {
        // Android Material Design guidelines
        fontSize = Math.round(fontSize / 4) * 4; // Round to 4px grid
      }
      
      // Convert to rem and round to reasonable precision
      const remValue = fontSize / BASE_FONT_SIZE;
      const rounded = Math.round(remValue * 1000) / 1000;
      
      return `${rounded}rem`;
    },
    
    fallback: `${calculateFontSize(step, SCALE_RATIOS.desktop) / BASE_FONT_SIZE}rem`,
    
    scale: {
      base: BASE_FONT_SIZE,
      ratio: (context) => getScaleRatio(context.viewport),
      step,
    },
    
    validate: (value: string) => {
      const fontSizePattern = /^[\d.]+rem$/;
      return fontSizePattern.test(value);
    },
    
    description,
    
    meta: {
      category: 'typography',
      type: 'fontSize',
      version: '1.0.0',
    },
  };
}

// ============================================================================
// FONT SIZE TOKENS
// ============================================================================

export const fontSizeXs = createFontSizeToken(
  FONT_SIZE_STEPS.xs,
  'Extra small font size - captions, fine print'
);

export const fontSizeSm = createFontSizeToken(
  FONT_SIZE_STEPS.sm,
  'Small font size - secondary text, labels'
);

export const fontSizeBase = createFontSizeToken(
  FONT_SIZE_STEPS.base,
  'Base font size - body text, default size'
);

export const fontSizeLg = createFontSizeToken(
  FONT_SIZE_STEPS.lg,
  'Large font size - emphasized text, small headings'
);

export const fontSizeXl = createFontSizeToken(
  FONT_SIZE_STEPS.xl,
  'Extra large font size - headings, important text'
);

export const fontSize2Xl = createFontSizeToken(
  FONT_SIZE_STEPS['2xl'],
  '2X large font size - section headings'
);

export const fontSize3Xl = createFontSizeToken(
  FONT_SIZE_STEPS['3xl'],
  '3X large font size - page headings'
);

// ============================================================================
// FONT WEIGHT TOKENS
// ============================================================================

export const fontWeightLight: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    // Some platforms handle light weights differently
    if (platform === 'android') {
      return 300; // Android prefers 300 for light
    }
    
    return 300;
  },
  
  fallback: 300,
  
  validate: (value: number) => {
    return typeof value === 'number' && value >= 100 && value <= 900;
  },
  
  description: 'Light font weight',
};

export const fontWeightNormal: TokenContract<number> = {
  resolve: () => 400,
  fallback: 400,
  validate: (value: number) => value === 400,
  description: 'Normal font weight',
};

export const fontWeightMedium: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    if (platform === 'ios') {
      return 500; // iOS prefers 500 for medium
    }
    
    return 500;
  },
  
  fallback: 500,
  
  validate: (value: number) => value === 500,
  
  description: 'Medium font weight',
};

export const fontWeightSemibold: TokenContract<number> = {
  resolve: () => 600,
  fallback: 600,
  validate: (value: number) => value === 600,
  description: 'Semibold font weight',
};

export const fontWeightBold: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { accessibility } = context;
    
    // Increase weight for better accessibility if needed
    if (accessibility.highContrast) {
      return 800; // Bolder for high contrast
    }
    
    return 700;
  },
  
  fallback: 700,
  
  validate: (value: number) => value === 700 || value === 800,
  
  description: 'Bold font weight with accessibility adjustments',
};

// ============================================================================
// LINE HEIGHT TOKENS
// ============================================================================

export const lineHeightTight: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { accessibility } = context;
    
    let lineHeight = 1.25;
    
    // Increase line height for accessibility
    if (accessibility.largeText) {
      lineHeight = Math.max(lineHeight, 1.4);
    }
    
    return lineHeight;
  },
  
  fallback: 1.25,
  
  validate: (value: number) => {
    return typeof value === 'number' && value >= 1.0 && value <= 2.0;
  },
  
  description: 'Tight line height for headings',
};

export const lineHeightNormal: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { accessibility, platform } = context;
    
    let lineHeight = 1.5;
    
    // Platform adjustments
    if (platform === 'ios') {
      lineHeight = 1.4; // iOS prefers slightly tighter
    }
    
    // Accessibility adjustments
    if (accessibility.largeText) {
      lineHeight = Math.max(lineHeight, 1.6);
    }
    
    return lineHeight;
  },
  
  fallback: 1.5,
  
  validate: (value: number) => {
    return typeof value === 'number' && value >= 1.0 && value <= 2.0;
  },
  
  description: 'Normal line height for body text',
};

export const lineHeightRelaxed: TokenContract<number> = {
  resolve: (context: ThemeContext) => {
    const { accessibility } = context;
    
    let lineHeight = 1.75;
    
    // Further increase for accessibility
    if (accessibility.largeText) {
      lineHeight = 1.8;
    }
    
    return lineHeight;
  },
  
  fallback: 1.75,
  
  validate: (value: number) => {
    return typeof value === 'number' && value >= 1.0 && value <= 2.0;
  },
  
  description: 'Relaxed line height for improved readability',
};

// ============================================================================
// LETTER SPACING TOKENS
// ============================================================================

export const letterSpacingTight: TokenContract<string> = {
  resolve: (context: ThemeContext) => {
    const { platform } = context;
    
    // Platform-specific letter spacing
    if (platform === 'android') {
      return '-0.01em'; // Android Material Design
    }
    
    return '-0.025em';
  },
  
  fallback: '-0.025em',
  
  validate: (value: string) => {
    return /^-?[\d.]+em$/.test(value);
  },
  
  description: 'Tight letter spacing for headings',
};

export const letterSpacingNormal: TokenContract<string> = {
  resolve: () => '0em',
  fallback: '0em',
  validate: (value: string) => value === '0em',
  description: 'Normal letter spacing',
};

export const letterSpacingWide: TokenContract<string> = {
  resolve: (context: ThemeContext) => {
    const { accessibility } = context;
    
    let spacing = '0.025em';
    
    // Increase spacing for accessibility
    if (accessibility.largeText) {
      spacing = '0.05em';
    }
    
    return spacing;
  },
  
  fallback: '0.025em',
  
  validate: (value: string) => {
    return /^[\d.]+em$/.test(value);
  },
  
  description: 'Wide letter spacing for improved readability',
};

// ============================================================================
// COMPOSITE TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Heading typography with responsive scaling
 */
export const headingTypography: TokenContract<string> = {
  resolve: (context: ThemeContext) => {
    const fontSize = fontSize2Xl.resolve(context);
    const fontWeight = fontWeightBold.resolve(context);
    const lineHeight = lineHeightTight.resolve(context);
    const letterSpacing = letterSpacingTight.resolve(context);
    
    return `${fontWeight} ${fontSize}/${lineHeight} var(--font-family-heading, system-ui)`;
  },
  
  fallback: '700 1.5rem/1.25 system-ui',
  
  validate: (value: string) => {
    // Basic validation for CSS font shorthand
    return typeof value === 'string' && value.includes('/');
  },
  
  description: 'Complete heading typography with responsive scaling',
};

/**
 * Body typography with accessibility considerations
 */
export const bodyTypography: TokenContract<string> = {
  resolve: (context: ThemeContext) => {
    const fontSize = fontSizeBase.resolve(context);
    const fontWeight = fontWeightNormal.resolve(context);
    const lineHeight = lineHeightNormal.resolve(context);
    
    return `${fontWeight} ${fontSize}/${lineHeight} var(--font-family-body, system-ui)`;
  },
  
  fallback: '400 1rem/1.5 system-ui',
  
  validate: (value: string) => {
    return typeof value === 'string' && value.includes('/');
  },
  
  description: 'Complete body typography with accessibility support',
};