/**
 * AI-Readable Report Formatter
 *
 * Produces structured output optimized for AI agent parsing.
 * Zero-context readability: Each section is self-contained with explicit semantics.
 *
 * Format principles:
 * 1. CONTEXT section - What/Why/When
 * 2. ANALYSIS section - Findings with counts
 * 3. DETAILS section - Specific issues with file:line references
 * 4. ACTIONS section - Required fixes with priority levels
 * 5. SUMMARY section - Status and next steps
 * 6. MACHINE_READABLE section - JSON for programmatic parsing
 */

import chalk from 'chalk';

export interface AIReportContext {
  /** What is being verified */
  what: string;
  /** Why this verification matters */
  why: string;
  /** When to run this verification */
  when: string;
  /** Related documentation */
  docs?: string[];
}

export interface AIReportAnalysis {
  /** Total items checked */
  totalChecked: number;
  /** Items that passed */
  passed: number;
  /** Items that failed */
  failed: number;
  /** Items with warnings */
  warned: number;
  /** Human-readable summary */
  summary: string;
  /** Impact assessment */
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export interface AIReportDetail {
  /** Severity level */
  level: 'ERROR' | 'WARNING' | 'INFO';
  /** Location (file:line or component name) */
  location: string;
  /** What was found */
  finding: string;
  /** What was expected */
  expected?: string;
  /** Suggested fix */
  suggestion?: string;
}

export interface AIReportAction {
  /** Priority level */
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  /** Action description */
  action: string;
  /** Why this action is needed */
  reason: string;
  /** How to implement */
  howTo?: string;
}

export interface AIReport {
  context: AIReportContext;
  analysis: AIReportAnalysis;
  details: AIReportDetail[];
  actions: AIReportAction[];
  /** Overall verification status */
  status: 'PASSED' | 'FAILED' | 'WARNED';
  /** Next step recommendation */
  nextStep?: string;
}

export class AIReportFormatter {
  private report: AIReport;

  constructor(report: AIReport) {
    this.report = report;
  }

