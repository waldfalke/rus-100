#!/usr/bin/env tsx
/**
 * Token Exports Verification Script
 *
 * Ensures all semantic token files are properly exported from semantic/index.ts
 *
 * Validates:
 * 1. Every semantic/*.ts file (except index.ts) has corresponding exports in index.ts
 * 2. Named exports present: light*Tokens, dark*Tokens, type *Tokens
 * 3. Aggregation: tokens included in lightSemanticTokens and darkSemanticTokens objects
 * 4. No typos in import/export names
 *
 * Usage:
 * ```bash
 * yarn verify-token-exports
 * ```
 *
 * Exit codes:
 * 0 - All exports verified
 * 1 - Missing or incorrect exports found
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface ExportIssue {
  file: string;
  type: 'missing-import' | 'missing-export' | 'missing-aggregation' | 'typo' | 'info';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  lineToAdd?: string;
}

interface ExportResult {
  checked: number;
  passed: number;
  errors: number;
  warnings: number;
  issues: ExportIssue[];
}

interface TokenFileInfo {
  fileName: string;
  baseName: string;
  componentName: string;
  expectedLight: string;
  expectedDark: string;
  expectedType: string;
}

// ============================================
// COLORS
// ============================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// UTILITIES
// ============================================

/**
 * Convert plural file name to singular component name
 */
const PLURAL_TO_SINGULAR: Record<string, string> = {
  buttons: 'Button',
  badges: 'Badge',
  forms: 'Form',
  links: 'Link',
  surfaces: 'Surface',
  animations: 'Animation',
  borders: 'Border',
  shadows: 'Shadow',
  colors: 'Color',
  typography: 'Typography',
  interactive: 'Interactive',
  status: 'Status',
};

function getComponentName(baseName: string): string {
  return PLURAL_TO_SINGULAR[baseName] ||
    (baseName.charAt(0).toUpperCase() + baseName.slice(1));
}

// ============================================
// FILE SCANNING
// ============================================

/**
 * Get all semantic token files (except index.ts)
 */
function getSemanticTokenFiles(semanticDir: string): TokenFileInfo[] {
  const files: TokenFileInfo[] = [];
  const entries = fs.readdirSync(semanticDir);

  for (const entry of entries) {
    // Skip index.ts, legacy directory, and non-TS files
    if (entry === 'index.ts' || entry === 'legacy' || !entry.endsWith('.ts')) {
      continue;
    }

    const baseName = entry.replace('.ts', '');
    const componentName = getComponentName(baseName);

    files.push({
      fileName: entry,
      baseName,
      componentName,
      expectedLight: `light${componentName}Tokens`,
      expectedDark: `dark${componentName}Tokens`,
      expectedType: `${componentName}Tokens`,
    });
  }

  return files;
}

// ============================================
// INDEX.TS PARSING
// ============================================

/**
 * Parse index.ts and extract all imports and exports
 */
