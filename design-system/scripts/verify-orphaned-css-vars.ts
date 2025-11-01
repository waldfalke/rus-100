/**
 * Orphaned CSS Variables Validator
 *
 * Finds CSS variables that are generated but NOT accessible via Tailwind.
 *
 * Problem: We generate 285 CSS variables but only 113 are mapped to Tailwind
 * Result: 172 variables exist but can't be used in className=""
 *
 * Usage:
 *   yarn verify-orphaned-css-vars
 */

import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractCssVars(cssContent: string): Set<string> {
  const vars = new Set<string>();
  // Match: --variable-name: value;
  const pattern = /--([a-z0-9-]+):/g;
  let match;
  while ((match = pattern.exec(cssContent)) !== null) {
    vars.add(match[1]);
  }
  return vars;
}

function main() {
  log('\n🔍 Orphaned CSS Variables Validator\n', 'cyan');
  log('━'.repeat(60), 'gray');

  const generatedCssPath = path.join(__dirname, '../../styles/design-tokens.generated.css');
  const globalsCssPath = path.join(__dirname, '../../styles/globals.css');

  if (!fs.existsSync(generatedCssPath)) {
    log('❌ design-tokens.generated.css not found!', 'red');
    log('   Run: yarn generate-css-vars', 'yellow');
    process.exit(1);
  }

  if (!fs.existsSync(globalsCssPath)) {
    log('❌ globals.css not found!', 'red');
    process.exit(1);
  }

  // Read files
  const generatedContent = fs.readFileSync(generatedCssPath, 'utf-8');
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf-8');

  // Extract variables
  const generatedVars = extractCssVars(generatedContent);
  const tailwindMappings = extractCssVars(globalsContent);

  // Find orphans
  const orphaned = Array.from(generatedVars).filter(v => !tailwindMappings.has(`color-${v}`) && !tailwindMappings.has(v));

  // Categorize orphans
  const byCategory = new Map<string, string[]>();
  orphaned.forEach(varName => {
    const category = varName.split('-')[0] || 'other';
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(varName);
  });

  // Report
  log(`📊 Statistics:\n`, 'cyan');
  log(`   Generated CSS variables:  ${generatedVars.size}`, 'gray');
  log(`   Tailwind mappings:        ${tailwindMappings.size}`, 'gray');
  log(`   Orphaned (no Tailwind):   ${orphaned.length}`, orphaned.length > 0 ? 'yellow' : 'green');
  log(`   Coverage:                 ${Math.round((tailwindMappings.size / generatedVars.size) * 100)}%\n`, 'cyan');

  if (orphaned.length === 0) {
    log('✅ All CSS variables are mapped to Tailwind!\n', 'green');
    log('━'.repeat(60), 'gray');
    process.exit(0);
  }

  log('⚠️  Orphaned Variables (by category):\n', 'yellow');

  Array.from(byCategory.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, vars]) => {
      log(`   ${category} (${vars.length}):`, 'yellow');
      vars.slice(0, 5).forEach(v => {
        log(`      --${v}`, 'gray');
      });
      if (vars.length > 5) {
        log(`      ... and ${vars.length - 5} more`, 'gray');
      }
      log('', 'reset');
    });

  log('━'.repeat(60), 'gray');
  log('\n💡 Why This Matters:\n', 'cyan');
  log('   Orphaned variables:', 'yellow');
  log('   • Cannot be used in className=""', 'gray');
  log('   • Wasted in generated CSS (file size)', 'gray');
  log('   • Confusing for developers', 'gray');
  log('   • May indicate incomplete migration', 'gray');

  log('\n💡 How to Fix:\n', 'cyan');
  log('   Option 1: Add Tailwind mapping in globals.css @theme', 'gray');
  log('   Option 2: Remove from generate-css-variables.ts if not needed', 'gray');
  log('   Option 3: Use directly with var(--variable-name) in CSS', 'gray');

  // Check if this is acceptable
  const orphanPercentage = (orphaned.length / generatedVars.size) * 100;
  const threshold = 10; // 10% orphans is acceptable

  log('\n━'.repeat(60), 'gray');

  if (orphanPercentage > threshold) {
    log(`\n⚠️  ${orphaned.length} orphaned variables (${Math.round(orphanPercentage)}% > ${threshold}% threshold)\n`, 'yellow');
    log('Consider mapping more variables to Tailwind or removing unused ones.\n', 'gray');
    // Don't fail - this is informational
    process.exit(0);
  } else {
    log(`\n✅ Orphan rate acceptable: ${Math.round(orphanPercentage)}% ≤ ${threshold}%\n`, 'green');
    process.exit(0);
  }
}

main();
