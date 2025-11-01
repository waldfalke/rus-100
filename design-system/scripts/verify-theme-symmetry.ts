/**
 * Theme Symmetry Validator
 *
 * Verifies that light and dark themes have identical structure.
 *
 * Problem: If light theme has "accent.background.hover" but dark theme doesn't,
 *          the dark theme will fallback to undefined or wrong value
 *
 * Usage:
 *   yarn verify-theme-symmetry
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

interface TokenPaths {
  light: Set<string>;
  dark: Set<string>;
}

function getObjectPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];

  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value) && !value.includes) {
      // Recurse into nested objects
      paths.push(...getObjectPaths(value, path));
    } else {
      // Leaf node - actual value
      paths.push(path);
    }
  }

  return paths;
}

function checkFileSymmetry(fileName: string): { asymmetric: boolean; onlyLight: string[]; onlyDark: string[] } {
  const filePath = path.join(__dirname, '../tokens/semantic', fileName);

  if (!fs.existsSync(filePath)) {
    return { asymmetric: false, onlyLight: [], onlyDark: [] };
  }

  // Dynamically import the file
  delete require.cache[require.resolve(filePath)];
  const module = require(filePath);

  const lightTokenName = `light${fileName.replace('.ts', '').charAt(0).toUpperCase() + fileName.replace('.ts', '').slice(1)}Tokens`;
  const darkTokenName = `dark${fileName.replace('.ts', '').charAt(0).toUpperCase() + fileName.replace('.ts', '').slice(1)}Tokens`;

  const lightTokens = module[lightTokenName];
  const darkTokens = module[darkTokenName];

  if (!lightTokens || !darkTokens) {
    return { asymmetric: false, onlyLight: [], onlyDark: [] };
  }

  const lightPaths = new Set(getObjectPaths(lightTokens));
  const darkPaths = new Set(getObjectPaths(darkTokens));

  const onlyLight = Array.from(lightPaths).filter(p => !darkPaths.has(p));
  const onlyDark = Array.from(darkPaths).filter(p => !lightPaths.has(p));

  return {
    asymmetric: onlyLight.length > 0 || onlyDark.length > 0,
    onlyLight,
    onlyDark,
  };
}

function main() {
  log('\n🔍 Theme Symmetry Validator\n', 'cyan');
  log('━'.repeat(60), 'gray');

  const semanticDir = path.join(__dirname, '../tokens/semantic');
  const tokenFiles = fs.readdirSync(semanticDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('components') && !f.includes('.test.') && !f.includes('.md'));

  let totalAsymmetries = 0;
  const asymmetricFiles: { file: string; onlyLight: string[]; onlyDark: string[] }[] = [];

  log('Checking theme symmetry...\n', 'gray');

  tokenFiles.forEach(file => {
    const result = checkFileSymmetry(file);

    if (result.asymmetric) {
      totalAsymmetries++;
      asymmetricFiles.push({
        file,
        onlyLight: result.onlyLight,
        onlyDark: result.onlyDark,
      });
    }
  });

  if (totalAsymmetries === 0) {
    log('✅ All theme files are symmetric!\n', 'green');
    log(`   Checked ${tokenFiles.length} files`, 'gray');
    log('   Light and dark themes have identical structure\n', 'gray');
    log('━'.repeat(60), 'gray');
    process.exit(0);
  }

  // Report asymmetries
  log(`⚠️  Found ${totalAsymmetries} asymmetric file(s):\n`, 'yellow');

  asymmetricFiles.forEach(({ file, onlyLight, onlyDark }) => {
    log(`   ❌ ${file}`, 'red');

    if (onlyLight.length > 0) {
      log(`      Only in LIGHT theme (${onlyLight.length}):`, 'yellow');
      onlyLight.slice(0, 3).forEach(path => {
        log(`         ${path}`, 'gray');
      });
      if (onlyLight.length > 3) {
        log(`         ... and ${onlyLight.length - 3} more`, 'gray');
      }
    }

    if (onlyDark.length > 0) {
      log(`      Only in DARK theme (${onlyDark.length}):`, 'yellow');
      onlyDark.slice(0, 3).forEach(path => {
        log(`         ${path}`, 'gray');
      });
      if (onlyDark.length > 3) {
        log(`         ... and ${onlyDark.length - 3} more`, 'gray');
      }
    }

    log('', 'reset');
  });

  log('━'.repeat(60), 'gray');
  log('\n💡 Why This Matters:\n', 'cyan');
  log('   Asymmetric themes cause:', 'yellow');
  log('   • Undefined values in one theme', 'gray');
  log('   • Fallback to wrong colors', 'gray');
  log('   • Inconsistent user experience', 'gray');
  log('   • Hard-to-debug CSS issues', 'gray');

  log('\n💡 How to Fix:\n', 'cyan');
  log('   1. Add missing paths to deficient theme', 'gray');
  log('   2. Remove extra paths from theme with extras', 'gray');
  log('   3. Ensure both themes export same structure', 'gray');

  log('\n━'.repeat(60), 'gray');
  log(`\n❌ ${totalAsymmetries} file(s) have asymmetric themes\n`, 'red');

  process.exit(1);
}

main();
