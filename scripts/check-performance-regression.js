#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Performance regression checker for CI/CD
 * Compares current benchmark results with baseline
 */

const PERFORMANCE_THRESHOLDS = {
  // Maximum allowed increase in validation time (%)
  validationTime: 20,
  // Maximum allowed increase in memory usage (%)
  memoryUsage: 15,
  // Maximum allowed increase in bundle size (%)
  bundleSize: 10,
  // Minimum required success rate (%)
  successRate: 95,
};

const BASELINE_FILE = 'benchmark-baseline.json';
const CURRENT_REPORT = 'benchmark-report.json';

function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}:`, error.message);
    return null;
  }
}

function calculatePercentageChange(current, baseline) {
  if (baseline === 0) return current > 0 ? 100 : 0;
  return ((current - baseline) / baseline) * 100;
}

function checkPerformanceRegression() {
  console.log('🔍 Checking for performance regressions...');

  // Load current benchmark report
  const currentReport = loadJsonFile(CURRENT_REPORT);
  if (!currentReport) {
    console.error('❌ Current benchmark report not found');
    process.exit(1);
  }

  // Load baseline (if exists)
  const baseline = loadJsonFile(BASELINE_FILE);
  if (!baseline) {
    console.log('📝 No baseline found, creating new baseline...');
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(currentReport, null, 2));
    console.log('✅ Baseline created successfully');
    return;
  }

  console.log('📊 Comparing performance metrics...');

  const regressions = [];
  const improvements = [];

  // Check validation time
  if (currentReport.performance && baseline.performance) {
    const validationTimeChange = calculatePercentageChange(
      currentReport.performance.averageValidationTime,
      baseline.performance.averageValidationTime
    );

    if (validationTimeChange > PERFORMANCE_THRESHOLDS.validationTime) {
      regressions.push({
        metric: 'Validation Time',
        current: currentReport.performance.averageValidationTime,
        baseline: baseline.performance.averageValidationTime,
        change: validationTimeChange,
        threshold: PERFORMANCE_THRESHOLDS.validationTime,
      });
    } else if (validationTimeChange < -5) {
      improvements.push({
        metric: 'Validation Time',
        change: validationTimeChange,
      });
    }

    // Check memory usage
    const memoryChange = calculatePercentageChange(
      currentReport.performance.peakMemoryUsage,
      baseline.performance.peakMemoryUsage
    );

    if (memoryChange > PERFORMANCE_THRESHOLDS.memoryUsage) {
      regressions.push({
        metric: 'Memory Usage',
        current: currentReport.performance.peakMemoryUsage,
        baseline: baseline.performance.peakMemoryUsage,
        change: memoryChange,
        threshold: PERFORMANCE_THRESHOLDS.memoryUsage,
      });
    } else if (memoryChange < -5) {
      improvements.push({
        metric: 'Memory Usage',
        change: memoryChange,
      });
    }
  }

  // Check success rate
  if (currentReport.summary && baseline.summary) {
    const successRateChange = calculatePercentageChange(
      currentReport.summary.successRate * 100,
      baseline.summary.successRate * 100
    );

    if (currentReport.summary.successRate * 100 < PERFORMANCE_THRESHOLDS.successRate) {
      regressions.push({
        metric: 'Success Rate',
        current: currentReport.summary.successRate * 100,
        baseline: baseline.summary.successRate * 100,
        change: successRateChange,
        threshold: PERFORMANCE_THRESHOLDS.successRate,
      });
    }
  }

  // Check bundle size (if available)
  if (currentReport.bundleSize && baseline.bundleSize) {
    const bundleSizeChange = calculatePercentageChange(
      currentReport.bundleSize.total,
      baseline.bundleSize.total
    );

    if (bundleSizeChange > PERFORMANCE_THRESHOLDS.bundleSize) {
      regressions.push({
        metric: 'Bundle Size',
        current: currentReport.bundleSize.total,
        baseline: baseline.bundleSize.total,
        change: bundleSizeChange,
        threshold: PERFORMANCE_THRESHOLDS.bundleSize,
      });
    } else if (bundleSizeChange < -2) {
      improvements.push({
        metric: 'Bundle Size',
        change: bundleSizeChange,
      });
    }
  }

  // Report results
  console.log('\n📈 Performance Analysis Results:');

  if (improvements.length > 0) {
    console.log('\n✅ Performance Improvements:');
    improvements.forEach(improvement => {
      console.log(`   ${improvement.metric}: ${Math.abs(improvement.change).toFixed(1)}% faster`);
    });
  }

  if (regressions.length > 0) {
    console.log('\n❌ Performance Regressions Detected:');
    regressions.forEach(regression => {
      console.log(`   ${regression.metric}:`);
      console.log(`     Current: ${regression.current}`);
      console.log(`     Baseline: ${regression.baseline}`);
      console.log(`     Change: +${regression.change.toFixed(1)}% (threshold: ${regression.threshold}%)`);
    });

    console.log('\n💡 Performance regression detected! Consider:');
    console.log('   - Reviewing recent changes for performance impact');
    console.log('   - Optimizing algorithms or data structures');
    console.log('   - Checking for memory leaks or inefficient operations');
    console.log('   - Running profiler to identify bottlenecks');

    process.exit(1);
  } else {
    console.log('\n✅ No performance regressions detected!');
    
    // Update baseline if performance is stable or improved
    if (improvements.length > 0 || regressions.length === 0) {
      console.log('📝 Updating performance baseline...');
      fs.writeFileSync(BASELINE_FILE, JSON.stringify(currentReport, null, 2));
      console.log('✅ Baseline updated successfully');
    }
  }
}

// Generate performance report summary
function generatePerformanceSummary() {
  const currentReport = loadJsonFile(CURRENT_REPORT);
  const baseline = loadJsonFile(BASELINE_FILE);

  if (!currentReport) {
    console.error('❌ No current report found');
    return;
  }

  const summary = {
    timestamp: new Date().toISOString(),
    current: {
      validationTime: currentReport.performance?.averageValidationTime || 0,
      memoryUsage: currentReport.performance?.peakMemoryUsage || 0,
      successRate: (currentReport.summary?.successRate || 0) * 100,
      bundleSize: currentReport.bundleSize?.total || 0,
    },
    baseline: baseline ? {
      validationTime: baseline.performance?.averageValidationTime || 0,
      memoryUsage: baseline.performance?.peakMemoryUsage || 0,
      successRate: (baseline.summary?.successRate || 0) * 100,
      bundleSize: baseline.bundleSize?.total || 0,
    } : null,
    changes: {},
  };

  if (baseline) {
    summary.changes = {
      validationTime: calculatePercentageChange(summary.current.validationTime, summary.baseline.validationTime),
      memoryUsage: calculatePercentageChange(summary.current.memoryUsage, summary.baseline.memoryUsage),
      successRate: calculatePercentageChange(summary.current.successRate, summary.baseline.successRate),
      bundleSize: calculatePercentageChange(summary.current.bundleSize, summary.baseline.bundleSize),
    };
  }

  fs.writeFileSync('performance-summary.json', JSON.stringify(summary, null, 2));
  console.log('📊 Performance summary generated: performance-summary.json');
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'check':
      checkPerformanceRegression();
      break;
    case 'summary':
      generatePerformanceSummary();
      break;
    default:
      checkPerformanceRegression();
      generatePerformanceSummary();
  }
}