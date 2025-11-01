#!/usr/bin/env tsx

/**
 * Verify Compatibility Layer Completeness (DISCOVERY-BASED)
 *
 * PROBLEM: Hardcoding expected token lists creates maintenance burden.
 *          When shadcn updates or we add components, lists become stale.
 *
 * SOLUTION: Discovery-based validation:
 *           1. Discover what shadcn components ACTUALLY use (scan src/components/ui/)
 *           2. Discover what compatibility layer ACTUALLY provides (scan generate-css-variables.ts)
 *           3. Calculate gap automatically
 *           NO HARDCODED TOKEN LISTS!
 *
 * OUTPUT: AI-readable report showing provided vs missing tokens based on real usage
 *
 * RUN: yarn verify-compatibility-completeness
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import {
  AIReportFormatter,
  type AIReport,
  type AIReportDetail,
  type AIReportAction,
} from './lib/ai-report-formatter.js';

interface CompatibilityLayerAnalysis {
  /** Tokens provided by compatibility layer */
  providedTokens: Set<string>;
  /** Tokens required by shadcn components */
  requiredTokens: Set<string>;
  /** Tokens that are MISSING (required but not provided) */
  missingTokens: Set<string>;
  /** Tokens provided but NOT used (potential dead code) */
  unusedTokens: Set<string>;
  /** Source locations for required tokens */
  requiredSources: Map<string, string[]>;
}

async function discoverProvidedTokens(): Promise<Set<string>> {
  const generatorPath = path.join(
    process.cwd(),
    'src/design-system/scripts/generate-css-variables.ts'
  );
  const content = await fs.readFile(generatorPath, 'utf-8');

  // Find compatibility layer section
  const lines = content.split('\n');
  const startIdx = lines.findIndex(line => line.includes('SHADCN-UI COMPATIBILITY LAYER'));
  const endIdx = lines.findIndex(
    (line, idx) => idx > startIdx && (line.includes('// Form tokens') || line.includes('// Typography'))
  );

  if (startIdx === -1) {
    throw new Error('Could not find SHADCN-UI COMPATIBILITY LAYER section');
  }

  const layerSection = lines.slice(startIdx, endIdx === -1 ? lines.length : endIdx).join('\n');

  // Extract all --token-name definitions in compatibility layer
  const tokenMatches = layerSection.matchAll(/css \+= [`']--([a-z0-9_-]+):/gi);
  const tokens = new Set<string>();
  for (const match of tokenMatches) {
    tokens.add(match[1]);
  }

  return tokens;
}

async function discoverRequiredTokens(): Promise<{
  required: Set<string>;
  sources: Map<string, string[]>;
}> {
  const componentFiles = await glob('src/components/ui/*.tsx', {
    cwd: process.cwd(),
  });

  const required = new Set<string>();
  const sources = new Map<string, string[]>();

  // External tokens that are provided by other systems (Tailwind, Next.js)
  const externalProviders = new Set([
    'font-geist-sans',
    'font-geist-mono',
    'font-inter',
    'font-raleway',
    'ease-linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
  ]);

  /**
   * 3rd-Party Runtime Tokens
   *
   * @ai-hint These CSS custom properties are set DYNAMICALLY by JavaScript libraries at runtime,
   * not by our design system. They should NOT be added to compatibility layer.
   *
   * See verify-shadcn-token-requirements.ts RUNTIME_TOKENS for full documentation.
   */
  const runtimeTokens = new Set([
    // Radix UI Select
    'radix-select-trigger-height',
    'radix-select-trigger-width',
    'radix-select-content-available-height',
    'radix-select-content-transform-origin',

    // Radix UI Dropdown Menu
    'radix-dropdown-menu-trigger-width',
    'radix-dropdown-menu-trigger-height',
    'radix-dropdown-menu-content-available-width',
    'radix-dropdown-menu-content-available-height',

    // Radix UI Popover
    'radix-popover-trigger-width',
    'radix-popover-trigger-height',
    'radix-popover-content-available-width',
    'radix-popover-content-available-height',

    // Radix UI Tooltip
    'radix-tooltip-trigger-width',
    'radix-tooltip-trigger-height',

    // Radix UI Navigation Menu
    'radix-navigation-menu-viewport-width',
    'radix-navigation-menu-viewport-height',

    // Radix UI Accordion
    'radix-accordion-content-height',
    'radix-accordion-content-width',

    // Radix UI Collapsible
    'radix-collapsible-content-height',
    'radix-collapsible-content-width',
  ]);

  for (const file of componentFiles) {
    const filePath = path.join(process.cwd(), file);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const componentName = path.basename(file);

    lines.forEach((line, idx) => {
      const matches = line.matchAll(/var\(--([a-z0-9_-]+)\)/gi);
      for (const match of matches) {
        const tokenName = match[1];

        // Skip system tokens (Tailwind z-index, etc.)
        if (/^(z-|ease-|foreground-|background-)/.test(tokenName)) {
          continue;
        }

        // Skip external providers
        if (externalProviders.has(tokenName)) {
          continue;
        }

        // Skip runtime tokens (Radix UI, etc.)
        if (runtimeTokens.has(tokenName)) {
          continue;
        }

        required.add(tokenName);

        if (!sources.has(tokenName)) {
          sources.set(tokenName, []);
        }
        sources.get(tokenName)!.push(`${componentName}:${idx + 1}`);
      }
    });
  }

  return { required, sources };
}

async function analyzeCompatibilityLayer(): Promise<CompatibilityLayerAnalysis> {
  const providedTokens = await discoverProvidedTokens();
  const { required: requiredTokens, sources: requiredSources } = await discoverRequiredTokens();

  // Calculate gap
  const missingTokens = new Set<string>();
  const unusedTokens = new Set<string>();

  // Missing = required but NOT provided
  for (const token of requiredTokens) {
    if (!providedTokens.has(token)) {
      missingTokens.add(token);
    }
  }

  // Unused = provided but NOT required (potential dead code)
  for (const token of providedTokens) {
    if (!requiredTokens.has(token)) {
      unusedTokens.add(token);
    }
  }

  return {
    providedTokens,
    requiredTokens,
    missingTokens,
    unusedTokens,
    requiredSources,
  };
}

function generateAIReport(analysis: CompatibilityLayerAnalysis): AIReport {
  const details: AIReportDetail[] = [];
  const actions: AIReportAction[] = [];

  // Show provided tokens
  if (analysis.providedTokens.size > 0) {
    details.push({
      level: 'INFO',
      location: 'Compatibility Layer',
      finding: `✅ Provides ${analysis.providedTokens.size} tokens`,
      expected: Array.from(analysis.providedTokens).sort().join(', '),
    });
  }

  // Show missing tokens (ERRORS)
  if (analysis.missingTokens.size > 0) {
    for (const token of Array.from(analysis.missingTokens).sort()) {
      const sources = analysis.requiredSources.get(token) || [];
      details.push({
        level: 'ERROR',
        location: sources.join(', '),
        finding: `❌ Requires --${token} (NOT PROVIDED by compatibility layer)`,
        expected: `Compatibility layer should define --${token}`,
        suggestion: generateTokenSuggestion(token),
      });
    }

    // Group actions by token category
    const spacingTokens = Array.from(analysis.missingTokens).filter(t =>
      t.includes('spacing') || t.includes('gap') || t.includes('padding')
    );
    const borderTokens = Array.from(analysis.missingTokens).filter(t =>
      t.includes('border') || t.includes('outline')
    );
    const radiusTokens = Array.from(analysis.missingTokens).filter(t =>
      t.includes('radius') || t.includes('rounded')
    );
    const chartTokens = Array.from(analysis.missingTokens).filter(t =>
      t.includes('chart')
    );
    const otherTokens = Array.from(analysis.missingTokens).filter(
      t => !spacingTokens.includes(t) && !borderTokens.includes(t) &&
           !radiusTokens.includes(t) && !chartTokens.includes(t)
    );

    if (spacingTokens.length > 0) {
      actions.push({
        priority: 'CRITICAL',
        action: `Add spacing tokens: ${spacingTokens.join(', ')}`,
        reason: `Spacing tokens are fundamental to component layouts. Missing these breaks grid calculations`,
        howTo: `In generate-css-variables.ts compatibility layer section, add:\ncss += \\\`--spacing: \\\${primitiveSpacing[4]}; /* 4px base */\\\\n\\\`;`,
      });
    }

    if (radiusTokens.length > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Add radius tokens: ${radiusTokens.join(', ')}`,
        reason: `Border radius tokens control component corner rounding`,
        howTo: `In generate-css-variables.ts compatibility layer section, add:\ncss += \\\`--radius: \\\${primitiveBorderRadii.md}; /* Default radius */\\\\n\\\`;`,
      });
    }

    if (borderTokens.length > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Add border variant tokens: ${borderTokens.join(', ')}`,
        reason: `Border variants needed for component styling`,
        howTo: `Add as alias: css += \\\`--border-default: var(--border);\\\\n\\\`;`,
      });
    }

    if (chartTokens.length > 0) {
      actions.push({
        priority: 'MEDIUM',
        action: `Add chart tokens or remove chart usage: ${chartTokens.join(', ')}`,
        reason: `Chart colors referenced but not defined. Only needed if using chart components`,
        howTo: `Option 1: Add to semantic/charts.ts\nOption 2: Remove var() usage from globals.css`,
      });
    }

    if (otherTokens.length > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Add missing tokens: ${otherTokens.join(', ')}`,
        reason: `shadcn components require these tokens`,
        howTo: `Analyze usage and add to compatibility layer`,
      });
    }
  }

  // Show unused tokens (WARNINGS)
  if (analysis.unusedTokens.size > 0) {
    details.push({
      level: 'WARNING',
      location: 'Compatibility Layer',
      finding: `⚠️  ${analysis.unusedTokens.size} tokens provided but NOT used by shadcn components`,
      expected: `These may be for future use or used via Tailwind utilities: ${Array.from(analysis.unusedTokens).slice(0, 10).join(', ')}${analysis.unusedTokens.size > 10 ? '...' : ''}`,
      suggestion: 'This is OK - tokens may be used via Tailwind classes (bg-primary, text-foreground, etc.)',
    });
  }

  const totalRequired = analysis.requiredTokens.size;
  const totalProvided = analysis.providedTokens.size;
  const totalMissing = analysis.missingTokens.size;
  const satisfactionRate = totalRequired === 0 ? 100 : ((totalRequired - totalMissing) / totalRequired) * 100;

  const status = totalMissing === 0 ? 'PASSED' : 'FAILED';
  const impact =
    totalMissing === 0 ? 'INFO' :
    satisfactionRate >= 90 ? 'LOW' :
    satisfactionRate >= 70 ? 'MEDIUM' :
    satisfactionRate >= 50 ? 'HIGH' : 'CRITICAL';

  return {
    context: {
      what: 'Verify compatibility layer completeness using discovery-based validation',
      why: 'Ensure shadcn components have all required tokens (no hardcoded lists)',
      when: 'After adding shadcn components, before refactoring compatibility layer',
      docs: [
        'src/design-system/scripts/generate-css-variables.ts (compatibility layer)',
        'src/components/ui/*.tsx (shadcn components)',
      ],
    },
    analysis: {
      totalChecked: totalRequired,
      passed: totalRequired - totalMissing,
      failed: totalMissing,
      warned: analysis.unusedTokens.size,
      summary: `Discovery found ${totalRequired} required tokens in shadcn components. Compatibility layer provides ${totalProvided} tokens total. ${totalMissing} tokens MISSING (${satisfactionRate.toFixed(1)}% satisfaction rate).`,
      impact,
    },
    details,
    actions,
    status,
    nextStep:
      totalMissing > 0
        ? 'Add missing tokens to compatibility layer in generate-css-variables.ts'
        : 'All shadcn requirements satisfied',
  };
}

function generateTokenSuggestion(tokenName: string): string {
  if (tokenName === 'spacing') {
    return `css += \\\`--spacing: \\\${primitiveSpacing[4]}; /* 4px base unit */\\\\n\\\`;`;
  }

  if (tokenName === 'radius') {
    return `css += \\\`--radius: \\\${primitiveBorderRadii.md}; /* Default border radius */\\\\n\\\`;`;
  }

  if (tokenName.includes('border-default')) {
    return `css += \\\`--border-default: var(--border);\\\\n\\\`; /* Alias */`;
  }

  if (tokenName.startsWith('chart-')) {
    return `Add to semantic/charts.ts or remove usage from globals.css`;
  }

  return `Add --${tokenName} to compatibility layer`;
}

// Run if called directly
if (require.main === module) {
  analyzeCompatibilityLayer()
    .then(analysis => {
      const report = generateAIReport(analysis);
      const formatter = new AIReportFormatter(report);
      console.log(formatter.formatTerminal());

      // Export JSON for matrix report generation
      const jsonPath = path.join(
        process.cwd(),
        'src/design-system/.verification-cache/compatibility-completeness.json'
      );
      formatter.exportJSON(jsonPath).catch(() => {
        // Ignore if directory doesn't exist
      });

      process.exit(report.status === 'PASSED' ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

export { analyzeCompatibilityLayer };
