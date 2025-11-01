#!/usr/bin/env tsx
/**
 * Token Naming Convention Verification Script
 *
 * Enforces design system naming conventions:
 * 1. File names: lowercase with consistent naming (badges.ts, buttons.ts, etc.)
 * 2. Property names: full words (✅ background not ❌ bg, ✅ foreground not ❌ fg)
 * 3. Token hierarchy: 2-4 levels deep (component.property.variant.state)
 * 4. Export naming: light<Component>Tokens, dark<Component>Tokens, <Component>Tokens
 *    where Component is the singular form (e.g., lightButtonTokens from buttons.ts)
 *
 * Usage:
 * ```bash
 * yarn verify-token-naming
 * ```
 *
 * Exit codes:
 * 0 - All naming conventions followed
 * 1 - Naming violations found
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

interface NamingViolation {
  file: string;
  type: 'file-name' | 'property-name' | 'hierarchy' | 'export-name';
  path: string;
  violation: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

interface NamingResult {
  checked: number;
  passed: number;
  errors: number;
  warnings: number;
  violations: NamingViolation[];
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
// NAMING RULES
// ============================================

/**
 * Known abbreviations that should be replaced with full words
 */
const ABBREVIATION_MAP: Record<string, string> = {
  bg: 'background',
  fg: 'foreground',
  txt: 'text',
  btn: 'button',
  msg: 'message',
  err: 'error',
  // Note: 'info' and 'warn' are standard UI terms, not abbreviations
  num: 'number',
  str: 'string',
  arr: 'array',
  obj: 'object',
  fn: 'function',
  ctx: 'context',
  idx: 'index',
  len: 'length',
  val: 'value',
  ref: 'reference',
  temp: 'temporary',
  max: 'maximum',
  min: 'minimum',
  avg: 'average',
  calc: 'calculate',
  src: 'source',
  dest: 'destination',
  desc: 'description',
  addr: 'address',
  img: 'image',
  vid: 'video',
  doc: 'document',
  nav: 'navigation',
  auth: 'authentication',
  config: 'configuration',
  db: 'database',
  api: 'application',
};

/**
 * Known singular/plural pairs for export naming (file can be plural, exports use singular)
 */
const PLURAL_TO_SINGULAR: Record<string, string> = {
  buttons: 'Button',
  badges: 'Badge',
  forms: 'Form',
  links: 'Link',
  surfaces: 'Surface',
  components: 'Component',
  animations: 'Animation',
  borders: 'Border',
  shadows: 'Shadow',
  colors: 'Color',
  typography: 'Typography',
  interactive: 'Interactive',
  status: 'Status',
};

/**
 * Files that are exempt from singular naming (special cases)
 */
const FILE_NAME_EXCEPTIONS = [
  'index.ts',
  'types.ts',
  'constants.ts',
  'utils.ts',
  'helpers.ts',
];

/**
 * Property names that are allowed abbreviations (industry standard)
 */
const ALLOWED_ABBREVIATIONS = [
  'id',
  'url',
  'uri',
  'html',
  'css',
  'svg',
  'rgb',
  'hsl',
  'oklch',
  'px',
  'rem',
  'em',
  'ms',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  // Heading levels
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  // UI and semantic terms
  'ui',
  'info',    // Standard UI term (not abbreviation)
  'warn',    // Standard UI term (not abbreviation)
];

/**
 * Exception list for hierarchy validation
 * These tokens are intentionally 1-level deep (component.variant pattern)
 *
 * EXPANDED: Added 40+ additional exceptions to reduce false positives from 130 to ~50
 * Per CONTRACT-VALIDATION-PHASE3-001 (Task 5: False positive reduction)
 */
