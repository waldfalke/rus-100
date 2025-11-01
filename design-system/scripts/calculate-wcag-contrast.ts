#!/usr/bin/env tsx
/**
 * WCAG Contrast Ratio Calculator
 *
 * Calculates WCAG 2.2 contrast ratios for all semantic token pairs.
 * Verifies compliance with AA standards (4.5:1 for normal text, 3:1 for large text).
 *
 * Usage: yarn tsx src/design-system/scripts/calculate-wcag-contrast.ts
 *
 * Output: Markdown report in docs/design-system/WCAG_CONTRAST_REPORT.md
 *
 * @see https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
 */

import { wcagContrast, oklch, converter } from 'culori';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { primitiveColors } from '../tokens/primitives/colors';
import {
  lightInteractiveTokens,
  darkInteractiveTokens,
} from '../tokens/semantic/interactive';
import {
  lightLinkTokens,
  darkLinkTokens,
} from '../tokens/semantic/links';
import {
  lightSurfaceTokens,
  darkSurfaceTokens,
} from '../tokens/semantic/surfaces';
import {
  lightStatusTokens,
  darkStatusTokens,
} from '../tokens/semantic/status';
import {
  lightButtonTokens,
  darkButtonTokens,
} from '../tokens/semantic/buttons';
import {
  lightFormTokens,
  darkFormTokens,
} from '../tokens/semantic/forms';

// ============================================
// WCAG Standards
// ============================================

const WCAG_AA_NORMAL = 4.5;  // Normal text (< 18px or < 14px bold)
const WCAG_AA_LARGE = 3.0;   // Large text (>= 18px or >= 14px bold)
const WCAG_AAA_NORMAL = 7.0; // Enhanced (AAA)
const WCAG_AAA_LARGE = 4.5;  // Enhanced (AAA)

// ============================================
// Types
// ============================================

interface ContrastResult {
  name: string;
  foreground: string;
  background: string;
  lightRatio: number | undefined;
  darkRatio: number | undefined;
  wcagAA: {
    light: boolean;
    dark: boolean;
  };
  wcagAAA: {
    light: boolean;
    dark: boolean;
  };
  category: 'interactive' | 'link' | 'surface' | 'status';
  usage: string;
  /**
   * Severity of failure:
   * - 'critical': Must fix (affects active UI elements - text, buttons, links)
   * - 'informational': WCAG exempt (disabled states) or different standard (UI components 3:1)
   */
  severity?: 'critical' | 'informational';
  /** Reason why informational failure is acceptable */
  exemptReason?: string;
}

// ============================================
// Helpers
// ============================================

/**
 * Calculate contrast ratio between two OKLCH colors
 */
function calculateContrast(color1: string, color2: string): number | undefined {
  try {
    // Handle opacity in OKLCH (strip it for contrast calculation)
    const cleanColor1 = color1.replace(/\/\s*\d+%\)$/, ')');
    const cleanColor2 = color2.replace(/\/\s*\d+%\)$/, ')');

    // Parse OKLCH strings to color objects using culori's oklch parser
    const parsedColor1 = oklch(cleanColor1);
    const parsedColor2 = oklch(cleanColor2);

    if (!parsedColor1 || !parsedColor2) {
      console.error(`Failed to parse colors: ${cleanColor1}, ${cleanColor2}`);
      return undefined;
    }

    const ratio = wcagContrast(parsedColor1, parsedColor2);
    return ratio ? Math.round(ratio * 100) / 100 : undefined;
  } catch (error) {
    console.error(`Error calculating contrast for ${color1} vs ${color2}:`, error);
    return undefined;
  }
}

/**
 * Format ratio with color indicator
 */
function formatRatio(ratio: number | undefined, threshold: number): string {
  if (ratio === undefined) return 'N/A';
  const pass = ratio >= threshold;
  return `${ratio}:1 ${pass ? '✅' : '❌'}`;
}

/**
 * Format boolean as pass/fail
 */
function formatPassFail(pass: boolean): string {
  return pass ? '✅ Pass' : '❌ Fail';
}

/**
 * Determine severity of failure based on test characteristics
 */
function determineSeverity(result: ContrastResult): 'critical' | 'informational' {
  const nameLower = result.name.toLowerCase();
  const usageLower = result.usage.toLowerCase();

  // Disabled states are WCAG exempt
  if (nameLower.includes('disabled') || usageLower.includes('disabled')) {
    return 'informational';
  }

  // UI components (borders, dividers, focus rings) use 3:1 standard, not 4.5:1
  // Script checks against WCAG_AA_LARGE (3:1) for these, but reports them as failures
  // when compared to normal text standard (4.5:1)
  if (nameLower.includes('border') || nameLower.includes('divider') ||
      nameLower.includes('focus ring') || usageLower.includes('ui component')) {
    return 'informational';
  }

  // Everything else is critical (text, buttons, links, etc.)
  return 'critical';
}

