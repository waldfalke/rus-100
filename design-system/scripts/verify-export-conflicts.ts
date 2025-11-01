/**
 * Export Conflicts Validator
 *
 * Detects when multiple files export the same symbol name.
 *
 * Problem: buttons.ts and components.ts both export "buttonTokens"
 * Result: Unpredictable behavior - last import wins, depends on import order
 *
 * Usage:
 *   yarn verify-export-conflicts
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

interface ExportInfo {
  file: string;
  name: string;
  type: 'const' | 'type' | 'function' | 'class' | 'interface';
  line: number;
}

function findExports(filePath: string): ExportInfo[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const exports: ExportInfo[] = [];
  const filename = path.basename(filePath);

  // Pattern: export const/type/function/class/interface NAME
  const exportPattern = /export\s+(const|type|function|class|interface)\s+(\w+)/g;

  lines.forEach((line, idx) => {
    const matches = [...line.matchAll(exportPattern)];
    matches.forEach(match => {
      exports.push({
        file: filename,
        name: match[2],
        type: match[1] as any,
        line: idx + 1,
      });
    });
  });

  return exports;
}

function main() {
  log('\n🔍 Export Conflicts Validator\n', 'cyan');
  log('━'.repeat(60), 'gray');

  const semanticDir = path.join(__dirname, '../tokens/semantic');
  const tokenFiles = fs.readdirSync(semanticDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('.test.') && !f.includes('.md'))
    .map(f => path.join(semanticDir, f));

  // Collect all exports
  const allExports: ExportInfo[] = [];
  tokenFiles.forEach(file => {
    allExports.push(...findExports(file));
  });

  // Group by export name
  const byName = new Map<string, ExportInfo[]>();
  allExports.forEach(exp => {
    if (!byName.has(exp.name)) {
      byName.set(exp.name, []);
    }
    byName.get(exp.name)!.push(exp);
  });

  // Find conflicts
  const conflicts = Array.from(byName.entries())
    .filter(([_, exports]) => exports.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (conflicts.length === 0) {
    log('\n✅ No export conflicts found!\n', 'green');
    log('━'.repeat(60), 'gray');
    process.exit(0);
  }

  // Report conflicts
  log('\n⚠️  Export Conflicts Found:\n', 'yellow');

  conflicts.forEach(([name, exports]) => {
    log(`   ❌ "${name}" exported by ${exports.length} files:`, 'red');
    exports.forEach(exp => {
      log(`      - ${exp.file.padEnd(25)} (line ${exp.line}, ${exp.type})`, 'gray');
    });
    log('', 'reset');
  });

  // Explain impact
  log('━'.repeat(60), 'gray');
  log('\n💡 Why This Matters:\n', 'cyan');
  log('   When multiple files export the same name:', 'yellow');
  log('   • Last import wins (unpredictable)', 'gray');
  log('   • Depends on import order in index.ts', 'gray');
  log('   • TypeScript may not warn!', 'gray');
  log('   • Refactoring becomes dangerous', 'gray');

  log('\n💡 How to Fix:\n', 'cyan');
  log('   1. Rename exports to be unique', 'gray');
  log('   2. Use namespaces (e.g., buttonSizes vs buttonColors)', 'gray');
  log('   3. Combine into single file if related', 'gray');

  // Specific recommendations
  const buttonConflict = conflicts.find(([name]) => name.toLowerCase().includes('button'));
  if (buttonConflict) {
    log('\n💡 Specific Fix for Button Tokens:\n', 'cyan');
    log('   buttons.ts:     export buttonColorTokens (variants: primary, secondary)', 'gray');
    log('   components.ts:  export buttonSizeTokens (sizes: xs, sm, md, lg)', 'gray');
  }

  log('\n━'.repeat(60), 'gray');
  log(`\n⚠️  Found ${conflicts.length} conflict(s). Review recommended.\n`, 'yellow');
  log('ℹ️  This is informational only - does not block CI/CD', 'cyan');

  process.exit(0); // Informational - don't fail build
}

main();