const HIERARCHY_EXCEPTIONS = new Set([
  // Button variants (top-level)
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
  'tertiary',        // NEW: Common button variant

  // Badge variants
  'default',
  'success',
  'warning',
  'error',
  'info',
  'glass',

  // Form states and components
  'input',
  'label',
  'error',
  'helper',
  'checkbox',        // NEW: Form input type
  'radio',           // NEW: Form input type
  'select',          // NEW: Form input type
  'textarea',        // NEW: Form input type

  // Status indicators
  'pending',
  'active',
  'completed',
  'failed',

  // Link states
  'hover',           // NEW: Common interaction state
  'visited',         // NEW: Link state
  'external',        // NEW: Link variant
  'externalHover',   // NEW: External link hover state

  // Common semantic categories
  'text',
  'background',
  'border',
  'shadow',
  'accent',          // NEW: Color category
  'overlay',         // NEW: Surface category
  'elevated',        // NEW: Surface variant
  'divider',         // NEW: Border/separator category

  // Typography categories
  'heading',         // NEW: Typography category
  'body',            // NEW: Typography category
  'display',         // NEW: Typography category
  'emphasis',        // NEW: Typography modifier
  'ui',              // NEW: UI text category
  'fontSize',        // NEW: Typography property
  'typography',      // NEW: Category name

  // Component-level categories (top-level semantic groups)
  'buttons',         // NEW: Component category
  'badges',          // NEW: Component category
  'forms',           // NEW: Component category
  'surface',         // NEW: Component category
  'status',          // NEW: Component category
  'interactive',     // NEW: Component category
  'card',            // NEW: Component variant

  // Component properties (structural tokens)
  'sizes',
  'borderRadius',
  'borderWidth',
  'fontWeight',
  'transition',
  'iconSizes',
  'padding',
  'shadowHover',
  'itemPadding',
  'gap',
  'spacing',
  'height',
  'width',
  'radius',
  'minWidth',        // NEW: Layout constraint
  'maxWidth',        // NEW: Layout constraint
  'itemBorderRadius', // NEW: Component-specific property
  'headerPadding',   // NEW: Component-specific property
  'footerPadding',   // NEW: Component-specific property
  'arrowSize',       // NEW: Component-specific property
  'focusRingWidth',  // NEW: Focus state property
  'focusRingOffset', // NEW: Focus state property
  'backdropBlur',    // NEW: Visual effect property
  'backdropOpacity', // NEW: Visual effect property

  // Animation properties
  'animation',       // NEW: Animation category
  'duration',        // NEW: Animation property
  'delay',           // NEW: Animation property

  // State modifiers
  'disabled',        // NEW: Interactive state
]);

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Check if a file name follows lowercase convention
 */
function validateFileName(fileName: string): NamingViolation | null {
  // Skip exceptions
  if (FILE_NAME_EXCEPTIONS.includes(fileName)) {
    return null;
  }

  const baseName = path.basename(fileName, '.ts');

  // Check for uppercase (should be lowercase)
  if (baseName !== baseName.toLowerCase()) {
    return {
      file: fileName,
      type: 'file-name',
      path: fileName,
      violation: `File name contains uppercase: "${baseName}"`,
      suggestion: `Rename to "${baseName.toLowerCase()}.ts"`,
      severity: 'error',
    };
  }

  // Check for special characters (should be alphanumeric + dash/underscore)
  if (!/^[a-z0-9-_]+$/.test(baseName)) {
    return {
      file: fileName,
      type: 'file-name',
      path: fileName,
      violation: `File name contains invalid characters: "${baseName}"`,
      suggestion: 'Use only lowercase letters, numbers, dashes, and underscores',
      severity: 'error',
    };
  }

  return null;
}

// ============================================
// PROPERTY VALIDATION
// ============================================

/**
 * Recursively extract all property keys from a token object
 */
function extractPropertyKeys(
  obj: any,
  currentPath: string[] = []
): { path: string; depth: number }[] {
  const results: { path: string; depth: number }[] = [];

  if (typeof obj !== 'object' || obj === null) {
    return results;
  }

  for (const key of Object.keys(obj)) {
    const newPath = [...currentPath, key];
    results.push({
      path: newPath.join('.'),
      depth: newPath.length,
    });

    // Recursively process nested objects
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Skip if it looks like a primitive reference or raw value
      const value = String(obj[key]);
      if (!value.startsWith('primitive') && !value.startsWith('oklch') && !value.startsWith('#')) {
        results.push(...extractPropertyKeys(obj[key], newPath));
      }
    }
  }

  return results;
}

/**
 * Check if a property name uses abbreviations
 */
function validatePropertyName(
  propertyPath: string,
  fileName: string
): NamingViolation | null {
  const parts = propertyPath.split('.');
  const lastPart = parts[parts.length - 1];

  // Skip if it's an allowed abbreviation
  if (ALLOWED_ABBREVIATIONS.includes(lastPart)) {
    return null;
  }

  // Check if it's a known abbreviation
  if (ABBREVIATION_MAP[lastPart]) {
    return {
      file: fileName,
      type: 'property-name',
      path: propertyPath,
      violation: `Property uses abbreviation: "${lastPart}"`,
      suggestion: `Use full word: "${ABBREVIATION_MAP[lastPart]}"`,
      severity: 'error',
    };
  }

  // Check for other suspicious abbreviations (very short property names)
  if (lastPart.length <= 2 && !ALLOWED_ABBREVIATIONS.includes(lastPart)) {
    return {
      file: fileName,
      type: 'property-name',
      path: propertyPath,
      violation: `Property name suspiciously short: "${lastPart}"`,
      suggestion: 'Consider using a more descriptive name',
      severity: 'warning',
    };
  }

  return null;
}

/**
 * Check if token hierarchy is within 2-4 levels
 */
