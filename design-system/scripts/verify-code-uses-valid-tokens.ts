#!/usr/bin/env tsx
/**
 * Code Token Usage Validator
 *
 * Validates that all design tokens used in code actually exist in the design system.
 * Prevents silent failures from using non-existent CSS variables.
 *
 * DIRECTION: Code → Design System (reverse of other validators)
 *
 * CHECKS:
 * - Scans all .tsx/.ts files for Tailwind utility classes
 * - Extracts token names from: bg-*, text-*, border-*, ring-*, shadow-*
 * - Verifies each token exists in design-tokens.generated.css
 * - Fails if code references non-existent tokens
 *
 * PREVENTS:
 * - Typos in token names (bg-surface-page-bg instead of bg-surface-primary-bg)
 * - Using deprecated tokens
 * - Using tokens that were removed
 *
 * @example
 * // This will FAIL:
 * <div className="bg-surface-page-bg" />  // Token doesn't exist
 *
 * // This will PASS:
 * <div className="bg-surface-primary-bg" />  // Token exists
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// ============================================
// Configuration
// ============================================

const SRC_DIR = path.resolve(__dirname, '../../');
const GENERATED_CSS = path.resolve(__dirname, '../../styles/design-tokens.generated.css');

// Tailwind prefixes that map to CSS custom properties
const TOKEN_PREFIXES = ['bg', 'text', 'border', 'ring', 'shadow'] as const;

// Standard Tailwind values that are NOT custom tokens (ignore these)
const STANDARD_VALUES = new Set([
  // Colors
  'white', 'black', 'transparent', 'current', 'inherit',
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet',
  'purple', 'fuchsia', 'pink', 'rose',

  // Sizes
  'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
  'none', 'full', 'screen',

  // Special
  'auto', 'scroll', 'clip', 'visible', 'hidden', 'collapse',
]);

// Tokens that should be ignored (inherited from Tailwind or shadcn)
const IGNORED_PATTERNS = [
  /^card$/, // shadcn uses bg-card
  /^card-foreground$/, // shadcn
  /^popover$/, // shadcn
  /^popover-foreground$/, // shadcn
  /^primary$/, // shadcn (not our interactive-primary)
  /^primary-foreground$/, // shadcn
  /^secondary$/, // shadcn (not our interactive-secondary)
  /^secondary-foreground$/, // shadcn
  /^muted$/, // shadcn
  /^muted-foreground$/, // shadcn
  /^accent$/, // shadcn (not our interactive-accent)
  /^accent-foreground$/, // shadcn
  /^destructive$/, // shadcn
  /^destructive-foreground$/, // shadcn
  /^background$/, // shadcn
  /^foreground$/, // shadcn
  /^input$/, // shadcn
  /^ring$/, // shadcn
  /^border$/, // shadcn
  /^chart-\d+$/, // shadcn charts
  /^\d+$/, // Numeric values (spacing, etc)
  /^[\d.]+rem$/, // Rem values
  /^[\d.]+px$/, // Pixel values
  /^[\d.]+%$/, // Percentage values
];

// ============================================
// Utilities
// ============================================

interface TokenUsage {
  file: string;
  line: number;
  className: string;
  tokenName: string;
}

/**
 * Load all CSS variables from generated CSS
 */
function loadGeneratedTokens(): Set<string> {
  const css = fs.readFileSync(GENERATED_CSS, 'utf-8');
  const tokens = new Set<string>();

  // Match all CSS custom properties: --token-name
  const regex = /--([a-z0-9-]+):/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    tokens.add(match[1]);
  }

  return tokens;
}

/**
 * Check if token name is from our design system
 *
 * STRATEGY: Only validate OUR tokens, ignore everything else (Tailwind utilities, shadcn, etc)
 */
function isDesignSystemToken(tokenName: string): boolean {
  // Our design system tokens follow these patterns:
  const patterns = [
    /^interactive-/,      // interactive-primary-bg, interactive-secondary-fg
    /^surface-/,          // surface-primary-bg, surface-elevated-text
    /^status-/,           // status-success-background-default
    /^form-/,             // form-input-bg-default, form-checkbox-border-checked
    /^badge-/,            // badge-default-bg, badge-secondary-fg
    /^feedback-/,         // feedback-* (deprecated, but should catch to warn)
  ];

  return patterns.some(pattern => pattern.test(tokenName));
}