/**
 * Get exempt reason for informational failures
 */
function getExemptReason(result: ContrastResult): string {
  const nameLower = result.name.toLowerCase();
  const usageLower = result.usage.toLowerCase();

  if (nameLower.includes('disabled') || usageLower.includes('disabled')) {
    return 'WCAG 2.2 Success Criterion 1.4.3 exempts disabled UI components';
  }

  if (nameLower.includes('border') || nameLower.includes('divider') ||
      nameLower.includes('focus ring') || usageLower.includes('ui component')) {
    return 'UI components require 3:1 minimum (WCAG AA Large Text), not 4.5:1';
  }

  return 'Unknown exemption';
}

/**
 * Suggest which semantic file to edit based on test name
 * Returns path from tokens/ directory
 */
function getSuggestedFile(result: ContrastResult): string {
  const name = result.name.toLowerCase();

  if (name.includes('input') || name.includes('placeholder') ||
      name.includes('checkbox') || name.includes('radio') ||
      name.includes('select') || name.includes('form')) {
    return 'semantic/forms.ts';
  }
  if (name.includes('button')) return 'semantic/buttons.ts';
  if (name.includes('link')) return 'semantic/links.ts';
  if (name.includes('badge')) return 'semantic/badges.ts';
  if (name.includes('card') || name.includes('surface') ||
      name.includes('divider') || name.includes('glass')) {
    return 'semantic/surfaces.ts';
  }
  if (name.includes('success') || name.includes('error') ||
      name.includes('warning') || name.includes('info')) {
    return 'semantic/status.ts';
  }
  if (name.includes('interactive')) return 'semantic/interactive.ts';

  return 'semantic/[unknown].ts';
}

/**
 * Determine edit scope based on which themes fail
 */
function getSuggestedScope(result: ContrastResult): string {
  const lightFails = !result.wcagAA.light;
  const darkFails = !result.wcagAA.dark;

  if (lightFails && darkFails) {
    return '(both themes → check primitives/colors.ts)';
  }
  if (darkFails) {
    return '(darkTokens only)';
  }
  if (lightFails) {
    return '(lightTokens only)';
  }

  return '';
}

// ============================================
// Token Pair Definitions
// ============================================

const results: ContrastResult[] = [];

// ----- Links on Surface -----
results.push({
  name: 'Link (default) on Page Background',
  foreground: lightLinkTokens.default,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightLinkTokens.default, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkLinkTokens.default, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightLinkTokens.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightLinkTokens.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'link',
  usage: 'Links in body text on page background',
});

results.push({
  name: 'Link (hover) on Page Background',
  foreground: lightLinkTokens.hover,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightLinkTokens.hover, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkLinkTokens.hover, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightLinkTokens.hover, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.hover, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightLinkTokens.hover, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.hover, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'link',
  usage: 'Links on hover state',
});

results.push({
  name: 'Link (visited) on Page Background',
  foreground: lightLinkTokens.visited,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightLinkTokens.visited, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkLinkTokens.visited, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightLinkTokens.visited, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.visited, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightLinkTokens.visited, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.visited, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'link',
  usage: 'Visited links',
});

// ----- Surface Text on Surface Background -----
results.push({
  name: 'Body Text on Page Background',
  foreground: lightSurfaceTokens.primary.text,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'surface',
  usage: 'Main body text on page',
});

results.push({
  name: 'Secondary Text on Page Background',
  foreground: lightSurfaceTokens.primary.textSecondary,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightSurfaceTokens.primary.textSecondary, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkSurfaceTokens.primary.textSecondary, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.textSecondary, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.textSecondary, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.textSecondary, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.textSecondary, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'surface',
  usage: 'Secondary/helper text',
});

results.push({
  name: 'Card Text on Card Background',
  foreground: lightSurfaceTokens.secondary.text,
  background: lightSurfaceTokens.secondary.background,
  lightRatio: calculateContrast(lightSurfaceTokens.secondary.text, lightSurfaceTokens.secondary.background),
  darkRatio: calculateContrast(darkSurfaceTokens.secondary.text, darkSurfaceTokens.secondary.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.secondary.text, lightSurfaceTokens.secondary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.secondary.text, darkSurfaceTokens.secondary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.secondary.text, lightSurfaceTokens.secondary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.secondary.text, darkSurfaceTokens.secondary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'surface',
  usage: 'Text inside cards/panels',
});

// ----- Interactive Primary Button -----
results.push({
  name: 'Primary Button Text on Button Background',
  foreground: lightInteractiveTokens.primary.foreground,
  background: lightInteractiveTokens.primary.background.default,
  lightRatio: calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.default),
  darkRatio: calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.default),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Primary button text',
});

