#!/usr/bin/env node
/**
 * Validate that DONE tasks in traceability-matrix.csv have tests or explicit justification.
 * Usage: node scripts/validate-tests.js [path-to-matrix.csv]
 */

const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map((line, idx) => {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    const row = { _line: idx + 2 };
    headers.forEach((h, i) => (row[h] = (cols[i] || '').trim()));
    return row;
  });
  return { headers, rows };
}

function ensureColumns(headers, required) {
  const missing = required.filter(c => !headers.includes(c));
  if (missing.length) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }
}

function main() {
  const matrixPath = process.argv[2] || 'traceability-matrix.csv';
  if (!fs.existsSync(matrixPath)) {
    log(`❌ File not found: ${matrixPath}`, 'red');
    process.exit(1);
  }
  const content = fs.readFileSync(matrixPath, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const required = [
    'Task_ID',
    'Contract_ID',
    'Implementation_Files',
    'Test_Files',
    'Status',
    'NoTests_Reason',
    'A11y_Checked',
    'Visual_Coverage',
  ];
  try {
    ensureColumns(headers, required);
  } catch (e) {
    log(`❌ ${e.message}`, 'red');
    process.exit(1);
  }

  let errors = 0;
  let warnings = 0;

  rows.forEach(r => {
    if ((r.Status || '').toUpperCase() === 'DONE') {
      const hasTests = !!r.Test_Files;
      const justified = !!r.NoTests_Reason;
      if (!hasTests && !justified) {
        errors++;
        log(`❌ Line ${r._line}: DONE task ${r.Task_ID} has no tests and no NoTests_Reason`, 'red');
      }
      // For UI-ish tasks (heuristic: components/ or stories) suggest a11y/visual
      const isUI = /components\//.test(r.Implementation_Files || '') || /stories?\.tsx?/.test(r.Implementation_Files || '');
      if (isUI) {
        if (!(r.A11y_Checked || '').toString().length) {
          warnings++;
          log(`⚠️  Line ${r._line}: UI task ${r.Task_ID} has no A11y_Checked flag`, 'yellow');
        }
        if (!(r.Visual_Coverage || '').toString().length) {
          warnings++;
          log(`⚠️  Line ${r._line}: UI task ${r.Task_ID} has no Visual_Coverage value`, 'yellow');
        }
      }
    }
  });

  if (errors === 0 && warnings === 0) {
    log('✅ Tests validation passed', 'green');
    process.exit(0);
  }
  if (errors > 0) {
    log(`❌ Tests validation failed: ${errors} error(s), ${warnings} warning(s)`, 'red');
    process.exit(1);
  }
  log(`✅ Tests validation passed with warnings: ${warnings}`, 'yellow');
  process.exit(0);
}

main();
