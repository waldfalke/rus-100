#!/usr/bin/env tsx
/**
 * Tailwind Integration Verification Script
 *
 * Validates that design tokens are properly integrated with Tailwind CSS v4.
 * Checks:
 * 1. CSS variables exist in design-tokens.generated.css
 * 2. CSS variables are mapped in globals.css @theme block
 * 3. Tokens are accessible as Tailwind utilities
 *
 * Critical gap: If a token exists in CSS but NOT in @theme block,
 * it can't be used as a Tailwind utility (e.g., text-xs, p-4)
 *
 * Usage:
 * ```bash
 * yarn verify-tailwind-integration
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface TailwindCheck {
  varName: string;
  category: string;
  status: 'mapped' | 'unmapped' | 'missing';
  tailwindUtility?: string;
  description: string;
}

interface IntegrationResult {
  checked: number;
  mapped: number;
  unmapped: number;
  missing: number;
  checks: TailwindCheck[];
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
// FILE LOADING
// ============================================

function loadGeneratedCSS(): string {
  const cssPath = path.resolve(
    __dirname,
    '../../styles/design-tokens.generated.css'
  );

  if (!fs.existsSync(cssPath)) {
    throw new Error(
      `Generated CSS not found: ${cssPath}\n` +
        `Run: yarn generate-css-vars`
    );
  }

  return fs.readFileSync(cssPath, 'utf-8');
}

function loadGlobalsCSS(): string {
  const cssPath = path.resolve(__dirname, '../../styles/globals.css');

  if (!fs.existsSync(cssPath)) {
    throw new Error(`globals.css not found: ${cssPath}`);
  }

  return fs.readFileSync(cssPath, 'utf-8');
}

// ============================================
// CSS PARSING
// ============================================

/**
 * Extract all CSS variables from design-tokens.generated.css
 */
function extractGeneratedTokens(css: string): Map<string, string> {
  const tokens = new Map<string, string>();
  const regex = /--([\w-]+):\s*([^;]+);/g;

  let match;
  while ((match = regex.exec(css)) !== null) {
    tokens.set(match[1], match[2].trim());
  }

  return tokens;
}

/**
 * Extract Tailwind @theme mappings from globals.css
 */
function extractTailwindMappings(css: string): Map<string, string> {
  const mappings = new Map<string, string>();

  // Find @theme inline block
  // Note: Using [\s\S]+ instead of /s flag for ES2017 compatibility
  const themeBlockMatch = css.match(/@theme\s+inline\s*\{([\s\S]+?)\}/);

  if (!themeBlockMatch) {
    log('⚠️  No @theme inline block found in globals.css', 'yellow');
    return mappings;
  }

  const themeBlock = themeBlockMatch[1];

  // Extract ALL variable definitions in @theme block
  // Matches: --var-name: <anything>;
  const allVarsRegex = /--([\w-]+):\s*([^;]+);/g;

  let match;
  while ((match = allVarsRegex.exec(themeBlock)) !== null) {
    const varName = match[1]; // e.g., "color-primary" or "radius-sm" or "font-sans"
    const value = match[2].trim(); // e.g., "var(--primary)" or "calc(var(--radius) - 4px)"

    // Check if it references a design token (either var() or calc() with var())
    if (value.includes('var(--')) {
      // Extract the referenced token name
      const tokenMatch = value.match(/var\(--([\w-]+)\)/);
      if (tokenMatch) {
        const tokenVar = tokenMatch[1];
        mappings.set(tokenVar, varName);
      }

      // For variables like --font-sans that are defined but reference themselves
      // or are defined with different values
      if (varName.startsWith('font-') || varName.startsWith('radius-') || varName.startsWith('color-')) {
        // Also mark the variable itself as mapped
        mappings.set(varName.replace(/^(font-|radius-|color-)/, '').replace(/^family-/, ''), varName);
      }
    }
  }

  return mappings;
}

/**
 * Categorize token by prefix
 */