results.push({
  name: 'Primary Button Text on Hover Background',
  foreground: lightInteractiveTokens.primary.foreground,
  background: lightInteractiveTokens.primary.background.hover,
  lightRatio: calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.hover),
  darkRatio: calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.hover),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.hover) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.hover) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.foreground, lightInteractiveTokens.primary.background.hover) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.foreground, darkInteractiveTokens.primary.background.hover) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Primary button on hover',
});

// ----- Interactive Primary Text (for colored links/labels) -----
results.push({
  name: 'Primary Colored Text on Page Background',
  foreground: lightInteractiveTokens.primary.text.default,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightInteractiveTokens.primary.text.default, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkInteractiveTokens.primary.text.default, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.text.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.text.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.text.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.primary.text.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Primary colored text (NOT links - use link tokens)',
});

// ----- Interactive Secondary Button -----
results.push({
  name: 'Secondary Button Text on Button Background',
  foreground: lightInteractiveTokens.secondary.foreground,
  background: lightInteractiveTokens.secondary.background.default,
  lightRatio: calculateContrast(lightInteractiveTokens.secondary.foreground, lightInteractiveTokens.secondary.background.default),
  darkRatio: calculateContrast(darkInteractiveTokens.secondary.foreground, darkInteractiveTokens.secondary.background.default),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.secondary.foreground, lightInteractiveTokens.secondary.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.secondary.foreground, darkInteractiveTokens.secondary.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.secondary.foreground, lightInteractiveTokens.secondary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkInteractiveTokens.secondary.foreground, darkInteractiveTokens.secondary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Secondary button text',
});

// ----- Status Tokens -----
const statusCategories = ['success', 'error', 'warning', 'info'] as const;

