#!/usr/bin/env tsx
/**
 * Component Validation Script for CI/CD
 *
 * Validates:
 * - No hardcoded colors (hex, rgb, hsl)
 * - No hardcoded spacing values
 * - Component reuse patterns
 * - DIY component detection (самодельные кнопки, карточки, инпуты, badge, dialogs, alerts)
 * - Contract compliance
 * - Accessibility requirements
 *
 * Usage:
 * ```bash
 * yarn validate-components
 * ```
 *
 * Exit codes:
 * 0 - All checks passed
 * 1 - Critical errors found (blocks CI)
 * 2 - Warnings found (passes CI but should be addressed)
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// ============================================
// TYPES
// ============================================

interface ValidationIssue {
  file: string;
  line?: number;
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
}

interface ValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  summary: {
    filesScanned: number;
    totalIssues: number;
    criticalIssues: number;
  };
}

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Directories to scan
  scanDirs: [
    'src/components',
    'src/pages',
    'src/app', // If using App Router
  ],

  // Directories to exclude
  excludeDirs: [
    'node_modules',
    '.next',
    'dist',
    'build',
  ],

  // File patterns to scan
  filePatterns: [
    '**/*.tsx',
    '**/*.ts',
    '**/*.jsx',
    '**/*.js',
    '**/*.module.css',  // CSS Modules
    '**/*.module.scss', // SCSS Modules
    '**/*.module.sass', // SASS Modules
  ],

  // CSS files to scan for token overrides
  cssFilePatterns: ['**/*.css', '**/*.scss', '**/*.sass'],

  // Patterns to detect hardcoded values
  patterns: {
    // Hex colors
    hexColor: /#[0-9A-Fa-f]{3,8}\b/g,

    // RGB/RGBA colors
    rgbColor: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,

    // HSL/HSLA colors
    hslColor: /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%/g,

    // OKLCH colors (but allow in token files)
    oklchColor: /oklch\(\s*[\d.]+\s+[\d.]+\s+[\d.]+/g,

    // Hardcoded px values in style objects
    hardcodedPx: /style=\s*\{\s*\{[^}]*:\s*['"]?\d+px['"]?/g,

    // Hardcoded spacing in className (e.g., p-[23px])
    hardcodedTailwind: /className=["'][^"']*\[(\d+px|\d+rem)\][^"']*/g,
  },

  // Component patterns (for reuse validation)
  componentPatterns: {
    bareInput: /<Input\s+/g,
    bareButton: /<button\s+/g,
    bareLabel: /<label\s+/g,
  },

  // DIY component detection (самодельные компоненты)
  diyPatterns: {
    // DIY Button: padding + background color classes
    diyButton: /className=["'][^"']*(?:px-\d+|py-\d+)[^"']*(?:bg-primary|bg-accent|bg-destructive|bg-secondary)[^"']*/g,

    // DIY Card: padding + border/shadow + rounded
    diyCard: /className=["'][^"']*(?:p-\d+)[^"']*(?:border|shadow)[^"']*(?:rounded)[^"']*/g,

    // DIY Input: border + rounded + padding input-specific
    diyInput: /className=["'][^"']*(?:border-\w+)[^"']*(?:rounded)[^"']*(?:px-\d+|py-\d+)[^"']*(?:focus:)[^"']*/g,

    // DIY Badge: inline-flex/flex + rounded-full + text-xs + padding
    diyBadge: /className=["'][^"']*(?:inline-flex|flex)[^"']*(?:rounded-full|rounded-md)[^"']*(?:text-xs|text-sm)[^"']*(?:px-\d+)[^"']*/g,

    // DIY Dialog/Modal: fixed + inset + z-50 + backdrop
    diyDialog: /className=["'][^"']*(?:fixed)[^"']*(?:inset-\d+|inset-x-\d+|inset-y-\d+)[^"']*(?:z-\d+)[^"']*(?:backdrop-blur|bg-black)[^"']*/g,

    // DIY Alert: border-l + padding + background status color
    diyAlert: /className=["'][^"']*(?:border-l-\d+)[^"']*(?:p-\d+)[^"']*(?:bg-destructive|bg-success|bg-warning|bg-info)[^"']*/g,
  },

  // Required patterns (what SHOULD be used)
  requiredPatterns: {
    formField: /FormField/,
    button: /<Button\s+/,
  },

  // Deprecated tokens (v1.0 → v2.0 migration)
  deprecatedTokens: {
    bgPrimary: /\bbg-primary(?!-)/g,
    textPrimary: /\btext-primary(?!-)/g,
    hoverBgPrimary: /hover:bg-primary\/\d+/g,
    bgSecondary: /\bbg-secondary(?!-)/g,
    textSecondary: /\btext-secondary(?!-)/g,
    bgCard: /\bbg-card(?!-)/g,
    textCardForeground: /\btext-card-foreground/g,
  },
};

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
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================
// FILE SCANNING
// ============================================

async function getFilesToScan(): Promise<string[]> {
  const files: string[] = [];

  for (const dir of CONFIG.scanDirs) {
    if (!fs.existsSync(dir)) continue;

    for (const pattern of CONFIG.filePatterns) {
      const matches = await glob(`${dir}/${pattern}`, {
        ignore: CONFIG.excludeDirs.map(d => `**/${d}/**`),
      });
      files.push(...matches);
    }
  }

  return [...new Set(files)]; // Remove duplicates
}

async function getCSSFilesToScan(): Promise<string[]> {
  const cssFiles: string[] = [];

  // Scan src/styles directory for CSS files
  const stylesDir = 'src/styles';
  if (fs.existsSync(stylesDir)) {
    for (const pattern of CONFIG.cssFilePatterns) {
      const matches = await glob(`${stylesDir}/${pattern}`, {
        ignore: [
          '**/node_modules/**',
          '**/.next/**',
          '**/design-tokens.generated.css', // Skip auto-generated file
        ],
      });
      cssFiles.push(...matches);
    }
  }

  return [...new Set(cssFiles)];
}

// ============================================
// VALIDATION RULES
// ============================================

/**
 * Rule 1: No hardcoded colors
 */
function validateNoHardcodedColors(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  const lines = content.split('\n');

  // Normalize path separators for cross-platform compatibility
  const normalizedPath = file.replace(/\\/g, '/');

  // Skip token files, design-system showcase page, and boilerplate pages (intentional colors/styling)
  if (normalizedPath.includes('/tokens/') || normalizedPath.includes('design-tokens.generated.css') || normalizedPath.includes('design-system.tsx') || normalizedPath.includes('pages/index.tsx')) {
    return;
  }

  lines.forEach((line, index) => {
    // Skip SVG fill/stroke attributes (brand logos are intentional)
    const isSvgColor = /fill=["']#|stroke=["']#/.test(line);

    // Hex colors
    const hexMatches = line.match(CONFIG.patterns.hexColor);
    if (hexMatches && !isSvgColor) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'hardcoded-color',
        message: `Hardcoded hex color found: ${hexMatches.join(', ')}`,
        suggestion: 'Use design tokens via Tailwind classes (e.g., bg-primary, text-foreground)',
      });
    }

    // RGB colors
    const rgbMatches = line.match(CONFIG.patterns.rgbColor);
    if (rgbMatches) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'hardcoded-color',
        message: `Hardcoded RGB color found: ${rgbMatches.join(', ')}`,
        suggestion: 'Use design tokens via Tailwind classes',
      });
    }

    // HSL colors
    const hslMatches = line.match(CONFIG.patterns.hslColor);
    if (hslMatches) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'hardcoded-color',
        message: `Hardcoded HSL color found: ${hslMatches.join(', ')}`,
        suggestion: 'Use design tokens via Tailwind classes',
      });
    }
  });
}

