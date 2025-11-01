/**
 * Hardcoded Values Validator
 *
 * Finds magic numbers and hardcoded values in component files.
 *
 * Problem: opacity-70, #FFFFFF, 12px - values that should use design tokens
 * Result: Inconsistent design, hard to theme, breaks design system
 *
 * Usage:
 *   yarn verify-hardcoded-values
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

interface HardcodedValue {
  file: string;
  line: number;
  type: 'hex-color' | 'rgb-color' | 'opacity' | 'px-value' | 'percentage';
  value: string;
  context: string;
}

const PATTERNS = {
  hexColor: /#[0-9a-fA-F]{3,8}/g,
  rgbColor: /rgba?\([^)]+\)/g,
  opacity: /opacity-\d+/g,
  pxValue: /\d+px/g,
  percentage: /\d+%/g,
};

const ALLOWED_VALUES = new Set([
  '0px',
  '1px',
  '2px',
  '100%',
  '#000',
  '#fff',
  '#ffffff',
  '#000000',
  'opacity-0',
  'opacity-100',
]);

function scanFile(filePath: string): HardcodedValue[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings: HardcodedValue[] = [];
  const filename = path.relative(path.join(__dirname, '../../'), filePath);

  lines.forEach((line, idx) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    // Check for hex colors
    const hexMatches = line.matchAll(PATTERNS.hexColor);
    for (const match of hexMatches) {
      if (!ALLOWED_VALUES.has(match[0].toLowerCase())) {
        findings.push({
          file: filename,
          line: idx + 1,
          type: 'hex-color',
          value: match[0],
          context: line.trim().substring(0, 80),
        });
      }
    }

    // Check for RGB colors
    const rgbMatches = line.matchAll(PATTERNS.rgbColor);
    for (const match of rgbMatches) {
      findings.push({
        file: filename,
        line: idx + 1,
        type: 'rgb-color',
        value: match[0],
        context: line.trim().substring(0, 80),
      });
    }

    // Check for opacity classes
    const opacityMatches = line.matchAll(PATTERNS.opacity);
    for (const match of opacityMatches) {
      if (!ALLOWED_VALUES.has(match[0])) {
        findings.push({
          file: filename,
          line: idx + 1,
          type: 'opacity',
          value: match[0],
          context: line.trim().substring(0, 80),
        });
      }
    }

    // Check for px values (only in className, not CSS files)
    if (line.includes('className') && !filePath.endsWith('.css')) {
      const pxMatches = line.matchAll(PATTERNS.pxValue);
      for (const match of pxMatches) {
        if (!ALLOWED_VALUES.has(match[0])) {
          findings.push({
            file: filename,
            line: idx + 1,
            type: 'px-value',
            value: match[0],
            context: line.trim().substring(0, 80),
          });
        }
      }
    }
  });

  return findings;
}

function main() {
  log('\n🔍 Hardcoded Values Validator\n', 'cyan');
  log('━'.repeat(60), 'gray');

  const componentsDir = path.join(__dirname, '../../components');
  const pagesDir = path.join(__dirname, '../../pages');

  const dirsToScan = [
    { path: componentsDir, name: 'components' },
    { path: pagesDir, name: 'pages' },
  ];

  const allFindings: HardcodedValue[] = [];

  dirsToScan.forEach(dir => {
    if (!fs.existsSync(dir.path)) return;

    const scanDir = (dirPath: string) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          const findings = scanFile(fullPath);
          allFindings.push(...findings);
        }
      });
    };

    scanDir(dir.path);
  });

  // Group by type
  const byType = new Map<string, HardcodedValue[]>();
  allFindings.forEach(finding => {
    if (!byType.has(finding.type)) {
      byType.set(finding.type, []);
    }
    byType.get(finding.type)!.push(finding);
  });

  if (allFindings.length === 0) {
    log('✅ No hardcoded values found!\n', 'green');
    log('   All components use design tokens properly\n', 'gray');
    log('━'.repeat(60), 'gray');
    process.exit(0);
  }

  // Report findings
  log(`⚠️  Found ${allFindings.length} hardcoded value(s):\n`, 'yellow');

  Array.from(byType.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([type, findings]) => {
      log(`   ${type.toUpperCase()} (${findings.length}):`, 'yellow');
      findings.slice(0, 5).forEach(f => {
        log(`      ${f.file}:${f.line}`, 'gray');
        log(`         ${f.value}`, 'red');
        log(`         ${f.context}`, 'gray');
      });
      if (findings.length > 5) {
        log(`      ... and ${findings.length - 5} more`, 'gray');
      }
      log('', 'reset');
    });

  log('━'.repeat(60), 'gray');
  log('\n💡 Why This Matters:\n', 'cyan');
  log('   Hardcoded values:', 'yellow');
  log('   • Break design system consistency', 'gray');
  log('   • Cannot be themed (light/dark mode)', 'gray');
  log('   • Hard to maintain and refactor', 'gray');
  log('   • Create visual inconsistencies', 'gray');

  log('\n💡 How to Fix:\n', 'cyan');
  log('   Hex colors:     Use CSS variables (--color-primary)', 'gray');
  log('   Opacity:        Use semantic tokens (bg-opacity-subtle)', 'gray');
  log('   PX values:      Use spacing tokens (p-4, gap-2)', 'gray');
  log('   RGB:            Convert to oklch() in design tokens', 'gray');

  log('\n💡 Exceptions (Allowed):\n', 'cyan');
  log('   • 0px, 1px, 2px (borders/offsets)', 'gray');
  log('   • #000, #fff (pure black/white)', 'gray');
  log('   • opacity-0, opacity-100 (fully transparent/opaque)', 'gray');

  log('\n━'.repeat(60), 'gray');

  // Determine severity
  const criticalTypes = ['hex-color', 'rgb-color'];
  const criticalCount = allFindings.filter(f => criticalTypes.includes(f.type)).length;

  if (criticalCount > 0) {
    log(`\n⚠️  ${criticalCount} critical hardcoded value(s) (colors)\n`, 'yellow');
    log('Review recommended to maintain design system integrity.\n', 'gray');
  } else {
    log(`\n⚠️  ${allFindings.length} non-critical hardcoded value(s)\n`, 'yellow');
    log('Consider using design tokens for better consistency.\n', 'gray');
  }

  log('ℹ️  This is informational only - does not block CI/CD\n', 'cyan');
  process.exit(0); // Informational - don't fail build
}

main();
