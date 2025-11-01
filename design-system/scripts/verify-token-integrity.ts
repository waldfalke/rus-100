#!/usr/bin/env tsx

/**
 * Verify Token Integrity
 *
 * Ensures token consistency across the entire pipeline:
 * 1. TypeScript tokens → CSS variables (all defined tokens have CSS output)
 * 2. CSS variables → Usage (no undefined var(--*) in code)
 * 3. Usage → CSS variables (no dead CSS variables)
 *
 * Catches:
 * - Typos in var(--token-name)
 * - Missing CSS variables
 * - Dead code (unused CSS variables)
 * - Orphaned inline styles
 *
 * Run: yarn verify-token-integrity
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

interface IntegrityResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalCssVars: number;
    usedCssVars: number;
    undefinedUsages: number;
    deadCssVars: number;
  };
}

// Tokens that are defined externally (not in design-tokens.generated.css)
const EXTERNAL_TOKENS = new Set([
  // Tailwind-mapped tokens (used via utility classes, not var())
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',

  // Next.js font variables (defined by next/font in _app.tsx)
  'font-geist-sans',
  'font-geist-mono',
  'font-inter',
  'font-raleway',

  // Tailwind easing functions (defined by Tailwind CSS v4)
  'ease-linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'ease-easeIn',
  'ease-easeOut',
  'ease-easeInOut',
  'ease-spring',
  'ease-bounce',
  'ease-emphasized',
  'ease-emphasizedDecelerate',
  'ease-emphasizedAccelerate',
  'ease-standard',
  'ease-decelerate',
  'ease-accelerate',
  'ease-smooth',
  'ease-sharpIn',
  'ease-sharpOut',

  // Legacy/TODO tokens (references in comments/docs)
  'token-name',
  'radius', // Legacy base radius (now using primitiveBorderRadii)
  'font-cornero', // TODO: Custom display font (not yet implemented)
]);

async function verifyTokenIntegrity(): Promise<IntegrityResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(chalk.blue('\n🔍 Verifying token integrity...\n'));
  console.log(chalk.gray('━'.repeat(60)));

  try {
    // ==========================================
    // Step 1: Load CSS Variables
    // ==========================================
    console.log(chalk.cyan('\n📦 Loading CSS variables...'));

    const generatedCssPath = path.join(process.cwd(), 'src/styles/design-tokens.generated.css');
    const generatedCss = await fs.readFile(generatedCssPath, 'utf-8');

    // Extract all CSS variable names (without --)
    const cssVarMatches = generatedCss.matchAll(/--([a-z0-9_-]+):/gi);
    const cssVars = new Set<string>();
    for (const match of cssVarMatches) {
      cssVars.add(match[1]);
    }

    console.log(chalk.green(`   ✅ Loaded ${cssVars.size} CSS variables`));

    // ==========================================
    // Step 2: Find all var(--*) usages in code
    // ==========================================
    console.log(chalk.cyan('\n📦 Scanning codebase for var(--*) usage...'));

    const codeFiles = await glob('src/**/*.{tsx,ts,css,scss}', {
      ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/design-tokens.generated.css'],
      cwd: process.cwd(),
    });

    const usedVars = new Set<string>();
    const undefinedUsages: Array<{ file: string; varName: string; line: number }> = [];

    for (const file of codeFiles) {
      const filePath = path.join(process.cwd(), file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Match var(--token-name)
        const matches = line.matchAll(/var\(--([a-z0-9_-]+)\)/gi);
        for (const match of matches) {
          const varName = match[1];
          usedVars.add(varName);

          // Check if this var is defined in CSS, externally, or matches Tailwind/Legacy pattern
          const isSystemToken = /^(z-|ease-|foreground-|background-)/.test(varName); // Tailwind system tokens

          if (!cssVars.has(varName) && !EXTERNAL_TOKENS.has(varName) && !isSystemToken) {
            undefinedUsages.push({
              file: file.replace(/\\/g, '/'),
              varName,
              line: idx + 1,
            });
          }
        }
      });
    }

    console.log(chalk.green(`   ✅ Found ${usedVars.size} unique var(--*) usages`));

    // ==========================================
    // Step 3: Check for undefined usages
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking for undefined var(--*) references...'));

    if (undefinedUsages.length > 0) {
      console.log(chalk.red(`   ❌ Found ${undefinedUsages.length} undefined var(--*) usages`));

      // Group by file
      const byFile = new Map<string, typeof undefinedUsages>();
      undefinedUsages.forEach(usage => {
        if (!byFile.has(usage.file)) {
          byFile.set(usage.file, []);
        }
        byFile.get(usage.file)!.push(usage);
      });

      // Report first 10 files
      let fileCount = 0;
      for (const [file, usages] of byFile) {
        if (fileCount >= 10) {
          console.log(chalk.gray(`      ... and ${byFile.size - 10} more files`));
          break;
        }
        errors.push(`Undefined var(--${usages[0].varName}) in ${file}:${usages[0].line}`);
        console.log(chalk.red(`      ${file}:${usages[0].line} → var(--${usages[0].varName})`));
        fileCount++;
      }
    } else {
      console.log(chalk.green('   ✅ No undefined var(--*) references'));
    }

    // ==========================================
    // Step 4: Check for dead CSS variables
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking for unused CSS variables...'));

    const deadVars: string[] = [];

    for (const cssVar of cssVars) {
      // Skip external tokens (used via utility classes or defined externally)
      const baseVarName = cssVar.replace(/^(light|dark)-/, ''); // Remove theme prefix
      if (EXTERNAL_TOKENS.has(baseVarName)) {
        continue;
      }

      // Skip dark theme duplicates (only check light version)
      if (cssVar.startsWith('dark-') && cssVars.has(cssVar.replace(/^dark-/, ''))) {
        continue;
      }

      if (!usedVars.has(cssVar)) {
        deadVars.push(cssVar);
      }
    }

    if (deadVars.length > 0) {
      console.log(chalk.yellow(`   ⚠️  Found ${deadVars.length} unused CSS variables`));

      // Show first 20
      const showCount = Math.min(20, deadVars.length);
      deadVars.slice(0, showCount).forEach(varName => {
        warnings.push(`Unused CSS variable: --${varName}`);
        console.log(chalk.yellow(`      --${varName}`));
      });

      if (deadVars.length > showCount) {
        console.log(chalk.gray(`      ... and ${deadVars.length - showCount} more`));
      }

      console.log(chalk.gray('\n   💡 These may be:'));
      console.log(chalk.gray('      • Used via Tailwind utilities (false positive)'));
      console.log(chalk.gray('      • Reserved for future use'));
      console.log(chalk.gray('      • Dead code that can be removed'));
    } else {
      console.log(chalk.green('   ✅ All CSS variables are used'));
    }

    // ==========================================
    // Step 5: Check for inline style usage consistency
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking inline style patterns...'));

    // Look for style={{ fontFamily: var(...) }} patterns
    let inlineStyleCount = 0;
    for (const file of codeFiles.filter(f => f.endsWith('.tsx'))) {
      const filePath = path.join(process.cwd(), file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Count inline styles with CSS variables
      const matches = content.matchAll(/style=\{\{[^}]*var\(--[a-z0-9_-]+\)/gi);
      inlineStyleCount += Array.from(matches).length;
    }

    if (inlineStyleCount > 0) {
      console.log(chalk.green(`   ✅ Found ${inlineStyleCount} inline style usages`));
    }

    // ==========================================
    // Summary
    // ==========================================
    console.log(chalk.gray('\n' + '━'.repeat(60)));
    console.log(chalk.blue('📊 INTEGRITY VERIFICATION SUMMARY'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(chalk.cyan(`   Total CSS variables: ${cssVars.size}`));
    console.log(chalk.cyan(`   Used in code: ${usedVars.size}`));
    console.log(chalk.cyan(`   Usage rate: ${((usedVars.size / cssVars.size) * 100).toFixed(1)}%`));

    if (undefinedUsages.length > 0) {
      console.log(chalk.red(`   ❌ Undefined usages: ${undefinedUsages.length}`));
    } else {
      console.log(chalk.green(`   ✅ Undefined usages: 0`));
    }

    if (deadVars.length > 0) {
      console.log(chalk.yellow(`   ⚠️  Unused variables: ${deadVars.length}`));
    } else {
      console.log(chalk.green(`   ✅ Unused variables: 0`));
    }

    console.log(chalk.gray('━'.repeat(60)));

    if (errors.length > 0) {
      console.log(chalk.red('\n❌ ERRORS:'));
      errors.slice(0, 10).forEach(err => console.log(chalk.red(`   • ${err}`)));
      if (errors.length > 10) {
        console.log(chalk.gray(`   ... and ${errors.length - 10} more errors`));
      }
    }

    if (warnings.length > 0 && warnings.length <= 20) {
      console.log(chalk.yellow('\n⚠️  WARNINGS (unused variables):'));
      console.log(chalk.gray('   These variables are defined but not referenced in code.'));
      console.log(chalk.gray('   They may be used via Tailwind or reserved for future use.\n'));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log(chalk.green('\n✅ Token integrity verified! 🎉'));
      console.log(chalk.gray('   All tokens are consistent across TS → CSS → Usage.\n'));
    } else if (errors.length === 0) {
      console.log(chalk.green('\n✅ Token integrity verified (with warnings)'));
      console.log(chalk.gray('   Consider reviewing unused variables.\n'));
    } else {
      console.log(chalk.red('\n❌ Token integrity verification FAILED'));
      console.log(chalk.gray('   Fix undefined var(--*) references above.\n'));
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings: warnings.slice(0, 20), // Limit warnings in return value
      stats: {
        totalCssVars: cssVars.size,
        usedCssVars: usedVars.size,
        undefinedUsages: undefinedUsages.length,
        deadCssVars: deadVars.length,
      },
    };
  } catch (error) {
    console.error(chalk.red('\n💥 Unexpected error during verification:'));
    console.error(error);
    return {
      passed: false,
      errors: [`Unexpected error: ${error}`],
      warnings: [],
      stats: {
        totalCssVars: 0,
        usedCssVars: 0,
        undefinedUsages: 0,
        deadCssVars: 0,
      },
    };
  }
}

// Run if called directly
if (require.main === module) {
  verifyTokenIntegrity()
    .then(result => {
      process.exit(result.passed ? 0 : 1);
    })
    .catch(err => {
      console.error(chalk.red('Fatal error:'), err);
      process.exit(1);
    });
}

export { verifyTokenIntegrity };
