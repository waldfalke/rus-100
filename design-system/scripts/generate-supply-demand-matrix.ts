#!/usr/bin/env tsx

/**
 * Generate Supply-Demand Matrix Report
 *
 * Aggregates data from verification scripts to create comprehensive overview:
 * - What consumers (shadcn components) demand
 * - What design system supplies
 * - Where gaps exist
 * - Action plan to fix
 *
 * INPUT: .verification-cache/*.json (from verify scripts)
 * OUTPUT: docs/design-system/SUPPLY_DEMAND_MATRIX.md
 *
 * RUN: yarn generate-supply-demand-matrix
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

interface VerificationCache {
  shadcnRequirements?: any;
  compatibilityCompleteness?: any;
}

async function loadVerificationCache(): Promise<VerificationCache> {
  const cache: VerificationCache = {};
  const cacheDir = path.join(process.cwd(), 'src/design-system/.verification-cache');

  try {
    // Load shadcn requirements
    const shadcnPath = path.join(cacheDir, 'shadcn-requirements.json');
    const shadcnContent = await fs.readFile(shadcnPath, 'utf-8');
    cache.shadcnRequirements = JSON.parse(shadcnContent);
  } catch (err) {
    console.warn(chalk.yellow('⚠️  shadcn-requirements.json not found, run: yarn verify-shadcn-requirements'));
  }

  try {
    // Load compatibility completeness
    const compatPath = path.join(cacheDir, 'compatibility-completeness.json');
    const compatContent = await fs.readFile(compatPath, 'utf-8');
    cache.compatibilityCompleteness = JSON.parse(compatContent);
  } catch (err) {
    console.warn(chalk.yellow('⚠️  compatibility-completeness.json not found, run: yarn verify-compatibility-completeness'));
  }

  return cache;
}

function generateMarkdown(cache: VerificationCache): string {
  const lines: string[] = [];

  // Header
  lines.push('# Supply-Demand Matrix Report');
  lines.push('');
  lines.push('**Auto-generated:** ' + new Date().toISOString());
  lines.push('');
  lines.push('This report shows the relationship between token **demand** (what shadcn components require) and **supply** (what design system provides).');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Executive Summary
  lines.push('## 📊 Executive Summary');
  lines.push('');

  if (cache.shadcnRequirements) {
    const report = cache.shadcnRequirements.report;
    const { totalChecked, passed, failed } = report.analysis;
    const passRate = ((passed / totalChecked) * 100).toFixed(1);

    lines.push(`- **Total Token Usages:** ${totalChecked}`);
    lines.push(`- **Satisfied:** ${passed} (${passRate}%)`);
    lines.push(`- **Missing:** ${failed}`);
    lines.push(`- **Status:** ${failed === 0 ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');

    if (failed > 0) {
      lines.push(`**Impact:** ${report.analysis.impact} - ${getImpactDescription(report.analysis.impact)}`);
      lines.push('');
    }
  } else {
    lines.push('⚠️ Run `yarn verify-shadcn-requirements` to generate data');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Demand Section
  lines.push('## 🔍 Demand (Token Requirements)');
  lines.push('');
  lines.push('### shadcn Components');
  lines.push('');

  if (cache.shadcnRequirements) {
    const details = cache.shadcnRequirements.report.details;

    if (details.length === 0) {
      lines.push('✅ All token requirements satisfied!');
      lines.push('');
    } else {
      lines.push('The following components require tokens that are **NOT PROVIDED**:');
      lines.push('');

      // Group by component
      const byComponent = new Map<string, typeof details>();
      details.forEach((detail: any) => {
        const component = detail.location.split(':')[0];
        if (!byComponent.has(component)) {
          byComponent.set(component, []);
        }
        byComponent.get(component)!.push(detail);
      });

      for (const [component, componentDetails] of byComponent) {
        lines.push(`#### \`${component}\``);
        lines.push('');
        componentDetails.forEach((detail: any) => {
          lines.push(`- ❌ **${detail.finding}**`);
          lines.push(`  - Location: \`${detail.location}\``);
          if (detail.suggestion) {
            lines.push(`  - 💡 Fix: ${detail.suggestion}`);
          }
          lines.push('');
        });
      }
    }
  } else {
    lines.push('⚠️ Data not available');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Supply Section
  lines.push('## 📦 Supply (Design System Provisions)');
  lines.push('');
  lines.push('### Compatibility Layer');
  lines.push('');

  if (cache.compatibilityCompleteness) {
    const report = cache.compatibilityCompleteness.report;
    const providedInfo = report.details.find((d: any) => d.finding.includes('Provides'));

    if (providedInfo) {
      const tokensMatch = providedInfo.finding.match(/Provides (\d+) tokens/);
      if (tokensMatch) {
        lines.push(`Provides **${tokensMatch[1]}** tokens for shadcn compatibility:`);
        lines.push('');
        lines.push('```');
        lines.push(providedInfo.expected);
        lines.push('```');
        lines.push('');
      }
    }

    const satisfactionRate = report.analysis.passRate;
    lines.push(`**Satisfaction Rate:** ${satisfactionRate}`);
    lines.push('');

    // Unused tokens warning
    const unusedInfo = report.details.find((d: any) => d.level === 'WARNING');
    if (unusedInfo) {
      lines.push('**Note:** ' + unusedInfo.suggestion);
      lines.push('');
    }
  } else {
    lines.push('⚠️ Data not available');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Gap Analysis
  lines.push('## ⚠️ Gap Analysis');
  lines.push('');

  if (cache.shadcnRequirements && cache.compatibilityCompleteness) {
    const shadcnDetails = cache.shadcnRequirements.report.details;
    const compatDetails = cache.compatibilityCompleteness.report.details.filter(
      (d: any) => d.level === 'ERROR'
    );

    if (shadcnDetails.length === 0 && compatDetails.length === 0) {
      lines.push('✅ **No gaps found!** All shadcn components have required tokens.');
      lines.push('');
    } else {
      lines.push('The following tokens are **REQUIRED** but **NOT PROVIDED**:');
      lines.push('');

      // Extract unique missing tokens
      const missingTokens = new Set<string>();
      shadcnDetails.forEach((detail: any) => {
        const match = detail.finding.match(/var\(--([a-z0-9_-]+)\)/);
        if (match) {
          missingTokens.add(match[1]);
        }
      });

      lines.push('| Token | Required By | Impact | Fix |');
      lines.push('|-------|-------------|--------|-----|');

      for (const token of missingTokens) {
        const detail = shadcnDetails.find((d: any) => d.finding.includes(`--${token}`));
        const location = detail?.location || 'Unknown';
        const suggestion = detail?.suggestion || 'Add to compatibility layer';

        // Determine impact
        const impact = token.includes('spacing') || token.includes('radius') ? 'CRITICAL' : 'HIGH';

        lines.push(`| \`--${token}\` | ${location} | ${impact} | ${suggestion.split('\n')[0]} |`);
      }

      lines.push('');
    }
  } else {
    lines.push('⚠️ Run verification scripts to generate gap analysis');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Action Plan
  lines.push('## 🎯 Action Plan');
  lines.push('');

  if (cache.shadcnRequirements || cache.compatibilityCompleteness) {
    const allActions: any[] = [];

    if (cache.shadcnRequirements) {
      allActions.push(...cache.shadcnRequirements.report.actions);
    }

    if (cache.compatibilityCompleteness) {
      allActions.push(...cache.compatibilityCompleteness.report.actions);
    }

    if (allActions.length === 0) {
      lines.push('✅ No actions required - all checks passed!');
      lines.push('');
    } else {
      // Sort by priority
      const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      allActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      allActions.forEach((action: any, idx: number) => {
        lines.push(`### ${idx + 1}. [${action.priority}] ${action.action}`);
        lines.push('');
        lines.push(`**Reason:** ${action.reason}`);
        lines.push('');
        if (action.howTo) {
          lines.push(`**How to fix:**`);
          lines.push('```typescript');
          lines.push(action.howTo);
          lines.push('```');
          lines.push('');
        }
      });
    }
  } else {
    lines.push('⚠️ Run verification scripts to generate action plan');
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Footer
  lines.push('## 🔄 Regenerate This Report');
  lines.push('');
  lines.push('```bash');
  lines.push('# 1. Run verification scripts');
  lines.push('yarn validate:supply-demand');
  lines.push('');
  lines.push('# 2. Generate updated matrix report');
  lines.push('yarn generate-supply-demand-matrix');
  lines.push('```');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('*This report is auto-generated. Do not edit manually.*');

  return lines.join('\n');
}

function getImpactDescription(impact: string): string {
  switch (impact) {
    case 'CRITICAL':
      return 'Blocks production, breaks components';
    case 'HIGH':
      return 'Major issues, requires immediate attention';
    case 'MEDIUM':
      return 'Should be fixed soon';
    case 'LOW':
      return 'Minor issues, fix when convenient';
    default:
      return 'Informational only';
  }
}

async function generateSupplyDemandMatrix() {
  console.log(chalk.blue('\n🔄 Generating Supply-Demand Matrix Report...\n'));

  const cache = await loadVerificationCache();

  if (!cache.shadcnRequirements && !cache.compatibilityCompleteness) {
    console.log(chalk.red('❌ No verification data found!'));
    console.log(chalk.yellow('   Run: yarn validate:supply-demand'));
    process.exit(1);
  }

  const markdown = generateMarkdown(cache);

  // Write to file
  const outputPath = path.join(process.cwd(), 'docs/design-system/SUPPLY_DEMAND_MATRIX.md');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markdown, 'utf-8');

  console.log(chalk.green('✅ Report generated:'), chalk.cyan(outputPath));
  console.log(chalk.gray('   View: docs/design-system/SUPPLY_DEMAND_MATRIX.md'));
  console.log('');
}

// Run if called directly
if (require.main === module) {
  generateSupplyDemandMatrix()
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      console.error(chalk.red('Fatal error:'), err);
      process.exit(1);
    });
}

export { generateSupplyDemandMatrix };