function parseIndexFile(indexPath: string): {
  imports: Map<string, { light: string; dark: string; type: string }>;
  exports: Set<string>;
  lightAggregation: Map<string, string>;
  darkAggregation: Map<string, string>;
} {
  const content = fs.readFileSync(indexPath, 'utf-8');
  const imports = new Map<string, { light: string; dark: string; type: string }>();
  const exports = new Set<string>();
  const lightAggregation = new Map<string, string>();
  const darkAggregation = new Map<string, string>();

  // Parse imports: import { lightButtonTokens, darkButtonTokens, type ButtonTokens } from './buttons';
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\/([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const imports_text = match[1];
    const file = match[2];

    const lightMatch = imports_text.match(/(\w*light\w*Tokens)/);
    const darkMatch = imports_text.match(/(\w*dark\w*Tokens)/);
    const typeMatch = imports_text.match(/type\s+(\w+Tokens)/);

    imports.set(file, {
      light: lightMatch ? lightMatch[1] : '',
      dark: darkMatch ? darkMatch[1] : '',
      type: typeMatch ? typeMatch[1] : '',
    });
  }

  // Parse exports: export { lightButtonTokens, darkButtonTokens, type ButtonTokens }
  const exportRegex = /export\s*{\s*([^}]+)\s*}/g;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportsText = match[1];
    const exportNames = exportsText.split(',').map((e) => e.trim().replace(/^type\s+/, ''));
    exportNames.forEach((name) => exports.add(name));
  }

  // Parse light aggregation: buttons: lightButtonTokens,
  const lightAggregationRegex = /export\s+const\s+lightSemanticTokens\s*=\s*{([^}]+)}/s;
  const lightAggMatch = content.match(lightAggregationRegex);
  if (lightAggMatch) {
    const entries = lightAggMatch[1].matchAll(/(\w+):\s*(\w+),?/g);
    for (const [, key, value] of entries) {
      lightAggregation.set(key, value);
    }
  }

  // Parse dark aggregation: buttons: darkButtonTokens,
  const darkAggregationRegex = /export\s+const\s+darkSemanticTokens\s*=\s*{([^}]+)}/s;
  const darkAggMatch = content.match(darkAggregationRegex);
  if (darkAggMatch) {
    const entries = darkAggMatch[1].matchAll(/(\w+):\s*(\w+),?/g);
    for (const [, key, value] of entries) {
      darkAggregation.set(key, value);
    }
  }

  return { imports, exports, lightAggregation, darkAggregation };
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate a single token file's exports
 */
