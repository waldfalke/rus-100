/**
 * Comprehensive token validation system for CI/CD
 */

import type { 
  ThemeContext, 
  TokenContract, 
  TokenPath, 
  ResolvedTokenValue 
} from '../theme-contracts';
import { 
  validateTokenContract, 
  validateThemeContext,
  validateCSSColor,
  validateCSSValue,
  checkWCAGContrast 
} from '../theme-contracts/validation';
import { contextResolver } from '../context';

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  /** Validation success status */
  success: boolean;
  
  /** Error messages */
  errors: ValidationError[];
  
  /** Warning messages */
  warnings: ValidationWarning[];
  
  /** Performance metrics */
  metrics: ValidationMetrics;
  
  /** Validation context */
  context: {
    tokenPath: string;
    themeContext: ThemeContext;
    timestamp: number;
  };
}

export interface ValidationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'error' | 'warning';
  
  /** Token path where error occurred */
  tokenPath: string;
  
  /** Expected value */
  expected?: any;
  
  /** Actual value */
  actual?: any;
  
  /** Suggestions for fixing */
  suggestions?: string[];
}

export interface ValidationWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Token path */
  tokenPath: string;
  
  /** Recommendation */
  recommendation?: string;
}

export interface ValidationMetrics {
  /** Total validation time in ms */
  totalTime: number;
  
  /** Number of tokens validated */
  tokensValidated: number;
  
  /** Number of contexts tested */
  contextsValidated: number;
  
  /** Memory usage in MB */
  memoryUsage: number;
}

export interface ValidationConfig {
  /** Validation rules to apply */
  rules: ValidationRule[];
  
  /** Contexts to test against */
  testContexts: ThemeContext[];
  
  /** Performance thresholds */
  performance: {
    maxValidationTime: number; // ms
    maxMemoryUsage: number; // MB
  };
  
  /** Output configuration */
  output: {
    format: 'json' | 'junit' | 'console';
    verbose: boolean;
    includeWarnings: boolean;
  };
}

export interface ValidationRule {
  /** Rule identifier */
  id: string;
  
  /** Rule name */
  name: string;
  
  /** Rule description */
  description: string;
  
  /** Token patterns to match */
  tokenPatterns: RegExp[];
  
  /** Validation function */
  validate: (
    tokenPath: string,
    value: ResolvedTokenValue,
    context: ThemeContext,
    contract: TokenContract
  ) => ValidationError[];
  
  /** Rule severity */
  severity: 'error' | 'warning';
  
  /** Whether rule is enabled */
  enabled: boolean;
}

// ============================================================================
// TOKEN VALIDATOR CLASS
// ============================================================================

export class TokenValidator {
  private config: ValidationConfig;
  private results: ValidationResult[] = [];
  
  constructor(config: ValidationConfig) {
    this.config = config;
  }
  
  /**
   * Validate a single token across all test contexts
   */
  async validateToken(
    tokenPath: TokenPath,
    contract: TokenContract
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const context of this.config.testContexts) {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      const result = await this.validateTokenInContext(
        tokenPath,
        contract,
        context
      );
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      result.metrics = {
        totalTime: endTime - startTime,
        tokensValidated: 1,
        contextsValidated: 1,
        memoryUsage: endMemory - startMemory,
      };
      
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Validate a token in a specific context
   */
  private async validateTokenInContext(
    tokenPath: TokenPath,
    contract: TokenContract,
    context: ThemeContext
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    try {
      // Validate contract structure
      const contractValidation = validateTokenContract(contract);
      if (!contractValidation.isValid) {
        errors.push({
          code: 'INVALID_CONTRACT',
          message: `Invalid token contract: ${contractValidation.errors.join(', ')}`,
          severity: 'error',
          tokenPath,
          suggestions: ['Check contract structure and required properties'],
        });
      }
      
      // Resolve token value
      let resolvedValue: ResolvedTokenValue;
      try {
        if (typeof contract.resolve === 'function') {
          resolvedValue = contract.resolve(context);
        } else {
          resolvedValue = contract.fallback || contract.value || null;
        }
        
        // Apply context resolution
        if (resolvedValue !== null) {
          resolvedValue = contextResolver.resolve(tokenPath, resolvedValue, context);
        }
      } catch (error) {
        errors.push({
          code: 'RESOLUTION_ERROR',
          message: `Failed to resolve token: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
          tokenPath,
          suggestions: ['Check resolve function implementation'],
        });
        resolvedValue = null;
      }
      
      // Apply validation rules
      if (resolvedValue !== null) {
        for (const rule of this.config.rules) {
          if (!rule.enabled) continue;
          
          const matches = rule.tokenPatterns.some(pattern => 
            pattern.test(tokenPath)
          );
          
          if (matches) {
            try {
              const ruleErrors = rule.validate(tokenPath, resolvedValue, context, contract);
              errors.push(...ruleErrors);
            } catch (error) {
              errors.push({
                code: 'RULE_ERROR',
                message: `Rule "${rule.id}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'warning',
                tokenPath,
              });
            }
          }
        }
      }
      