  /**
   * Format report for terminal output with AI-readable structure
   */
  formatTerminal(): string {
    const lines: string[] = [];
    const w = 80; // Width

    // Header
    lines.push('');
    lines.push(chalk.blue('═'.repeat(w)));
    lines.push(chalk.blue.bold('AI-READABLE VERIFICATION REPORT'));
    lines.push(chalk.blue('═'.repeat(w)));

    // CONTEXT Section
    lines.push('');
    lines.push(chalk.cyan.bold('=== CONTEXT ==='));
    lines.push('');
    lines.push(chalk.white(`What:  ${this.report.context.what}`));
    lines.push(chalk.white(`Why:   ${this.report.context.why}`));
    lines.push(chalk.white(`When:  ${this.report.context.when}`));
    if (this.report.context.docs && this.report.context.docs.length > 0) {
      lines.push(chalk.gray(`Docs:  ${this.report.context.docs.join(', ')}`));
    }

    // ANALYSIS Section
    lines.push('');
    lines.push(chalk.cyan.bold('=== ANALYSIS ==='));
    lines.push('');
    lines.push(chalk.white(`Total checked: ${this.report.analysis.totalChecked}`));
    lines.push(chalk.green(`Passed:        ${this.report.analysis.passed}`));
    if (this.report.analysis.failed > 0) {
      lines.push(chalk.red(`Failed:        ${this.report.analysis.failed}`));
    }
    if (this.report.analysis.warned > 0) {
      lines.push(chalk.yellow(`Warned:        ${this.report.analysis.warned}`));
    }
    lines.push('');
    lines.push(chalk.white(`Summary: ${this.report.analysis.summary}`));
    lines.push(this.formatImpact(this.report.analysis.impact));

    // DETAILS Section (limit to 20 items)
    if (this.report.details.length > 0) {
      lines.push('');
      lines.push(chalk.cyan.bold('=== DETAILS ==='));
      lines.push('');

      const detailsToShow = this.report.details.slice(0, 20);
      detailsToShow.forEach((detail, idx) => {
        const prefix = detail.level === 'ERROR' ? chalk.red('❌ ERROR') :
                       detail.level === 'WARNING' ? chalk.yellow('⚠️  WARN') :
                       chalk.blue('ℹ️  INFO');

        lines.push(`${prefix}  [${detail.location}]`);
        lines.push(chalk.white(`   Finding:    ${detail.finding}`));
        if (detail.expected) {
          lines.push(chalk.gray(`   Expected:   ${detail.expected}`));
        }
        if (detail.suggestion) {
          lines.push(chalk.cyan(`   💡 Fix: ${detail.suggestion}`));
        }
        lines.push('');
      });

      if (this.report.details.length > 20) {
        lines.push(chalk.gray(`   ... and ${this.report.details.length - 20} more issues`));
        lines.push('');
      }
    }

    // ACTIONS Section
    if (this.report.actions.length > 0) {
      lines.push('');
      lines.push(chalk.cyan.bold('=== ACTIONS REQUIRED ==='));
      lines.push('');

      this.report.actions.forEach((action, idx) => {
        const priorityColor = action.priority === 'CRITICAL' ? chalk.red :
                             action.priority === 'HIGH' ? chalk.yellow :
                             action.priority === 'MEDIUM' ? chalk.blue :
                             chalk.gray;

        lines.push(priorityColor(`${idx + 1}. [${action.priority}] ${action.action}`));
        lines.push(chalk.gray(`   Reason: ${action.reason}`));
        if (action.howTo) {
          lines.push(chalk.cyan(`   How: ${action.howTo}`));
        }
        lines.push('');
      });
    }

    // SUMMARY Section
    lines.push('');
    lines.push(chalk.cyan.bold('=== SUMMARY ==='));
    lines.push('');

    const statusIcon = this.report.status === 'PASSED' ? '✅' :
                       this.report.status === 'FAILED' ? '❌' :
                       '⚠️';
    const statusColor = this.report.status === 'PASSED' ? chalk.green :
                        this.report.status === 'FAILED' ? chalk.red :
                        chalk.yellow;

    lines.push(statusColor(`${statusIcon} Status: ${this.report.status}`));
    lines.push(chalk.white(`   Errors:   ${this.report.analysis.failed}`));
    lines.push(chalk.white(`   Warnings: ${this.report.analysis.warned}`));

    if (this.report.nextStep) {
      lines.push('');
      lines.push(chalk.cyan(`📍 Next Step: ${this.report.nextStep}`));
    }

    // MACHINE_READABLE Section
    lines.push('');
    lines.push(chalk.gray('=== MACHINE_READABLE (JSON) ==='));
    lines.push('');
    lines.push(chalk.gray(JSON.stringify(this.formatMachineReadable(), null, 2)));

    // Footer
    lines.push('');
    lines.push(chalk.blue('═'.repeat(w)));
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Format impact level with color
   */
  private formatImpact(impact: AIReportAnalysis['impact']): string {
    const impactText = `Impact: ${impact}`;
    switch (impact) {
      case 'CRITICAL':
        return chalk.red.bold(`⚠️  ${impactText} - Blocks production, breaks components`);
      case 'HIGH':
        return chalk.red(`⚠️  ${impactText} - Major issues, requires immediate attention`);
      case 'MEDIUM':
        return chalk.yellow(`⚠️  ${impactText} - Should be fixed soon`);
      case 'LOW':
        return chalk.blue(`ℹ️  ${impactText} - Minor issues, fix when convenient`);
      case 'INFO':
        return chalk.gray(`ℹ️  ${impactText} - Informational only`);
    }
  }

  /**
   * Format as JSON for programmatic parsing
   */
  formatMachineReadable() {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      report: {
        context: this.report.context,
        analysis: {
          ...this.report.analysis,
          passRate: ((this.report.analysis.passed / this.report.analysis.totalChecked) * 100).toFixed(1) + '%',
        },
        details: this.report.details,
        actions: this.report.actions,
        status: this.report.status,
        nextStep: this.report.nextStep,
      },
    };
  }

  /**
   * Export as JSON file
   */
  async exportJSON(filepath: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(
      filepath,
      JSON.stringify(this.formatMachineReadable(), null, 2),
      'utf-8'
    );
  }
}

/**
 * Helper: Create quick error report
 */
export function createErrorReport(
  what: string,
  errors: Array<{ location: string; finding: string; suggestion?: string }>
): AIReport {
  return {
    context: {
      what,
      why: 'Ensure system integrity and prevent runtime failures',
      when: 'Pre-build, pre-commit, on-demand',
    },
    analysis: {
      totalChecked: errors.length,
      passed: 0,
      failed: errors.length,
      warned: 0,
      summary: `Found ${errors.length} critical errors that must be fixed`,
      impact: 'CRITICAL',
    },
    details: errors.map(err => ({
      level: 'ERROR' as const,
      location: err.location,
      finding: err.finding,
      suggestion: err.suggestion,
    })),
    actions: [{
      priority: 'CRITICAL',
      action: 'Fix all errors listed above',
      reason: 'These errors will cause runtime failures',
    }],
    status: 'FAILED',
    nextStep: 'Review and fix errors, then re-run verification',
  };
}

/**
 * Helper: Create success report
 */
export function createSuccessReport(
  what: string,
  totalChecked: number,
  message?: string
): AIReport {
  return {
    context: {
      what,
      why: 'Ensure system integrity and prevent runtime failures',
      when: 'Pre-build, pre-commit, on-demand',
    },
    analysis: {
      totalChecked,
      passed: totalChecked,
      failed: 0,
      warned: 0,
      summary: message || `All ${totalChecked} checks passed successfully`,
      impact: 'INFO',
    },
    details: [],
    actions: [],
    status: 'PASSED',
    nextStep: 'All checks passed - ready to proceed',
  };
}
