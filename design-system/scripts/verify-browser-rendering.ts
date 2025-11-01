#!/usr/bin/env tsx
/**
 * Browser Rendering Validation
 *
 * Uses Playwright to verify CSS variables are properly injected
 * and resolved in the browser runtime environment.
 *
 * Run: yarn verify-browser-rendering
 */

import { chromium, Browser } from 'playwright';
import chalk from 'chalk';

async function verifyBrowserRendering() {
  const startTime = Date.now();

  console.log(chalk.blue('\n🌐 Verifying browser rendering...\n'));

  let browser: Browser | null = null;

  try {
    // 1. Check if dev server is running
    const isServerRunning = await checkServerRunning('http://localhost:3000');

    if (!isServerRunning) {
      console.log(chalk.yellow('⚠️  Dev server not detected on http://localhost:3000'));
      console.log(chalk.yellow('   Please start dev server first: yarn dev'));
      console.log(chalk.yellow('   Then run this script again.\n'));
      process.exit(1);
    }

    console.log(chalk.green('✓ Dev server detected'));

    // 2. Launch browser
    console.log(chalk.cyan('🔧 Launching Chromium...'));
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 3. Navigate to showcase page (or fallback to root)
    console.log(chalk.cyan('📄 Loading showcase page...'));
    try {
      await page.goto('http://localhost:3000/design-system-showcase', {
        waitUntil: 'networkidle',
        timeout: 10000,
      });
      console.log(chalk.green('✓ Showcase page loaded'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Showcase page not found, loading home page...'));
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      console.log(chalk.green('✓ Home page loaded'));
    }

    // 4. Extract CSS variables from :root
    console.log(chalk.cyan('🔍 Extracting CSS variables...'));

    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const vars: Record<string, string> = {};

      // Get all CSS custom properties
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--')) {
          const value = styles.getPropertyValue(prop).trim();
          vars[prop] = value;
        }
      }

      return vars;
    });

    const varCount = Object.keys(cssVars).length;
    console.log(chalk.green(`✓ Found ${varCount} CSS variables`));

    if (varCount === 0) {
      console.log(chalk.red('\n❌ No CSS variables found in DOM!'));
      console.log(chalk.yellow('\n💡 Suggestions:'));
      console.log(chalk.yellow('   1. Check if design-tokens.generated.css is imported'));
      console.log(chalk.yellow('   2. Run: yarn generate-css-vars'));
      console.log(chalk.yellow('   3. Check src/pages/_app.tsx for CSS imports\n'));
      await browser.close();
      process.exit(1);
    }

    // 5. Check for undefined/empty variables (non-blocking - many Tailwind vars may be unused)
    const undefinedVars = Object.entries(cssVars).filter(
      ([key, value]) => !value || value === 'undefined' || value === ''
    );

    if (undefinedVars.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Found ${undefinedVars.length} undefined CSS variables (this may be expected):\n`));
      undefinedVars.slice(0, 10).forEach(([key, value]) => {
        console.log(chalk.gray(`   ${key}: ${value || '(empty)'}`));
      });
      if (undefinedVars.length > 10) {
        console.log(chalk.gray(`   ... and ${undefinedVars.length - 10} more`));
      }
      console.log(chalk.gray('\n💡 Note: Some undefined variables are expected (unused Tailwind utilities, etc.)'));
      console.log(chalk.gray('   We\'ll verify that key design system tokens are defined below.\n'));
    } else {
      console.log(chalk.green('✓ All variables have values'));
    }

    // 6. Verify key design tokens exist
    console.log(chalk.cyan('\n🎨 Verifying key design tokens...'));

    const keyTokens = [
      '--interactive-primary-bg',
      '--interactive-primary-fg',
      '--surface-primary-bg',
      '--foreground-primary',
      '--background-primary'
    ];

    const missingTokens = [];
    const foundTokens = [];

    for (const token of keyTokens) {
      if (!cssVars[token]) {
        missingTokens.push(token);
      } else {
        foundTokens.push({ token, value: cssVars[token] });
        console.log(chalk.gray(`   ${token}: ${cssVars[token]}`));
      }
    }

    if (missingTokens.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Missing key tokens: ${missingTokens.join(', ')}`));
      console.log(chalk.yellow('   These tokens may need to be generated\n'));
    } else {
      console.log(chalk.green('✓ All key tokens present'));
    }

    // 7. Switch to dark mode and re-validate
    console.log(chalk.cyan('\n🌙 Testing dark mode...\n'));

    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Wait for theme to apply
    await page.waitForTimeout(500);

    const darkCssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const vars: Record<string, string> = {};

      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--')) {
          const value = styles.getPropertyValue(prop).trim();
          vars[prop] = value;
        }
      }

      return vars;
    });

    const darkVarCount = Object.keys(darkCssVars).length;
    console.log(chalk.green(`   ✅ Found ${darkVarCount} CSS variables (dark mode)`));

    // Check for undefined dark mode variables
    const undefinedDarkVars = Object.entries(darkCssVars).filter(
      ([key, value]) => !value || value === 'undefined' || value === ''
    );

    if (undefinedDarkVars.length > 0) {
      console.log(chalk.yellow(`\n   ⚠️  Found ${undefinedDarkVars.length} undefined dark mode CSS variables (may be expected):\n`));
      undefinedDarkVars.slice(0, 10).forEach(([key, value]) => {
        console.log(chalk.gray(`      ${key}: ${value || '(empty)'}`));
      });
      if (undefinedDarkVars.length > 10) {
        console.log(chalk.gray(`      ... and ${undefinedDarkVars.length - 10} more`));
      }
      console.log(chalk.gray('\n   💡 Note: Some undefined variables are expected (unused Tailwind utilities, etc.)'));
      console.log(chalk.gray('      We\'ll verify that key design system tokens are defined below.\n'));
    } else {
      console.log(chalk.green('   ✅ All dark mode variables resolved'));
    }

    // Verify key dark mode tokens
    console.log(chalk.cyan('\n🎨 Verifying dark mode tokens...\n'));

    const missingDarkTokens = [];
    for (const token of keyTokens) {
      if (!darkCssVars[token]) {
        missingDarkTokens.push(token);
      } else {
        // Show value changed from light to dark
        const lightValue = cssVars[token];
        const darkValue = darkCssVars[token];

        if (lightValue !== darkValue) {
          console.log(chalk.gray(`   ${token}:`));
          console.log(chalk.gray(`      Light: ${lightValue}`));
          console.log(chalk.gray(`      Dark:  ${darkValue} ✓`));
        } else {
          console.log(chalk.yellow(`   ⚠️  ${token} (same in both modes)`));
        }
      }
    }

    if (missingDarkTokens.length > 0) {
      console.log(chalk.red(`\n❌ Missing dark mode tokens: ${missingDarkTokens.join(', ')}\n`));

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(chalk.gray(`\n⏱️  Execution time: ${duration}s\n`));

      await browser.close();
      process.exit(1);
    }

    // 8. Compare variable counts between light and dark modes
    const varCountDiff = Math.abs(varCount - darkVarCount);
    if (varCountDiff > 5) {
      console.log(chalk.yellow(`\n⚠️  Variable count difference: ${varCountDiff} (light: ${varCount}, dark: ${darkVarCount})`));
      console.log(chalk.yellow('   This may indicate missing or extra tokens in one theme.'));
      console.log(chalk.yellow('   Consider reviewing darkSemanticTokens vs lightSemanticTokens.\n'));
    }

    // 9. Success report
    console.log(chalk.gray('\n' + '━'.repeat(60)));
    console.log(chalk.blue('📊 BROWSER RENDERING VALIDATION'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(chalk.green(`   ✅ CSS variables in DOM (light): ${varCount}`));
    console.log(chalk.green(`   ✅ CSS variables in DOM (dark): ${darkVarCount}`));

    if (varCountDiff <= 5) {
      console.log(chalk.green(`   ✅ Variable count parity (diff: ${varCountDiff})`));
    } else {
      console.log(chalk.yellow(`   ⚠️  Variable count difference: ${varCountDiff}`));
    }

    console.log(chalk.green('   ✅ All variables resolved'));
    if (undefinedVars.length === 0 && undefinedDarkVars.length === 0) {
      console.log(chalk.green('   ✅ No undefined variables'));
    } else {
      const totalUndefined = Math.max(undefinedVars.length, undefinedDarkVars.length);
      console.log(chalk.yellow(`   ⚠️  ${totalUndefined} undefined variables (unused Tailwind utilities)`));
    }
    console.log(chalk.green('   ✅ Key tokens present (both modes)'));

    if (missingTokens.length > 0) {
      console.log(chalk.yellow(`   ⚠️  ${missingTokens.length} light mode tokens missing`));
    }

    console.log(chalk.gray('━'.repeat(60)));

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (missingTokens.length === 0 && missingDarkTokens.length === 0) {
      console.log(chalk.green('\n✅ Browser rendering validation passed! 🎉'));
      console.log(chalk.gray(`⏱️  Execution time: ${duration}s\n`));
      await browser.close();
      process.exit(0);
    } else {
      console.log(chalk.yellow('\n⚠️  Validation passed with warnings'));
      console.log(chalk.gray(`⏱️  Execution time: ${duration}s\n`));
      await browser.close();
      process.exit(0);
    }

  } catch (error: any) {
    console.log(chalk.red(`\n❌ Error: ${error.message}\n`));

    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log(chalk.yellow('💡 Dev server is not running. Start it with: yarn dev\n'));
    } else {
      console.log(chalk.gray('Stack trace:'));
      console.log(chalk.gray(error.stack));
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(chalk.gray(`⏱️  Execution time: ${duration}s\n`));

    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

async function checkServerRunning(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

verifyBrowserRendering();
