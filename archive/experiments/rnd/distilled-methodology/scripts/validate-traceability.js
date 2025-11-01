#!/usr/bin/env node
/**
 * Validate traceability-matrix.csv consistency
 * Usage: node scripts/validate-traceability.js [path-to-matrix.csv]
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'DEFERRED'];
const REQUIRED_COLUMNS = ['Task_ID', 'Contract_ID', 'Status'];

let errors = [];
let warnings = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addError(row, message) {
  errors.push({ row, message });
}

function addWarning(row, message) {
  warnings.push({ row, message });
}

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    row._lineNum = index + 2; // +2 because 0-indexed and header is line 1
    return row;
  });

  return { headers, rows };
}

function validateHeaders(headers) {
  const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  
  if (missing.length > 0) {
    addError(1, `Missing required columns: ${missing.join(', ')}`);
    return false;
  }

  return true;
}

function validateRow(row, index) {
  const lineNum = row._lineNum;

  // Validate Task_ID
  if (!row.Task_ID) {
    addError(lineNum, 'Missing Task_ID');
  } else if (!/^[A-Z]+-\d{3}$/.test(row.Task_ID)) {
    addError(lineNum, `Invalid Task_ID format: ${row.Task_ID} (expected [PREFIX]-[NNN])`);
  }

  // Validate Status
  if (!row.Status) {
    addError(lineNum, `Task ${row.Task_ID}: Missing status`);
  } else if (!VALID_STATUSES.includes(row.Status)) {
    addError(lineNum, `Task ${row.Task_ID}: Invalid status '${row.Status}' (expected: ${VALID_STATUSES.join(', ')})`);
  }

  // Validate files exist if DONE
  if (row.Status === 'DONE') {
    if (!row.Implementation_Files || row.Implementation_Files === '') {
      addWarning(lineNum, `Task ${row.Task_ID} is DONE but has no implementation files listed`);
    }

    if (!row.Test_Files || row.Test_Files === '') {
      addWarning(lineNum, `Task ${row.Task_ID} is DONE but has no test files listed`);
    }

    if (!row.Last_Verified || row.Last_Verified === '') {
      addError(lineNum, `Task ${row.Task_ID} is DONE but has no Last_Verified date`);
    }
  }

  // Validate Contract_ID format if present
  if (row.Contract_ID && row.Contract_ID !== '') {
    if (!/^CONTRACT-[A-Z]+-\d{3}$/.test(row.Contract_ID)) {
      addWarning(lineNum, `Task ${row.Task_ID}: Contract_ID '${row.Contract_ID}' doesn't match expected format CONTRACT-[NAME]-[NNN]`);
    }
  }

  // Validate date format if present
  if (row.Last_Verified && row.Last_Verified !== '') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.Last_Verified)) {
      addError(lineNum, `Task ${row.Task_ID}: Invalid date format '${row.Last_Verified}' (expected YYYY-MM-DD)`);
    }
  }
}

function checkOrphanedFiles(rows, projectRoot) {
  log('\n🔍 Checking for orphaned files...', 'blue');

  const trackedFiles = new Set();
  rows.forEach(row => {
    if (row.Implementation_Files) {
      row.Implementation_Files.split(',').forEach(file => {
        trackedFiles.add(file.trim().replace(/^"|"$/g, ''));
      });
    }
  });

  log(`   Tracked files: ${trackedFiles.size}`, 'blue');
}

function validateTraceability(filePath, options = {}) {
  log(`\n🔍 Validating traceability matrix: ${filePath}`, 'blue');

  if (!fs.existsSync(filePath)) {
    log(`❌ File not found: ${filePath}`, 'red');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const { headers, rows } = parseCSV(content);

  // Validate headers
  if (!validateHeaders(headers)) {
    log('\n❌ Invalid CSV structure', 'red');
    process.exit(1);
  }

  // Validate each row
  rows.forEach((row, index) => {
    validateRow(row, index);
  });

  // Optional: Check for orphaned files
  if (options.checkOrphaned && options.projectRoot) {
    checkOrphanedFiles(rows, options.projectRoot);
  }

  // Report results
  log('\n📊 Validation Results:', 'blue');
  log(`   Total entries: ${rows.length}`, 'blue');
  
  const doneCount = rows.filter(r => r.Status === 'DONE').length;
  const inProgressCount = rows.filter(r => r.Status === 'IN_PROGRESS').length;
  const todoCount = rows.filter(r => r.Status === 'TODO').length;
  
  log(`   DONE: ${doneCount}`, 'blue');
  log(`   IN_PROGRESS: ${inProgressCount}`, 'blue');
  log(`   TODO: ${todoCount}`, 'blue');

  if (errors.length === 0 && warnings.length === 0) {
    log('\n✅ Traceability matrix is valid!', 'green');
    process.exit(0);
  }

  // Print errors
  if (errors.length > 0) {
    log(`\n❌ Errors (${errors.length}):`, 'red');
    errors.forEach(({ row, message }) => {
      log(`   Line ${row}: ${message}`, 'red');
    });
  }

  // Print warnings
  if (warnings.length > 0) {
    log(`\n⚠️  Warnings (${warnings.length}):`, 'yellow');
    warnings.forEach(({ row, message }) => {
      log(`   Line ${row}: ${message}`, 'yellow');
    });
  }

  // Exit with error if any errors found
  if (errors.length > 0) {
    log('\n❌ Validation failed with errors', 'red');
    process.exit(1);
  } else {
    log('\n✅ Validation passed with warnings', 'green');
    process.exit(0);
  }
}

// Main
const matrixPath = process.argv[2] || 'traceability-matrix.csv';
validateTraceability(matrixPath);
