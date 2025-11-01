/**
 * Functional layout utilities leveraging token contracts
 */

import type { ThemeContext } from '../theme-contracts';
import { containerMaxWidth, gridGap } from './contracts/spacing';
import { 
  pagePaddingX, 
  pagePaddingY, 
  gridMinItemWidthGroups, 
  gridMinItemWidthTestForm,
  contentPadding,
  headerHeight,
  headerContentGap,
  mainContentBottomPadding
} from './contracts/layout';

/** Convert token value to string using context or fallback */
function resolveToken(token: { resolve: (ctx: ThemeContext) => string; fallback: string }, ctx?: Partial<ThemeContext>) {
  try {
    const context: ThemeContext = {
      mode: 'light',
      platform: 'web',
      contrast: 'normal',
      motion: 'full',
      viewport: { width: typeof window !== 'undefined' ? window.innerWidth : 1280, height: typeof window !== 'undefined' ? window.innerHeight : 800, density: 1 },
      accessibility: { reducedMotion: false, highContrast: false, largeText: false, prefersReducedData: false },
      component: undefined,
      ...(ctx as ThemeContext)
    };
    const v = token.resolve(context);
    return v || token.fallback;
  } catch {
    return token.fallback;
  }
}

export function getContainerStyles(ctx?: Partial<ThemeContext>) {
  return {
    maxWidth: resolveToken(containerMaxWidth, ctx),
    paddingLeft: resolveToken(pagePaddingX, ctx),
    paddingRight: resolveToken(pagePaddingX, ctx),
    paddingTop: resolveToken(pagePaddingY, ctx),
    paddingBottom: resolveToken(pagePaddingY, ctx)
  } as React.CSSProperties;
}

export function getGridGap(ctx?: Partial<ThemeContext>) {
  return resolveToken(gridGap, ctx);
}

export function getAutoGridTemplateColumns(variant: 'groups' | 'tests' | 'generic' = 'generic', ctx?: Partial<ThemeContext>) {
  const minWidth = variant === 'groups'
    ? resolveToken(gridMinItemWidthGroups, ctx)
    : variant === 'tests'
    ? resolveToken(gridMinItemWidthTestForm, ctx)
    : '20rem';
  return `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
}

// ============================================================================
// NEW LAYOUT UTILITIES
// ============================================================================

/** Get page layout styles with consistent padding and container */
export function getPageLayoutStyles(ctx?: Partial<ThemeContext>) {
  return {
    paddingLeft: resolveToken(pagePaddingX, ctx),
    paddingRight: resolveToken(pagePaddingX, ctx),
    paddingTop: resolveToken(contentPadding, ctx),
    paddingBottom: resolveToken(mainContentBottomPadding, ctx),
    maxWidth: resolveToken(containerMaxWidth, ctx),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%'
  } as React.CSSProperties;
}

/** Get main content area styles */
export function getMainContentStyles(ctx?: Partial<ThemeContext>) {
  return {
    paddingBottom: resolveToken(mainContentBottomPadding, ctx),
    flexGrow: 1
  } as React.CSSProperties;
}

/**
 * Get content alignment styles
 * Ensures consistent alignment for header, breadcrumbs and main content
 */
export function getContentAlignmentStyles(ctx?: Partial<ThemeContext>) {
  // Use fixed values to avoid hydration mismatch between server and client
  return {
    paddingLeft: '1rem', // Fixed fallback value
    paddingRight: '1rem', // Fixed fallback value  
    maxWidth: '72rem', // max-w-6xl (1152px)
    margin: '0 auto',
    width: '100%'
  } as React.CSSProperties;
}

/**
 * Get inner content padding for containers
 */
export function getInnerContentPadding(ctx?: Partial<ThemeContext>) {
  return {
    paddingLeft: resolveToken(contentPadding, ctx),
    paddingRight: resolveToken(contentPadding, ctx)
  } as React.CSSProperties;
}

/** Get header layout styles */
export function getHeaderLayoutStyles(ctx?: Partial<ThemeContext>) {
  return {
    height: resolveToken(headerHeight, ctx),
    marginBottom: resolveToken(headerContentGap, ctx)
  } as React.CSSProperties;
}

/** Get content padding for inner elements */
export function getContentPadding(ctx?: Partial<ThemeContext>) {
  return resolveToken(contentPadding, ctx);
}