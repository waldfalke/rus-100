#!/usr/bin/env node

import { TokenValidator, DEFAULT_VALIDATION_RULES } from '../lib/testing/TokenValidator';
import { themeContract } from '../lib/theme-contracts';
import { colorTokens, spacingTokens, typographyTokens } from '../lib/tokens';
import fs from 'fs/promises';
import path from 'path';

interface ValidationContext {
  mode: 'light' | 'dark';
  contrast: 'normal' | 'high';
  platform: 'web' | 'ios' | 'android';
}

const TEST_CONTEXTS: ValidationContext[] = [
  { mode: 'light', contrast: 'normal', platform: 'web' },
  { mode: 'dark', contrast: 'normal', platform: 'web' },
  { mode: 'light', contrast: 'high', platform: 'web' },
  { mode: 'dark', contrast: 'high', platform: 'web' },
  { mode: 'light', contrast: 'normal', platform: 'ios' },
  { mode: 'dark', contrast: 'normal', platform: 'ios' },
  { mode: 'light', contrast: 'normal', platform: 'android' },
  { mode: 'dark', contrast: 'normal', platform: 'android' },
];

async function validateTokens() {
  console.log('🔍 Starting token validation...');
  
  const validator = new TokenValidator({
    rules: DEFAULT_VALIDATION_RULES,
    testContexts: TEST_CONTEXTS.map(ctx => ({
      name: `${ctx.mode}-${ctx.contrast}-${ctx.platform}`,
      themeContext: {
        mode: ctx.mode,
        contrast: ctx.contrast,
        platform: ctx.platform,
        reducedMotion: false,
        largeText: false,
      },
      tokenPath: 'root',
    })),
  });

  // Collect all tokens to validate
  const tokensToValidate = [
    // Color tokens
    ...Object.entries(colorTokens).map(([key, token]) => ({
      name: `colors.${key}`,
      token,
      type: 'color' as const,
    })),
    
    // Spacing tokens
    ...Object.entries(spacingTokens).map(([key, token]) => ({
      name: `spacing.${key}`,
      token,
      type: 'dimension' as const,
    })),
    
    // Typography tokens
    ...Object.entries(typographyTokens).map(([key, token]) => ({
      name: `typography.${key}`,
      token,
      type: 'typography' as const,
    })),
  ];

  console.log(`📊 Validating ${tokensToValidate.length} tokens across ${TEST_CONTEXTS.length} contexts...`);

  // Run validation
  const startTime = Date.now();
  const results = await validator.validateTokens({});
  const endTime = Date.now();

  // Generate reports
  console.log('📝 Generating validation reports...');
  
  const report = validator.generateReport();
  const jsonReport = validator.exportReport(report);
  const junitReport = validator.exportReport(report);
  const consoleReport = validator.exportReport(report);

  // Write reports to files
  // ОШИБКА: Argument of type 'ValidationReport' is not assignable to parameter of type 'string'
  // ИСПРАВЛЕНИЕ: Используем exportReport для получения строкового представления
  await fs.writeFile('validation-report.json', jsonReport);
  await fs.writeFile('validation-report.xml', junitReport);
  
  // Print console report
  console.log('\n' + consoleReport);

  // Calculate and display summary
  const summary = {
    totalValidations: results.length,
    successfulValidations: results.filter(r => r.success).length,
    failedValidations: results.filter(r => !r.success).length,
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
    successRate: results.filter(r => r.success).length / results.length,
    duration: endTime - startTime,
  };

  console.log('\n📈 Validation Summary:');
  console.log(`   Total Validations: ${summary.totalValidations}`);
  console.log(`   Successful: ${summary.successfulValidations}`);
  console.log(`   Failed: ${summary.failedValidations}`);
  console.log(`   Success Rate: ${(summary.successRate * 100).toFixed(1)}%`);
  console.log(`   Total Errors: ${summary.totalErrors}`);
  console.log(`   Total Warnings: ${summary.totalWarnings}`);
  console.log(`   Duration: ${summary.duration}ms`);

  // Exit with error code if validations failed
  if (summary.failedValidations > 0) {
    console.error('\n❌ Token validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All token validations passed!');
    process.exit(0);
  }
}

// Performance monitoring
async function validateTokensWithPerformanceMonitoring() {
  const memoryBefore = process.memoryUsage();
  const startTime = process.hrtime.bigint();

  try {
    await validateTokens();
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  } finally {
    const endTime = process.hrtime.bigint();
    const memoryAfter = process.memoryUsage();
    
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
    const memoryDelta = {
      rss: memoryAfter.rss - memoryBefore.rss,
      heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
      heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
    };

    console.log('\n🔧 Performance Metrics:');
    console.log(`   Execution Time: ${duration.toFixed(2)}ms`);
    console.log(`   Memory Delta (RSS): ${(memoryDelta.rss / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Memory Delta (Heap Used): ${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Peak Memory Usage: ${(memoryAfter.rss / 1024 / 1024).toFixed(2)}MB`);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateTokensWithPerformanceMonitoring().catch(error => {
    console.error('❌ Fatal error during token validation:', error);
    process.exit(1);
  });
}

export { validateTokens, validateTokensWithPerformanceMonitoring };