/**
 * Rule 2: No hardcoded spacing
 */
function validateNoHardcodedSpacing(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = file.replace(/\\/g, '/');

  // Skip showcase and boilerplate pages (intentional for display)
  if (normalizedPath.includes('design-system.tsx') || normalizedPath.includes('pages/index.tsx')) {
    return;
  }

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Hardcoded px in style objects
    const pxMatches = line.match(CONFIG.patterns.hardcodedPx);
    if (pxMatches) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'hardcoded-spacing',
        message: `Hardcoded spacing in style object`,
        suggestion: 'Use Tailwind utilities (e.g., p-4, m-8) or design tokens',
      });
    }

    // Hardcoded spacing in Tailwind arbitrary values
    const tailwindMatches = line.match(CONFIG.patterns.hardcodedTailwind);
    if (tailwindMatches) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'hardcoded-spacing',
        message: `Hardcoded spacing in Tailwind arbitrary value: ${tailwindMatches[0]}`,
        suggestion: 'Use standard Tailwind spacing scale (p-4, m-8, etc.)',
      });
    }
  });
}

/**
 * Rule 3: Component reuse patterns
 */
function validateComponentReuse(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  // Skip non-component files
  if (!file.includes('/components/') && !file.includes('/pages/')) {
    return;
  }

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for bare <Input> without FormField
    if (CONFIG.componentPatterns.bareInput.test(line)) {
      // Check if FormField is imported in the file
      if (!content.includes('FormField')) {
        issues.push({
          file,
          line: index + 1,
          type: 'warning',
          category: 'component-reuse',
          message: 'Using bare <Input> component',
          suggestion: 'Use <FormField> molecule instead to enforce Label + Input pattern (WCAG compliance)',
        });
      }
    }

    // Check for bare <button> instead of <Button>
    if (CONFIG.componentPatterns.bareButton.test(line)) {
      // Allow in Button component itself
      if (!file.includes('ui/button.tsx')) {
        issues.push({
          file,
          line: index + 1,
          type: 'warning',
          category: 'component-reuse',
          message: 'Using native <button> element',
          suggestion: 'Use <Button> component for consistent styling and accessibility',
        });
      }
    }

    // Check for bare <label> instead of <Label>
    if (CONFIG.componentPatterns.bareLabel.test(line)) {
      // Allow in Label component itself
      if (!file.includes('ui/label.tsx')) {
        issues.push({
          file,
          line: index + 1,
          type: 'info',
          category: 'component-reuse',
          message: 'Using native <label> element',
          suggestion: 'Consider using <Label> component from shadcn-ui',
        });
      }
    }
  });
}