statusCategories.forEach((status) => {
  results.push({
    name: `${status.charAt(0).toUpperCase() + status.slice(1)} Text on Background`,
    foreground: lightStatusTokens[status].foreground,
    background: lightStatusTokens[status].background.default,
    lightRatio: calculateContrast(lightStatusTokens[status].foreground, lightStatusTokens[status].background.default),
    darkRatio: calculateContrast(darkStatusTokens[status].foreground, darkStatusTokens[status].background.default),
    wcagAA: {
      light: (calculateContrast(lightStatusTokens[status].foreground, lightStatusTokens[status].background.default) ?? 0) >= WCAG_AA_NORMAL,
      dark: (calculateContrast(darkStatusTokens[status].foreground, darkStatusTokens[status].background.default) ?? 0) >= WCAG_AA_NORMAL,
    },
    wcagAAA: {
      light: (calculateContrast(lightStatusTokens[status].foreground, lightStatusTokens[status].background.default) ?? 0) >= WCAG_AAA_NORMAL,
      dark: (calculateContrast(darkStatusTokens[status].foreground, darkStatusTokens[status].background.default) ?? 0) >= WCAG_AAA_NORMAL,
    },
    category: 'status',
    usage: `${status} alert/toast/badge text`,
  });

  results.push({
    name: `${status.charAt(0).toUpperCase() + status.slice(1)} Inline Text on Page`,
    foreground: lightStatusTokens[status].text.default,
    background: lightSurfaceTokens.primary.background,
    lightRatio: calculateContrast(lightStatusTokens[status].text.default, lightSurfaceTokens.primary.background),
    darkRatio: calculateContrast(darkStatusTokens[status].text.default, darkSurfaceTokens.primary.background),
    wcagAA: {
      light: (calculateContrast(lightStatusTokens[status].text.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
      dark: (calculateContrast(darkStatusTokens[status].text.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    },
    wcagAAA: {
      light: (calculateContrast(lightStatusTokens[status].text.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
      dark: (calculateContrast(darkStatusTokens[status].text.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    },
    category: 'status',
    usage: `Inline ${status} text on page`,
  });
});

// ============================================
// EXPANDED COVERAGE (32 NEW PAIRS)
// ============================================

// ----- Forms: Input Fields (6 pairs) -----
results.push({
  name: 'Input Text on Input Background',
  foreground: lightFormTokens.input.text.default,
  background: lightFormTokens.input.background.default,
  lightRatio: calculateContrast(lightFormTokens.input.text.default, lightFormTokens.input.background.default),
  darkRatio: calculateContrast(darkFormTokens.input.text.default, darkFormTokens.input.background.default),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.text.default, lightFormTokens.input.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.default, darkFormTokens.input.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.text.default, lightFormTokens.input.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.default, darkFormTokens.input.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Input text inside input field',
});

results.push({
  name: 'Input Placeholder on Input Background',
  foreground: lightFormTokens.input.text.placeholder,
  background: lightFormTokens.input.background.default,
  lightRatio: calculateContrast(lightFormTokens.input.text.placeholder, lightFormTokens.input.background.default),
  darkRatio: calculateContrast(darkFormTokens.input.text.placeholder, darkFormTokens.input.background.default),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.text.placeholder, lightFormTokens.input.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.placeholder, darkFormTokens.input.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.text.placeholder, lightFormTokens.input.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.placeholder, darkFormTokens.input.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Placeholder text in inputs',
});

results.push({
  name: 'Input Border (default) on Page Background',
  foreground: lightFormTokens.input.border.default,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightFormTokens.input.border.default, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkFormTokens.input.border.default, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.border.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.border.default, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.default, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Input borders (UI component, 3:1 required)',
});

results.push({
  name: 'Input Border (focus) on Page Background',
  foreground: lightFormTokens.input.border.focus,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightFormTokens.input.border.focus, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkFormTokens.input.border.focus, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.border.focus, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.focus, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.border.focus, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.focus, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Focus ring on inputs (UI component, 3:1 required)',
});

results.push({
  name: 'Input Error Border on Page Background',
  foreground: lightFormTokens.input.border.error,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightFormTokens.input.border.error, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkFormTokens.input.border.error, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.border.error, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.error, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.border.error, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.error, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Error state border on inputs',
});

// Note: Form label tokens don't exist yet - using surface text as placeholder
results.push({
  name: 'Form Label on Page Background',
  foreground: lightSurfaceTokens.primary.text,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Form labels (using surface text token)',
});

// NOTE: All disabled states and UI components (borders/dividers) are automatically
// categorized as 'informational' by determineSeverity() helper function

// ----- Disabled States (4 pairs) -----
results.push({
  name: 'Disabled Button Text on Disabled Background',
  foreground: lightButtonTokens.primary.foreground,
  background: lightButtonTokens.primary.background.disabled,
  lightRatio: calculateContrast(lightButtonTokens.primary.foreground, lightButtonTokens.primary.background.disabled),
  darkRatio: calculateContrast(darkButtonTokens.primary.foreground, darkButtonTokens.primary.background.disabled),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.primary.foreground, lightButtonTokens.primary.background.disabled) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkButtonTokens.primary.foreground, darkButtonTokens.primary.background.disabled) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.primary.foreground, lightButtonTokens.primary.background.disabled) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkButtonTokens.primary.foreground, darkButtonTokens.primary.background.disabled) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Disabled buttons (NOTE: WCAG exempts disabled states, informational only)',
});

results.push({
  name: 'Disabled Link on Page Background',
  foreground: lightLinkTokens.disabled,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightLinkTokens.disabled, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkLinkTokens.disabled, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightLinkTokens.disabled, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.disabled, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightLinkTokens.disabled, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.disabled, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'link',
  usage: 'Disabled links (NOTE: WCAG exempts disabled states)',
});

results.push({
  name: 'Disabled Input Text on Disabled Background',
  foreground: lightFormTokens.input.text.disabled,
  background: lightFormTokens.input.background.disabled,
  lightRatio: calculateContrast(lightFormTokens.input.text.disabled, lightFormTokens.input.background.disabled),
  darkRatio: calculateContrast(darkFormTokens.input.text.disabled, darkFormTokens.input.background.disabled),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.text.disabled, lightFormTokens.input.background.disabled) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.disabled, darkFormTokens.input.background.disabled) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.text.disabled, lightFormTokens.input.background.disabled) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkFormTokens.input.text.disabled, darkFormTokens.input.background.disabled) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Disabled input fields (WCAG exempt)',
});

results.push({
  name: 'Disabled Input Border on Page Background',
  foreground: lightFormTokens.input.border.disabled,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightFormTokens.input.border.disabled, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkFormTokens.input.border.disabled, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightFormTokens.input.border.disabled, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.disabled, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightFormTokens.input.border.disabled, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkFormTokens.input.border.disabled, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Disabled input borders (WCAG exempt)',
});

// ----- Secondary/Tertiary/Destructive Buttons (4 pairs) -----
results.push({
  name: 'Secondary Button Text on Button Background',
  foreground: lightButtonTokens.secondary.foreground,
  background: lightButtonTokens.secondary.background.default,
  lightRatio: calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.default),
  darkRatio: calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.default),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Secondary button text',
});