function validateTokenFile(
  fileInfo: TokenFileInfo,
  indexData: ReturnType<typeof parseIndexFile>
): ExportIssue[] {
  const issues: ExportIssue[] = [];
  const { baseName, fileName, expectedLight, expectedDark, expectedType } = fileInfo;
  const { imports, exports, lightAggregation, darkAggregation } = indexData;

  // Skip components.ts (structural tokens, not theme-based)
  if (baseName === 'components') {
    return issues;
  }

  // Check if file is imported
  const importData = imports.get(baseName);
  if (!importData) {
    issues.push({
      file: fileName,
      type: 'missing-import',
      severity: 'error',
      message: `File "${fileName}" is not imported in index.ts`,
      suggestion: `Add to semantic/index.ts:`,
      lineToAdd: `import {\n  ${expectedLight},\n  ${expectedDark},\n  type ${expectedType},\n} from './${baseName}';`,
    });
    return issues; // No point checking further if not imported
  }

  // Check light import
  if (!importData.light || importData.light !== expectedLight) {
    issues.push({
      file: fileName,
      type: importData.light ? 'typo' : 'missing-import',
      severity: 'error',
      message: `Light token import ${importData.light ? `"${importData.light}"` : 'missing'} for ${fileName}`,
      suggestion: `Expected: ${expectedLight}${importData.light ? ` (found: ${importData.light})` : ''}`,
      lineToAdd: importData.light ? undefined : `  ${expectedLight},`,
    });
  }

  // Check dark import
  if (!importData.dark || importData.dark !== expectedDark) {
    issues.push({
      file: fileName,
      type: importData.dark ? 'typo' : 'missing-import',
      severity: 'error',
      message: `Dark token import ${importData.dark ? `"${importData.dark}"` : 'missing'} for ${fileName}`,
      suggestion: `Expected: ${expectedDark}${importData.dark ? ` (found: ${importData.dark})` : ''}`,
      lineToAdd: importData.dark ? undefined : `  ${expectedDark},`,
    });
  }

  // Check type import
  if (!importData.type || importData.type !== expectedType) {
    issues.push({
      file: fileName,
      type: importData.type ? 'typo' : 'missing-import',
      severity: 'error',
      message: `Type import ${importData.type ? `"${importData.type}"` : 'missing'} for ${fileName}`,
      suggestion: `Expected: type ${expectedType}${importData.type ? ` (found: ${importData.type})` : ''}`,
      lineToAdd: importData.type ? undefined : `  type ${expectedType},`,
    });
  }

  // Check named exports
  if (!exports.has(expectedLight)) {
    issues.push({
      file: fileName,
      type: 'missing-export',
      severity: 'error',
      message: `Light token not re-exported: ${expectedLight}`,
      suggestion: `Add to export block in index.ts`,
      lineToAdd: `  ${expectedLight},`,
    });
  }

  if (!exports.has(expectedDark)) {
    issues.push({
      file: fileName,
      type: 'missing-export',
      severity: 'error',
      message: `Dark token not re-exported: ${expectedDark}`,
      suggestion: `Add to export block in index.ts`,
      lineToAdd: `  ${expectedDark},`,
    });
  }

  // Check for type export - allow V1 suffix for deprecated tokens
  const typeExported = exports.has(expectedType) || exports.has(`${expectedType}V1`);
  if (!typeExported) {
    issues.push({
      file: fileName,
      type: 'missing-export',
      severity: 'error',
      message: `Type not re-exported: ${expectedType}`,
      suggestion: `Add to export block in index.ts (or use ${expectedType}V1 for deprecated)`,
      lineToAdd: `  type ${expectedType},`,
    });
  }

  // Check light aggregation
  // Try both plural and singular keys (e.g., 'buttons' and 'button', 'links' and 'link')
  const pluralKey = baseName;
  const singularKey = baseName.replace(/s$/, ''); // Simple pluralization removal
  const aggregationKey = lightAggregation.has(pluralKey) ? pluralKey :
    lightAggregation.has(singularKey) ? singularKey : pluralKey;

  if (!lightAggregation.has(aggregationKey)) {
    issues.push({
      file: fileName,
      type: 'missing-aggregation',
      severity: 'error',
      message: `Not included in lightSemanticTokens aggregation`,
      suggestion: `Add to lightSemanticTokens object (use '${aggregationKey}' as key):`,
      lineToAdd: `  ${aggregationKey}: ${expectedLight},`,
    });
  } else if (lightAggregation.get(aggregationKey) !== expectedLight) {
    issues.push({
      file: fileName,
      type: 'typo',
      severity: 'error',
      message: `Wrong value in lightSemanticTokens: ${lightAggregation.get(aggregationKey)}`,
      suggestion: `Should be: ${expectedLight}`,
      lineToAdd: `  ${aggregationKey}: ${expectedLight},`,
    });
  }

  // Check dark aggregation
  if (!darkAggregation.has(aggregationKey)) {
    issues.push({
      file: fileName,
      type: 'missing-aggregation',
      severity: 'error',
      message: `Not included in darkSemanticTokens aggregation`,
      suggestion: `Add to darkSemanticTokens object (use '${aggregationKey}' as key):`,
      lineToAdd: `  ${aggregationKey}: ${expectedDark},`,
    });
  } else if (darkAggregation.get(aggregationKey) !== expectedDark) {
    issues.push({
      file: fileName,
      type: 'typo',
      severity: 'error',
      message: `Wrong value in darkSemanticTokens: ${darkAggregation.get(aggregationKey)}`,
      suggestion: `Should be: ${expectedDark}`,
      lineToAdd: `  ${aggregationKey}: ${expectedDark},`,
    });
  }

  return issues;
}

// ============================================
// MAIN VALIDATION
// ============================================

/**
 * Validate all token exports
 */