/**
 * Rule 4: DIY component detection (самодельные компоненты)
 */
function validateDIYComponents(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  // Skip component implementation files (they're allowed to have these patterns)
  const normalizedPath = file.replace(/\\/g, '/');
  if (normalizedPath.includes('/components/ui/')) {
    return;
  }

  const lines = content.split('\n');

  // Check for DIY buttons
  lines.forEach((line, index) => {
    // DIY Button detection
    const diyButtonMatches = line.match(CONFIG.diyPatterns.diyButton);
    if (diyButtonMatches && !line.includes('<Button')) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'diy-component',
        message: 'DIY button pattern detected (px/py + bg-primary/accent)',
        suggestion: 'Use <Button> component with variants instead',
      });
    }

    // DIY Card detection
    const diyCardMatches = line.match(CONFIG.diyPatterns.diyCard);
    if (diyCardMatches && !line.includes('<Card')) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'diy-component',
        message: 'DIY card pattern detected (p-X + border/shadow + rounded)',
        suggestion: 'Use <Card> component instead',
      });
    }

    // DIY Input detection
    const diyInputMatches = line.match(CONFIG.diyPatterns.diyInput);
    if (diyInputMatches && !line.includes('<Input') && !line.includes('<FormField')) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'diy-component',
        message: 'DIY input pattern detected (border + rounded + padding + focus)',
        suggestion: 'Use <Input> or <FormField> component instead',
      });
    }

    // DIY Badge detection
    const diyBadgeMatches = line.match(CONFIG.diyPatterns.diyBadge);
    if (diyBadgeMatches && !line.includes('<Badge')) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'diy-component',
        message: 'DIY badge pattern detected (inline-flex + rounded-full + text-xs + px)',
        suggestion: 'Use <Badge> component with variants instead',
      });
    }

    // DIY Dialog detection
    const diyDialogMatches = line.match(CONFIG.diyPatterns.diyDialog);
    if (diyDialogMatches && !line.includes('<Dialog') && !line.includes('DialogContent')) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'diy-component',
        message: 'DIY dialog/modal pattern detected (fixed + inset + z-index + backdrop)',
        suggestion: 'Use shadcn <Dialog> component instead',
      });
    }

    // DIY Alert detection
    const diyAlertMatches = line.match(CONFIG.diyPatterns.diyAlert);
    if (diyAlertMatches && !line.includes('<Alert')) {
      issues.push({
        file,
        line: index + 1,
        type: 'info',
        category: 'diy-component',
        message: 'DIY alert pattern detected (border-l + padding + status bg color)',
        suggestion: 'Consider creating an <Alert> component or using shadcn Alert',
      });
    }
  });
}