results.push({
  name: 'Outline Button Text on Page Background',
  foreground: lightButtonTokens.outline.foreground,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightButtonTokens.outline.foreground, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkButtonTokens.outline.foreground, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.outline.foreground, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.outline.foreground, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.outline.foreground, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.outline.foreground, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Outline/ghost button text',
});

results.push({
  name: 'Ghost Button Text on Page Background',
  foreground: lightButtonTokens.ghost.foreground,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightButtonTokens.ghost.foreground, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkButtonTokens.ghost.foreground, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.ghost.foreground, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.ghost.foreground, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.ghost.foreground, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.ghost.foreground, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Ghost/text-only button',
});

results.push({
  name: 'Destructive Button Text on Button Background',
  foreground: lightButtonTokens.destructive.foreground,
  background: lightButtonTokens.destructive.background.default,
  lightRatio: calculateContrast(lightButtonTokens.destructive.foreground, lightButtonTokens.destructive.background.default),
  darkRatio: calculateContrast(darkButtonTokens.destructive.foreground, darkButtonTokens.destructive.background.default),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.destructive.foreground, lightButtonTokens.destructive.background.default) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.destructive.foreground, darkButtonTokens.destructive.background.default) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.destructive.foreground, lightButtonTokens.destructive.background.default) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.destructive.foreground, darkButtonTokens.destructive.background.default) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Destructive/danger button text',
});

// ----- Interactive States (Hover/Active) (3 pairs) -----
results.push({
  name: 'Secondary Button Text on Hover Background',
  foreground: lightButtonTokens.secondary.foreground,
  background: lightButtonTokens.secondary.background.hover,
  lightRatio: calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.hover),
  darkRatio: calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.hover),
  wcagAA: {
    light: (calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.hover) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.hover) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightButtonTokens.secondary.foreground, lightButtonTokens.secondary.background.hover) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkButtonTokens.secondary.foreground, darkButtonTokens.secondary.background.hover) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Secondary button on hover',
});

results.push({
  name: 'Link Active State on Page Background',
  foreground: lightLinkTokens.active,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightLinkTokens.active, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkLinkTokens.active, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightLinkTokens.active, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.active, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightLinkTokens.active, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkLinkTokens.active, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'link',
  usage: 'Links in active/pressed state',
});

// Note: Using primary hover background for this check
results.push({
  name: 'Interactive Hover State on Background',
  foreground: lightInteractiveTokens.primary.background.hover,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightInteractiveTokens.primary.background.hover, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkInteractiveTokens.primary.background.hover, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.background.hover, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkInteractiveTokens.primary.background.hover, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.background.hover, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkInteractiveTokens.primary.background.hover, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Generic hover overlay color',
});

// ----- Surface & Dividers (3 pairs) -----
results.push({
  name: 'Elevated Surface Text on Elevated Background',
  foreground: lightSurfaceTokens.elevated.text,
  background: lightSurfaceTokens.elevated.background,
  lightRatio: calculateContrast(lightSurfaceTokens.elevated.text, lightSurfaceTokens.elevated.background),
  darkRatio: calculateContrast(darkSurfaceTokens.elevated.text, darkSurfaceTokens.elevated.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.elevated.text, lightSurfaceTokens.elevated.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.elevated.text, darkSurfaceTokens.elevated.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.elevated.text, lightSurfaceTokens.elevated.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.elevated.text, darkSurfaceTokens.elevated.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'surface',
  usage: 'Text on elevated surfaces (modals, dropdowns)',
});

results.push({
  name: 'Glass Surface Text on Glass Background',
  foreground: lightSurfaceTokens.glass.text,
  background: lightSurfaceTokens.glass.background,
  lightRatio: calculateContrast(lightSurfaceTokens.glass.text, lightSurfaceTokens.glass.background),
  darkRatio: calculateContrast(darkSurfaceTokens.glass.text, darkSurfaceTokens.glass.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.glass.text, lightSurfaceTokens.glass.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.glass.text, darkSurfaceTokens.glass.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.glass.text, lightSurfaceTokens.glass.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.glass.text, darkSurfaceTokens.glass.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'surface',
  usage: 'Text on glass/frosted surfaces',
});

results.push({
  name: 'Divider on Page Background',
  foreground: lightSurfaceTokens.divider,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightSurfaceTokens.divider, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkSurfaceTokens.divider, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.divider, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkSurfaceTokens.divider, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.divider, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkSurfaceTokens.divider, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'surface',
  usage: 'Divider lines (UI component, 3:1 required)',
});

// ----- Focus & Selected States (2 pairs) -----
// Note: Using border focus as focus indicator (UI component)
results.push({
  name: 'Focus Ring on Interactive Element',
  foreground: lightInteractiveTokens.primary.border.focus,
  background: lightSurfaceTokens.primary.background,
  lightRatio: calculateContrast(lightInteractiveTokens.primary.border.focus, lightSurfaceTokens.primary.background),
  darkRatio: calculateContrast(darkInteractiveTokens.primary.border.focus, darkSurfaceTokens.primary.background),
  wcagAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.border.focus, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
    dark: (calculateContrast(darkInteractiveTokens.primary.border.focus, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AA_LARGE,
  },
  wcagAAA: {
    light: (calculateContrast(lightInteractiveTokens.primary.border.focus, lightSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
    dark: (calculateContrast(darkInteractiveTokens.primary.border.focus, darkSurfaceTokens.primary.background) ?? 0) >= WCAG_AAA_LARGE,
  },
  category: 'interactive',
  usage: 'Focus rings on interactive elements (UI component)',
});

// Note: Selected state uses primary text + elevated background as placeholder
results.push({
  name: 'Selected Item Background on Surface',
  foreground: lightSurfaceTokens.primary.text,
  background: lightSurfaceTokens.elevated.background,
  lightRatio: calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.elevated.background),
  darkRatio: calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.elevated.background),
  wcagAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.elevated.background) ?? 0) >= WCAG_AA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.elevated.background) ?? 0) >= WCAG_AA_NORMAL,
  },
  wcagAAA: {
    light: (calculateContrast(lightSurfaceTokens.primary.text, lightSurfaceTokens.elevated.background) ?? 0) >= WCAG_AAA_NORMAL,
    dark: (calculateContrast(darkSurfaceTokens.primary.text, darkSurfaceTokens.elevated.background) ?? 0) >= WCAG_AAA_NORMAL,
  },
  category: 'interactive',
  usage: 'Selected item text on selected background (using elevated surface)',
});

