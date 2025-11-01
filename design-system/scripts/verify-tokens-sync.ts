#!/usr/bin/env tsx
/**
 * Token Synchronization Verification Script
 *
 * Verifies that TypeScript design tokens are correctly synchronized with
 * generated CSS variables.
 *
 * Checks:
 * - Every token has corresponding CSS variable
 * - Values match (with transformation: px → rem, etc.)
 * - No missing variables
 * - No value mismatches
 *
 * Usage:
 * ```bash
 * yarn verify-tokens-sync
 * ```
 *
 * Exit codes:
 * 0 - All tokens synchronized
 * 1 - Critical sync errors found
 * 2 - Warnings (mismatches but not blocking)
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface TokenCheck {
  varName: string;
  expectedValue: string;
  actualValue?: string;
  status: 'ok' | 'missing' | 'mismatch';
  description: string;
}

interface SyncResult {
  checked: number;
  passed: number;
  missing: number;
  mismatched: number;
  checks: TokenCheck[];
}

// ============================================
// COLORS
// ============================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// TOKEN LOADING
// ============================================

/**
 * Load TypeScript tokens dynamically
 */
async function loadTypeScriptTokens() {
  const tokensPath = path.join(process.cwd(), 'src/design-system/tokens');

  // Helper to create file URL for Windows
  const toFileUrl = (filePath: string) => new URL(`file:///${filePath.replace(/\\/g, '/')}`).href;

  // NOTE: Legacy semantic colors removed (2025-10-21)
  // New token system uses semantic/* files (buttons, badges, status, surfaces, forms, etc.)
  // const colorsPath = path.join(tokensPath, 'semantic/legacy/colors.ts');
  // const { lightSemanticColors, darkSemanticColors } = await import(toFileUrl(colorsPath));
  const lightSemanticColors = {};
  const darkSemanticColors = {};

  // Import primitive tokens
  const typographyPath = path.join(tokensPath, 'primitives/typography.ts');
  const spacingPath = path.join(tokensPath, 'primitives/spacing.ts');
  const bordersPath = path.join(tokensPath, 'primitives/borders.ts');
  const shadowsPath = path.join(tokensPath, 'primitives/shadows.ts');
  const animationsPath = path.join(tokensPath, 'primitives/animations.ts');

  const typography = await import(toFileUrl(typographyPath));
  const spacing = await import(toFileUrl(spacingPath));
  const borders = await import(toFileUrl(bordersPath));
  const shadows = await import(toFileUrl(shadowsPath));
  const animations = await import(toFileUrl(animationsPath));

  return {
    // Semantic tokens
    light: lightSemanticColors,
    dark: darkSemanticColors,

    // Primitive tokens
    typography: {
      fontFamilies: typography.primitiveFontFamilies,
      fontSizes: typography.primitiveFontSizes,
      fontWeights: typography.primitiveFontWeights,
      lineHeights: typography.primitiveLineHeights,
      letterSpacing: typography.primitiveLetterSpacing,
    },
    spacing: {
      spacing: spacing.primitiveSpacing,
      sizes: spacing.primitiveSizes,
      iconSizes: spacing.primitiveIconSizes,
    },
    borders: {
      widths: borders.primitiveBorderWidths,
      radii: borders.primitiveBorderRadii,
      styles: borders.primitiveBorderStyles,
    },
    shadows: {
      shadows: shadows.primitiveShadows,
      dropShadows: shadows.primitiveDropShadows,
    },
    animations: {
      durations: animations.primitiveAnimationDurations,
      easings: animations.primitiveAnimationEasings,
    },
  };
}

/**
 * Load generated CSS
 */
function loadGeneratedCSS(): string {
  const cssPath = path.join(
    process.cwd(),
    'src/styles/design-tokens.generated.css'
  );

  if (!fs.existsSync(cssPath)) {
    throw new Error(`Generated CSS not found: ${cssPath}\nRun: yarn generate-css-vars`);
  }

  return fs.readFileSync(cssPath, 'utf-8');
}