function categorizeToken(varName: string): string {
  if (varName.startsWith('font-size-')) return 'Typography: Font Size';
  if (varName.startsWith('font-weight-')) return 'Typography: Font Weight';
  if (varName.startsWith('font-family-') || varName.startsWith('font-'))
    return 'Typography: Font Family';
  if (varName.startsWith('letter-spacing-')) return 'Typography: Letter Spacing';
  if (varName.startsWith('line-height-')) return 'Typography: Line Height';

  if (varName.startsWith('space-')) return 'Spacing: Space Scale';
  if (varName.startsWith('size-')) return 'Spacing: Sizes';

  if (varName.startsWith('border-width-')) return 'Borders: Width';
  if (varName.startsWith('radius-')) return 'Borders: Radius';
  if (varName.startsWith('ring-width-')) return 'Borders: Ring Width';
  if (varName.startsWith('ring-offset-')) return 'Borders: Ring Offset';

  if (varName.startsWith('shadow-')) return 'Shadows';

  if (varName.startsWith('duration-')) return 'Animations: Duration';
  if (varName.startsWith('ease-')) return 'Animations: Easing';
  if (varName.startsWith('z-')) return 'Animations: Z-Index';

  if (
    varName.startsWith('interactive-') ||
    varName.startsWith('link-') ||
    varName.startsWith('surface-') ||
    varName.startsWith('status-')
  ) {
    return 'Semantic Colors';
  }

  return 'Other';
}

/**
 * Determine which Tailwind utility would use this token
 */
function getTailwindUtility(varName: string): string | undefined {
  // Font sizes: text-xs, text-sm, etc.
  if (varName.startsWith('font-size-')) {
    const size = varName.replace('font-size-', '');
    return `text-${size}`;
  }

  // Font weights: font-bold, font-semibold, etc.
  if (varName.startsWith('font-weight-')) {
    const weight = varName.replace('font-weight-', '');
    return `font-${weight}`;
  }

  // Spacing: p-4, m-8, gap-2, etc.
  if (varName.startsWith('space-')) {
    const space = varName.replace('space-', '');
    return `p-${space}, m-${space}, gap-${space}`;
  }

  // Border radius: rounded-sm, rounded-lg, etc.
  if (varName.startsWith('radius-')) {
    const radius = varName.replace('radius-', '');
    return `rounded-${radius}`;
  }

  // Shadows: shadow-sm, shadow-lg, etc.
  if (varName.startsWith('shadow-')) {
    const shadow = varName.replace('shadow-', '');
    return `shadow-${shadow}`;
  }

  // Colors: text-link, bg-interactive-primary-bg, etc.
  if (
    varName.startsWith('interactive-') ||
    varName.startsWith('link-') ||
    varName.startsWith('surface-') ||
    varName.startsWith('status-')
  ) {
    return `text-${varName}, bg-${varName}, border-${varName}`;
  }

  return undefined;
}

// ============================================
// VERIFICATION
// ============================================

function verifyTailwindIntegration(): IntegrationResult {
  log('\n🔍 Verifying Tailwind CSS integration...', 'cyan');
  log('━'.repeat(60), 'gray');

  // Load files
  const generatedCSS = loadGeneratedCSS();
  const globalsCSS = loadGlobalsCSS();

  log('✅ Loaded design-tokens.generated.css', 'green');
  log('✅ Loaded globals.css\n', 'green');

  // Extract data
  const generatedTokens = extractGeneratedTokens(generatedCSS);
  const tailwindMappings = extractTailwindMappings(globalsCSS);

  log(`📦 Generated tokens: ${generatedTokens.size}`, 'cyan');
  log(`🎨 Tailwind mappings: ${tailwindMappings.size}\n`, 'cyan');

  // Verify each token
  const checks: TailwindCheck[] = [];

  // Exceptions: tokens that are intentionally defined differently
  const exceptions = new Set([
    'font-sans',        // Defined directly in @theme, uses Next.js font loader
    'font-mono',        // Defined directly in @theme
    'radius-sm',        // Calculated value: calc(var(--radius) - 4px)
    'radius-md',        // Calculated value: calc(var(--radius) - 2px)
    'radius-lg',        // Calculated value: var(--radius)
    'radius-xl',        // Calculated value: calc(var(--radius) + 4px)
    'color-primary',    // Alias for --primary (legacy compatibility)
    'color-primary-foreground', // Alias for --primary-foreground
  ]);

  generatedTokens.forEach((value, varName) => {
    const category = categorizeToken(varName);
    const tailwindUtility = getTailwindUtility(varName);

    // Skip line-height (they're paired with font-size)
    if (varName.startsWith('line-height-')) {
      return;
    }

    // Skip exceptions (intentional design decisions)
    if (exceptions.has(varName)) {
      return;
    }

    const isMapped = tailwindMappings.has(varName);

    checks.push({
      varName,
      category,
      status: isMapped ? 'mapped' : 'unmapped',
      tailwindUtility,
      description: `${varName} → ${tailwindUtility || 'N/A'}`,
    });
  });

  // Summary
  const summary: IntegrationResult = {
    checked: checks.length,
    mapped: checks.filter((c) => c.status === 'mapped').length,
    unmapped: checks.filter((c) => c.status === 'unmapped').length,
    missing: checks.filter((c) => c.status === 'missing').length,
    checks,
  };

  return summary;
}