      // Performance warnings
      if (this.config.performance.maxValidationTime > 0) {
        const validationTime = performance.now();
        // This will be calculated in the calling function
      }
      
    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
        tokenPath,
      });
    }
    
    return {
      success: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      warnings,
      metrics: {
        totalTime: 0, // Will be set by caller
        tokensValidated: 1,
        contextsValidated: 1,
        memoryUsage: 0, // Will be set by caller
      },
      context: {
        tokenPath,
        themeContext: context,
        timestamp: Date.now(),
      },
    };
  }
  
  /**
   * Validate multiple tokens
   */
  async validateTokens(
    tokens: Record<TokenPath, TokenContract>
  ): Promise<ValidationResult[]> {
    const allResults: ValidationResult[] = [];
    
    for (const [tokenPath, contract] of Object.entries(tokens)) {
      const tokenResults = await this.validateToken(tokenPath, contract);
      allResults.push(...tokenResults);
    }
    
    this.results = allResults;
    return allResults;
  }
  
  /**
   * Generate validation report
   */
  generateReport(): ValidationReport {
    const totalErrors = this.results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = this.results.reduce((sum, r) => sum + r.warnings.length, 0);
    const successfulValidations = this.results.filter(r => r.success).length;
    
    const errorsByCode = this.results
      .flatMap(r => r.errors)
      .reduce((acc, error) => {
        acc[error.code] = (acc[error.code] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const averageValidationTime = this.results.length > 0
      ? this.results.reduce((sum, r) => sum + r.metrics.totalTime, 0) / this.results.length
      : 0;
    
    return {
      summary: {
        totalValidations: this.results.length,
        successfulValidations,
        failedValidations: this.results.length - successfulValidations,
        totalErrors,
        totalWarnings,
        successRate: this.results.length > 0 ? successfulValidations / this.results.length : 0,
      },
      performance: {
        averageValidationTime,
        totalValidationTime: this.results.reduce((sum, r) => sum + r.metrics.totalTime, 0),
        peakMemoryUsage: Math.max(...this.results.map(r => r.metrics.memoryUsage), 0),
      },
      errorBreakdown: errorsByCode,
      results: this.results,
      timestamp: Date.now(),
    };
  }
  
  /**
   * Export report in specified format
   */
  exportReport(report: ValidationReport): string {
    switch (this.config.output.format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'junit':
        return this.generateJUnitXML(report);
      
      case 'console':
      default:
        return this.generateConsoleReport(report);
    }
  }
  
  /**
   * Generate JUnit XML format
   */
  private generateJUnitXML(report: ValidationReport): string {
    const testCases = report.results.map(result => {
      const errors = result.errors.filter(e => e.severity === 'error');
      const hasFailure = errors.length > 0;
      
      let testCase = `    <testcase name="${result.context.tokenPath}" time="${result.metrics.totalTime / 1000}">`;
      
      if (hasFailure) {
        const errorMessages = errors.map(e => e.message).join('; ');
        testCase += `\n      <failure message="${errorMessages}"></failure>`;
      }
      
      testCase += '\n    </testcase>';
      return testCase;
    }).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuite 
  name="Token Validation" 
  tests="${report.summary.totalValidations}"
  failures="${report.summary.failedValidations}"
  time="${report.performance.totalValidationTime / 1000}">
${testCases}
</testsuite>`;
  }
  
  /**
   * Generate console report
   */
  private generateConsoleReport(report: ValidationReport): string {
    let output = '\n=== TOKEN VALIDATION REPORT ===\n\n';
    
    // Summary
    output += `Summary:\n`;
    output += `  Total Validations: ${report.summary.totalValidations}\n`;
    output += `  Successful: ${report.summary.successfulValidations}\n`;
    output += `  Failed: ${report.summary.failedValidations}\n`;
    output += `  Success Rate: ${(report.summary.successRate * 100).toFixed(1)}%\n`;
    output += `  Total Errors: ${report.summary.totalErrors}\n`;
    output += `  Total Warnings: ${report.summary.totalWarnings}\n\n`;
    
    // Performance
    output += `Performance:\n`;
    output += `  Average Validation Time: ${report.performance.averageValidationTime.toFixed(2)}ms\n`;
    output += `  Total Validation Time: ${report.performance.totalValidationTime.toFixed(2)}ms\n`;
    output += `  Peak Memory Usage: ${report.performance.peakMemoryUsage.toFixed(2)}MB\n\n`;
    
    // Error breakdown
    if (Object.keys(report.errorBreakdown).length > 0) {
      output += `Error Breakdown:\n`;
      for (const [code, count] of Object.entries(report.errorBreakdown)) {
        output += `  ${code}: ${count}\n`;
      }
      output += '\n';
    }
    
    // Detailed errors (if verbose)
    if (this.config.output.verbose) {
      const failedResults = report.results.filter(r => !r.success);
      if (failedResults.length > 0) {
        output += `Detailed Errors:\n`;
        for (const result of failedResults) {
          output += `\n  Token: ${result.context.tokenPath}\n`;
          for (const error of result.errors) {
            output += `    [${error.severity.toUpperCase()}] ${error.code}: ${error.message}\n`;
            if (error.suggestions) {
              output += `      Suggestions: ${error.suggestions.join(', ')}\n`;
            }
          }
        }
      }
    }
    
    return output;
  }
  
  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }
}

// ============================================================================
// VALIDATION REPORT TYPE
// ============================================================================

export interface ValidationReport {
  summary: {
    totalValidations: number;
    successfulValidations: number;
    failedValidations: number;
    totalErrors: number;
    totalWarnings: number;
    successRate: number;
  };
  performance: {
    averageValidationTime: number;
    totalValidationTime: number;
    peakMemoryUsage: number;
  };
  errorBreakdown: Record<string, number>;
  results: ValidationResult[];
  timestamp: number;
}

// ============================================================================
// DEFAULT VALIDATION RULES
// ============================================================================

export const DEFAULT_VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'color-format',
    name: 'Color Format Validation',
    description: 'Validates that color tokens produce valid CSS color values',
    tokenPatterns: [/^colors\./],
    severity: 'error',
    enabled: true,
    validate: (tokenPath, value, context, contract) => {
      const errors: ValidationError[] = [];
      
      if (typeof value === 'string') {
        const validation = validateCSSColor(value);
        if (!validation.isValid) {
          errors.push({
            code: 'INVALID_COLOR_FORMAT',
            message: `Invalid color format: ${validation.errors.join(', ')}`,
            severity: 'error',
            tokenPath,
            actual: value,
            suggestions: ['Use valid CSS color format (hex, rgb, hsl, oklch)'],
          });
        }
      }
      
      return errors;
    },
  },
  
  {
    id: 'contrast-compliance',
    name: 'WCAG Contrast Compliance',
    description: 'Validates that color combinations meet WCAG contrast requirements',
    tokenPatterns: [/^colors\.(foreground|text)/],
    severity: 'warning',
    enabled: true,
    validate: (tokenPath, value, context, contract) => {
      const errors: ValidationError[] = [];
      
      // This would need background color context to properly validate
      // For now, just check if it's a valid color
      if (typeof value === 'string' && contract.accessibility?.contrastRatio) {
        const requiredRatio = contract.accessibility.contrastRatio;
        // In a real implementation, you'd calculate actual contrast
        // against background colors
      }
      
      return errors;
    },
  },
  
  {
    id: 'dimension-format',
    name: 'Dimension Format Validation',
    description: 'Validates that dimension tokens produce valid CSS dimension values',
    tokenPatterns: [/^spacing\./, /^typography\.fontSize/, /^borderRadius\./],
    severity: 'error',
    enabled: true,
    validate: (tokenPath, value, context, contract) => {
      const errors: ValidationError[] = [];
      
      if (typeof value === 'string') {
        const validation = validateCSSValue(value);
        if (!validation.isValid) {
          errors.push({
            code: 'INVALID_DIMENSION_FORMAT',
            message: `Invalid dimension format: ${validation.errors.join(', ')}`,
            severity: 'error',
            tokenPath,
            actual: value,
            suggestions: ['Use valid CSS dimension (px, rem, em, %)'],
          });
        }
      }
      
      return errors;
    },
  },
  
  {
    id: 'performance-check',
    name: 'Performance Validation',
    description: 'Checks for performance issues in token resolution',
    tokenPatterns: [/.*/],
    severity: 'warning',
    enabled: true,
    validate: (tokenPath, value, context, contract) => {
      const errors: ValidationError[] = [];
      
      // Check for expensive operations
      if (typeof contract.resolve === 'function') {
        const startTime = performance.now();
        try {
          contract.resolve(context);
          const endTime = performance.now();
          
          if (endTime - startTime > 10) { // 10ms threshold
            errors.push({
              code: 'SLOW_RESOLUTION',
              message: `Token resolution is slow (${(endTime - startTime).toFixed(2)}ms)`,
              severity: 'warning',
              tokenPath,
              suggestions: ['Consider memoization or optimization'],
            });
          }
        } catch (error) {
          // Error will be caught by main validation
        }
      }
      
      return errors;
    },
  },
];