/**
 * Load globals.css for manual token checks
 */
function loadGlobalsCSS(): string {
  const cssPath = path.join(process.cwd(), 'src/styles/globals.css');

  if (!fs.existsSync(cssPath)) {
    throw new Error(`globals.css not found: ${cssPath}`);
  }

  return fs.readFileSync(cssPath, 'utf-8');
}

// ============================================
// VALUE TRANSFORMATION
// ============================================

/**
 * Normalize value for comparison (remove extra spaces)
 */
function normalize(value: string | number): string {
  const str = String(value);
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Transform token value based on type
 * Currently we store OKLCH values directly, no transformation needed
 */
function transformTokenValue(value: string | number): string {
  // If it's already a string (OKLCH color), return as-is
  if (typeof value === 'string') {
    return normalize(value);
  }

  // If it's a number, convert to string
  return String(value);
}

// ============================================
// CSS VARIABLE EXTRACTION
// ============================================

/**
 * Extract CSS variable value from generated CSS
 */
function extractCSSVariable(css: string, varName: string): string | null {
  // Match: --var-name: value;
  const regex = new RegExp(`${varName}:\\s*([^;]+);`, 'i');
  const match = css.match(regex);

  if (!match) {
    return null;
  }

  return normalize(match[1]);
}

// ============================================
// TOKEN VERIFICATION
// ============================================

/**
 * Check if CSS variable exists and matches expected value
 */
function checkCSSVar(
  css: string,
  varName: string,
  expectedValue: string,
  description: string
): TokenCheck {
  const actualValue = extractCSSVariable(css, varName);

  if (!actualValue) {
    return {
      varName,
      expectedValue,
      actualValue: undefined,
      status: 'missing',
      description,
    };
  }

  const normalizedExpected = normalize(expectedValue);
  const normalizedActual = normalize(actualValue);

  if (normalizedExpected !== normalizedActual) {
    return {
      varName,
      expectedValue: normalizedExpected,
      actualValue: normalizedActual,
      status: 'mismatch',
      description,
    };
  }

  return {
    varName,
    expectedValue: normalizedExpected,
    actualValue: normalizedActual,
    status: 'ok',
    description,
  };
}

// ============================================
// TYPOGRAPHY VERIFICATION
// ============================================

/**
 * Verify typography tokens (fonts)
 * Checks generated CSS variables
 */
function verifyTypographyTokens(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Typography Tokens...', 'cyan');

  // Check font families
  Object.keys(tokens.fontFamilies).forEach(key => {
    results.push(checkCSSVar(css, `--font-${key}`, tokens.fontFamilies[key], `Font family: ${key}`));
  });

  // Check font sizes (converted to rem)
  Object.entries(tokens.fontSizes).forEach(([key, value]: [string, any]) => {
    const remSize = (value.size / 16).toFixed(4);
    results.push(checkCSSVar(css, `--font-size-${key}`, `${remSize}rem`, `Font size: ${key}`));
  });

  // Check font weights
  Object.keys(tokens.fontWeights).forEach(key => {
    results.push(checkCSSVar(css, `--font-weight-${key}`, tokens.fontWeights[key], `Font weight: ${key}`));
  });

  log('   ✅ Typography tokens verified', 'green');
}

// ============================================
// SPACING VERIFICATION
// ============================================

/**
 * Verify spacing tokens
 */
function verifySpacingTokens(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Spacing Tokens...', 'cyan');

  // Check spacing values (converted to rem)
  Object.entries(tokens.spacing).forEach(([key, value]: [string, any]) => {
    if (typeof value === 'number') {
      const remValue = (value / 16).toFixed(4);
      results.push(checkCSSVar(css, `--space-${key}`, `${remValue}rem`, `Spacing: ${key}`));
    }
  });

  log('   ✅ Spacing tokens verified', 'green');
}

// ============================================
// BORDER VERIFICATION
// ============================================

/**
 * Verify border tokens
 */
function verifyBorderTokens(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Border Tokens...', 'cyan');

  // Check border widths
  Object.entries(tokens.widths).forEach(([key, value]: [string, any]) => {
    const cssKey = key === 'DEFAULT' ? 'border-width' : `border-width-${key}`;
    results.push(checkCSSVar(css, `--${cssKey}`, value, `Border width: ${key}`));
  });

  // Check border radii
  Object.entries(tokens.radii).forEach(([key, value]: [string, any]) => {
    const cssKey = key === 'DEFAULT' ? 'radius-default' : `radius-${key}`;
    results.push(checkCSSVar(css, `--${cssKey}`, value, `Border radius: ${key}`));
  });

  log('   ✅ Border tokens verified', 'green');
}

// ============================================
// SHADOW VERIFICATION
// ============================================

/**
 * Verify shadow tokens
 */
function verifyShadowTokens(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Shadow Tokens...', 'cyan');

  // Check shadow values
  Object.entries(tokens.shadows).forEach(([key, value]: [string, any]) => {
    if (typeof value === 'string') {
      results.push(checkCSSVar(css, `--shadow-${key}`, value, `Shadow: ${key}`));
    }
  });

  log('   ✅ Shadow tokens verified', 'green');
}

// ============================================
// ANIMATION VERIFICATION
// ============================================

/**
 * Verify animation tokens
 */
function verifyAnimationTokens(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Animation Tokens...', 'cyan');

  // Check animation durations
  Object.keys(tokens.durations).forEach(key => {
    results.push(checkCSSVar(css, `--duration-${key}`, tokens.durations[key], `Duration: ${key}`));
  });

  // Check animation easings
  Object.keys(tokens.easings).forEach(key => {
    results.push(checkCSSVar(css, `--ease-${key}`, tokens.easings[key], `Easing: ${key}`));
  });

  log('   ✅ Animation tokens verified', 'green');
}

// ============================================
// SEMANTIC COLOR VERIFICATION
// ============================================

/**
 * Verify semantic colors (light theme)
 */
function verifyLightSemanticColors(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Light Theme Semantic Colors...', 'cyan');

  // Primary
  if (tokens.primary) {
    results.push(checkCSSVar(css, '--primary', tokens.primary.default, 'Primary color'));
    results.push(checkCSSVar(css, '--primary-foreground', tokens.primary.foreground, 'Primary foreground'));
  }

  // Secondary
  if (tokens.secondary) {
    results.push(checkCSSVar(css, '--secondary', tokens.secondary.default, 'Secondary color'));
    results.push(checkCSSVar(css, '--secondary-foreground', tokens.secondary.foreground, 'Secondary foreground'));
  }

  // Accent
  if (tokens.accent) {
    results.push(checkCSSVar(css, '--accent', tokens.accent.background, 'Accent background'));
    results.push(checkCSSVar(css, '--accent-foreground', tokens.accent.foreground, 'Accent foreground'));
  }

  // Destructive (Error)
  if (tokens.error) {
    results.push(checkCSSVar(css, '--destructive', tokens.error.default, 'Destructive/Error color'));
    results.push(checkCSSVar(css, '--destructive-foreground', tokens.error.foreground, 'Destructive foreground'));
  }

  // Background (uses .primary for Tailwind alias)
  if (tokens.background) {
    results.push(checkCSSVar(css, '--background', tokens.background.primary, 'Background color'));
  }

  // Foreground (uses .primary for Tailwind alias)
  if (tokens.foreground) {
    results.push(checkCSSVar(css, '--foreground', tokens.foreground.primary, 'Foreground text color'));
  }

  // Muted
  if (tokens.muted) {
    results.push(checkCSSVar(css, '--muted', tokens.muted.background, 'Muted background'));
    results.push(checkCSSVar(css, '--muted-foreground', tokens.muted.foreground, 'Muted foreground'));
  }

  // Card
  if (tokens.card) {
    results.push(checkCSSVar(css, '--card', tokens.card.background, 'Card background'));
    results.push(checkCSSVar(css, '--card-foreground', tokens.card.foreground, 'Card foreground'));
  }

  // Popover
  if (tokens.popover) {
    results.push(checkCSSVar(css, '--popover', tokens.popover.background, 'Popover background'));
    results.push(checkCSSVar(css, '--popover-foreground', tokens.popover.foreground, 'Popover foreground'));
  }

  // Border (uses .primary)
  if (tokens.border) {
    results.push(checkCSSVar(css, '--border', tokens.border.primary, 'Border color'));
  }

  // Input (uses .border)
  if (tokens.input) {
    results.push(checkCSSVar(css, '--input', tokens.input.border, 'Input border color'));
  }

  // Ring
  if (tokens.ring) {
    results.push(checkCSSVar(css, '--ring', tokens.ring, 'Focus ring color'));
  }

  // Chart colors
  if (tokens.chart) {
    results.push(checkCSSVar(css, '--chart-1', tokens.chart['1'], 'Chart color 1'));
    results.push(checkCSSVar(css, '--chart-2', tokens.chart['2'], 'Chart color 2'));
    results.push(checkCSSVar(css, '--chart-3', tokens.chart['3'], 'Chart color 3'));
    results.push(checkCSSVar(css, '--chart-4', tokens.chart['4'], 'Chart color 4'));
    results.push(checkCSSVar(css, '--chart-5', tokens.chart['5'], 'Chart color 5'));
  }
}

/**
 * Verify semantic colors (dark theme)
 */
function verifyDarkSemanticColors(
  css: string,
  tokens: any,
  results: TokenCheck[]
): void {
  log('\n📦 Checking Dark Theme Semantic Colors...', 'cyan');

  // Check .dark section of CSS
  const darkSectionRegex = /\.dark\s*\{([\s\S]+?)\}\s*\}/;
  const darkMatch = css.match(darkSectionRegex);

  if (!darkMatch) {
    log('⚠️  Warning: No .dark theme section found in generated CSS', 'yellow');
    return;
  }

  const darkCSS = darkMatch[1];

  // Primary
  if (tokens.primary) {
    const check = checkCSSVar(darkCSS, '--primary', tokens.primary.default, 'Dark: Primary color');
    check.varName = '.dark ' + check.varName;
    results.push(check);
  }

  // Background (uses .primary)
  if (tokens.background) {
    const check = checkCSSVar(darkCSS, '--background', tokens.background.primary, 'Dark: Background color');
    check.varName = '.dark ' + check.varName;
    results.push(check);
  }

  // Foreground (uses .primary)
  if (tokens.foreground) {
    const check = checkCSSVar(darkCSS, '--foreground', tokens.foreground.primary, 'Dark: Foreground');
    check.varName = '.dark ' + check.varName;
    results.push(check);
  }

  // Additional dark theme checks can be added here
}

