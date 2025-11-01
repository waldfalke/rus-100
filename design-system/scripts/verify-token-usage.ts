/**
 * Token Usage Validator
 *
 * CRITICAL: Checks that semantic tokens are ACTUALLY used by CSS generator
 *
 * Problem: We can have "dead" token files that exist but don't generate CSS.
 * Example: buttons.ts exists (211 lines) but generate-css-variables.ts doesn't import it!
 *
 * This script prevents:
 * 1. Dead token files wasting developer time
 * 2. Confusion about which file to edit
 * 3. Duplicate/conflicting token definitions
 *
 * Usage:
 *   yarn verify-token-usage
 */

import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface TokenFile {
  name: string;
  path: string;
  importedBy: string[];
  usedByCssGen: boolean;
  lines: number;
}

function main() {
  log('\n🔍 Token Usage Validator\n', 'cyan');
  log('━'.repeat(60), 'gray');

  const semanticDir = path.join(__dirname, '../tokens/semantic');
  const cssGenPath = path.join(__dirname, 'generate-css-variables.ts');

  // Read CSS generator imports
  const cssGenContent = fs.readFileSync(cssGenPath, 'utf-8');

  // Find all semantic token files
  const tokenFiles = fs.readdirSync(semanticDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('.test.') && !f.includes('.md'))
    .map(filename => {
      const filePath = path.join(semanticDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;

      // Check if imported by CSS generator
      const tokenName = filename.replace('.ts', '');
      const usedByCssGen = cssGenContent.includes(`from '../tokens/semantic/${tokenName}`) ||
                          cssGenContent.includes(`from './tokens/semantic/${tokenName}`) ||
                          cssGenContent.includes(`'../tokens/semantic/${tokenName}'`) ||
                          cssGenContent.includes(`"../tokens/semantic/${tokenName}"`);

      return {
        name: filename,
        path: filePath,
        importedBy: [],
        usedByCssGen,
        lines,
      };
    });

  // Check for imports in other scripts
  const scriptsDir = path.join(__dirname);
  const scriptFiles = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.ts'));

  scriptFiles.forEach(scriptFile => {
    const scriptPath = path.join(scriptsDir, scriptFile);
    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

    tokenFiles.forEach(tokenFile => {
      const tokenName = tokenFile.name.replace('.ts', '');
      if (scriptContent.includes(`from '../tokens/semantic/${tokenName}`) ||
          scriptContent.includes(`from './tokens/semantic/${tokenName}`)) {
        tokenFile.importedBy.push(scriptFile);
      }
    });
  });

  // Categorize files
  const activeFiles = tokenFiles.filter(f => f.usedByCssGen);
  const deadFiles = tokenFiles.filter(f => !f.usedByCssGen);

  log('\n📦 Active Token Files (Used by CSS Generator):\n', 'green');
  if (activeFiles.length === 0) {
    log('   ❌ NO ACTIVE FILES FOUND! CSS generator broken!', 'red');
  } else {
    activeFiles.forEach(f => {
      log(`   ✅ ${f.name.padEnd(25)} (${f.lines.toString().padStart(3)} lines)`, 'green');
    });
  }

  log('\n⚠️  Dead Token Files (NOT used by CSS Generator):\n', 'yellow');
  if (deadFiles.length === 0) {
    log('   ✅ No dead files found!', 'green');
  } else {
    let totalDeadLines = 0;
    deadFiles.forEach(f => {
      totalDeadLines += f.lines;
      log(`   ❌ ${f.name.padEnd(25)} (${f.lines.toString().padStart(3)} lines) - WASTED`, 'red');
      if (f.importedBy.length > 0) {
        log(`      Used by: ${f.importedBy.join(', ')}`, 'gray');
      } else {
        log(`      ⚠️  Not imported by ANY script!`, 'yellow');
      }
    });
    log(`\n   📊 Total dead code: ${totalDeadLines} lines`, 'red');
  }

  // Check for duplicate token definitions
  log('\n🔍 Checking for Duplicate Token Definitions:\n', 'cyan');

  interface TokenDefinition {
    file: string;
    exportName: string;
  }

  const exports = new Map<string, TokenDefinition[]>();

  tokenFiles.forEach(f => {
    const content = fs.readFileSync(f.path, 'utf-8');
    const exportMatches = content.matchAll(/export\s+(const|type)\s+(\w+)/g);

    for (const match of exportMatches) {
      const exportName = match[2];
      if (!exports.has(exportName)) {
        exports.set(exportName, []);
      }
      exports.get(exportName)!.push({ file: f.name, exportName });
    }
  });

  let duplicatesFound = false;
  exports.forEach((definitions, exportName) => {
    if (definitions.length > 1) {
      duplicatesFound = true;
      log(`   ⚠️  Duplicate export: ${exportName}`, 'yellow');
      definitions.forEach(d => {
        log(`      - ${d.file}`, 'gray');
      });
    }
  });

  if (!duplicatesFound) {
    log('   ✅ No duplicate exports found', 'green');
  }

  // Check for naming conflicts
  log('\n🔍 Checking for Potential Naming Conflicts:\n', 'cyan');

  const potentialConflicts: string[] = [];

  // Check if we have both buttons.ts and interactive.ts with similar exports
  const buttonsFile = tokenFiles.find(f => f.name === 'buttons.ts');
  const interactiveFile = tokenFiles.find(f => f.name === 'interactive.ts');

  if (buttonsFile && interactiveFile) {
    const buttonsContent = fs.readFileSync(buttonsFile.path, 'utf-8');
    const interactiveContent = fs.readFileSync(interactiveFile.path, 'utf-8');

    // Check for "button" related exports
    const buttonExports = buttonsContent.match(/export\s+(?:const|type)\s+\w*[Bb]utton\w*/g) || [];
    const interactiveExports = interactiveContent.match(/export\s+(?:const|type)\s+\w*[Bb]utton\w*/g) || [];

    if (buttonExports.length > 0 && interactiveExports.length > 0) {
      log(`   ⚠️  Both buttons.ts and interactive.ts define button-related tokens!`, 'yellow');
      log(`      buttons.ts: ${buttonExports.join(', ')}`, 'gray');
      log(`      interactive.ts: ${interactiveExports.join(', ')}`, 'gray');
      potentialConflicts.push('buttons vs interactive');
    }
  }

  if (potentialConflicts.length === 0) {
    log('   ✅ No naming conflicts detected', 'green');
  }

  // Summary
  log('\n━'.repeat(60), 'gray');
  log('\n📊 Summary:\n', 'cyan');
  log(`   Active files:     ${activeFiles.length}`, 'green');
  log(`   Dead files:       ${deadFiles.length}${deadFiles.length > 0 ? ' ❌' : ' ✅'}`, deadFiles.length > 0 ? 'red' : 'green');
  log(`   Total files:      ${tokenFiles.length}`, 'blue');
  log(`   Duplicates:       ${duplicatesFound ? 'YES ⚠️' : 'NO ✅'}`, duplicatesFound ? 'yellow' : 'green');
  log(`   Conflicts:        ${potentialConflicts.length > 0 ? 'YES ⚠️' : 'NO ✅'}`, potentialConflicts.length > 0 ? 'yellow' : 'green');

  log('\n━'.repeat(60), 'gray');

  // Recommendations
  if (deadFiles.length > 0) {
    log('\n💡 Recommendations:\n', 'cyan');
    deadFiles.forEach(f => {
      if (f.importedBy.length === 0) {
        log(`   🗑️  DELETE ${f.name} (not used anywhere)`, 'yellow');
      } else {
        log(`   📝 MIGRATE or DEPRECATE ${f.name}`, 'yellow');
        log(`      Currently only used by: ${f.importedBy.join(', ')}`, 'gray');
      }
    });
  }

  if (buttonsFile && !buttonsFile.usedByCssGen && interactiveFile && interactiveFile.usedByCssGen) {
    log('\n⚠️  CRITICAL: buttons.ts exists but CSS generator uses interactive.ts!', 'red');
    log('   This causes confusion about which file to edit.', 'yellow');
    log('   See: src/design-system/tokens/semantic/MIGRATION_PLAN.md', 'cyan');
  }

  // Exit code
  const hasIssues = deadFiles.length > 0 || duplicatesFound || potentialConflicts.length > 0;

  if (hasIssues) {
    log('\n⚠️  Issues found. Review recommendations above.', 'yellow');
    log('ℹ️  This is informational only - does not block CI/CD\n', 'cyan');
  } else {
    log('\n✅ All tokens are properly used!', 'green');
  }

  process.exit(0); // Informational - don't fail build
}

main();
