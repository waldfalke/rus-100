#!/usr/bin/env tsx

/**
 * Verify CSS Injection
 *
 * Ensures that generated CSS tokens are correctly injected into the application.
 * Catches issues like:
 * - Missing @import in globals.css
 * - Missing globals.css import in _app.tsx
 * - Empty or incomplete generated CSS
 * - Circular imports
 *
 * Run: yarn verify-css-injection
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

interface CheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

async function verifyCSSInjection(): Promise<CheckResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  console.log(chalk.blue('\n🔍 Verifying CSS injection pipeline...\n'));
  console.log(chalk.gray('━'.repeat(60)));

  // Paths
  const generatedCssPath = path.join(process.cwd(), 'src/styles/design-tokens.generated.css');
  const globalsCssPath = path.join(process.cwd(), 'src/styles/globals.css');
  const appTsxPath = path.join(process.cwd(), 'src/pages/_app.tsx');

  try {
    // ==========================================
    // Check 1: Generated CSS exists and is not empty
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking generated CSS...'));

    let generatedCss: string;
    try {
      generatedCss = await fs.readFile(generatedCssPath, 'utf-8');
    } catch (err) {
      errors.push('Generated CSS file not found: design-tokens.generated.css');
      console.log(chalk.red('   ❌ File not found'));
      // Cannot continue without this file
      return { passed: false, errors, warnings, info };
    }

    // Count CSS variables
    const varMatches = generatedCss.match(/--[\w-]+:/g);
    const varCount = varMatches ? varMatches.length : 0;

    if (varCount === 0) {
      errors.push('Generated CSS is empty (0 variables found)');
      console.log(chalk.red(`   ❌ 0 CSS variables found`));
    } else if (varCount < 400) {
      warnings.push(`Only ${varCount} CSS variables generated (expected 400+)`);
      console.log(chalk.yellow(`   ⚠️  ${varCount} variables (expected 400+)`));
    } else {
      info.push(`${varCount} CSS variables generated`);
      console.log(chalk.green(`   ✅ ${varCount} variables generated`));
    }

    // Check for :root selector
    if (!generatedCss.includes(':root')) {
      errors.push('Generated CSS missing :root selector');
      console.log(chalk.red('   ❌ Missing :root selector'));
    }

    // Check for .dark selector (dark theme)
    if (!generatedCss.includes('.dark')) {
      warnings.push('Generated CSS missing .dark theme selector');
      console.log(chalk.yellow('   ⚠️  Missing .dark theme'));
    } else {
      console.log(chalk.green('   ✅ Dark theme present'));
    }

    // ==========================================
    // Check 2: globals.css imports generated tokens
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking globals.css...'));

    let globalsCss: string;
    try {
      globalsCss = await fs.readFile(globalsCssPath, 'utf-8');
    } catch (err) {
      errors.push('globals.css not found');
      console.log(chalk.red('   ❌ File not found'));
      return { passed: false, errors, warnings, info };
    }

    // Check for generated CSS import
    const hasGeneratedImport =
      globalsCss.includes('@import "./design-tokens.generated.css"') ||
      globalsCss.includes('@import "design-tokens.generated.css"') ||
      globalsCss.includes('@import \'./design-tokens.generated.css\'') ||
      globalsCss.includes('@import \'design-tokens.generated.css\'');

    if (!hasGeneratedImport) {
      errors.push('globals.css does not import design-tokens.generated.css');
      console.log(chalk.red('   ❌ Missing @import for design-tokens.generated.css'));
      console.log(chalk.gray('      Add: @import "./design-tokens.generated.css";'));
    } else {
      console.log(chalk.green('   ✅ Imports design-tokens.generated.css'));
    }

    // Check for Tailwind import
    const hasTailwindImport =
      globalsCss.includes('@import "tailwindcss"') ||
      globalsCss.includes('@tailwind');

    if (!hasTailwindImport) {
      warnings.push('globals.css missing Tailwind CSS import');
      console.log(chalk.yellow('   ⚠️  Missing Tailwind import'));
    } else {
      console.log(chalk.green('   ✅ Tailwind CSS imported'));
    }

    // Check for circular imports
    if (globalsCss.includes('@import "./globals.css"') ||
        globalsCss.includes('@import "globals.css"')) {
      errors.push('Circular import detected: globals.css imports itself');
      console.log(chalk.red('   ❌ Circular import detected'));
    }

    // ==========================================
    // Check 3: _app.tsx imports globals.css
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking _app.tsx...'));

    let appTsx: string;
    try {
      appTsx = await fs.readFile(appTsxPath, 'utf-8');
    } catch (err) {
      errors.push('_app.tsx not found');
      console.log(chalk.red('   ❌ File not found'));
      return { passed: false, errors, warnings, info };
    }

    // Check for globals.css import
    const hasGlobalsImport =
      appTsx.includes('import "@/styles/globals.css"') ||
      appTsx.includes('import \'@/styles/globals.css\'') ||
      appTsx.includes('import "../styles/globals.css"') ||
      appTsx.includes('import \'../styles/globals.css\'');

    if (!hasGlobalsImport) {
      errors.push('_app.tsx does not import globals.css');
      console.log(chalk.red('   ❌ Missing import for globals.css'));
      console.log(chalk.gray('      Add: import "@/styles/globals.css";'));
    } else {
      console.log(chalk.green('   ✅ Imports globals.css'));
    }

    // ==========================================
    // Check 4: Import order validation
    // ==========================================
    console.log(chalk.cyan('\n📦 Checking import order...'));

    // In globals.css: design-tokens should come before Tailwind
    const globalsLines = globalsCss.split('\n');
    let tokensImportLine = -1;
    let tailwindImportLine = -1;

    globalsLines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      // Only check @import directives, not comments
      if (trimmedLine.startsWith('@import') && line.includes('design-tokens.generated.css')) {
        tokensImportLine = idx;
      }
      if (trimmedLine.startsWith('@import') && (line.includes('tailwindcss') || line.includes('@tailwind'))) {
        if (tailwindImportLine === -1) tailwindImportLine = idx;
      }
    });

    if (tokensImportLine !== -1 && tailwindImportLine !== -1) {
      if (tokensImportLine > tailwindImportLine) {
        warnings.push('design-tokens.generated.css imported AFTER Tailwind (may cause specificity issues)');
        console.log(chalk.yellow('   ⚠️  Tokens imported after Tailwind'));
        console.log(chalk.gray('      Recommended: Import tokens before Tailwind'));
      } else {
        console.log(chalk.green('   ✅ Import order correct (tokens → Tailwind)'));
      }
    }

    // ==========================================
    // Summary
    // ==========================================
    console.log(chalk.gray('\n' + '━'.repeat(60)));
    console.log(chalk.blue('📊 VERIFICATION SUMMARY'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(chalk.cyan(`   Checks performed: 4`));
    console.log(chalk.green(`   ✅ Passed: ${4 - errors.length - warnings.length}`));

    if (errors.length > 0) {
      console.log(chalk.red(`   ❌ Errors: ${errors.length}`));
    }
    if (warnings.length > 0) {
      console.log(chalk.yellow(`   ⚠️  Warnings: ${warnings.length}`));
    }
    console.log(chalk.gray('━'.repeat(60)));

    if (errors.length > 0) {
      console.log(chalk.red('\n❌ ERRORS:'));
      errors.forEach(err => console.log(chalk.red(`   • ${err}`)));
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  WARNINGS:'));
      warnings.forEach(warn => console.log(chalk.yellow(`   • ${warn}`)));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log(chalk.green('\n✅ All CSS injection checks passed! 🎉'));
      console.log(chalk.gray('   Generated tokens are correctly wired into the application.\n'));
    } else if (errors.length === 0) {
      console.log(chalk.green('\n✅ CSS injection checks passed (with warnings)'));
      console.log(chalk.gray('   Consider addressing warnings for optimal setup.\n'));
    } else {
      console.log(chalk.red('\n❌ CSS injection verification FAILED'));
      console.log(chalk.gray('   Fix errors above before deploying.\n'));
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      info
    };

  } catch (error) {
    console.error(chalk.red('\n💥 Unexpected error during verification:'));
    console.error(error);
    return {
      passed: false,
      errors: [`Unexpected error: ${error}`],
      warnings: [],
      info: []
    };
  }
}

// Run if called directly
if (require.main === module) {
  verifyCSSInjection()
    .then(result => {
      process.exit(result.passed ? 0 : 1);
    })
    .catch(err => {
      console.error(chalk.red('Fatal error:'), err);
      process.exit(1);
    });
}

export { verifyCSSInjection };
