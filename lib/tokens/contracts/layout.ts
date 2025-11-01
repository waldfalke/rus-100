/**
 * Layout and grid token contracts
 */

import type { DimensionTokenContract, ThemeContext } from '../../theme-contracts';

// ============================================================================
// PAGE PADDING TOKENS
// ============================================================================

/** Horizontal page padding with responsive scaling */
export const pagePaddingX: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    if (viewport.width < 640) return '0.75rem'; // sm
    if (viewport.width < 768) return '1rem';    // md
    if (viewport.width < 1024) return '1.25rem'; // lg
    if (viewport.width < 1280) return '1.5rem'; // xl
    return '2rem'; // 2xl
  },
  fallback: '1rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Horizontal page padding with responsive scaling'
};

/** Vertical page padding with responsive scaling */
export const pagePaddingY: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    if (viewport.width < 640) return '1rem';
    if (viewport.width < 768) return '1.25rem';
    if (viewport.width < 1024) return '1.5rem';
    if (viewport.width < 1280) return '1.75rem';
    return '2rem';
  },
  fallback: '1.5rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Vertical page padding with responsive scaling'
};

// ============================================================================
// GRID MIN ITEM WIDTH TOKENS
// ============================================================================

/** Minimum card width for groups grid */
export const gridMinItemWidthGroups: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    // Slightly larger cards on big screens
    if (viewport.width >= 1536) return '26rem'; // ~416px
    if (viewport.width >= 1280) return '24rem'; // ~384px
    if (viewport.width >= 1024) return '22rem'; // ~352px
    return '20rem'; // ~320px
  },
  fallback: '24rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Minimum card width for groups grid to control columns'
};

/** Minimum item width for test creation form grid */
export const gridMinItemWidthTestForm: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    if (viewport.width >= 1536) return '22rem'; // ~352px
    if (viewport.width >= 1280) return '20rem'; // ~320px
    if (viewport.width >= 1024) return '18rem'; // ~288px
    return '16rem'; // ~256px
  },
  fallback: '20rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Minimum field block width for test creation grid'
};

// ============================================================================
// CONTAINER TOKENS
// ============================================================================

/** Maximum width for main content container */
export const containerMaxWidth: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    return '96rem'; // 1536px - consistent with existing containerMaxWidth
  },
  fallback: '96rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Maximum width for main content container'
};

/** Content area padding (inside container, around main content) */
export const contentPadding: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    const { viewport } = context;
    if (viewport.width < 640) return '1rem';    // sm
    if (viewport.width < 768) return '1.25rem'; // md
    if (viewport.width < 1024) return '1.5rem'; // lg
    return '2rem'; // xl+
  },
  fallback: '1.5rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Padding around main content inside container'
};

// ============================================================================
// HEADER LAYOUT TOKENS
// ============================================================================

/** Header height for layout calculations */
export const headerHeight: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    return '4rem'; // 64px - standard header height
  },
  fallback: '4rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Standard header height for layout calculations'
};

/** Gap between header and main content */
export const headerContentGap: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    return '0rem'; // No gap - content starts immediately after header
  },
  fallback: '0rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Gap between header and main content'
};

// ============================================================================
// MAIN CONTENT TOKENS
// ============================================================================

/** Bottom padding for main content (to account for fixed elements) */
export const mainContentBottomPadding: DimensionTokenContract = {
  resolve: (context: ThemeContext) => {
    return '5rem'; // 80px - space for potential fixed bottom elements
  },
  fallback: '5rem',
  validate: (value: string) => /^[\d.]+(?:px|rem|em)$/.test(value),
  description: 'Bottom padding for main content area'
};

// ============================================================================
// LAYOUT TOKENS
// ============================================================================

export const layoutTokens = {
  // Page-level padding (horizontal spacing from screen edges)
  pagePaddingX: {
    mobile: "1rem",    // 16px
    tablet: "1.5rem",  // 24px  
    desktop: "2rem",   // 32px
    fallback: "1rem"   // Default fallback
  },

  // Content alignment - ensures all content starts at the same horizontal position
  contentAlignment: {
    // Left edge position for all content (header, breadcrumbs, main)
    leftEdge: {
      mobile: "1rem",    // 16px from screen edge
      tablet: "1.5rem",  // 24px from screen edge
      desktop: "2rem",   // 32px from screen edge
      fallback: "1rem"   // Default fallback
    },
    // Inner content padding within containers
    innerPadding: {
      mobile: "1rem",    // 16px
      tablet: "1.5rem",  // 24px
      desktop: "2rem",   // 32px
      fallback: "1rem"   // Default fallback
    },
    // Maximum content width for consistent line length
    maxContentWidth: "1152px" // 72rem
  },

  // Container constraints
  maxWidth: {
    content: "1152px", // 72rem - main content max width
    wide: "1280px",    // 80rem - for wider layouts
    full: "100%"       // Full width when needed
  },

  // Vertical spacing
  sectionSpacing: {
    small: "1rem",     // 16px
    medium: "1.5rem",  // 24px
    large: "2rem",     // 32px
    xlarge: "3rem"     // 48px
  }
} as const;