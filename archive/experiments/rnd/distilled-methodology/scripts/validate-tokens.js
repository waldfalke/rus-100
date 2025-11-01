#!/usr/bin/env node
/**
 * Validate design tokens against schema
 * Usage: node scripts/validate-tokens.js [path-to-tokens.json]
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateTokenStructure(tokens) {
  const errors = [];
  const warnings = [];

  // Check metadata
  if (!tokens.metadata) {
    errors.push('Missing metadata section');
  } else {
    if (!tokens.metadata.version) warnings.push('metadata.version missing');
    if (!tokens.metadata.generated) warnings.push('metadata.generated timestamp missing');
  }

  // Validate token categories
  const requiredCategories = ['color', 'spacing', 'typography'];
  requiredCategories.forEach(category => {
    if (!tokens[category]) {
      warnings.push(`Recommended category missing: ${category}`);
    }
  });

  // Validate individual tokens
  function validateTokens(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'metadata' || key === '$description') continue;

      const currentPath = path ? `${path}.${key}` : key;

      // Check if it's a token value object
      if (value && typeof value === 'object' && 'value' in value) {
        // Validate token object structure
        if (!value.type) {
          warnings.push(`Token ${currentPath}: missing type field`);
        }

        // Check for units on dimension types
        if (value.type === 'dimension' && typeof value.value === 'number') {
          if (!value.unit) {
            errors.push(`Token ${currentPath}: dimension type requires unit field (px, rem, etc.)`);
          }
        }

        // Validate color format
        if (value.type === 'color' && typeof value.value === 'string') {
          const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
          const rgbaPattern = /^rgba?\(/;
          const hslPattern = /^hsla?\(/;
          
          if (!hexPattern.test(value.value) && !rgbaPattern.test(value.value) && !hslPattern.test(value.value)) {
            warnings.push(`Token ${currentPath}: potentially invalid color format "${value.value}"`);
          }
        }
      } else if (value && typeof value === 'object') {
        // Recurse into nested objects
        validateTokens(value, currentPath);
      }
    }
  }

  validateTokens(tokens);

  return { errors, warnings };
}

function checkHardcodedValues(tokensPath, componentsDir = './components') {
  const issues = [];

  if (!fs.existsSync(componentsDir)) {
    return issues;
  }

  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for hardcoded hex colors
        const hexMatches = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{8}/g);
        if (hexMatches) {
          issues.push({
            file: fullPath,
            type: 'hardcoded-color',
            values: [...new Set(hexMatches)],
          });
        }

        // Check for hardcoded px values in style props
        const pxMatches = content.match(/style=\{?\{[^}]*:\s*['"]?\d+px['"]?/g);
        if (pxMatches) {
          issues.push({
            file: fullPath,
            type: 'hardcoded-spacing',
            count: pxMatches.length,
          });
        }
      }
    }
  }

  try {
    scanDirectory(componentsDir);
  } catch (err) {
    // Silently handle if components directory doesn't exist
  }

  return issues;
}

function main() {
  const tokensPath = process.argv[2] || './design-tokens/tokens.json';

  log('\n🔍 Validating design tokens...', 'blue');
  log(`📁 Tokens file: ${tokensPath}\n`);

  // Check if file exists
  if (!fs.existsSync(tokensPath)) {
    log(`❌ Error: Tokens file not found: ${tokensPath}`, 'red');
    process.exit(1);
  }

  // Load and parse tokens
  let tokens;
  try {
    const content = fs.readFileSync(tokensPath, 'utf8');
    tokens = JSON.parse(content);
  } catch (err) {
    log(`❌ Error: Failed to parse tokens.json: ${err.message}`, 'red');
    process.exit(1);
  }

  // Validate structure
  const { errors, warnings } = validateTokenStructure(tokens);

  // Check for hardcoded values
  log('🔎 Scanning for hardcoded values in components...\n');
  const hardcodedIssues = checkHardcodedValues(tokensPath);

  // Report results
  let hasErrors = false;

  if (errors.length > 0) {
    hasErrors = true;
    log(`❌ Errors (${errors.length}):`, 'red');
    errors.forEach(err => log(`  • ${err}`, 'red'));
    log('');
  }

  if (warnings.length > 0) {
    log(`⚠️  Warnings (${warnings.length}):`, 'yellow');
    warnings.forEach(warn => log(`  • ${warn}`, 'yellow'));
    log('');
  }

  if (hardcodedIssues.length > 0) {
    log(`⚠️  Hardcoded values found (${hardcodedIssues.length} files):`, 'yellow');
    hardcodedIssues.forEach(issue => {
      if (issue.type === 'hardcoded-color') {
        log(`  • ${path.relative('.', issue.file)}: ${issue.values.join(', ')}`, 'yellow');
      } else {
        log(`  • ${path.relative('.', issue.file)}: ${issue.count} hardcoded spacing values`, 'yellow');
      }
    });
    log('');
  }

  // Summary
  if (!hasErrors && warnings.length === 0 && hardcodedIssues.length === 0) {
    log('✅ All checks passed!', 'green');
    process.exit(0);
  } else if (!hasErrors) {
    log('✅ Validation passed with warnings', 'green');
    process.exit(0);
  } else {
    log('❌ Validation failed', 'red');
    process.exit(1);
  }
}

main();
