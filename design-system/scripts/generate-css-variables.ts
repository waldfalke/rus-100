/**
 * Generate CSS Variables from Design Tokens
 *
 * This script reads TypeScript design tokens and generates CSS variables
 * that are used by Tailwind and shadcn-ui components.
 *
 * Purpose:
 * - Auto-sync tokens → CSS variables
 * - Eliminate manual CSS updates
 * - Single source of truth (TypeScript tokens)
 *
 * Usage:
 * ```bash
 * yarn generate-css-vars
 * ```
 *
 * Integration:
 * - Runs automatically before dev/build (via package.json scripts)
 * - Output: src/styles/design-tokens.generated.css
 * - Import in globals.css: @import "./design-tokens.generated.css";
 */

import * as fs from 'fs';
import * as path from 'path';
// New property-based tokens (v2.0)
import {
  lightInteractiveTokens,
  darkInteractiveTokens,
  lightLinkTokens,
  darkLinkTokens,
  lightSurfaceTokens,
  darkSurfaceTokens,
  lightStatusTokens,
  darkStatusTokens,
  lightTypographyTokens,
  darkTypographyTokens,
  lightButtonTokens,
  darkButtonTokens,
  lightBadgeTokens,
  darkBadgeTokens,
  lightFormTokens,
  darkFormTokens,
} from '../tokens/semantic';
// Component overrides (Tier 3 - exceptional cases only)
import { componentOverrides } from '../tokens/component-overrides';
// Primitive tokens
import {
  primitiveFontFamilies,
  primitiveFontSizes,
  primitiveFontWeights,
  primitiveLineHeights,
  primitiveLetterSpacing,
} from '../tokens/primitives/typography';
import { primitiveSpacing, primitiveSizes } from '../tokens/primitives/spacing';
import {
  primitiveBorderWidths,
  primitiveBorderRadii,
  primitiveRingWidths,
  primitiveRingOffsetWidths,
} from '../tokens/primitives/borders';
import { primitiveShadows } from '../tokens/primitives/shadows';
import {
  primitiveAnimationDurations,
  primitiveAnimationEasings,
  primitiveZIndices,
} from '../tokens/primitives/animations';

const OUTPUT_FILE = path.join(process.cwd(), 'src/styles/design-tokens.generated.css');

// ============================================
// CSS GENERATION
// ============================================