/**
 * Rule 5: Accessibility checks
 */
function validateAccessibility(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for images without alt text
    if (/<img\s+/.test(line) && !/alt=/.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'accessibility',
        message: 'Image without alt attribute',
        suggestion: 'Add alt="" for decorative images or descriptive alt text',
      });
    }

    // Check for buttons without accessible labels
    if (/<Button\s+size=["']icon["']/.test(line) && !/aria-label=/.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'accessibility',
        message: 'Icon-only button without aria-label',
        suggestion: 'Add aria-label for screen readers',
      });
    }
  });
}

/**
 * Rule 6: Contract compliance (check if component has contract)
 */
function validateContractExists(
  file: string,
  issues: ValidationIssue[]
): void {
  // Only check custom components (not shadcn UI)
  if (!file.includes('/components/molecules/') && !file.includes('/components/organisms/')) {
    return;
  }

  // Extract component name
  const fileName = path.basename(file, path.extname(file));
  const componentType = file.includes('/molecules/') ? 'molecules' : 'organisms';

  // Check if contract exists
  const contractPath = path.join(
    'src/design-system/contracts/components',
    componentType,
    `${fileName}.contract.yaml`
  );

  if (!fs.existsSync(contractPath)) {
    issues.push({
      file,
      type: 'warning',
      category: 'contract-missing',
      message: `Component contract not found: ${contractPath}`,
      suggestion: 'Create a contract file documenting the component API, accessibility, and usage',
    });
  }
}

/**
 * Rule 7: CSS Token Override Detection
 * Detects when globals.css or other CSS files override auto-generated token values
 */
function validateCSSTokenOverrides(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  const lines = content.split('\n');

  // List of auto-generated tokens that should NOT be overridden
  const autoGeneratedTokens = [
    '--background',
    '--foreground',
    '--background-primary',
    '--background-secondary',
    '--background-tertiary',
    '--foreground-primary',
    '--foreground-secondary',
    '--foreground-tertiary',
    '--primary',
    '--primary-foreground',
  ];

  // Check for overrides in :root or .dark selectors
  let insideRoot = false;
  let insideDark = false;
  let insideMediaQuery = false;
  let currentSelector = '';

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Track context
    if (trimmedLine === ':root {') {
      insideRoot = true;
      currentSelector = ':root';
    } else if (trimmedLine === '.dark {') {
      insideDark = true;
      currentSelector = '.dark';
    } else if (trimmedLine.includes('@media (prefers-color-scheme: dark)')) {
      insideMediaQuery = true;
      currentSelector = '@media (prefers-color-scheme: dark)';
    } else if (trimmedLine === '}') {
      insideRoot = false;
      insideDark = false;
      insideMediaQuery = false;
      currentSelector = '';
    }

    // Check for token overrides
    if (insideRoot || insideDark || insideMediaQuery) {
      for (const token of autoGeneratedTokens) {
        // Match: --token: value;
        const regex = new RegExp(`^\\s*${token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}:\\s*[^;]+;`, 'i');
        if (regex.test(trimmedLine)) {
          issues.push({
            file,
            line: index + 1,
            type: 'error',
            category: 'css-token-override',
            message: `Overriding auto-generated token "${token}" in ${currentSelector}`,
            suggestion: `Remove this override. Token is auto-generated from design-system/tokens/semantic/colors.ts`,
          });
        }
      }
    }

    // Detect @media (prefers-color-scheme: dark) usage (but skip comments)
    if (trimmedLine.includes('@media (prefers-color-scheme: dark)') && !trimmedLine.startsWith('/*') && !trimmedLine.startsWith('//')) {
      issues.push({
        file,
        line: index + 1,
        type: 'error',
        category: 'css-system-theme',
        message: 'Using @media (prefers-color-scheme: dark) - causes system theme override',
        suggestion: 'Remove this media query. Theme should be controlled only via .dark class',
      });
    }
  });
}