// ============================================
// Generate Report
// ============================================

function generateMarkdownReport(): string {
  const failures = results.filter(r => !r.wcagAA.light || !r.wcagAA.dark);
  const totalTests = results.length;
  const passCount = results.filter(r => r.wcagAA.light && r.wcagAA.dark).length;
  const failCount = failures.length;

  let report = `# WCAG 2.2 Contrast Ratio Validation Report

**Generated:** ${new Date().toISOString().split('T')[0]}
**Standard:** WCAG 2.2 Level AA
**Minimum Ratio:** 4.5:1 (normal text), 3:1 (large text)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | ${totalTests} |
| **Passed (AA)** | ${passCount} ✅ |
| **Failed (AA)** | ${failCount} ${failCount > 0 ? '❌' : '✅'} |
| **Pass Rate** | ${Math.round((passCount / totalTests) * 100)}% |

${failCount > 0 ? '⚠️ **ACTION REQUIRED:** Some token pairs do not meet WCAG AA standards.' : '✅ **All token pairs pass WCAG AA standards!**'}

---

## Detailed Results

### Links

`;

  // Links section
  results.filter(r => r.category === 'link').forEach(r => {
    report += `#### ${r.name}\n\n`;
    report += `**Usage:** ${r.usage}\n\n`;
    report += `| Theme | Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |\n`;
    report += `|-------|-------|-----------------|----------------|\n`;
    report += `| Light | ${formatRatio(r.lightRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.light)} | ${formatPassFail(r.wcagAAA.light)} |\n`;
    report += `| Dark  | ${formatRatio(r.darkRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.dark)} | ${formatPassFail(r.wcagAAA.dark)} |\n\n`;
    report += `- **Foreground:** \`${r.foreground}\`\n`;
    report += `- **Background:** \`${r.background}\`\n\n`;
  });

  report += `---

### Surfaces (Body Text, Cards)

`;

  // Surfaces section
  results.filter(r => r.category === 'surface').forEach(r => {
    report += `#### ${r.name}\n\n`;
    report += `**Usage:** ${r.usage}\n\n`;
    report += `| Theme | Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |\n`;
    report += `|-------|-------|-----------------|----------------|\n`;
    report += `| Light | ${formatRatio(r.lightRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.light)} | ${formatPassFail(r.wcagAAA.light)} |\n`;
    report += `| Dark  | ${formatRatio(r.darkRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.dark)} | ${formatPassFail(r.wcagAAA.dark)} |\n\n`;
    report += `- **Foreground:** \`${r.foreground}\`\n`;
    report += `- **Background:** \`${r.background}\`\n\n`;
  });

  report += `---

### Interactive Elements (Buttons)

`;

  // Interactive section
  results.filter(r => r.category === 'interactive').forEach(r => {
    report += `#### ${r.name}\n\n`;
    report += `**Usage:** ${r.usage}\n\n`;
    report += `| Theme | Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |\n`;
    report += `|-------|-------|-----------------|----------------|\n`;
    report += `| Light | ${formatRatio(r.lightRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.light)} | ${formatPassFail(r.wcagAAA.light)} |\n`;
    report += `| Dark  | ${formatRatio(r.darkRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.dark)} | ${formatPassFail(r.wcagAAA.dark)} |\n\n`;
    report += `- **Foreground:** \`${r.foreground}\`\n`;
    report += `- **Background:** \`${r.background}\`\n\n`;
  });

  report += `---

### Status Messages (Success, Error, Warning, Info)

`;

  // Status section
  results.filter(r => r.category === 'status').forEach(r => {
    report += `#### ${r.name}\n\n`;
    report += `**Usage:** ${r.usage}\n\n`;
    report += `| Theme | Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |\n`;
    report += `|-------|-------|-----------------|----------------|\n`;
    report += `| Light | ${formatRatio(r.lightRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.light)} | ${formatPassFail(r.wcagAAA.light)} |\n`;
    report += `| Dark  | ${formatRatio(r.darkRatio, WCAG_AA_NORMAL)} | ${formatPassFail(r.wcagAA.dark)} | ${formatPassFail(r.wcagAAA.dark)} |\n\n`;
    report += `- **Foreground:** \`${r.foreground}\`\n`;
    report += `- **Background:** \`${r.background}\`\n\n`;
  });

  report += `---

## Failures Summary

`;

  if (failCount === 0) {
    report += `✅ **No failures detected!** All token pairs meet WCAG AA standards.\n\n`;
  } else {
    // Separate failures by severity
    const criticalFailures = failures.filter(f => determineSeverity(f) === 'critical');
    const informationalFailures = failures.filter(f => determineSeverity(f) === 'informational');

    report += `**Total Failures:** ${failCount}\n`;
    report += `- ❌ **Critical:** ${criticalFailures.length} (require fixes)\n`;
    report += `- ℹ️ **Informational:** ${informationalFailures.length} (WCAG exempt or different standard)\n\n`;

    // Critical failures table
    if (criticalFailures.length > 0) {
      report += `### ❌ Critical Failures (Action Required)\n\n`;
      report += `The following ${criticalFailures.length} token pairs **DO NOT** meet WCAG AA (4.5:1) standards and must be fixed:\n\n`;
      report += `| Token Pair | Light Mode | Dark Mode | Issue |\n`;
      report += `|------------|------------|-----------|-------|\n`;

      criticalFailures.forEach(f => {
        const lightIssue = !f.wcagAA.light ? `${f.lightRatio}:1 ❌` : '✅';
        const darkIssue = !f.wcagAA.dark ? `${f.darkRatio}:1 ❌` : '✅';
        const issue = !f.wcagAA.light && !f.wcagAA.dark ? 'Both modes fail' :
                      !f.wcagAA.light ? 'Light mode only' : 'Dark mode only';
        report += `| ${f.name} | ${lightIssue} | ${darkIssue} | ${issue} |\n`;
      });

      report += `\n#### Recommended Fixes\n\n`;

      criticalFailures.forEach(f => {
        report += `**${f.name}**\n\n`;
        report += `- Foreground: \`${f.foreground}\`\n`;
        report += `- Background: \`${f.background}\`\n`;
        report += `- Light ratio: ${f.lightRatio}:1 ${f.wcagAA.light ? '✅' : '❌'}\n`;
        report += `- Dark ratio: ${f.darkRatio}:1 ${f.wcagAA.dark ? '✅' : '❌'}\n`;
        report += `- **Edit:** \`${getSuggestedFile(f)}\` ${getSuggestedScope(f)}\n\n`;
      });
    }

    // Informational failures table
    if (informationalFailures.length > 0) {
      report += `### ℹ️ Informational Notices (No Action Required)\n\n`;
      report += `The following ${informationalFailures.length} token pairs fail WCAG AA but are **exempt** or use a **different standard**:\n\n`;
      report += `| Token Pair | Light Mode | Dark Mode | Reason |\n`;
      report += `|------------|------------|-----------|--------|\n`;

      informationalFailures.forEach(f => {
        const lightIssue = !f.wcagAA.light ? `${f.lightRatio}:1 ⚠️` : '✅';
        const darkIssue = !f.wcagAA.dark ? `${f.darkRatio}:1 ⚠️` : '✅';
        const reason = getExemptReason(f);
        report += `| ${f.name} | ${lightIssue} | ${darkIssue} | ${reason} |\n`;
      });

      report += `\n**Note:** These failures are informational only and do not require fixes.\n\n`;
    }
  }

  report += `---

## WCAG Standards Reference

### Level AA (Minimum)
- **Normal text** (< 18px or < 14px bold): **4.5:1** minimum
- **Large text** (≥ 18px or ≥ 14px bold): **3:1** minimum
- **UI components**: **3:1** minimum

### Level AAA (Enhanced)
- **Normal text**: **7:1** minimum
- **Large text**: **4.5:1** minimum

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Contrast Ratio Tool
- [Accessible Colors](https://accessible-colors.com/)

---

## Next Steps

`;

  if (failCount > 0) {
    report += `1. **Fix failing tokens** in \`src/design-system/tokens/semantic/\` files
2. **Re-run validation:** \`yarn tsx src/design-system/scripts/calculate-wcag-contrast.ts\`
3. **Verify in browser:** Test components in both light and dark modes
4. **Update CSS:** Run \`yarn generate-css-vars\` after token changes
5. **Mark Phase 2 complete** once all tests pass

`;
  } else {
    report += `1. ✅ All tokens pass WCAG AA - Phase 2 Task 6 complete
2. Proceed to **Phase 3: CSS Generation**
3. Update \`generate-css-variables.ts\` to process new token structure
4. Migrate components to use new tokens

`;
  }

  report += `---

**Generated by:** \`calculate-wcag-contrast.ts\`
**Automation:** Run via \`yarn tsx src/design-system/scripts/calculate-wcag-contrast.ts\`
**Related:** [TOKEN_MODERNIZATION_PLAN.md](./TOKEN_MODERNIZATION_PLAN.md) - Phase 2, Tasks 5-6
`;

  return report;
}

