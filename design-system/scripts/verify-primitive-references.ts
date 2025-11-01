#!/usr/bin/env tsx
/**
 * Primitive References Verification Script
 *
 * Validates that semantic tokens only reference valid primitive tokens.
 * Checks for:
 * 1. All primitiveColors.* references exist
 * 2. All primitiveSpacing.* references exist
 * 3. All primitiveTypography.* references exist
 * 4. Array indices are valid (e.g., primitiveColors.teal[700] - does [700] exist?)
 * 5. No typos in primitive names
 *
 * Usage:
 * ```bash
 * yarn verify-primitive-references
 * ```
 *
 * Exit codes:
 * 0 - All primitive references valid
 * 1 - Invalid references found
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface ReferenceIssue {
  file: string;
  line: number;
  reference: string;
  type: 'missing' | 'invalid-index' | 'typo' | 'undefined';
  severity: 'error' | 'warning';
  message: string;
  suggestion: string;
}

interface ValidationResult {
  checked: number;
  passed: number;
  errors: number;
  warnings: number;
  issues: ReferenceIssue[];
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
// PRIMITIVE TOKEN INDEXING
// ============================================

/**
 * Load and index all primitive tokens
 */
async function loadPrimitiveTokens(): Promise<Map<string, Set<string>>> {
  const tokensDir = path.join(process.cwd(), 'src/design-system/tokens/primitives');
  const toFileUrl = (filePath: string) => new URL(`file:///${filePath.replace(/\\/g, '/')}`).href;

  const primitiveIndex = new Map<string, Set<string>>();

  // Load all primitive token files
  const primitiveFiles = [
    'colors.ts',
    'spacing.ts',
    'typography.ts',
    'borders.ts',
    'shadows.ts',
    'animations.ts',
  ];

  for (const file of primitiveFiles) {
    const filePath = path.join(tokensDir, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const module = await import(toFileUrl(filePath));
      const baseName = file.replace('.ts', '');

      // Index all exported objects
      for (const [exportName, exportValue] of Object.entries(module)) {
        if (exportName.startsWith('primitive') && typeof exportValue === 'object') {
          const paths = extractAllPaths(exportValue);
          primitiveIndex.set(exportName, paths);
        }
      }
    } catch (error) {
      log(`  ⚠️  Failed to load ${file}: ${error}`, 'yellow');
    }
  }

  return primitiveIndex;
}

/**
 * Recursively extract all valid paths from a primitive token object
 */
function extractAllPaths(obj: any, currentPath: string[] = []): Set<string> {
  const paths = new Set<string>();

  if (typeof obj !== 'object' || obj === null) {
    // Leaf node - add current path
    if (currentPath.length > 0) {
      paths.add(currentPath.join('.'));
    }
    return paths;
  }

  // Handle arrays (e.g., colors with numeric indices)
  if (Array.isArray(obj)) {
    obj.forEach((_, index) => {
      paths.add([...currentPath, String(index)].join('.'));
    });
    return paths;
  }

  // Handle objects
  for (const key of Object.keys(obj)) {
    const newPath = [...currentPath, key];
    paths.add(newPath.join('.'));

    // Recursively process nested objects
    const nestedPaths = extractAllPaths(obj[key], newPath);
    nestedPaths.forEach((p) => paths.add(p));
  }

  return paths;
}

// ============================================
// REFERENCE EXTRACTION
// ============================================

/**
 * Extract all primitive references from a file
 */
function extractPrimitiveReferences(
  filePath: string,
  content: string
): Array<{ line: number; reference: string; fullMatch: string }> {
  const references: Array<{ line: number; reference: string; fullMatch: string }> = [];

  // Match patterns like: primitiveColors.brand.primary[500]
  // primitiveSpacing[4], primitiveTypography.fontSizes.base, etc.
  const regex = /(primitive\w+)(\.[a-zA-Z_]+|\[[^\]]+\])+/g;

  const lines = content.split('\n');
  lines.forEach((line, lineIndex) => {
    let match;
    const lineRegex = new RegExp(regex);
    while ((match = lineRegex.exec(line)) !== null) {
      references.push({
        line: lineIndex + 1,
        reference: match[0],
        fullMatch: match[0],
      });
    }
  });

  return references;
}

/**
 * Parse a primitive reference into base and path
 * e.g., "primitiveColors.brand.primary[500]" -> { base: "primitiveColors", path: "brand.primary.500" }
 */
