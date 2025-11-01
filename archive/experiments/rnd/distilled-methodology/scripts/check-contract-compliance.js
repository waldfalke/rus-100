#!/usr/bin/env node
/**
 * Check component implementation against its contract
 * Usage: node scripts/check-contract-compliance.js [contract-file] [component-file]
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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

function loadContract(contractPath) {
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Contract not found: ${contractPath}`);
  }

  const content = fs.readFileSync(contractPath, 'utf8');
  return yaml.load(content);
}

function loadComponent(componentPath) {
  if (!fs.existsSync(componentPath)) {
    throw new Error(`Component not found: ${componentPath}`);
  }

  return fs.readFileSync(componentPath, 'utf8');
}

function extractProps(componentCode) {
  const props = new Set();
  
  // Extract from interface definitions
  const interfaceMatch = componentCode.match(/interface\s+\w+Props\s*{([^}]+)}/s);
  if (interfaceMatch) {
    const propsBlock = interfaceMatch[1];
    const propMatches = propsBlock.matchAll(/^\s*(\w+)[\?:]?\s*:/gm);
    for (const match of propMatches) {
      props.add(match[1]);
    }
  }

  // Extract from destructured props
  const destructureMatch = componentCode.match(/{\s*([^}]+)\s*}:\s*\w+Props/);
  if (destructureMatch) {
    const propsBlock = destructureMatch[1];
    const propNames = propsBlock.split(',').map(p => p.trim().split(/[=:]/)[0].trim());
    propNames.forEach(p => props.add(p));
  }

  return Array.from(props);
}

function checkPropsCompliance(contract, componentCode) {
  const errors = [];
  const warnings = [];

  if (!contract.props) return { errors, warnings };

  const implementedProps = extractProps(componentCode);

  // Check required props
  if (contract.props.required) {
    contract.props.required.forEach(prop => {
      if (!implementedProps.includes(prop.name)) {
        errors.push(`Missing required prop: ${prop.name}`);
      }
    });
  }

  // Check for undeclared props (props in code not in contract)
  const contractPropNames = new Set();
  if (contract.props.required) {
    contract.props.required.forEach(p => contractPropNames.add(p.name));
  }
  if (contract.props.optional) {
    contract.props.optional.forEach(p => contractPropNames.add(p.name));
  }

  implementedProps.forEach(prop => {
    if (!contractPropNames.has(prop) && !['className', 'children', 'key', 'ref'].includes(prop)) {
      warnings.push(`Undeclared prop in contract: ${prop}`);
    }
  });

  return { errors, warnings };
}

function checkVariantsCompliance(contract, componentCode) {
  const errors = [];
  const warnings = [];

  if (!contract.variants) return { errors, warnings };

  // Check if variants are implemented
  contract.variants.forEach(variant => {
    const variantName = variant.name;
    
    // Look for variant in code (class-variance-authority pattern)
    const cvaPattern = new RegExp(`variants:\\s*{[^}]*${variantName}\\s*:`);
    const classNamesPattern = new RegExp(`variant\\s*===\\s*['"\`]${variantName}['"\`]`);
    
    if (!cvaPattern.test(componentCode) && !classNamesPattern.test(componentCode)) {
      warnings.push(`Variant "${variantName}" may not be implemented`);
    }
  });

  return { errors, warnings };
}

function checkInvariantsDocumentation(contract, componentCode) {
  const warnings = [];

  if (!contract.invariants) return { warnings };

  // Check if invariants are mentioned in comments
  const hasInvariantComments = /\/\*\*[\s\S]*?@invariant/i.test(componentCode);
  
  if (!hasInvariantComments && contract.invariants.length > 0) {
    warnings.push(`Contract defines ${contract.invariants.length} invariants but none documented in component`);
  }

  return { warnings };
}

function checkHardcodedValues(componentCode) {
  const issues = [];

  // Check for hardcoded colors
  const hexColors = componentCode.match(/#[0-9A-Fa-f]{6}/g);
  if (hexColors) {
    issues.push({
      type: 'hardcoded-color',
      count: hexColors.length,
      examples: [...new Set(hexColors)].slice(0, 3),
    });
  }

  // Check for hardcoded spacing (inline style props)
  const inlineSpacing = componentCode.match(/style=\{\{[^}]*(?:margin|padding|gap|width|height):\s*['"]?\d+px/g);
  if (inlineSpacing) {
    issues.push({
      type: 'hardcoded-spacing',
      count: inlineSpacing.length,
    });
  }

  return issues;
}

function main() {
  const contractPath = process.argv[2];
  const componentPath = process.argv[3];

  if (!contractPath || !componentPath) {
    console.error('Usage: node check-contract-compliance.js [contract-file] [component-file]');
    process.exit(1);
  }

  log('\n📋 Checking contract compliance...', 'blue');
  log(`📄 Contract: ${contractPath}`);
  log(`🔧 Component: ${componentPath}\n`);

  let contract, componentCode;

  try {
    contract = loadContract(contractPath);
    componentCode = loadComponent(componentPath);
  } catch (err) {
    log(`❌ Error: ${err.message}`, 'red');
    process.exit(1);
  }

  // Run checks
  const propsResult = checkPropsCompliance(contract, componentCode);
  const variantsResult = checkVariantsCompliance(contract, componentCode);
  const invariantsResult = checkInvariantsDocumentation(contract, componentCode);
  const hardcodedIssues = checkHardcodedValues(componentCode);

  // Aggregate results
  const allErrors = [...propsResult.errors, ...variantsResult.errors];
  const allWarnings = [
    ...propsResult.warnings,
    ...variantsResult.warnings,
    ...invariantsResult.warnings,
  ];

  // Report
  let hasErrors = false;

  if (allErrors.length > 0) {
    hasErrors = true;
    log(`❌ Errors (${allErrors.length}):`, 'red');
    allErrors.forEach(err => log(`  • ${err}`, 'red'));
    log('');
  }

  if (allWarnings.length > 0) {
    log(`⚠️  Warnings (${allWarnings.length}):`, 'yellow');
    allWarnings.forEach(warn => log(`  • ${warn}`, 'yellow'));
    log('');
  }

  if (hardcodedIssues.length > 0) {
    log(`⚠️  Code Quality Issues:`, 'yellow');
    hardcodedIssues.forEach(issue => {
      if (issue.type === 'hardcoded-color') {
        log(`  • ${issue.count} hardcoded color(s): ${issue.examples.join(', ')}`, 'yellow');
      } else {
        log(`  • ${issue.count} hardcoded spacing value(s)`, 'yellow');
      }
    });
    log('');
  }

  // Summary
  if (!hasErrors && allWarnings.length === 0 && hardcodedIssues.length === 0) {
    log('✅ Component fully complies with contract!', 'green');
    process.exit(0);
  } else if (!hasErrors) {
    log('✅ Component complies with contract (with warnings)', 'green');
    process.exit(0);
  } else {
    log('❌ Component does not comply with contract', 'red');
    process.exit(1);
  }
}

// Handle missing yaml library gracefully
try {
  require.resolve('js-yaml');
} catch (e) {
  console.error('❌ Error: js-yaml not installed');
  console.error('Run: npm install js-yaml');
  process.exit(1);
}

main();