function validateTokenExports(): ExportResult {
  const startTime = Date.now();

  const result: ExportResult = {
    checked: 0,
    passed: 0,
    errors: 0,
    warnings: 0,
    issues: [],
  };

  const semanticDir = path.join(process.cwd(), 'src/design-system/tokens/semantic');
  const indexPath = path.join(semanticDir, 'index.ts');

  if (!fs.existsSync(indexPath)) {
    result.errors++;
    result.issues.push({
      file: 'semantic/index.ts',
      type: 'missing-import',
      severity: 'error',
      message: 'index.ts not found in semantic directory',
      suggestion: 'Create semantic/index.ts to export all tokens',
    });
    return result;
  }

  const tokenFiles = getSemanticTokenFiles(semanticDir);
  const indexData = parseIndexFile(indexPath);

  result.checked = tokenFiles.length;

  log(`\n${'='.repeat(60)}`, 'cyan');
  log('Token Exports Verification', 'cyan');
  log('='.repeat(60), 'cyan');

  for (const fileInfo of tokenFiles) {
    const issues = validateTokenFile(fileInfo, indexData);

    if (issues.length > 0) {
      result.issues.push(...issues);
      result.errors += issues.filter((i) => i.severity === 'error').length;
      result.warnings += issues.filter((i) => i.severity === 'warning').length;
    } else {
      result.passed++;
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  (result as any).executionTime = duration;

  return result;
}

// ============================================
// REPORTING
// ============================================

/**
 * Print validation report
 */
function printReport(result: ExportResult): void {
  log(`\n${'─'.repeat(60)}`, 'gray');
  log('Results Summary', 'bold');
  log('─'.repeat(60), 'gray');

  log(`\nFiles checked: ${result.checked}`);
  log(`Files passed:  ${result.passed}`, 'green');
  log(`Errors found:  ${result.errors}`, result.errors > 0 ? 'red' : 'green');
  log(`Warnings:      ${result.warnings}`, result.warnings > 0 ? 'yellow' : 'green');

  const executionTime = (result as any).executionTime;
  if (executionTime) {
    log(`\n⏱️  Execution time: ${executionTime}s`, 'gray');
  }

  if (result.issues.length > 0) {
    log(`\n${'─'.repeat(60)}`, 'gray');
    log('Issues Found', 'bold');
    log('─'.repeat(60), 'gray');

    // Group by file
    const byFile = new Map<string, ExportIssue[]>();
    for (const issue of result.issues) {
      if (!byFile.has(issue.file)) {
        byFile.set(issue.file, []);
      }
      byFile.get(issue.file)!.push(issue);
    }

    for (const [file, issues] of byFile) {
      log(`\n📁 ${file}`, 'cyan');

      for (const issue of issues) {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        const color = issue.severity === 'error' ? 'red' : 'yellow';

        log(`  ${icon} ${issue.message}`, color);
        log(`     ${issue.suggestion}`, 'blue');

        if (issue.lineToAdd) {
          log(`     Code to add:`, 'gray');
          const lines = issue.lineToAdd.split('\n');
          lines.forEach((line) => {
            log(`       ${line}`, 'green');
          });
        }
      }
    }

    // Provide summary fix instructions
    log(`\n${'─'.repeat(60)}`, 'gray');
    log('How to Fix', 'bold');
    log('─'.repeat(60), 'gray');

    log('\n1. Open src/design-system/tokens/semantic/index.ts');
    log('2. Add missing imports at the top:');

    const missingImports = result.issues.filter((i) => i.type === 'missing-import');
    if (missingImports.length > 0) {
      log('');
      missingImports.forEach((issue) => {
        if (issue.lineToAdd && issue.lineToAdd.includes('import')) {
          log(issue.lineToAdd, 'green');
        }
      });
    }

    log('\n3. Add missing re-exports to the export block');
    log('4. Add missing entries to lightSemanticTokens and darkSemanticTokens objects');
  }

  log(`\n${'='.repeat(60)}`, 'cyan');

  if (result.errors > 0) {
    log('❌ Export validation failed!', 'red');
    log('\nPlease fix the errors above to ensure all tokens are properly exported.', 'yellow');
  } else if (result.warnings > 0) {
    log('⚠️  Passed with warnings', 'yellow');
  } else {
    log('✅ All token exports verified!', 'green');
  }

  log('='.repeat(60), 'cyan');
}

// ============================================
// ENTRY POINT
// ============================================

async function main(): Promise<void> {
  try {
    const result = validateTokenExports();
    printReport(result);

    // Exit with appropriate code
    if (result.errors > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    log('\n❌ Fatal error during validation:', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