// ============================================
// REPORTING
// ============================================

/**
 * Print results summary
 */
function printSummary(result: SyncResult): void {
  log('\n' + '━'.repeat(60), 'gray');
  log('📊 VERIFICATION SUMMARY', 'blue');
  log('━'.repeat(60), 'gray');
  log(`   Tokens checked: ${result.checked}`, 'cyan');
  log(`   ✅ Passed: ${result.passed}`, 'green');
  log(`   ❌ Missing: ${result.missing}`, result.missing > 0 ? 'red' : 'gray');
  log(`   ⚠️  Mismatched: ${result.mismatched}`, result.mismatched > 0 ? 'yellow' : 'gray');
  log('━'.repeat(60) + '\n', 'gray');
}

/**
 * Print detailed errors
 */
function printErrors(checks: TokenCheck[]): void {
  const missing = checks.filter(c => c.status === 'missing');
  const mismatched = checks.filter(c => c.status === 'mismatch');

  if (missing.length > 0) {
    log('❌ MISSING VARIABLES:', 'red');
    missing.forEach(check => {
      log(`   ${check.varName}`, 'gray');
      log(`   Expected: ${check.expectedValue}`, 'red');
      log(`   ${check.description}`, 'cyan');
      log('');
    });
  }

  if (mismatched.length > 0) {
    log('⚠️  VALUE MISMATCHES:', 'yellow');
    mismatched.forEach(check => {
      log(`   ${check.varName}`, 'gray');
      log(`   Expected: ${check.expectedValue}`, 'yellow');
      log(`   Actual:   ${check.actualValue}`, 'yellow');
      log(`   ${check.description}`, 'cyan');
      log('');
    });
  }
}