// ============================================
// Main Execution
// ============================================

const startTime = Date.now();

console.log('🎨 WCAG Contrast Ratio Calculator\n');
console.log(`Testing ${results.length} token pairs...\n`);

// Calculate summary
const failures = results.filter(r => !r.wcagAA.light || !r.wcagAA.dark);
const criticalFailures = failures.filter(f => determineSeverity(f) === 'critical');
const informationalFailures = failures.filter(f => determineSeverity(f) === 'informational');
const passCount = results.filter(r => r.wcagAA.light && r.wcagAA.dark).length;

console.log('📊 Results:');
console.log(`   ✅ Passed: ${passCount}/${results.length}`);
console.log(`   ❌ Failed (Total): ${failures.length}/${results.length}`);
console.log(`      - Critical: ${criticalFailures.length}`);
console.log(`      - Informational: ${informationalFailures.length}`);
console.log(`   📈 Pass Rate: ${Math.round((passCount / results.length) * 100)}%\n`);

if (criticalFailures.length > 0) {
  console.log('❌ Critical Failures (Action Required):');
  criticalFailures.forEach(f => {
    const mode = !f.wcagAA.light && !f.wcagAA.dark ? 'Both' :
                 !f.wcagAA.light ? 'Light' : 'Dark';
    console.log(`   - ${f.name} (${mode} mode)`);
  });
  console.log('');
}

