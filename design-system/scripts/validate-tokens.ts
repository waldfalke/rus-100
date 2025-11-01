/**
 * Token Validation Script
 *
 * Validates that design tokens are correctly formatted and helps generate
 * Tailwind CSS v4 theme extensions from TypeScript tokens.
 *
 * Usage:
 *   yarn ts-node src/design-system/scripts/validate-tokens.ts
 */

import { primitiveSpacing, primitiveSizes } from '../tokens/primitives/spacing';
import { primitiveFontSizes, primitiveFontWeights, primitiveLineHeights } from '../tokens/primitives/typography';
import { primitiveBorderRadii, primitiveBorderWidths } from '../tokens/primitives/borders';
import { primitiveAnimationDurations, primitiveAnimationEasings } from '../tokens/primitives/animations';
import { buttonTokens, inputTokens, cardTokens } from '../tokens/semantic/components';
import { toRem } from '../tokens/utils';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

// Validation functions

function validateSpacingFormat() {
  section('Validating Spacing Tokens Format');

  let errors = 0;
  let warnings = 0;

  // Check that spacing values are numbers (px) not strings (rem)
  Object.entries(primitiveSpacing).forEach(([key, value]) => {
    if (typeof value === 'string' && value !== 'auto' && value !== 'px') {
      log(`❌ spacing[${key}]: Expected number, got string "${value}"`, 'red');
      errors++;
    } else if (typeof value === 'number') {
      log(`✓ spacing[${key}]: ${value}px → ${toRem(value)}`, 'green');
    }
  });

  if (errors === 0) {
    log('\n✅ All spacing tokens are correctly formatted as px numbers', 'green');
  } else {
    log(`\n❌ Found ${errors} spacing format errors`, 'red');
  }

  return { errors, warnings };
}

function validateTypographyFormat() {
  section('Validating Typography Tokens Format');

  let errors = 0;

  // Check that font sizes are numbers (px) not strings (rem)
  Object.entries(primitiveFontSizes).forEach(([key, value]: [string, { size: number | string; lineHeight: number | string }]) => {
    if (typeof value.size === 'string') {
      log(`❌ fontSize[${key}].size: Expected number, got string "${value.size}"`, 'red');
      errors++;
    } else if (typeof value.size === 'number') {
      log(`✓ fontSize[${key}]: ${value.size}px / ${value.lineHeight}px → ${toRem(value.size)} / ${toRem(value.lineHeight)}`, 'green');
    }

    if (typeof value.lineHeight === 'string') {
      log(`❌ fontSize[${key}].lineHeight: Expected number, got string "${value.lineHeight}"`, 'red');
      errors++;
    }
  });

  if (errors === 0) {
    log('\n✅ All typography tokens are correctly formatted as px numbers', 'green');
  } else {
    log(`\n❌ Found ${errors} typography format errors`, 'red');
  }

  return { errors, warnings: 0 };
}

function validateComponentTokens() {
  section('Validating Component Tokens');

  let errors = 0;

  // Check button tokens
  log('\nButton tokens:', 'blue');
  try {
    Object.entries(buttonTokens.sizes).forEach(([size, config]) => {
      log(`  ✓ button.${size}: height=${config.height}, padding=${config.padding}`, 'green');
    });
  } catch (e) {
    log(`  ❌ Error validating button tokens: ${e}`, 'red');
    errors++;
  }

  // Check input tokens
  log('\nInput tokens:', 'blue');
  try {
    Object.entries(inputTokens.sizes).forEach(([size, config]) => {
      log(`  ✓ input.${size}: height=${config.height}, padding=${config.padding}`, 'green');
    });
  } catch (e) {
    log(`  ❌ Error validating input tokens: ${e}`, 'red');
    errors++;
  }

  // Check card tokens
  log('\nCard tokens:', 'blue');
  try {
    Object.entries(cardTokens.padding).forEach(([size, value]) => {
      log(`  ✓ card.padding.${size}: ${value}`, 'green');
    });
  } catch (e) {
    log(`  ❌ Error validating card tokens: ${e}`, 'red');
    errors++;
  }

  if (errors === 0) {
    log('\n✅ All component tokens validated successfully', 'green');
  } else {
    log(`\n❌ Found ${errors} component token errors`, 'red');
  }

  return { errors, warnings: 0 };
}

function generateTailwindThemeSpacing() {
  section('Generating Tailwind v4 Theme - Spacing Scale');

  console.log('\n/* Add to globals.css @theme inline block */');
  console.log('\n@theme inline {');

  // Generate spacing scale
  Object.entries(primitiveSpacing).forEach(([key, value]) => {
    if (typeof value === 'number') {
      const remValue = toRem(value);
      console.log(`  --spacing-${key}: ${remValue};`);
    }
  });

  console.log('}');

  log('\n💡 Copy the above CSS to your globals.css @theme inline block', 'yellow');
}

function generateTailwindThemeFontSizes() {
  section('Generating Tailwind v4 Theme - Font Sizes');

  console.log('\n/* Add to globals.css @theme inline block */');
  console.log('\n@theme inline {');

  // Generate font sizes
  Object.entries(primitiveFontSizes).forEach(([key, value]) => {
    const fontSize = toRem(value.size);
    const lineHeight = toRem(value.lineHeight);
    console.log(`  --font-size-${key}: ${fontSize};`);
    console.log(`  --line-height-${key}: ${lineHeight};`);
  });

  console.log('}');

  log('\n💡 Copy the above CSS to your globals.css @theme inline block', 'yellow');
}

// Summary and recommendations

function printSummary(results: { errors: number; warnings: number }[]) {
  section('Validation Summary');

  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);

  if (totalErrors === 0 && totalWarnings === 0) {
    log('\n✅ All tokens are valid!', 'green');
    log('\n✨ Token format is correct - ready for CSS generation', 'green');
  } else {
    if (totalErrors > 0) {
      log(`\n❌ Found ${totalErrors} error(s)`, 'red');
    }
    if (totalWarnings > 0) {
      log(`\n⚠️  Found ${totalWarnings} warning(s)`, 'yellow');
    }
  }

  log('\n📚 Next Steps:', 'cyan');
  log('  1. Fix any errors shown above', 'reset');
  log('  2. Review warnings for improvements', 'reset');
  log('  3. Use generated CSS snippets to update globals.css', 'reset');
  log('  4. Run `yarn build` to validate with Tailwind', 'reset');
}

// Main execution

async function main() {
  log('\n🔍 Design Token Validation Tool', 'cyan');
  log('Validating token format and generating Tailwind theme extensions\n', 'reset');

  const results = [
    validateSpacingFormat(),
    validateTypographyFormat(),
    validateComponentTokens(),
  ];

  // Generation (optional - commented out for first run)
  // generateTailwindThemeSpacing();
  // generateTailwindThemeFontSizes();

  printSummary(results);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { validateSpacingFormat, validateTypographyFormat, validateComponentTokens };