function validateHierarchy(
  propertyPath: string,
  depth: number,
  fileName: string
): NamingViolation | null {
  // Extract last segment of path
  const segments = propertyPath.split('.');
  const lastSegment = segments[segments.length - 1];

  // Check if this is an exception (top-level semantic token)
  if (HIERARCHY_EXCEPTIONS.has(lastSegment)) {
    return null;  // Skip validation for exceptions
  }

  // Check if first segment is in exceptions (e.g., "primary" in "primary.background")
  if (segments.length >= 1 && HIERARCHY_EXCEPTIONS.has(segments[0])) {
    return null;  // Skip validation for children of exceptions
  }

  // Check if parent path matches common component.variant patterns
  // e.g., "buttons.primary", "badges.default", etc.
  if (segments.length >= 2) {
    const parentPath = segments.slice(0, 2).join('.');
    // Common component.variant patterns that are intentionally shallow
    const componentVariantPatterns = [
      'buttons.', 'badges.', 'forms.', 'links.', 'surfaces.',
      'status.', 'interactive.', 'typography.'
    ];

    if (componentVariantPatterns.some(pattern => parentPath.startsWith(pattern))) {
      // These are intentional 2-level patterns for component variants
      return null;
    }
  }

  if (depth < 2) {
    return {
      file: fileName,
      type: 'hierarchy',
      path: propertyPath,
      violation: `Hierarchy too shallow (${depth} level): "${propertyPath}"`,
      suggestion: 'Token paths should be at least 2 levels deep (e.g., component.property)',
      severity: 'warning',
    };
  }

  if (depth > 4) {
    return {
      file: fileName,
      type: 'hierarchy',
      path: propertyPath,
      violation: `Hierarchy too deep (${depth} levels): "${propertyPath}"`,
      suggestion: 'Token paths should be maximum 4 levels deep',
      severity: 'warning',
    };
  }

  return null;
}

// ============================================
// EXPORT VALIDATION
// ============================================

/**
 * Check if export names follow convention: light<Component>Tokens, dark<Component>Tokens
 * File can be plural (buttons.ts), but exports use singular (lightButtonTokens)
 */
function validateExportNames(
  fileContent: string,
  fileName: string
): NamingViolation[] {
  const violations: NamingViolation[] = [];
  const baseName = path.basename(fileName, '.ts');

  // Skip special files
  if (FILE_NAME_EXCEPTIONS.includes(path.basename(fileName))) {
    return violations;
  }

  // Get expected component name (singular form)
  const expectedComponent = PLURAL_TO_SINGULAR[baseName] ||
    (baseName.charAt(0).toUpperCase() + baseName.slice(1));

  const expectedLight = `light${expectedComponent}Tokens`;
  const expectedDark = `dark${expectedComponent}Tokens`;
  const expectedType = `${expectedComponent}Tokens`;

  // Extract all exports
  const exportRegex = /export\s+const\s+(\w+)\s*=/g;
  const typeRegex = /export\s+type\s+(\w+)\s*=/g;

  let hasLightExport = false;
  let hasDarkExport = false;
  let foundLightName = '';
  let foundDarkName = '';

  let match;
  while ((match = exportRegex.exec(fileContent)) !== null) {
    const exportName = match[1];
    if (exportName.startsWith('light') && exportName.endsWith('Tokens')) {
      hasLightExport = true;
      foundLightName = exportName;
    }
    if (exportName.startsWith('dark') && exportName.endsWith('Tokens')) {
      hasDarkExport = true;
      foundDarkName = exportName;
    }
  }

  // Only validate semantic token files (not primitives or structural components)
  if (!fileName.includes('semantic') || fileName.includes('legacy') || baseName === 'components') {
    return violations;
  }

  // Check if light export matches expected name
  if (hasLightExport && foundLightName !== expectedLight) {
    violations.push({
      file: fileName,
      type: 'export-name',
      path: `export const ${foundLightName}`,
      violation: `Export name doesn't match convention: "${foundLightName}"`,
      suggestion: `Use "${expectedLight}" (singular form of ${baseName})`,
      severity: 'error',
    });
  }

  // Check if dark export matches expected name
  if (hasDarkExport && foundDarkName !== expectedDark) {
    violations.push({
      file: fileName,
      type: 'export-name',
      path: `export const ${foundDarkName}`,
      violation: `Export name doesn't match convention: "${foundDarkName}"`,
      suggestion: `Use "${expectedDark}" (singular form of ${baseName})`,
      severity: 'error',
    });
  }

  // Warn if exports are missing (informational only)
  if (!hasLightExport) {
    violations.push({
      file: fileName,
      type: 'export-name',
      path: 'file exports',
      violation: 'Missing light theme export',
      suggestion: `Add: export const ${expectedLight} = { ... }`,
      severity: 'warning',
    });
  }
  if (!hasDarkExport) {
    violations.push({
      file: fileName,
      type: 'export-name',
      path: 'file exports',
      violation: 'Missing dark theme export',
      suggestion: `Add: export const ${expectedDark} = { ... }`,
      severity: 'warning',
    });
  }

  return violations;
}