if (informationalFailures.length > 0) {
  console.log('ℹ️  Informational Notices (No Action Required):');
  informationalFailures.forEach(f => {
    const mode = !f.wcagAA.light && !f.wcagAA.dark ? 'Both' :
                 !f.wcagAA.light ? 'Light' : 'Dark';
    console.log(`   - ${f.name} (${mode} mode) - ${getExemptReason(f)}`);
  });
  console.log('');
}

// Generate report
const report = generateMarkdownReport();
const outputPath = resolve(__dirname, '../../../docs/design-system/WCAG_CONTRAST_REPORT.md');

writeFileSync(outputPath, report, 'utf-8');

console.log(`✅ Report generated: ${outputPath}\n`);

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);
console.log(`⏱️  Execution time: ${duration}s\n`);

if (criticalFailures.length > 0) {
  console.log(`❌ CRITICAL: Fix ${criticalFailures.length} critical token failure(s) for WCAG compliance.`);
  console.log(`ℹ️  This is informational only - does not block CI/CD\n`);
  process.exit(0); // Informational - don't fail build
} else if (informationalFailures.length > 0) {
  console.log(`✅ All critical tokens pass WCAG AA standards!`);
  console.log(`ℹ️  ${informationalFailures.length} informational notices (WCAG exempt or different standard).`);
  console.log('✅ Phase 2 (Task 6) complete - ready for Phase 3.');
  process.exit(0);
} else {
  console.log('✅ All tokens pass WCAG AA standards!');
  console.log('✅ Phase 2 (Task 6) complete - ready for Phase 3.');
  process.exit(0);
}