/**
 * Rule 8: Deprecated token detection (v1.0 → v2.0 migration)
 */
function validateDeprecatedTokens(
  file: string,
  content: string,
  issues: ValidationIssue[]
): void {
  const normalizedPath = file.replace(/\\/g, '/');

  // Skip token files, generated CSS, and backup files
  if (
    normalizedPath.includes('/tokens/') ||
    normalizedPath.includes('design-tokens.generated.css') ||
    normalizedPath.includes('.backup')
  ) {
    return;
  }

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // bg-primary → NOT using design system tokens
    if (CONFIG.deprecatedTokens.bgPrimary.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--primary", not design system token',
        suggestion: 'Fix: Map --primary to --interactive-primary-background-default in globals.css, OR replace class with bg-interactive-primary-bg',
      });
    }

    // text-primary → NOT using design system tokens
    if (CONFIG.deprecatedTokens.textPrimary.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--primary", not design system token',
        suggestion: 'Fix: Map --primary to design tokens in globals.css, OR replace class with text-interactive-primary-text or text-link',
      });
    }

    // hover:bg-primary/90 → NOT using design system tokens
    if (CONFIG.deprecatedTokens.hoverBgPrimary.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--primary" with opacity, not design system hover state',
        suggestion: 'Fix: Use explicit hover token hover:bg-interactive-primary-bg-hover instead of opacity pattern',
      });
    }

    // bg-secondary → NOT using design system tokens
    if (CONFIG.deprecatedTokens.bgSecondary.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--secondary", not design system token',
        suggestion: 'Fix: Map --secondary to --interactive-secondary-background-default in globals.css, OR replace class with bg-interactive-secondary-bg',
      });
    }

    // text-secondary → NOT using design system tokens
    if (CONFIG.deprecatedTokens.textSecondary.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--secondary", not design system token',
        suggestion: 'Fix: Map --secondary to design tokens in globals.css, OR replace class with text-interactive-secondary-text',
      });
    }

    // bg-card → NOT using design system tokens
    if (CONFIG.deprecatedTokens.bgCard.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--card", not design system token',
        suggestion: 'Fix: Map --card to --surfaces-card-background in globals.css, OR replace class with bg-surface-elevated-bg',
      });
    }

    // text-card-foreground → NOT using design system tokens
    if (CONFIG.deprecatedTokens.textCardForeground.test(line)) {
      issues.push({
        file,
        line: index + 1,
        type: 'warning',
        category: 'shadcn-default-variable',
        message: 'Component uses shadcn CSS variable "--card-foreground", not design system token',
        suggestion: 'Fix: Map --card-foreground to --surfaces-card-text in globals.css, OR replace class with text-surface-elevated-text',
      });
    }
  });
}

// ============================================
// MAIN VALIDATION
// ============================================

async function validateFiles(): Promise<ValidationResult> {
  log('\n🔍 Validating components and interfaces...', 'blue');
  log('━'.repeat(60), 'gray');

  const files = await getFilesToScan();
  const cssFiles = await getCSSFilesToScan();
  const allIssues: ValidationIssue[] = [];

  log(`\n📁 Scanning ${files.length} component files...\n`, 'cyan');

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');

      // Run all validation rules
      validateNoHardcodedColors(file, content, allIssues);
      validateNoHardcodedSpacing(file, content, allIssues);
      validateComponentReuse(file, content, allIssues);
      validateDIYComponents(file, content, allIssues);
      validateAccessibility(file, content, allIssues);
      validateContractExists(file, allIssues);
      validateDeprecatedTokens(file, content, allIssues);

    } catch (error) {
      log(`⚠️  Error reading file ${file}: ${error}`, 'yellow');
    }
  }

  // Validate CSS files for token overrides
  if (cssFiles.length > 0) {
    log(`\n🎨 Scanning ${cssFiles.length} CSS files for token overrides...\n`, 'cyan');

    for (const file of cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        validateCSSTokenOverrides(file, content, allIssues);
      } catch (error) {
        log(`⚠️  Error reading CSS file ${file}: ${error}`, 'yellow');
      }
    }
  }

  // Categorize issues
  const errors = allIssues.filter(i => i.type === 'error');
  const warnings = allIssues.filter(i => i.type === 'warning');
  const info = allIssues.filter(i => i.type === 'info');

  return {
    errors,
    warnings,
    info,
    summary: {
      filesScanned: files.length,
      totalIssues: allIssues.length,
      criticalIssues: errors.length,
    },
  };
}