/**
 * Extract token usages from a file
 *
 * ONLY extracts design system tokens (interactive-*, surface-*, status-*, etc)
 * IGNORES standard Tailwind utilities (text-center, border-b, bg-white, etc)
 */
function extractTokenUsages(filePath: string): TokenUsage[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const usages: TokenUsage[] = [];

  // Build regex pattern for all prefixes: (bg|text|border|ring|shadow)-([a-z0-9-]+)
  const prefixPattern = TOKEN_PREFIXES.join('|');
  // Allow multiple dashes in token name: interactive-primary-bg-hover
  const regex = new RegExp(`\\b(${prefixPattern})-([a-z0-9-]+(?:-[a-z0-9]+)*)(?:\\s|:|/|\\[|"|'|$)`, 'gi');

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      return;
    }

    const matches = line.matchAll(regex);
    for (const match of matches) {
      const prefix = match[1];
      const tokenName = match[2];
      const className = `${prefix}-${tokenName}`;

      // ONLY check tokens from our design system
      // Skip everything else (Tailwind utilities, shadcn tokens, etc)
      if (!isDesignSystemToken(tokenName)) {
        continue;
      }

      usages.push({
        file: filePath,
        line: index + 1,
        className,
        tokenName,
      });
    }
  });

  return usages;
}

/**
 * Map Tailwind class prefix to CSS variable prefix
 */
function mapPrefixToCSSVar(prefix: string): string {
  // bg-token → --token
  // text-token → --token
  // border-token → --token
  // Most of our tokens already include the semantic meaning in the name
  return '';
}

/**
 * Find all TypeScript/TSX files
 */
async function findSourceFiles(): Promise<string[]> {
  const files = await glob('**/*.{ts,tsx}', {
    cwd: SRC_DIR,
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/design-system/scripts/**', // Don't validate validator scripts
      '**/design-tokens.generated.css',
    ],
    absolute: true,
  });

  return files;
}

// ============================================
// Main Validation
// ============================================

async function main() {
  console.log('\n🔍 Validating code uses only valid design tokens...');
  console.log('━'.repeat(60));

  // Load generated tokens
  const generatedTokens = loadGeneratedTokens();
  console.log(`✅ Loaded ${generatedTokens.size} tokens from generated CSS\n`);

  // Find all source files
  const files = await findSourceFiles();
  console.log(`📁 Scanning ${files.length} files...\n`);

  // Extract all token usages
  const allUsages: TokenUsage[] = [];
  for (const file of files) {
    const usages = extractTokenUsages(file);
    allUsages.push(...usages);
  }

  console.log(`📊 Found ${allUsages.length} token usages in code\n`);

  // Check each usage
  const invalidUsages: TokenUsage[] = [];
  const validUsages = new Set<string>();

  for (const usage of allUsages) {
    // For our design system, token names in classes match CSS variables
    // bg-surface-primary-bg → --surface-primary-bg
    const cssVarName = usage.tokenName;

    if (!generatedTokens.has(cssVarName)) {
      invalidUsages.push(usage);
    } else {
      validUsages.add(usage.tokenName);
    }
  }

  // Report results
  console.log('━'.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('━'.repeat(60));
  console.log(`   Total usages: ${allUsages.length}`);
  console.log(`   ✅ Valid: ${allUsages.length - invalidUsages.length}`);
  console.log(`   ❌ Invalid: ${invalidUsages.length}`);
  console.log('━'.repeat(60));

  if (invalidUsages.length > 0) {
    console.log('\n❌ INVALID TOKEN USAGES FOUND:\n');

    // Group by file
    const byFile = new Map<string, TokenUsage[]>();
    for (const usage of invalidUsages) {
      if (!byFile.has(usage.file)) {
        byFile.set(usage.file, []);
      }
      byFile.get(usage.file)!.push(usage);
    }

    for (const [file, usages] of byFile) {
      const relativePath = path.relative(SRC_DIR, file);
      console.log(`📄 ${relativePath}`);
      for (const usage of usages) {
        console.log(`   Line ${usage.line}: ${usage.className} → --${usage.tokenName} (DOES NOT EXIST)`);
      }
      console.log('');
    }

    console.log('💡 TIPS:');
    console.log('   • Check for typos in token names');
    console.log('   • Verify token exists in design-tokens.generated.css');
    console.log('   • Run `yarn generate-css-vars` to regenerate tokens');
    console.log('   • Check src/design-system/tokens/ for available tokens\n');

    process.exit(1);
  }

  console.log('\n✅ SUCCESS: All code uses valid design tokens! 🎉\n');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