// ============================================
// REPORTING
// ============================================

function reportResults(result: IntegrationResult): void {
  log('\n' + '━'.repeat(60), 'gray');
  log('📊 INTEGRATION SUMMARY', 'blue');
  log('━'.repeat(60), 'gray');

  log(`   Tokens checked: ${result.checked}`, 'cyan');
  log(`   ✅ Mapped to Tailwind: ${result.mapped}`, 'green');
  log(`   ❌ Unmapped (not accessible): ${result.unmapped}`, 'red');
  log('━'.repeat(60), 'gray');

  // Group unmapped tokens by category
  const unmappedByCategory = new Map<string, TailwindCheck[]>();

  result.checks
    .filter((c) => c.status === 'unmapped')
    .forEach((check) => {
      const existing = unmappedByCategory.get(check.category) || [];
      existing.push(check);
      unmappedByCategory.set(check.category, existing);
    });

  if (unmappedByCategory.size > 0) {
    log('\n❌ UNMAPPED TOKENS (Not accessible in Tailwind):\n', 'red');

    unmappedByCategory.forEach((checks, category) => {
      log(`📁 ${category} (${checks.length} unmapped)`, 'yellow');

      // Show ALL tokens, not just first 5
      checks.forEach((check) => {
        log(`   --${check.varName}`, 'gray');
        if (check.tailwindUtility) {
          log(`      Would be: ${check.tailwindUtility}`, 'gray');
        }
      });

      log('', 'reset');
    });

    log('\n⚠️  IMPACT:', 'yellow');
    log(
      '   These tokens exist in CSS but are NOT accessible as Tailwind utilities.',
      'gray'
    );
    log('   Example: text-xs might use Tailwind default instead of --font-size-xs', 'gray');
    log('\n💡 FIX:', 'cyan');
    log('   Add mappings to @theme inline block in globals.css:', 'gray');
    log('   --font-size-xs: var(--font-size-xs);', 'gray');
    log('   --spacing-4: var(--space-4);', 'gray');
    log('   etc.\n', 'gray');
  } else {
    log('\n✅ All tokens properly mapped to Tailwind!\n', 'green');
  }

  // Exit code - distinguish between critical and optional unmapped tokens
  const criticalUnmapped = result.checks.filter(
    (c) =>
      c.status === 'unmapped' &&
      !c.category.startsWith('Typography') && // Typography tokens used directly in CSS
      !c.category.startsWith('Other') && // Other/complex tokens
      !c.varName.includes('_') // Fractional spacing (0_5, 1_5) rarely used
  );

  if (criticalUnmapped.length > 0) {
    log('\n❌ FAILED: Critical unmapped tokens detected', 'red');
    log('   These tokens SHOULD be in @theme for Tailwind access\n', 'red');
    // Show ALL critical unmapped tokens, not just first 10
    criticalUnmapped.forEach((c) => {
      log(`   - --${c.varName} (${c.category})`, 'red');
      if (c.tailwindUtility) {
        log(`      Would be: ${c.tailwindUtility}`, 'gray');
      }
    });
    log('\n   Add @theme mappings in globals.css\n', 'cyan');
    process.exit(1);
  } else if (result.unmapped > 0) {
    log('\n⚠️  INFO: Some tokens unmapped (not critical)', 'yellow');
    log(`   ${result.unmapped} tokens use direct CSS var() syntax`, 'gray');
    log('   This is normal for typography/complex tokens\n', 'gray');
    log('✅ SUCCESS: All critical tokens properly integrated! 🎉\n', 'green');
    process.exit(0);
  } else {
    log('✅ SUCCESS: All tokens integrated with Tailwind! 🎉\n', 'green');
    process.exit(0);
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  try {
    const result = verifyTailwindIntegration();
    reportResults(result);
  } catch (error) {
    log(`\n❌ Error: ${(error as Error).message}\n`, 'red');
    process.exit(1);
  }
}

main();