// ============================================
// REPORTING
// ============================================

function reportIssues(result: ValidationResult): void {
  log('\n' + '━'.repeat(60), 'gray');
  log('📊 VALIDATION RESULTS', 'blue');
  log('━'.repeat(60), 'gray');

  // Summary
  log(`\n📈 Summary:`, 'cyan');
  log(`   Files scanned: ${result.summary.filesScanned}`, 'gray');
  log(`   Total issues: ${result.summary.totalIssues}`, 'gray');
  log(`   Critical (errors): ${result.errors.length}`, 'gray');
  log(`   Warnings: ${result.warnings.length}`, 'gray');
  log(`   Info: ${result.info.length}\n`, 'gray');

  // Errors
  if (result.errors.length > 0) {
    log(`\n❌ ERRORS (${result.errors.length}) - Must fix before merge:`, 'red');
    log('━'.repeat(60), 'gray');

    // Group by category
    const errorsByCategory = groupByCategory(result.errors);

    for (const [category, issues] of Object.entries(errorsByCategory)) {
      log(`\n  ${getCategoryIcon(category)} ${category.toUpperCase()} (${issues.length}):`, 'red');

      issues.forEach((issue) => {
        const location = issue.line ? `:${issue.line}` : '';
        log(`    ${path.relative(process.cwd(), issue.file)}${location}`, 'gray');
        log(`    → ${issue.message}`, 'red');
        if (issue.suggestion) {
          log(`      💡 ${issue.suggestion}`, 'cyan');
        }
        log('');
      });
    }
  }

  // Warnings
  if (result.warnings.length > 0) {
    log(`\n⚠️  WARNINGS (${result.warnings.length}) - Should address:`, 'yellow');
    log('━'.repeat(60), 'gray');

    const warningsByCategory = groupByCategory(result.warnings);

    for (const [category, issues] of Object.entries(warningsByCategory)) {
      log(`\n  ${getCategoryIcon(category)} ${category.toUpperCase()} (${issues.length}):`, 'yellow');

      // Show ALL warnings (no truncation)
      issues.forEach((issue) => {
        const location = issue.line ? `:${issue.line}` : '';
        log(`    ${path.relative(process.cwd(), issue.file)}${location}`, 'gray');
        log(`    → ${issue.message}`, 'yellow');
        if (issue.suggestion) {
          log(`      💡 ${issue.suggestion}`, 'cyan');
        }
      });
      log('');
    }
  }

  // Info
  if (result.info.length > 0) {
    log(`\nℹ️  INFO (${result.info.length}) - Consider improving:`, 'cyan');
    log(`   (Run with --verbose to see details)\n`, 'gray');
  }
}

function groupByCategory(issues: ValidationIssue[]): Record<string, ValidationIssue[]> {
  return issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, ValidationIssue[]>);
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'hardcoded-color': '🎨',
    'hardcoded-spacing': '📏',
    'component-reuse': '♻️',
    'diy-component': '🔨',
    'accessibility': '♿',
    'contract-missing': '📋',
    'css-token-override': '⚠️',
    'css-system-theme': '🌓',
    'deprecated-token': '🔄',
  };
  return icons[category] || '•';
}

// ============================================
// MAIN
// ============================================

async function main() {
  try {
    const result = await validateFiles();

    reportIssues(result);

    // Exit codes
    if (result.errors.length > 0) {
      log('\n❌ Validation FAILED - Critical issues found', 'red');
      log('   Fix errors before committing\n', 'gray');
      process.exit(1);
    } else if (result.warnings.length > 0) {
      log('\n⚠️  Validation PASSED with warnings', 'yellow');
      log('   Consider addressing warnings\n', 'gray');
      process.exit(0); // Pass CI but show warnings
    } else {
      log('\n✅ All checks PASSED!', 'green');
      log('   No issues found\n', 'gray');
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ Fatal error: ${error}`, 'red');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { validateFiles };
export type { ValidationResult };