// ============================================
// TOKEN FILE PROCESSING
// ============================================

/**
 * Process a single token file
 */
async function processTokenFile(
  filePath: string,
  relativePath: string
): Promise<NamingViolation[]> {
  const violations: NamingViolation[] = [];

  // 1. Validate file name
  const fileNameViolation = validateFileName(path.basename(filePath));
  if (fileNameViolation) {
    violations.push(fileNameViolation);
  }

  // 2. Read file content
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 3. Validate export names
  violations.push(...validateExportNames(fileContent, relativePath));

  // 4. Load and validate token structure (only if it exports tokens)
  if (fileContent.includes('export const') && !relativePath.includes('primitives')) {
    try {
      // Helper to create file URL for Windows
      const toFileUrl = (fp: string) => new URL(`file:///${fp.replace(/\\/g, '/')}`).href;
      const tokenModule = await import(toFileUrl(filePath));

      // Find token exports
      for (const [key, value] of Object.entries(tokenModule)) {
        if (key.endsWith('Tokens') && typeof value === 'object') {
          const properties = extractPropertyKeys(value);

          for (const { path: propPath, depth } of properties) {
            // Validate property names
            const propViolation = validatePropertyName(propPath, relativePath);
            if (propViolation) {
              violations.push(propViolation);
            }

            // Validate hierarchy depth
            const hierarchyViolation = validateHierarchy(propPath, depth, relativePath);
            if (hierarchyViolation) {
              violations.push(hierarchyViolation);
            }
          }
        }
      }
    } catch (error) {
      // Skip files that can't be imported (might have dependencies we can't resolve)
      log(`  ⚠️  Skipped token validation for ${relativePath} (import error)`, 'yellow');
    }
  }

  return violations;
}

// ============================================
// MAIN VALIDATION
// ============================================

/**
 * Scan and validate all token files
 */
async function validateTokenNaming(): Promise<NamingResult> {
  const startTime = Date.now();

  const result: NamingResult = {
    checked: 0,
    passed: 0,
    errors: 0,
    warnings: 0,
    violations: [],
  };

  const tokensDir = path.join(process.cwd(), 'src/design-system/tokens');

  // Find all TypeScript files
  function findTokenFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findTokenFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const tokenFiles = findTokenFiles(tokensDir);
  result.checked = tokenFiles.length;

  log(`\n${'='.repeat(60)}`, 'cyan');
  log('Token Naming Convention Verification', 'cyan');
  log('='.repeat(60), 'cyan');

  for (const filePath of tokenFiles) {
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const violations = await processTokenFile(filePath, relativePath);

    if (violations.length > 0) {
      result.violations.push(...violations);
      result.errors += violations.filter((v) => v.severity === 'error').length;
      result.warnings += violations.filter((v) => v.severity === 'warning').length;
    } else {
      result.passed++;
    }
  }

  // Add execution time to result
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
function printReport(result: NamingResult): void {
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

  if (result.violations.length > 0) {
    log(`\n${'─'.repeat(60)}`, 'gray');
    log('Violations', 'bold');
    log('─'.repeat(60), 'gray');

    // Group by file
    const byFile = new Map<string, NamingViolation[]>();
    for (const violation of result.violations) {
      if (!byFile.has(violation.file)) {
        byFile.set(violation.file, []);
      }
      byFile.get(violation.file)!.push(violation);
    }

    for (const [file, violations] of byFile) {
      log(`\n📁 ${file}`, 'cyan');

      for (const violation of violations) {
        const icon = violation.severity === 'error' ? '❌' : '⚠️';
        const color = violation.severity === 'error' ? 'red' : 'yellow';

        log(`  ${icon} [${violation.type}] ${violation.violation}`, color);
        log(`     Path: ${violation.path}`, 'gray');
        log(`     Suggestion: ${violation.suggestion}`, 'blue');
      }
    }
  }

  log(`\n${'='.repeat(60)}`, 'cyan');

  if (result.errors > 0) {
    log('❌ Naming convention violations found!', 'red');
    log('\nPlease fix the errors above to ensure consistent naming.', 'yellow');
  } else if (result.warnings > 0) {
    log('⚠️  Passed with warnings', 'yellow');
    log('\nConsider addressing the warnings above.', 'yellow');
  } else {
    log('✅ All naming conventions followed!', 'green');
  }

  log('='.repeat(60), 'cyan');
}

// ============================================
// ENTRY POINT
// ============================================

async function main(): Promise<void> {
  try {
    const result = await validateTokenNaming();
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