function generateCSSVariables(): string {
  const timestamp = new Date().toISOString();

  let css = `/**
 * Design System CSS Variables (v2.0)
 *
 * ⚠️  AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated: ${timestamp}
 * Source: src/design-system/tokens/semantic/ (property-based tokens)
 *   - interactive.ts (buttons, badges, CTAs)
 *   - links.ts (hyperlinks)
 *   - surfaces.ts (backgrounds, cards, panels)
 *   - status.ts (success, error, warning, info)
 *
 * To regenerate: yarn generate-css-vars
 * Documentation: docs/design-system/TOKEN_MODERNIZATION_PLAN.md
 */

@layer base {
  /* ========================================
     LIGHT THEME (Default)
     ======================================== */
  :root {
`;

  // ============================================
  // SHADCN-UI COMPATIBILITY LAYER
  // Auto-mapped from design system tokens
  // ============================================

  css += `    /* ========================================\n`;
  css += `       shadcn-ui Compatibility Layer\n`;
  css += `       Auto-mapped from design system tokens\n`;
  css += `       ======================================== */\n\n`;

  // Background & Foreground (base page colors)
  css += `    /* Base colors */\n`;
  css += `    --background: ${lightSurfaceTokens.primary.background}; /* Page background */\n`;
  css += `    --foreground: ${lightSurfaceTokens.primary.text}; /* Page text */\n\n`;

  // Card (elevated surfaces)
  css += `    /* Card component */\n`;
  css += `    --card: ${lightSurfaceTokens.elevated.background}; /* Card background */\n`;
  css += `    --card-foreground: ${lightSurfaceTokens.elevated.text}; /* Card text */\n\n`;

  // Popover (floating UI)
  css += `    /* Popover component */\n`;
  css += `    --popover: ${lightSurfaceTokens.elevated.background}; /* Popover background */\n`;
  css += `    --popover-foreground: ${lightSurfaceTokens.elevated.text}; /* Popover text */\n\n`;

  // Primary (main brand actions)
  css += `    /* Primary actions (buttons, links) */\n`;
  css += `    --primary: ${lightInteractiveTokens.primary.background.default}; /* Primary button bg */\n`;
  css += `    --primary-foreground: ${lightInteractiveTokens.primary.foreground}; /* Primary button text */\n\n`;

  // Secondary (alternative actions)
  css += `    /* Secondary actions */\n`;
  css += `    --secondary: ${lightInteractiveTokens.secondary.background.default}; /* Secondary button bg */\n`;
  css += `    --secondary-foreground: ${lightInteractiveTokens.secondary.foreground}; /* Secondary button text */\n\n`;

  // Muted (subtle backgrounds)
  css += `    /* Muted (subtle backgrounds) */\n`;
  css += `    --muted: ${lightSurfaceTokens.secondary.background}; /* Muted background */\n`;
  css += `    --muted-foreground: ${lightSurfaceTokens.secondary.textSecondary}; /* Muted text */\n\n`;

  // Accent (subtle highlights for ghost/hover states)
  // NOTE: Using secondary tokens instead of accent to avoid aggressive red color
  // In shadcn-ui, --accent is for subtle hover states (ghost buttons, etc.)
  // Our brand.accent is red, which is too aggressive for this purpose
  css += `    /* Accent (subtle highlights for ghost/hover states) */\n`;
  css += `    --accent: ${lightInteractiveTokens.secondary.background.hover}; /* Subtle hover bg (light gray) */\n`;
  css += `    --accent-foreground: ${lightInteractiveTokens.secondary.foreground}; /* Dark gray text */\n\n`;

  // Destructive (errors, dangerous actions)
  css += `    /* Destructive (errors, dangerous actions) */\n`;
  css += `    --destructive: ${lightStatusTokens.error.text.default}; /* Error button bg (dark red) */\n`;
  css += `    --destructive-foreground: ${lightSurfaceTokens.elevated.background}; /* White text on red */\n\n`;

  // Borders and inputs
  css += `    /* Borders and inputs */\n`;
  css += `    --border: ${lightSurfaceTokens.primary.border}; /* Border color */\n`;
  css += `    --input: ${lightSurfaceTokens.primary.border}; /* Input border */\n`;
  css += `    --ring: ${lightInteractiveTokens.primary.border.focus}; /* Focus ring */\n\n`;

  // Form tokens (input placeholder, etc.)
  css += `    /* Form element tokens */\n`;
  css += `    --form-input-text-placeholder: ${lightFormTokens.input.text.placeholder}; /* Input placeholder text */\n\n`;

  // Sidebar tokens (optional - for Sidebar component)
  css += `    /* Sidebar component tokens (optional) */\n`;
  css += `    --sidebar: ${lightSurfaceTokens.elevated.background}; /* Sidebar background */\n`;
  css += `    --sidebar-foreground: ${lightSurfaceTokens.elevated.text}; /* Sidebar text */\n`;
  css += `    --sidebar-primary: ${lightInteractiveTokens.primary.background.default}; /* Sidebar primary accent */\n`;
  css += `    --sidebar-primary-foreground: ${lightInteractiveTokens.primary.foreground}; /* Sidebar primary text */\n`;
  css += `    --sidebar-accent: ${lightInteractiveTokens.secondary.background.hover}; /* Sidebar secondary accent */\n`;
  css += `    --sidebar-accent-foreground: ${lightInteractiveTokens.secondary.foreground}; /* Sidebar accent text */\n`;
  css += `    --sidebar-border: ${lightSurfaceTokens.elevated.border}; /* Sidebar border */\n`;
  css += `    --sidebar-ring: ${lightInteractiveTokens.primary.border.focus}; /* Sidebar focus ring */\n\n`;

  // Chart tokens (optional - for Chart component)
  css += `    /* Chart component tokens (optional) */\n`;
  css += `    --chart-1: oklch(0.646 0.222 41.116); /* Chart color 1 */\n`;
  css += `    --chart-2: oklch(0.6 0.118 184.704); /* Chart color 2 */\n`;
  css += `    --chart-3: oklch(0.398 0.07 227.392); /* Chart color 3 */\n`;
  css += `    --chart-4: oklch(0.828 0.189 84.429); /* Chart color 4 */\n`;
  css += `    --chart-5: oklch(0.769 0.188 70.08); /* Chart color 5 */\n\n`;

  // NEW: Interactive tokens (v2.0 - property-based)
  css += `    /* ========================================\n`;
  css += `       Interactive Tokens (v2.0)\n`;
  css += `       Property-based: text, background, foreground, border\n`;
  css += `       ======================================== */\n\n`;

  // Interactive Primary
  css += `    /* Interactive Primary */\n`;
  css += `    --interactive-primary-text: ${lightInteractiveTokens.primary.text.default};\n`;
  css += `    --interactive-primary-text-hover: ${lightInteractiveTokens.primary.text.hover};\n`;
  css += `    --interactive-primary-bg: ${lightInteractiveTokens.primary.background.default};\n`;
  css += `    --interactive-primary-bg-hover: ${lightInteractiveTokens.primary.background.hover};\n`;
  css += `    --interactive-primary-fg: ${lightInteractiveTokens.primary.foreground};\n`;
  css += `    --interactive-primary-border: ${lightInteractiveTokens.primary.border.default};\n`;
  css += `    --interactive-primary-border-focus: ${lightInteractiveTokens.primary.border.focus};\n\n`;

  // Interactive Secondary
  css += `    /* Interactive Secondary */\n`;
  css += `    --interactive-secondary-text: ${lightInteractiveTokens.secondary.text.default};\n`;
  css += `    --interactive-secondary-text-hover: ${lightInteractiveTokens.secondary.text.hover};\n`;
  css += `    --interactive-secondary-bg: ${lightInteractiveTokens.secondary.background.default};\n`;
  css += `    --interactive-secondary-bg-hover: ${lightInteractiveTokens.secondary.background.hover};\n`;
  css += `    --interactive-secondary-fg: ${lightInteractiveTokens.secondary.foreground};\n`;
  css += `    --interactive-secondary-border: ${lightInteractiveTokens.secondary.border.default};\n`;
  css += `    --interactive-secondary-border-focus: ${lightInteractiveTokens.secondary.border.focus};\n\n`;

  // Interactive Tertiary
  css += `    /* Interactive Tertiary */\n`;
  css += `    --interactive-tertiary-text: ${lightInteractiveTokens.tertiary.text.default};\n`;
  css += `    --interactive-tertiary-text-hover: ${lightInteractiveTokens.tertiary.text.hover};\n`;
  css += `    --interactive-tertiary-bg: ${lightInteractiveTokens.tertiary.background.default};\n`;
  css += `    --interactive-tertiary-bg-hover: ${lightInteractiveTokens.tertiary.background.hover};\n`;
  css += `    --interactive-tertiary-fg: ${lightInteractiveTokens.tertiary.foreground};\n`;
  css += `    --interactive-tertiary-border: ${lightInteractiveTokens.tertiary.border.default};\n`;
  css += `    --interactive-tertiary-border-focus: ${lightInteractiveTokens.tertiary.border.focus};\n\n`;

  // Interactive Accent
  css += `    /* Interactive Accent */\n`;
  css += `    --interactive-accent-text: ${lightInteractiveTokens.accent.text.default};\n`;
  css += `    --interactive-accent-text-hover: ${lightInteractiveTokens.accent.text.hover};\n`;
  css += `    --interactive-accent-text-active: ${lightInteractiveTokens.accent.text.active};\n`;
  css += `    --interactive-accent-bg: ${lightInteractiveTokens.accent.background.default};\n`;
  css += `    --interactive-accent-bg-hover: ${lightInteractiveTokens.accent.background.hover};\n`;
  css += `    --interactive-accent-bg-active: ${lightInteractiveTokens.accent.background.active};\n`;
  css += `    --interactive-accent-fg: ${lightInteractiveTokens.accent.foreground};\n`;
  css += `    --interactive-accent-border: ${lightInteractiveTokens.accent.border.default};\n`;
  css += `    --interactive-accent-border-hover: ${lightInteractiveTokens.accent.border.hover};\n`;
  css += `    --interactive-accent-border-focus: ${lightInteractiveTokens.accent.border.focus};\n\n`;

  // Link tokens
  css += `    /* Link Tokens (dedicated for hyperlinks) */\n`;
  css += `    --link: ${lightLinkTokens.default};\n`;
  css += `    --link-hover: ${lightLinkTokens.hover};\n`;
  css += `    --link-visited: ${lightLinkTokens.visited};\n`;
  css += `    --link-active: ${lightLinkTokens.active};\n\n`;

  // Surface tokens
  css += `    /* Surface Tokens (backgrounds, cards, panels) */\n`;
  css += `    --surface-primary-bg: ${lightSurfaceTokens.primary.background};\n`;
  css += `    --surface-primary-text: ${lightSurfaceTokens.primary.text};\n`;
  css += `    --surface-primary-text-secondary: ${lightSurfaceTokens.primary.textSecondary};\n`;
  css += `    --surface-primary-border: ${lightSurfaceTokens.primary.border};\n`;
  css += `    --surface-secondary-bg: ${lightSurfaceTokens.secondary.background};\n`;
  css += `    --surface-secondary-text: ${lightSurfaceTokens.secondary.text};\n`;
  css += `    --surface-secondary-text-secondary: ${lightSurfaceTokens.secondary.textSecondary};\n`;
  css += `    --surface-secondary-border: ${lightSurfaceTokens.secondary.border};\n`;
  css += `    --surface-elevated-bg: ${lightSurfaceTokens.elevated.background};\n`;
  css += `    --surface-elevated-text: ${lightSurfaceTokens.elevated.text};\n`;
  css += `    --surface-overlay: ${lightSurfaceTokens.overlay};\n`;
  css += `    --surface-glass-bg: ${lightSurfaceTokens.glass.background};\n`;
  css += `    --surface-glass-text: ${lightSurfaceTokens.glass.text};\n`;
  css += `    --surface-glass-border: ${lightSurfaceTokens.glass.border};\n`;
  css += `    --surface-glass-blur: ${lightSurfaceTokens.glass.blur};\n`;
  css += `    --surface-divider: ${lightSurfaceTokens.divider};\n\n`;

  // Status tokens
  css += `    /* Status Tokens (success, error, warning, info) */\n`;
  css += `    --status-success-text: ${lightStatusTokens.success.text.default};\n`;
  css += `    --status-success-text-hover: ${lightStatusTokens.success.text.hover};\n`;
  css += `    --status-success-bg: ${lightStatusTokens.success.background.default};\n`;
  css += `    --status-success-bg-hover: ${lightStatusTokens.success.background.hover};\n`;
  css += `    --status-success-fg: ${lightStatusTokens.success.foreground};\n`;
  css += `    --status-success-border: ${lightStatusTokens.success.border};\n`;
  css += `    --status-error-text: ${lightStatusTokens.error.text.default};\n`;
  css += `    --status-error-text-hover: ${lightStatusTokens.error.text.hover};\n`;
  css += `    --status-error-bg: ${lightStatusTokens.error.background.default};\n`;
  css += `    --status-error-bg-hover: ${lightStatusTokens.error.background.hover};\n`;
  css += `    --status-error-fg: ${lightStatusTokens.error.foreground};\n`;
  css += `    --status-error-border: ${lightStatusTokens.error.border};\n`;
  css += `    --status-warning-text: ${lightStatusTokens.warning.text.default};\n`;
  css += `    --status-warning-text-hover: ${lightStatusTokens.warning.text.hover};\n`;
  css += `    --status-warning-bg: ${lightStatusTokens.warning.background.default};\n`;
  css += `    --status-warning-bg-hover: ${lightStatusTokens.warning.background.hover};\n`;
  css += `    --status-warning-fg: ${lightStatusTokens.warning.foreground};\n`;
  css += `    --status-warning-border: ${lightStatusTokens.warning.border};\n`;
  css += `    --status-info-text: ${lightStatusTokens.info.text.default};\n`;
  css += `    --status-info-text-hover: ${lightStatusTokens.info.text.hover};\n`;
  css += `    --status-info-bg: ${lightStatusTokens.info.background.default};\n`;
  css += `    --status-info-bg-hover: ${lightStatusTokens.info.background.hover};\n`;
  css += `    --status-info-fg: ${lightStatusTokens.info.foreground};\n`;
  css += `    --status-info-border: ${lightStatusTokens.info.border};\n\n`;

  // Component Overrides (Tier 3 - exceptional cases only)
  if (Object.keys(componentOverrides).length > 0) {
    css += `    /* ========================================\n`;
    css += `       Component Override Tokens (Tier 3)\n`;
    css += `       ⚠️ EXCEPTIONAL CASES ONLY (5-10%)\n`;
    css += `       Component-specific tokens that cannot use semantic tokens\n`;
    css += `       ======================================== */\n\n`;

    // Recursively flatten component overrides
    const flattenOverrides = (obj: any, prefix = 'override') => {
      Object.entries(obj).forEach(([key, value]) => {
        const cssKey = `${prefix}-${key}`;
        if (typeof value === 'string' || typeof value === 'number') {
          css += `    --${cssKey}: ${value};\n`;
        } else if (value && typeof value === 'object') {
          flattenOverrides(value, cssKey);
        }
      });
    };

    flattenOverrides(componentOverrides);
    css += `\n`;
  }

  // Typography tokens
  css += `    /* ========================================\n`;
  css += `       Typography Tokens\n`;
  css += `       ======================================== */\n\n`;

  css += `    /* Font Families */\n`;
  Object.entries(primitiveFontFamilies).forEach(([key, value]) => {
    css += `    --font-${key}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Font Sizes (converted to rem) */\n`;
  Object.entries(primitiveFontSizes).forEach(([key, value]) => {
    const remSize = (value.size / 16).toFixed(4);
    const remLineHeight = (value.lineHeight / 16).toFixed(4);
    css += `    --font-size-${key}: ${remSize}rem;\n`;
    css += `    --line-height-${key}: ${remLineHeight}rem;\n`;
  });
  css += `\n`;

  css += `    /* Font Weights */\n`;
  Object.entries(primitiveFontWeights).forEach(([key, value]) => {
    css += `    --font-weight-${key}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Letter Spacing */\n`;
  Object.entries(primitiveLetterSpacing).forEach(([key, value]) => {
    css += `    --letter-spacing-${key}: ${value};\n`;
  });
  css += `\n`;

  // Semantic Typography Tokens (v2.0)
  css += `    /* ========================================\n`;
  css += `       Semantic Typography Tokens (v2.0)\n`;
  css += `       Usage-based combinations for specific contexts\n`;
  css += `       ======================================== */\n\n`;

  // Helper function to flatten nested objects
  const flattenTypography = (obj: any, prefix = 'typography') => {
    const result: Array<[string, any]> = [];
    Object.entries(obj).forEach(([key, value]) => {
      const cssKey = `${prefix}-${key}`;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Check if it's a token object (has family/size/weight properties)
        if ('family' in value || 'size' in value || 'weight' in value) {
          result.push([cssKey, value]);
        } else {
          // Recurse deeper
          result.push(...flattenTypography(value, cssKey));
        }
      }
    });
    return result;
  };

  const flatTokens = flattenTypography(lightTypographyTokens);
  flatTokens.forEach(([cssKey, value]) => {
    if (value.family) css += `    --${cssKey}-family: ${value.family};\n`;
    if (value.size !== undefined) {
      const remSize = (value.size / 16).toFixed(4);
      css += `    --${cssKey}-size: ${remSize}rem;\n`;
    }
    if (value.lineHeight !== undefined) {
      const remLineHeight = (value.lineHeight / 16).toFixed(4);
      css += `    --${cssKey}-line-height: ${remLineHeight}rem;\n`;
    }
    if (value.weight) css += `    --${cssKey}-weight: ${value.weight};\n`;
    if (value.letterSpacing) css += `    --${cssKey}-letter-spacing: ${value.letterSpacing};\n`;
    if (value.decoration) {
      if (typeof value.decoration === 'object') {
        if (value.decoration.default) css += `    --${cssKey}-decoration: ${value.decoration.default};\n`;
        if (value.decoration.hover) css += `    --${cssKey}-decoration-hover: ${value.decoration.hover};\n`;
      } else {
        css += `    --${cssKey}-decoration: ${value.decoration};\n`;
      }
    }
  });
  css += `\n`;

  // Spacing tokens
  css += `    /* ========================================\n`;
  css += `       Spacing Tokens\n`;
  css += `       ======================================== */\n\n`;

  Object.entries(primitiveSpacing).forEach(([key, value]) => {
    if (typeof value === 'number') {
      const remValue = (value / 16).toFixed(4);
      css += `    --space-${key}: ${remValue}rem;\n`;
    } else {
      css += `    --space-${key}: ${value};\n`;
    }
  });
  css += `\n`;

  css += `    /* Sizes */\n`;
  Object.entries(primitiveSizes).forEach(([key, value]) => {
    if (typeof value === 'number') {
      const remValue = (value / 16).toFixed(4);
      css += `    --size-${key}: ${remValue}rem;\n`;
    } else if (typeof value === 'string' && !primitiveSpacing[key as keyof typeof primitiveSpacing]) {
      css += `    --size-${key}: ${value};\n`;
    }
  });
  css += `\n`;

  // Border tokens
  css += `    /* ========================================\n`;
  css += `       Border Tokens\n`;
  css += `       ======================================== */\n\n`;

  css += `    /* Border Widths */\n`;
  Object.entries(primitiveBorderWidths).forEach(([key, value]) => {
    const cssKey = key === 'DEFAULT' ? 'border-width' : `border-width-${key}`;
    css += `    --${cssKey}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Border Radii */\n`;
  Object.entries(primitiveBorderRadii).forEach(([key, value]) => {
    const cssKey = key === 'DEFAULT' ? 'radius-default' : `radius-${key}`;
    css += `    --${cssKey}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Ring Widths */\n`;
  Object.entries(primitiveRingWidths).forEach(([key, value]) => {
    const cssKey = key === 'DEFAULT' ? 'ring-width' : `ring-width-${key}`;
    css += `    --${cssKey}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Ring Offset Widths */\n`;
  Object.entries(primitiveRingOffsetWidths).forEach(([key, value]) => {
    css += `    --ring-offset-${key}: ${value};\n`;
  });
  css += `\n`;

  // Shadow tokens
  css += `    /* ========================================\n`;
  css += `       Shadow Tokens\n`;
  css += `       ======================================== */\n\n`;

  Object.entries(primitiveShadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      css += `    --shadow-${key}: ${value};\n`;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        css += `    --shadow-${key}-${subKey}: ${subValue};\n`;
      });
    }
  });
  css += `\n`;

  // Animation tokens
  css += `    /* ========================================\n`;
  css += `       Animation Tokens\n`;
  css += `       ======================================== */\n\n`;

  css += `    /* Animation Durations */\n`;
  Object.entries(primitiveAnimationDurations).forEach(([key, value]) => {
    css += `    --duration-${key}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Animation Easings */\n`;
  Object.entries(primitiveAnimationEasings).forEach(([key, value]) => {
    css += `    --ease-${key}: ${value};\n`;
  });
  css += `\n`;

  css += `    /* Z-Indices */\n`;
  Object.entries(primitiveZIndices).forEach(([key, value]) => {
    css += `    --z-${key}: ${value};\n`;
  });
  css += `\n`;

  css += `  }

  /* ========================================
     DARK THEME (Explicit)
     Activated via .dark class on html/body

     NOTE: We do NOT use @media (prefers-color-scheme: dark)
     because we want explicit control via .dark class only.
     This prevents system theme from overriding user choice.
     ======================================== */
  .dark {
`;

  // ============================================
  // SHADCN-UI COMPATIBILITY LAYER - DARK THEME
  // Auto-mapped from design system tokens
  // ============================================

  css += `    /* ========================================\n`;
  css += `       shadcn-ui Compatibility Layer - DARK THEME\n`;
  css += `       Auto-mapped from design system tokens\n`;
  css += `       ======================================== */\n\n`;

  // Background & Foreground (base page colors)
  css += `    /* Base colors */\n`;
  css += `    --background: ${darkSurfaceTokens.primary.background}; /* Page background */\n`;
  css += `    --foreground: ${darkSurfaceTokens.primary.text}; /* Page text */\n\n`;

  // Card (elevated surfaces)
  css += `    /* Card component */\n`;
  css += `    --card: ${darkSurfaceTokens.elevated.background}; /* Card background */\n`;
  css += `    --card-foreground: ${darkSurfaceTokens.elevated.text}; /* Card text */\n\n`;

  // Popover (floating UI)
  css += `    /* Popover component */\n`;
  css += `    --popover: ${darkSurfaceTokens.elevated.background}; /* Popover background */\n`;
  css += `    --popover-foreground: ${darkSurfaceTokens.elevated.text}; /* Popover text */\n\n`;

  // Primary (main brand actions)
  css += `    /* Primary actions (buttons, links) */\n`;
  css += `    --primary: ${darkInteractiveTokens.primary.background.default}; /* Primary button bg */\n`;
  css += `    --primary-foreground: ${darkInteractiveTokens.primary.foreground}; /* Primary button text */\n\n`;

  // Secondary (alternative actions)
  css += `    /* Secondary actions */\n`;
  css += `    --secondary: ${darkInteractiveTokens.secondary.background.default}; /* Secondary button bg */\n`;
  css += `    --secondary-foreground: ${darkInteractiveTokens.secondary.foreground}; /* Secondary button text */\n\n`;

  // Muted (subtle backgrounds)
  css += `    /* Muted (subtle backgrounds) */\n`;
  css += `    --muted: ${darkSurfaceTokens.secondary.background}; /* Muted background */\n`;
  css += `    --muted-foreground: ${darkSurfaceTokens.secondary.textSecondary}; /* Muted text */\n\n`;

  // Accent (subtle highlights for ghost/hover states)
  // NOTE: Using secondary tokens instead of accent to avoid aggressive red color
  // In shadcn-ui, --accent is for subtle hover states (ghost buttons, etc.)
  // Our brand.accent is red, which is too aggressive for this purpose
  css += `    /* Accent (subtle highlights for ghost/hover states) */\n`;
  css += `    --accent: ${darkInteractiveTokens.secondary.background.hover}; /* Subtle hover bg (lighter gray) */\n`;
  css += `    --accent-foreground: ${darkInteractiveTokens.secondary.foreground}; /* Light gray text */\n\n`;

  // Destructive (errors, dangerous actions)
  css += `    /* Destructive (errors, dangerous actions) */\n`;
  css += `    --destructive: ${darkStatusTokens.error.text.default}; /* Error button bg (lighter red for dark mode) */\n`;
  css += `    --destructive-foreground: ${darkSurfaceTokens.elevated.background}; /* Dark bg text on red */\n\n`;

  // Borders and inputs
  css += `    /* Borders and inputs */\n`;
  css += `    --border: ${darkSurfaceTokens.primary.border}; /* Border color */\n`;
  css += `    --input: ${darkSurfaceTokens.primary.border}; /* Input border */\n`;
  css += `    --input-bg: ${darkFormTokens.input.background.default}; /* Input background (dark mode needs visible bg) */\n`;
  css += `    --ring: ${darkInteractiveTokens.primary.border.focus}; /* Focus ring */\n\n`;

  // Form tokens (input placeholder, etc.)
  css += `    /* Form element tokens */\n`;
  css += `    --form-input-text-placeholder: ${darkFormTokens.input.text.placeholder}; /* Input placeholder text */\n\n`;

  // Sidebar tokens (optional - for Sidebar component) - DARK THEME
  css += `    /* Sidebar component tokens (optional) - DARK THEME */\n`;
  css += `    --sidebar: ${darkSurfaceTokens.elevated.background}; /* Sidebar background */\n`;
  css += `    --sidebar-foreground: ${darkSurfaceTokens.elevated.text}; /* Sidebar text */\n`;
  css += `    --sidebar-primary: ${darkInteractiveTokens.primary.background.default}; /* Sidebar primary accent */\n`;
  css += `    --sidebar-primary-foreground: ${darkInteractiveTokens.primary.foreground}; /* Sidebar primary text */\n`;
  css += `    --sidebar-accent: ${darkInteractiveTokens.secondary.background.hover}; /* Sidebar secondary accent */\n`;
  css += `    --sidebar-accent-foreground: ${darkInteractiveTokens.secondary.foreground}; /* Sidebar accent text */\n`;
  css += `    --sidebar-border: ${darkSurfaceTokens.elevated.border}; /* Sidebar border */\n`;
  css += `    --sidebar-ring: ${darkInteractiveTokens.primary.border.focus}; /* Sidebar focus ring */\n\n`;

  // Chart tokens (optional - for Chart component) - DARK THEME
  css += `    /* Chart component tokens (optional) - DARK THEME */\n`;
  css += `    --chart-1: oklch(0.488 0.243 264.376); /* Chart color 1 */\n`;
  css += `    --chart-2: oklch(0.696 0.17 162.48); /* Chart color 2 */\n`;
  css += `    --chart-3: oklch(0.769 0.188 70.08); /* Chart color 3 */\n`;
  css += `    --chart-4: oklch(0.627 0.265 303.9); /* Chart color 4 */\n`;
  css += `    --chart-5: oklch(0.645 0.246 16.439); /* Chart color 5 */\n\n`;

  // NEW: Interactive tokens (v2.0 - property-based) - LIGHTER in dark mode
  css += `    /* ========================================\n`;
  css += `       Interactive Tokens (v2.0) - DARK THEME\n`;
  css += `       LIGHTER colors for visibility (surface illumination)\n`;
  css += `       ======================================== */\n\n`;

  // Interactive Primary - LIGHTER in dark theme
  css += `    /* Interactive Primary - LIGHTER for dark mode */\n`;
  css += `    --interactive-primary-text: ${darkInteractiveTokens.primary.text.default};\n`;
  css += `    --interactive-primary-text-hover: ${darkInteractiveTokens.primary.text.hover};\n`;
  css += `    --interactive-primary-bg: ${darkInteractiveTokens.primary.background.default};\n`;
  css += `    --interactive-primary-bg-hover: ${darkInteractiveTokens.primary.background.hover};\n`;
  css += `    --interactive-primary-fg: ${darkInteractiveTokens.primary.foreground};\n`;
  css += `    --interactive-primary-border: ${darkInteractiveTokens.primary.border.default};\n`;
  css += `    --interactive-primary-border-focus: ${darkInteractiveTokens.primary.border.focus};\n\n`;

  // Interactive Secondary
  css += `    /* Interactive Secondary */\n`;
  css += `    --interactive-secondary-text: ${darkInteractiveTokens.secondary.text.default};\n`;
  css += `    --interactive-secondary-text-hover: ${darkInteractiveTokens.secondary.text.hover};\n`;
  css += `    --interactive-secondary-bg: ${darkInteractiveTokens.secondary.background.default};\n`;
  css += `    --interactive-secondary-bg-hover: ${darkInteractiveTokens.secondary.background.hover};\n`;
  css += `    --interactive-secondary-fg: ${darkInteractiveTokens.secondary.foreground};\n`;
  css += `    --interactive-secondary-border: ${darkInteractiveTokens.secondary.border.default};\n`;
  css += `    --interactive-secondary-border-focus: ${darkInteractiveTokens.secondary.border.focus};\n\n`;

  // Interactive Tertiary
  css += `    /* Interactive Tertiary */\n`;
  css += `    --interactive-tertiary-text: ${darkInteractiveTokens.tertiary.text.default};\n`;
  css += `    --interactive-tertiary-text-hover: ${darkInteractiveTokens.tertiary.text.hover};\n`;
  css += `    --interactive-tertiary-bg: ${darkInteractiveTokens.tertiary.background.default};\n`;
  css += `    --interactive-tertiary-bg-hover: ${darkInteractiveTokens.tertiary.background.hover};\n`;
  css += `    --interactive-tertiary-fg: ${darkInteractiveTokens.tertiary.foreground};\n`;
  css += `    --interactive-tertiary-border: ${darkInteractiveTokens.tertiary.border.default};\n`;
  css += `    --interactive-tertiary-border-focus: ${darkInteractiveTokens.tertiary.border.focus};\n\n`;

  // Interactive Accent
  css += `    /* Interactive Accent */\n`;
  css += `    --interactive-accent-text: ${darkInteractiveTokens.accent.text.default};\n`;
  css += `    --interactive-accent-text-hover: ${darkInteractiveTokens.accent.text.hover};\n`;
  css += `    --interactive-accent-text-active: ${darkInteractiveTokens.accent.text.active};\n`;
  css += `    --interactive-accent-bg: ${darkInteractiveTokens.accent.background.default};\n`;
  css += `    --interactive-accent-bg-hover: ${darkInteractiveTokens.accent.background.hover};\n`;
  css += `    --interactive-accent-bg-active: ${darkInteractiveTokens.accent.background.active};\n`;
  css += `    --interactive-accent-fg: ${darkInteractiveTokens.accent.foreground};\n`;
  css += `    --interactive-accent-border: ${darkInteractiveTokens.accent.border.default};\n`;
  css += `    --interactive-accent-border-hover: ${darkInteractiveTokens.accent.border.hover};\n`;
  css += `    --interactive-accent-border-focus: ${darkInteractiveTokens.accent.border.focus};\n\n`;

  // Link tokens - LIGHTER and DESATURATED
  css += `    /* Link Tokens - LIGHTER for visibility */\n`;
  css += `    --link: ${darkLinkTokens.default};\n`;
  css += `    --link-hover: ${darkLinkTokens.hover};\n`;
  css += `    --link-visited: ${darkLinkTokens.visited};\n`;
  css += `    --link-active: ${darkLinkTokens.active};\n\n`;

  // Surface tokens
  css += `    /* Surface Tokens (backgrounds, cards, panels) - LIGHTER */\n`;
  css += `    --surface-primary-bg: ${darkSurfaceTokens.primary.background};\n`;
  css += `    --surface-primary-text: ${darkSurfaceTokens.primary.text};\n`;
  css += `    --surface-primary-text-secondary: ${darkSurfaceTokens.primary.textSecondary};\n`;
  css += `    --surface-primary-border: ${darkSurfaceTokens.primary.border};\n`;
  css += `    --surface-secondary-bg: ${darkSurfaceTokens.secondary.background};\n`;
  css += `    --surface-secondary-text: ${darkSurfaceTokens.secondary.text};\n`;
  css += `    --surface-secondary-text-secondary: ${darkSurfaceTokens.secondary.textSecondary};\n`;
  css += `    --surface-secondary-border: ${darkSurfaceTokens.secondary.border};\n`;
  css += `    --surface-elevated-bg: ${darkSurfaceTokens.elevated.background};\n`;
  css += `    --surface-elevated-text: ${darkSurfaceTokens.elevated.text};\n`;
  css += `    --surface-overlay: ${darkSurfaceTokens.overlay};\n`;
  css += `    --surface-glass-bg: ${darkSurfaceTokens.glass.background};\n`;
  css += `    --surface-glass-text: ${darkSurfaceTokens.glass.text};\n`;
  css += `    --surface-glass-border: ${darkSurfaceTokens.glass.border};\n`;
  css += `    --surface-glass-blur: ${darkSurfaceTokens.glass.blur};\n`;
  css += `    --surface-divider: ${darkSurfaceTokens.divider};\n\n`;

  // Status tokens
  css += `    /* Status Tokens (success, error, warning, info) */\n`;
  css += `    --status-success-text: ${darkStatusTokens.success.text.default};\n`;
  css += `    --status-success-text-hover: ${darkStatusTokens.success.text.hover};\n`;
  css += `    --status-success-bg: ${darkStatusTokens.success.background.default};\n`;
  css += `    --status-success-bg-hover: ${darkStatusTokens.success.background.hover};\n`;
  css += `    --status-success-fg: ${darkStatusTokens.success.foreground};\n`;
  css += `    --status-success-border: ${darkStatusTokens.success.border};\n`;
  css += `    --status-error-text: ${darkStatusTokens.error.text.default};\n`;
  css += `    --status-error-text-hover: ${darkStatusTokens.error.text.hover};\n`;
  css += `    --status-error-bg: ${darkStatusTokens.error.background.default};\n`;
  css += `    --status-error-bg-hover: ${darkStatusTokens.error.background.hover};\n`;
  css += `    --status-error-fg: ${darkStatusTokens.error.foreground};\n`;
  css += `    --status-error-border: ${darkStatusTokens.error.border};\n`;
  css += `    --status-warning-text: ${darkStatusTokens.warning.text.default};\n`;
  css += `    --status-warning-text-hover: ${darkStatusTokens.warning.text.hover};\n`;
  css += `    --status-warning-bg: ${darkStatusTokens.warning.background.default};\n`;
  css += `    --status-warning-bg-hover: ${darkStatusTokens.warning.background.hover};\n`;
  css += `    --status-warning-fg: ${darkStatusTokens.warning.foreground};\n`;
  css += `    --status-warning-border: ${darkStatusTokens.warning.border};\n`;
  css += `    --status-info-text: ${darkStatusTokens.info.text.default};\n`;
  css += `    --status-info-text-hover: ${darkStatusTokens.info.text.hover};\n`;
  css += `    --status-info-bg: ${darkStatusTokens.info.background.default};\n`;
  css += `    --status-info-bg-hover: ${darkStatusTokens.info.background.hover};\n`;
  css += `    --status-info-fg: ${darkStatusTokens.info.foreground};\n`;
  css += `    --status-info-border: ${darkStatusTokens.info.border};\n\n`;

  // Component Overrides (Tier 3 - exceptional cases only)
  // Note: Component overrides are theme-agnostic unless explicitly defined per theme
  if (Object.keys(componentOverrides).length > 0) {
    css += `    /* ========================================\n`;
    css += `       Component Override Tokens (Tier 3) - DARK THEME\n`;
    css += `       ⚠️ EXCEPTIONAL CASES ONLY (5-10%)\n`;
    css += `       Same as light theme unless explicitly overridden\n`;
    css += `       ======================================== */\n\n`;

    // Recursively flatten component overrides
    const flattenOverrides = (obj: any, prefix = 'override') => {
      Object.entries(obj).forEach(([key, value]) => {
        const cssKey = `${prefix}-${key}`;
        if (typeof value === 'string' || typeof value === 'number') {
          css += `    --${cssKey}: ${value};\n`;
        } else if (value && typeof value === 'object') {
          flattenOverrides(value, cssKey);
        }
      });
    };

    flattenOverrides(componentOverrides);
    css += `\n`;
  }

  css += `  }
}

/* ========================================
   USAGE NOTES
   ========================================

   These CSS variables are automatically mapped to Tailwind utilities
   in globals.css via @theme inline block:

   @theme inline {
     --color-primary: var(--primary);
     --color-primary-foreground: var(--primary-foreground);
     // ... etc
   }

   shadcn components then use Tailwind classes:
   <Button className="bg-primary text-primary-foreground" />

   Token flow:
   TypeScript Tokens → CSS Variables (this file) → Tailwind Classes → Components

   ======================================== */
`;

  return css;
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log('🎨 Generating CSS variables from design tokens...\n');

  try {
    // Generate CSS content
    const cssContent = generateCSSVariables();

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, cssContent, 'utf-8');

    console.log('✅ CSS variables generated successfully!');
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    console.log(`📊 Variables: ${(cssContent.match(/--[\w-]+:/g) || []).length}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Ensure globals.css imports this file:');
    console.log('      @import "./design-tokens.generated.css";');
    console.log('   2. Restart dev server: yarn dev');
    console.log('   3. Verify in browser DevTools (check CSS variables)\n');
  } catch (error) {
    console.error('❌ Error generating CSS variables:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateCSSVariables };
