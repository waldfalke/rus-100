#!/usr/bin/env tsx

/**
 * Verify shadcn-ui Token Requirements
 *
 * PROBLEM: shadcn-ui components expect specific CSS variables (--spacing, --border-default, etc.)
 *          but our design system may not provide them, causing silent failures.
 *
 * SOLUTION: Scan all shadcn components (src/components/ui/*.tsx) and find:
 *           1. Which CSS variables they require (var(--*) usage)
 *           2. Which are provided by design system
 *           3. Which are MISSING (supply-demand gap)
 *
 * OUTPUT: AI-readable report showing demand (shadcn) vs supply (design system)
 *
 * RUN: yarn verify-shadcn-requirements
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

interface TokenRequirement {
  /** Component name (e.g., "alert.tsx") */
  component: string;
  /** Token name without -- prefix (e.g., "spacing") */
  tokenName: string;
  /** Line number where token is used */
  line: number;
  /** Is this token provided by design system? */
  isProvided: boolean;
  /** Where is it provided (or why not) */
  providerInfo: string;
}

interface VerificationResult {
  /** All token requirements found in shadcn components */
  requirements: TokenRequirement[];
  /** Unique tokens that are provided */
  providedTokens: Set<string>;
  /** Unique tokens that are MISSING */
  missingTokens: Set<string>;
  /** CSS variables defined in design-tokens.generated.css */
  definedCssVars: Set<string>;
}

// Tokens that are defined externally (Tailwind, Next.js fonts, etc.)
const EXTERNAL_TOKENS = new Set([
  // shadcn-ui semantic tokens (defined in compatibility layer)
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'radius',

  // shadcn extended tokens
  'link',
  'link-hover',

  // Next.js font variables
  'font-geist-sans',
  'font-geist-mono',
  'font-inter',
  'font-raleway',

  // Tailwind easing functions
  'ease-linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
]);

/**
 * 3rd-Party Runtime Tokens
 *
 * @ai-hint These CSS custom properties are set DYNAMICALLY by JavaScript libraries at runtime,
 * not by our design system. They should NOT be added to design-tokens.generated.css.
 *
 * CATEGORY: Runtime Variables (not Design Tokens)
 * OWNERSHIP: External libraries (Radix UI, etc.)
 * LIFECYCLE: Set via JavaScript after component mount
 * VALIDATION: Always consider these as "provided" (not missing)
 *
 * WHY THIS MATTERS:
 * - Design systems define build-time tokens (colors, spacing, etc.)
 * - Runtime variables are positioning/layout hints set by component libraries
 * - Mixing these categories creates ownership confusion
 * - Official shadcn/ui does NOT define these in design system
 *
 * EXAMPLE: --radix-select-trigger-width
 * - Set by: @radix-ui/react-select when dropdown opens
 * - Purpose: Match dropdown width to trigger button width
 * - Value: Measured dynamically (e.g., "200px" based on actual trigger)
 * - Fallback: If undefined, CSS ignores invalid var() → uses auto/initial
 * - Impact: Visual mismatch (dropdown narrower than trigger), but functional
 *
 * WHEN TO ADD NEW TOKENS HERE:
 * 1. Validator reports "missing" token with --radix-* or similar prefix
 * 2. Check official library docs (Radix UI, Floating UI, etc.)
 * 3. If docs say "automatically set", add here
 * 4. If docs say "define in your CSS", add to design system instead
 *
 * RELATED DOCS: docs/design-system/radix-runtime-tokens-analysis.md
 */
const RUNTIME_TOKENS = new Set([
  // Radix UI Select component
  'radix-select-trigger-height',      // Dropdown viewport height matches trigger
  'radix-select-trigger-width',       // Dropdown min-width matches trigger
  'radix-select-content-available-height', // Max height constrained to viewport
  'radix-select-content-transform-origin', // Animation origin point

  // Radix UI Dropdown Menu component
  'radix-dropdown-menu-trigger-width',
  'radix-dropdown-menu-trigger-height',
  'radix-dropdown-menu-content-available-width',
  'radix-dropdown-menu-content-available-height',

  // Radix UI Popover component
  'radix-popover-trigger-width',
  'radix-popover-trigger-height',
  'radix-popover-content-available-width',
  'radix-popover-content-available-height',

  // Radix UI Tooltip component
  'radix-tooltip-trigger-width',
  'radix-tooltip-trigger-height',

  // Radix UI Navigation Menu
  'radix-navigation-menu-viewport-width',
  'radix-navigation-menu-viewport-height',

  // Radix UI Accordion
  'radix-accordion-content-height', // For smooth height animations
  'radix-accordion-content-width',

  // Radix UI Collapsible
  'radix-collapsible-content-height',
  'radix-collapsible-content-width',
]);

async function loadDefinedCssVars(): Promise<Set<string>> {
  const generatedCssPath = path.join(
    process.cwd(),
    'src/styles/design-tokens.generated.css'
  );
  const content = await fs.readFile(generatedCssPath, 'utf-8');

  // Extract all CSS variable names (without --)
  const cssVarMatches = content.matchAll(/--([a-z0-9_-]+):/gi);
  const cssVars = new Set<string>();
  for (const match of cssVarMatches) {
    cssVars.add(match[1]);
  }

  return cssVars;
}

async function scanShadcnComponents(): Promise<TokenRequirement[]> {
  const componentFiles = await glob('src/components/ui/*.tsx', {
    cwd: process.cwd(),
  });

  const requirements: TokenRequirement[] = [];
  const definedCssVars = await loadDefinedCssVars();

  for (const file of componentFiles) {
    const filePath = path.join(process.cwd(), file);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const componentName = path.basename(file);

    lines.forEach((line, idx) => {
      // 1. Find all var(--token-name) usages
      const varMatches = line.matchAll(/var\(--([a-z0-9_-]+)\)/gi);
      for (const match of varMatches) {
        const tokenName = match[1];

        // Determine if token is provided
        let isProvided = false;
        let providerInfo = '';

        if (definedCssVars.has(tokenName)) {
          isProvided = true;
          providerInfo = 'design-tokens.generated.css';
        } else if (EXTERNAL_TOKENS.has(tokenName)) {
          isProvided = true;
          providerInfo = 'compatibility layer (generate-css-variables.ts)';
        } else if (RUNTIME_TOKENS.has(tokenName)) {
          isProvided = true;
          providerInfo = '3rd-party runtime variable (Radix UI, etc.)';
        } else if (/^(z-|ease-|foreground-|background-)/.test(tokenName)) {
          // Tailwind system tokens
          isProvided = true;
          providerInfo = 'Tailwind CSS system token';
        } else {
          isProvided = false;
          providerInfo = 'NOT PROVIDED - missing from design system';
        }

        requirements.push({
          component: componentName,
          tokenName,
          line: idx + 1,
          isProvided,
          providerInfo,
        });
      }

      // 2. Find Tailwind utility token usages (bg-*, text-*, border-*, etc.)
      // Pattern: bg-{token-name}, text-{token-name}, border-{token-name}
      const tailwindPrefixes = ['bg', 'text', 'border', 'ring', 'shadow'];
      const tailwindPattern = new RegExp(
        `\\b(${tailwindPrefixes.join('|')})-((?:[a-z0-9]+-)*[a-z0-9]+)(?:\\s|:|/|\\[|"|$)`,
        'gi'
      );

      const tailwindMatches = line.matchAll(tailwindPattern);
      for (const match of tailwindMatches) {
        const prefix = match[1]; // bg, text, border, etc.
        const tokenName = match[2]; // interactive-primary-bg, foreground, etc.

        // Skip common Tailwind defaults (bg-white, text-black, border-2, etc.)
        if (
          /^(white|black|transparent|current|inherit|none)$/.test(tokenName) ||
          /^\d+$/.test(tokenName) || // numeric values (border-2, w-4)
          /^(xs|sm|md|lg|xl|2xl|3xl)$/.test(tokenName) || // size variants
          /^(solid|dashed|dotted)$/.test(tokenName) // border styles
        ) {
          continue;
        }

        // Check if this looks like a custom token from our design system
        const looksLikeCustomToken =
          tokenName.includes('-') && // has hyphens
          (tokenName.startsWith('interactive-') ||
            tokenName.startsWith('surface-') ||
            tokenName.startsWith('feedback-') ||
            tokenName.includes('-fg') ||
            tokenName.includes('-bg') ||
            tokenName.includes('-border') ||
            tokenName.includes('-text'));

        if (!looksLikeCustomToken) {
          continue;
        }

        // Determine if token is provided
        let isProvided = false;
        let providerInfo = '';

        if (definedCssVars.has(tokenName)) {
          isProvided = true;
          providerInfo = 'design-tokens.generated.css (Tailwind utility)';
        } else if (EXTERNAL_TOKENS.has(tokenName)) {
          isProvided = true;
          providerInfo = 'compatibility layer (Tailwind utility)';
        } else if (RUNTIME_TOKENS.has(tokenName)) {
          isProvided = true;
          providerInfo = '3rd-party runtime variable (Radix UI, etc.)';
        } else {
          isProvided = false;
          providerInfo = 'NOT PROVIDED - missing from Tailwind @theme';
        }

        requirements.push({
          component: componentName,
          tokenName,
          line: idx + 1,
          isProvided,
          providerInfo,
        });
      }
    });
  }

  return requirements;
}

async function verifyShadcnTokenRequirements(): Promise<VerificationResult> {
  const requirements = await scanShadcnComponents();

  const providedTokens = new Set<string>();
  const missingTokens = new Set<string>();
  const definedCssVars = await loadDefinedCssVars();

  requirements.forEach(req => {
    if (req.isProvided) {
      providedTokens.add(req.tokenName);
    } else {
      missingTokens.add(req.tokenName);
    }
  });

  return {
    requirements,
    providedTokens,
    missingTokens,
    definedCssVars,
  };
}

function generateAIReport(result: VerificationResult): AIReport {
  const totalComponents = new Set(result.requirements.map(r => r.component)).size;
  const totalTokenUsages = result.requirements.length;
  const providedCount = result.requirements.filter(r => r.isProvided).length;
  const missingCount = result.requirements.filter(r => !r.isProvided).length;

  // Group missing tokens by component
  const missingByComponent = new Map<string, TokenRequirement[]>();
  result.requirements
    .filter(r => !r.isProvided)
    .forEach(req => {
      if (!missingByComponent.has(req.component)) {
        missingByComponent.set(req.component, []);
      }
      missingByComponent.get(req.component)!.push(req);
    });

  // Create details section
  const details: AIReportDetail[] = [];

  // Group by component for better readability
  for (const [component, reqs] of missingByComponent) {
    reqs.forEach(req => {
      details.push({
        level: 'ERROR',
        location: `${req.component}:${req.line}`,
        finding: `Requires var(--${req.tokenName})`,
        expected: `Token --${req.tokenName} should be defined in design system`,
        suggestion: findSuggestionForToken(req.tokenName, result.definedCssVars),
      });
    });
  }

  // Create actions section
  const actions: AIReportAction[] = [];

  if (result.missingTokens.size > 0) {
    // Group suggestions by category
    const spacingTokens = Array.from(result.missingTokens).filter(t =>
      t.includes('spacing')
    );
    const borderTokens = Array.from(result.missingTokens).filter(t =>
      t.includes('border')
    );
    const chartTokens = Array.from(result.missingTokens).filter(t =>
      t.includes('chart')
    );
    const otherTokens = Array.from(result.missingTokens).filter(
      t => !spacingTokens.includes(t) && !borderTokens.includes(t) && !chartTokens.includes(t)
    );

    if (spacingTokens.length > 0) {
      actions.push({
        priority: 'CRITICAL',
        action: `Add spacing tokens to compatibility layer: ${spacingTokens.join(', ')}`,
        reason: `shadcn components (alert, card, etc.) expect --spacing as base unit`,
        howTo: `In generate-css-variables.ts line ~156, add:\n  css += \`--spacing: \${primitiveSpacing[4]}; /* 4px base unit */\\n\`;`,
      });
    }

    if (borderTokens.length > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Add border variant tokens: ${borderTokens.join(', ')}`,
        reason: `Components expect border variants (default, etc.)`,
        howTo: `Add alias in compatibility layer or rename existing --border usage`,
      });
    }

    if (chartTokens.length > 0) {
      actions.push({
        priority: 'MEDIUM',
        action: `Add chart color tokens or remove chart usage: ${chartTokens.join(', ')}`,
        reason: `Chart colors referenced but not defined`,
        howTo: `Either add chart tokens to semantic/charts.ts or remove from globals.css`,
      });
    }

    if (otherTokens.length > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Review and add missing tokens: ${otherTokens.join(', ')}`,
        reason: `shadcn components expect these tokens`,
        howTo: `Analyze usage and add to appropriate semantic token file`,
      });
    }
  }

  const status = result.missingTokens.size === 0 ? 'PASSED' : 'FAILED';
  const impact = result.missingTokens.size === 0 ? 'INFO' : 'CRITICAL';

  return {
    context: {
      what: 'Verify shadcn-ui component token requirements vs design system supply',
      why: 'Prevent silent CSS failures when shadcn components use undefined tokens',
      when: 'Before adding new shadcn components, during token refactoring',
      docs: [
        'src/design-system/scripts/generate-css-variables.ts (compatibility layer)',
        'src/design-system/tokens/README.md',
      ],
    },
    analysis: {
      totalChecked: totalTokenUsages,
      passed: providedCount,
      failed: missingCount,
      warned: 0,
      summary: `Scanned ${totalComponents} shadcn components with ${totalTokenUsages} token usages. Found ${providedCount} provided tokens and ${missingCount} MISSING tokens.`,
      impact,
    },
    details,
    actions,
    status,
    nextStep:
      result.missingTokens.size > 0
        ? 'Add missing tokens to compatibility layer in generate-css-variables.ts'
        : 'All shadcn token requirements satisfied',
  };
}

function findSuggestionForToken(tokenName: string, definedCssVars: Set<string>): string {
  // Suggest alternatives from existing tokens
  if (tokenName === 'spacing') {
    return 'Add --spacing: ${primitiveSpacing[4]} to compatibility layer, or use existing --space-4';
  }

  if (tokenName === 'border-default') {
    return 'Create alias --border-default or use existing --border';
  }

  if (tokenName.startsWith('chart-')) {
    return 'Add chart color tokens to semantic/charts.ts or remove chart usage';
  }

  // Check for similar tokens
  const similarTokens = Array.from(definedCssVars).filter(v =>
    v.includes(tokenName) || tokenName.includes(v)
  );

  if (similarTokens.length > 0) {
    return `Similar tokens exist: ${similarTokens.slice(0, 3).join(', ')}. Consider aliasing or renaming.`;
  }

  return `Add --${tokenName} to compatibility layer in generate-css-variables.ts`;
}

// Run if called directly
if (require.main === module) {
  verifyShadcnTokenRequirements()
    .then(result => {
      const report = generateAIReport(result);
      const formatter = new AIReportFormatter(report);
      console.log(formatter.formatTerminal());

      // Export JSON for programmatic parsing
      const jsonPath = path.join(
        process.cwd(),
        'src/design-system/.verification-cache/shadcn-requirements.json'
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

export { verifyShadcnTokenRequirements };
