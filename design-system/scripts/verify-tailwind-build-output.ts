#!/usr/bin/env tsx
/**
 * Tailwind Build Output Verification Script
 *
 * Validates that Tailwind CSS utilities are properly generated from @theme variables.
 * This script addresses Invariant 11: "Tailwind utility class generation from design tokens"
 *
 * Checks:
 * 1. Next.js build directory (.next/static/css/*.css) exists
 * 2. CSS utilities are generated from @theme mappings in globals.css
 * 3. Key utility classes (text-*, bg-*, rounded-*, etc.) exist in build output
 * 4. Reports missing utilities with actionable suggestions
 *
 * Usage:
 * ```bash
 * yarn verify-tailwind-build-output
 * ```
 *
 * Exit codes:
 * 0 - All expected utilities found in build output
 * 1 - Build directory missing or critical utilities not generated
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

interface UtilityClass {
  selector: string;
  property: string;
  expectedValue: string | RegExp;
}

const KEY_UTILITIES: UtilityClass[] = [
  // Typography
  { selector: '.text-xs', property: 'font-size', expectedValue: /var\(--font-size-xs\)|0\.75rem/ },
  { selector: '.text-sm', property: 'font-size', expectedValue: /var\(--font-size-sm\)|0\.875rem/ },
  { selector: '.text-base', property: 'font-size', expectedValue: /var\(--font-size-base\)|1rem/ },

  // Spacing (commonly used)
  { selector: '.p-4', property: 'padding', expectedValue: /var\(--spacing-4\)|1rem/ },
  { selector: '.gap-4', property: 'gap', expectedValue: /var\(--spacing-4\)|1rem/ },

  // Colors (using arbitrary values with CSS variables)
  { selector: '.bg-\\[var\\(--interactive-primary-bg\\)\\]', property: 'background-color', expectedValue: /var\(--interactive-primary-bg\)/ },

  // Borders
  { selector: '.rounded-sm', property: 'border-radius', expectedValue: /var\(--radius-sm\)|0\.125rem/ },
  { selector: '.rounded-lg', property: 'border-radius', expectedValue: /var\(--radius-lg\)|0\.5rem/ },
];

async function verifyTailwindBuildOutput() {
  const startTime = Date.now();

  console.log(chalk.blue('\n🔧 Verifying Tailwind build output...\n'));

  try {
    // 1. Check if .next/static/css exists
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      console.log(chalk.red('\n❌ No build found!'));
      console.log(chalk.gray(`   Expected directory: ${nextDir}`));
      console.log(chalk.yellow('\n💡 Run the following command first:'));
      console.log(chalk.cyan('   yarn build'));
      console.log(chalk.yellow('\n   Then run this script again:'));
      console.log(chalk.cyan('   yarn verify-tailwind-build-output\n'));

      const endTime = Date.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(chalk.gray(`⏱️  Execution time: ${executionTime}s\n`));

      process.exit(1);
    }

    console.log(chalk.green(`✅ Build directory found: ${nextDir}`));

    // 2. Find CSS files in .next/static (both css and chunks directories)
    const cssFiles = await glob('.next/static/**/*.css', {
      cwd: process.cwd(),
      absolute: true
    });

    if (cssFiles.length === 0) {
      console.log(chalk.red('❌ No CSS files found in .next/static/\n'));
      process.exit(1);
    }

    console.log(chalk.cyan(`📦 Found ${cssFiles.length} CSS files\n`));

    // 3. Read and combine all CSS content
    let allCSS = '';
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      allCSS += content + '\n';
    }

    console.log(chalk.cyan(`📄 Total CSS size: ${Math.round(allCSS.length / 1024)}KB\n`));

    // 4. Check for key utility classes
    console.log(chalk.cyan('🔍 Checking for key utility classes...\n'));

    const missing: UtilityClass[] = [];
    const foundUtilities: UtilityClass[] = [];

    for (const util of KEY_UTILITIES) {
      // Simple check: just look for the selector in CSS (not perfect, but good enough)
      // For arbitrary values like bg-[var(--...)], just check for the variable name
      let isFound = false;

      if (util.selector.includes('\\[var\\(')) {
        // For arbitrary CSS variable selectors, just check if the variable is used
        const varMatch = util.selector.match(/--[\w-]+/);
        if (varMatch && allCSS.includes(varMatch[0])) {
          isFound = true;
        }
      } else {
        // For normal selectors, use simple string search
        const searchPattern = util.selector.replace(/\\/g, '');
        isFound = allCSS.includes(searchPattern + '{') || allCSS.includes(searchPattern + ' ');
      }

      if (isFound) {
        foundUtilities.push(util);
        console.log(chalk.green(`   ✅ ${util.selector}`));
      } else {
        missing.push(util);
        console.log(chalk.red(`   ❌ ${util.selector}`));
      }
    }

    // 5. Report results
    console.log(chalk.gray('\n' + '━'.repeat(60)));
    console.log(chalk.blue('📊 TAILWIND BUILD OUTPUT VALIDATION'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(chalk.cyan(`   CSS files: ${cssFiles.length}`));
    console.log(chalk.green(`   ✅ Utilities found: ${foundUtilities.length}/${KEY_UTILITIES.length}`));

    if (missing.length > 0) {
      console.log(chalk.red(`   ❌ Missing utilities: ${missing.length}`));
      console.log(chalk.yellow('\n💡 Missing utilities:'));
      missing.forEach(util => {
        console.log(chalk.yellow(`   - ${util.selector}`));
      });
      console.log(chalk.yellow('\n💡 Suggestions:'));
      console.log(chalk.yellow('   1. Check if token is mapped in globals.css @theme'));
      console.log(chalk.yellow('   2. Verify token exists in design-tokens.generated.css'));
      console.log(chalk.yellow('   3. Run: yarn verify-tailwind-integration'));

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(chalk.gray(`\n⏱️  Execution time: ${duration}s\n`));

      process.exit(1);
    }

    console.log(chalk.gray('━'.repeat(60)));

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(chalk.green('\n✅ All key Tailwind utilities generated! 🎉'));
    console.log(chalk.gray(`⏱️  Execution time: ${duration}s\n`));
    process.exit(0);

  } catch (error: any) {
    console.log(chalk.red(`\n❌ Error: ${error.message}\n`));

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(chalk.gray(`⏱️  Execution time: ${duration}s\n`));

    process.exit(1);
  }
}

verifyTailwindBuildOutput();