function parsePrimitiveReference(reference: string): {
  base: string;
  path: string;
} | null {
  const match = reference.match(/^(primitive\w+)(\..*|\[.*)?$/);
  if (!match) {
    return null;
  }

  const base = match[1];
  let path = match[2] || '';

  // Convert bracket notation to dot notation: [500] -> .500, ['key'] -> .key
  path = path
    .replace(/\[['"]?([^'"\]]+)['"]?\]/g, '.$1')
    .replace(/^\./, ''); // Remove leading dot

  return { base, path };
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate a single primitive reference
 */
function validateReference(
  reference: string,
  primitiveIndex: Map<string, Set<string>>,
  fileName: string,
  lineNumber: number
): ReferenceIssue | null {
  const parsed = parsePrimitiveReference(reference);
  if (!parsed) {
    return {
      file: fileName,
      line: lineNumber,
      reference,
      type: 'typo',
      severity: 'error',
      message: `Invalid primitive reference syntax: ${reference}`,
      suggestion: 'Check syntax - should be like primitiveColors.brand.primary[500]',
    };
  }

  const { base, path } = parsed;

  // Check if primitive base exists
  if (!primitiveIndex.has(base)) {
    // Find similar names (typo detection)
    const availableBases = Array.from(primitiveIndex.keys());
    const similar = availableBases.find((b) =>
      levenshteinDistance(base, b) <= 2
    );

    return {
      file: fileName,
      line: lineNumber,
      reference,
      type: 'typo',
      severity: 'error',
      message: `Primitive base not found: ${base}`,
      suggestion: similar
        ? `Did you mean: ${similar}?`
        : `Available: ${availableBases.join(', ')}`,
    };
  }

  // Check if path exists in primitive
  const validPaths = primitiveIndex.get(base)!;

  if (path && !validPaths.has(path)) {
    // Try to find similar paths
    const pathParts = path.split('.');
    const similarPaths: string[] = [];

    // Check if partial path exists
    for (let i = pathParts.length - 1; i > 0; i--) {
      const partialPath = pathParts.slice(0, i).join('.');
      if (validPaths.has(partialPath)) {
        // Find what keys are available at this level
        const prefix = partialPath + '.';
        const availableKeys = Array.from(validPaths)
          .filter((p) => p.startsWith(prefix) && p.split('.').length === pathParts.length)
          .map((p) => p.split('.').pop())
          .filter((k, i, arr) => arr.indexOf(k) === i); // unique

        if (availableKeys.length > 0 && availableKeys.length <= 10) {
          return {
            file: fileName,
            line: lineNumber,
            reference,
            type: 'invalid-index',
            severity: 'error',
            message: `Path not found: ${reference}`,
            suggestion: `Available at ${partialPath}: [${availableKeys.join(', ')}]`,
          };
        }
      }
    }

    // General error
    return {
      file: fileName,
      line: lineNumber,
      reference,
      type: 'missing',
      severity: 'error',
      message: `Path not found in ${base}: ${path}`,
      suggestion: 'Check primitive token definitions for valid paths',
    };
  }

  return null;
}

/**
 * Calculate Levenshtein distance for typo detection
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Validate all primitive references in a file
 */
function validateFile(
  filePath: string,
  relativePath: string,
  primitiveIndex: Map<string, Set<string>>
): ReferenceIssue[] {
  const issues: ReferenceIssue[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const references = extractPrimitiveReferences(filePath, content);

  for (const { line, reference } of references) {
    const issue = validateReference(reference, primitiveIndex, relativePath, line);
    if (issue) {
      issues.push(issue);
    }
  }

  return issues;
}

// ============================================
// MAIN VALIDATION
// ============================================

/**
 * Validate all semantic token files
 */
async function validatePrimitiveReferences(): Promise<ValidationResult> {
  const startTime = Date.now();

  const result: ValidationResult = {
    checked: 0,
    passed: 0,
    errors: 0,
    warnings: 0,
    issues: [],
  };

  log(`\n${'='.repeat(60)}`, 'cyan');
  log('Primitive References Verification', 'cyan');
  log('='.repeat(60), 'cyan');

  log('\nLoading primitive tokens...', 'gray');
  const primitiveIndex = await loadPrimitiveTokens();

  log(`Indexed ${primitiveIndex.size} primitive token sets:`, 'gray');
  primitiveIndex.forEach((paths, name) => {
    log(`  - ${name}: ${paths.size} paths`, 'gray');
  });

  // Find all semantic token files
  const semanticDir = path.join(process.cwd(), 'src/design-system/tokens/semantic');

  function findSemanticFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'legacy') {
        files.push(...findSemanticFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
        files.push(fullPath);
      }
    }

    return files;
  }

  const semanticFiles = findSemanticFiles(semanticDir);
  result.checked = semanticFiles.length;

  log(`\nValidating ${semanticFiles.length} semantic token files...\n`, 'gray');

  for (const filePath of semanticFiles) {
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const issues = validateFile(filePath, relativePath, primitiveIndex);

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
function printReport(result: ValidationResult): void {
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
    const byFile = new Map<string, ReferenceIssue[]>();
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

        log(`  ${icon} Line ${issue.line}: ${issue.message}`, color);
        log(`     Reference: ${issue.reference}`, 'gray');
        log(`     ${issue.suggestion}`, 'blue');
      }
    }
  }

  log(`\n${'='.repeat(60)}`, 'cyan');

  if (result.errors > 0) {
    log('❌ Primitive reference validation failed!', 'red');
    log('\nPlease fix the invalid references above.', 'yellow');
  } else if (result.warnings > 0) {
    log('⚠️  Passed with warnings', 'yellow');
  } else {
    log('✅ All primitive references validated!', 'green');
  }

  log('='.repeat(60), 'cyan');
}

// ============================================
// ENTRY POINT
// ============================================

async function main(): Promise<void> {
  try {
    const result = await validatePrimitiveReferences();
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