// ============================================
// PRIMITIVE TOKEN USAGE DETECTION
// ============================================

interface PrimitiveUsageResult {
  category: string;
  totalPrimitives: number;
  usedPrimitives: Set<string>;
  unusedPrimitives: string[];
  usagePercentage: number;
}

/**
 * Check which primitive tokens are used in semantic tokens
 */
async function checkPrimitiveUsage(): Promise<PrimitiveUsageResult[]> {
  const tokensPath = path.join(process.cwd(), 'src/design-system/tokens');
  const toFileUrl = (filePath: string) => new URL(`file:///${filePath.replace(/\\/g, '/')}`).href;

  // Load all primitive tokens
  const primitivesPath = path.join(tokensPath, 'primitives');
  const colorsPath = path.join(primitivesPath, 'colors.ts');
  const typographyPath = path.join(primitivesPath, 'typography.ts');
  const spacingPath = path.join(primitivesPath, 'spacing.ts');
  const bordersPath = path.join(primitivesPath, 'borders.ts');
  const shadowsPath = path.join(primitivesPath, 'shadows.ts');
  const animationsPath = path.join(primitivesPath, 'animations.ts');

  const primitives = {
    colors: await import(toFileUrl(colorsPath)),
    typography: await import(toFileUrl(typographyPath)),
    spacing: await import(toFileUrl(spacingPath)),
    borders: await import(toFileUrl(bordersPath)),
    shadows: await import(toFileUrl(shadowsPath)),
    animations: await import(toFileUrl(animationsPath)),
  };

  // Load all semantic token files
  const semanticPath = path.join(tokensPath, 'semantic');
  const semanticFiles = [
    'buttons.ts',
    'badges.ts',
    'forms.ts',
    'typography.ts',
    'interactive.ts',
    'links.ts',
    'surfaces.ts',
    'status.ts',
  ];

  const results: PrimitiveUsageResult[] = [];

  // Check color primitives usage
  const colorPrimitives = new Set<string>();
  const usedColors = new Set<string>();

  // Collect all color primitive keys
  const collectColorKeys = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string' && value.startsWith('oklch')) {
        colorPrimitives.add(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        collectColorKeys(value, fullKey);
      }
    });
  };

  collectColorKeys(primitives.colors.primitiveColors, 'primitiveColors');

  // Check semantic files for primitive usage
  for (const file of semanticFiles) {
    const filePath = path.join(semanticPath, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');

    // Find all primitiveColors.* references
    const colorMatches = content.matchAll(/primitiveColors\.([a-zA-Z0-9.\[\]'"]+)/g);
    for (const match of colorMatches) {
      let colorPath = match[1]
        .replace(/\[['"]([^'"]+)['"]\]/g, '.$1') // Convert ['500'] to .500
        .replace(/\[(\d+)\]/g, '.$1'); // Convert [500] to .500
      usedColors.add(`primitiveColors.${colorPath}`);
    }
  }

  results.push({
    category: 'Colors',
    totalPrimitives: colorPrimitives.size,
    usedPrimitives: usedColors,
    unusedPrimitives: Array.from(colorPrimitives).filter(key => !usedColors.has(key)),
    usagePercentage: (usedColors.size / colorPrimitives.size) * 100,
  });

  // Check typography primitives usage
  const typographyPrimitives = new Set<string>();
  const usedTypography = new Set<string>();

  // Collect typography primitive keys
  ['primitiveFontFamilies', 'primitiveFontSizes', 'primitiveFontWeights', 'primitiveLineHeights', 'primitiveLetterSpacing'].forEach(tokenSet => {
    const obj = (primitives.typography as any)[tokenSet];
    if (obj) {
      Object.keys(obj).forEach(key => {
        typographyPrimitives.add(`${tokenSet}.${key}`);
      });
    }
  });

  // Check semantic files for typography primitive usage
  for (const file of semanticFiles) {
    const filePath = path.join(semanticPath, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');

    // Find all primitive typography references
    const typoMatches = content.matchAll(/(primitiveFontFamilies|primitiveFontSizes|primitiveFontWeights|primitiveLineHeights|primitiveLetterSpacing)\.([a-zA-Z0-9.\[\]'"]+)/g);
    for (const match of typoMatches) {
      const tokenSet = match[1];
      let propPath = match[2]
        .replace(/\[['"]([^'"]+)['"]\]/g, '.$1')
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')[0]; // Get first property only
      usedTypography.add(`${tokenSet}.${propPath}`);
    }
  }

  results.push({
    category: 'Typography',
    totalPrimitives: typographyPrimitives.size,
    usedPrimitives: usedTypography,
    unusedPrimitives: Array.from(typographyPrimitives).filter(key => !usedTypography.has(key)),
    usagePercentage: (usedTypography.size / typographyPrimitives.size) * 100,
  });

  // Check spacing primitives usage
  const spacingPrimitives = new Set<string>();
  const usedSpacing = new Set<string>();

  ['primitiveSpacing', 'primitiveSizes'].forEach(tokenSet => {
    const obj = (primitives.spacing as any)[tokenSet];
    if (obj) {
      Object.keys(obj).forEach(key => {
        spacingPrimitives.add(`${tokenSet}.${key}`);
      });
    }
  });

  for (const file of semanticFiles) {
    const filePath = path.join(semanticPath, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');

    const spacingMatches = content.matchAll(/(primitiveSpacing|primitiveSizes)\.([a-zA-Z0-9.\[\]'"]+)/g);
    for (const match of spacingMatches) {
      const tokenSet = match[1];
      let propPath = match[2]
        .replace(/\[['"]([^'"]+)['"]\]/g, '.$1')
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')[0];
      usedSpacing.add(`${tokenSet}.${propPath}`);
    }
  }

  results.push({
    category: 'Spacing',
    totalPrimitives: spacingPrimitives.size,
    usedPrimitives: usedSpacing,
    unusedPrimitives: Array.from(spacingPrimitives).filter(key => !usedSpacing.has(key)),
    usagePercentage: (usedSpacing.size / spacingPrimitives.size) * 100,
  });

  return results;
}

/**
 * Print primitive usage report
 */
function printPrimitiveUsage(results: PrimitiveUsageResult[]): void {
  log('\n📊 PRIMITIVE TOKEN USAGE IN SEMANTIC LAYER', 'blue');
  log('━'.repeat(60), 'gray');

  results.forEach(result => {
    const percentage = result.usagePercentage.toFixed(1);
    const color = result.usagePercentage > 80 ? 'green' : result.usagePercentage > 50 ? 'yellow' : 'red';

    log(`\n📦 ${result.category}`, 'cyan');
    log(`   Total primitives: ${result.totalPrimitives}`, 'gray');
    log(`   Used in semantic: ${result.usedPrimitives.size}`, 'green');
    log(`   Unused: ${result.unusedPrimitives.length}`, result.unusedPrimitives.length > 0 ? 'yellow' : 'green');
    log(`   Usage: ${percentage}%`, color);

    if (result.unusedPrimitives.length > 0 && result.unusedPrimitives.length <= 10) {
      log('\n   Unused primitives:', 'yellow');
      result.unusedPrimitives.forEach(key => {
        log(`   • ${key}`, 'gray');
      });
    } else if (result.unusedPrimitives.length > 10) {
      log('\n   Unused primitives (showing first 10):', 'yellow');
      result.unusedPrimitives.slice(0, 10).forEach(key => {
        log(`   • ${key}`, 'gray');
      });
      log(`   ... and ${result.unusedPrimitives.length - 10} more`, 'gray');
    }
  });

  log('\n━'.repeat(60), 'gray');
  log('💡 TIP: Unused primitives may indicate:', 'cyan');
  log('   • Dead code that can be removed', 'gray');
  log('   • Missing semantic token definitions', 'gray');
  log('   • Reserved tokens for future use\n', 'gray');
}

// ============================================
// TOKEN USAGE DETECTION
// ============================================

/**
 * Find files that use a specific CSS variable
 */
function findTokenUsage(varName: string): string[] {
  const { globSync } = require('glob');
  const files = globSync('src/**/*.{tsx,ts,jsx,js,css,scss}', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });

  const usages: string[] = [];

  files.forEach((file: string) => {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');

    // Check for various usage patterns:
    // 1. Tailwind utility: text-xs, bg-primary, etc.
    // 2. CSS var() reference: var(--font-size-xs)
    // 3. Direct class: bg-[--primary]
    const tokenName = varName.replace('--', '');
    const patterns = [
      new RegExp(`var\\(--${tokenName}\\)`, 'g'),  // var(--font-size-xs)
      new RegExp(`\\[--${tokenName}\\]`, 'g'),     // bg-[--font-size-xs]
      new RegExp(`--${tokenName}\\s*:`, 'g'),      // CSS definition
    ];

    const hasUsage = patterns.some((pattern) => pattern.test(content));

    if (hasUsage) {
      usages.push(file);
    }
  });

  return usages;
}

/**
 * Find unused tokens
 */
function findUnusedTokens(checks: TokenCheck[]): TokenCheck[] {
  log('\n🔍 Checking token usage in codebase...', 'cyan');

  const okTokens = checks.filter((c) => c.status === 'ok');
  const unused: TokenCheck[] = [];

  // Known tokens that are used via Tailwind classes (false positives)
  // These are mapped in globals.css @theme and used as Tailwind utilities
  const tailwindMappedTokens = new Set([
    '--primary',
    '--primary-foreground',
    '--background',
    '--foreground',
    '--secondary',
    '--secondary-foreground',
    '--destructive',
    '--destructive-foreground',
    '--muted',
    '--muted-foreground',
    '--accent',
    '--accent-foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
    '--border',
    '--input',
    '--ring',
    // Dark theme variants
    '.dark --primary',
    '.dark --primary-foreground',
    '.dark --background',
    '.dark --foreground',
    '.dark --secondary',
    '.dark --secondary-foreground',
  ]);

  okTokens.forEach((check, index) => {
    // Show progress for long operations
    if (index % 50 === 0) {
      log(`   Checking ${index + 1}/${okTokens.length}...`, 'gray');
    }

    // Skip known Tailwind-mapped tokens
    if (tailwindMappedTokens.has(check.varName)) {
      return;
    }

    const usages = findTokenUsage(check.varName);

    if (usages.length === 0) {
      unused.push(check);
    }
  });

  return unused;
}

/**
 * Print unused tokens report
 */
function printUnusedTokens(unused: TokenCheck[]): void {
  if (unused.length === 0) {
    log('\n✅ All tokens are being used! 🎉', 'green');
    return;
  }

  log('\n⚠️  UNUSED TOKENS (Dead code):\n', 'yellow');
  log(`   Found ${unused.length} tokens that are never used\n`, 'gray');

  // Group by category
  const byCategory = new Map<string, TokenCheck[]>();

  unused.forEach((check) => {
    let category = 'Other';

    if (check.varName.includes('font')) category = 'Typography';
    else if (check.varName.includes('space-') || check.varName.includes('size-'))
      category = 'Spacing';
    else if (check.varName.includes('radius') || check.varName.includes('border'))
      category = 'Borders';
    else if (check.varName.includes('shadow')) category = 'Shadows';
    else if (check.varName.includes('duration') || check.varName.includes('ease'))
      category = 'Animations';
    else if (
      check.varName.includes('interactive') ||
      check.varName.includes('link') ||
      check.varName.includes('surface') ||
      check.varName.includes('status')
    )
      category = 'Semantic Colors';

    const existing = byCategory.get(category) || [];
    existing.push(check);
    byCategory.set(category, existing);
  });

  byCategory.forEach((tokens, category) => {
    log(`📁 ${category} (${tokens.length} unused)`, 'yellow');

    tokens.slice(0, 5).forEach((token) => {
      log(`   ${token.varName}`, 'gray');
    });

    if (tokens.length > 5) {
      log(`   ... and ${tokens.length - 5} more`, 'gray');
    }

    log('', 'reset');
  });

  log('💡 IMPACT:', 'cyan');
  log('   These tokens increase CSS bundle size but are never used.', 'gray');
  log('   Consider removing them or adding them to Tailwind config.\n', 'gray');
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  log('\n🔍 Verifying token synchronization...', 'blue');
  log('━'.repeat(60), 'gray');

  try {
    // Load tokens and CSS
    const tokens = await loadTypeScriptTokens();
    const css = loadGeneratedCSS();
    const globalsCss = loadGlobalsCSS();

    log('✅ Loaded TypeScript tokens', 'green');
    log('✅ Loaded generated CSS', 'green');
    log('✅ Loaded globals.css\n', 'green');

    // Run verification
    const results: TokenCheck[] = [];

    // Colors (already implemented)
    verifyLightSemanticColors(css, tokens.light, results);
    verifyDarkSemanticColors(css, tokens.dark, results);

    // Typography - Check generated CSS
    verifyTypographyTokens(css, tokens.typography, results);

    // Spacing - Check generated CSS
    verifySpacingTokens(css, tokens.spacing, results);

    // Borders - Check generated CSS
    verifyBorderTokens(css, tokens.borders, results);

    // Shadows - Check generated CSS
    verifyShadowTokens(css, tokens.shadows, results);

    // Animations - Check generated CSS
    verifyAnimationTokens(css, tokens.animations, results);

    // Calculate summary
    const summary: SyncResult = {
      checked: results.length,
      passed: results.filter(c => c.status === 'ok').length,
      missing: results.filter(c => c.status === 'missing').length,
      mismatched: results.filter(c => c.status === 'mismatch').length,
      checks: results,
    };

    // Print results
    printSummary(summary);

    if (summary.missing > 0 || summary.mismatched > 0) {
      printErrors(results);
    }

    // Check primitive usage in semantic layer
    const primitiveUsage = await checkPrimitiveUsage();
    printPrimitiveUsage(primitiveUsage);

    // Check for unused tokens (only if sync passed)
    if (summary.missing === 0 && summary.mismatched === 0) {
      const unusedTokens = findUnusedTokens(results);
      printUnusedTokens(unusedTokens);
    }

    // Exit with appropriate code
    if (summary.missing > 0) {
      log('❌ FAILED: Missing CSS variables detected', 'red');
      log('   Run: yarn generate-css-vars\n', 'cyan');
      process.exit(1);
    } else if (summary.mismatched > 0) {
      log('⚠️  WARNING: Value mismatches detected', 'yellow');
      log('   Review mismatches above and fix tokens or generation script\n', 'cyan');
      process.exit(2);
    } else {
      log('✅ SUCCESS: All tokens synchronized! 🎉\n', 'green');
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ ERROR: ${error instanceof Error ? error.message : String(error)}`, 'red');
    process.exit(1);
  }
}

// Run
main();
