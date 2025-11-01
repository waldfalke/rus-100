#!/usr/bin/env node
/**
 * Validate master-backlog.md consistency
 * Usage: node scripts/validate-backlog.js [path-to-backlog.md]
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
  magenta: '\x1b[35m',
};

const VALID_STATUSES = ['IDEA', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'DEFERRED', 'BACKLOG'];
const VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const TASK_ID_PATTERN = /^[A-Z]+-\d{3}$/;
const EPIC_ID_PATTERN = /^EPIC-[A-Z]+$/;

let errors = [];
let warnings = [];
let taskIds = new Set();
let duplicates = new Set();

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addError(line, message) {
  errors.push({ line, message });
}

function addWarning(line, message) {
  warnings.push({ line, message });
}

function validateTaskId(taskId, lineNum) {
  if (!taskId) {
    addError(lineNum, 'Missing task ID');
    return false;
  }

  // Check for EPIC
  if (taskId.startsWith('**EPIC-')) {
    const epicId = taskId.replace(/\*\*/g, '');
    if (!EPIC_ID_PATTERN.test(epicId)) {
      addError(lineNum, `Invalid EPIC ID format: ${epicId} (expected EPIC-[NAME])`);
      return false;
    }
    return true;
  }

  // Check for regular task
  if (!TASK_ID_PATTERN.test(taskId)) {
    addError(lineNum, `Invalid task ID format: ${taskId} (expected [PREFIX]-[NNN])`);
    return false;
  }

  // Check for duplicates
  if (taskIds.has(taskId)) {
    duplicates.add(taskId);
    addError(lineNum, `Duplicate task ID: ${taskId}`);
    return false;
  }

  taskIds.add(taskId);
  return true;
}

function validateStatus(status, lineNum) {
  if (!status) {
    addError(lineNum, 'Missing status');
    return false;
  }

  const cleanStatus = status.replace(/\*\*/g, '').trim();
  
  if (!VALID_STATUSES.includes(cleanStatus)) {
    addError(lineNum, `Invalid status: ${status} (expected one of: ${VALID_STATUSES.join(', ')})`);
    return false;
  }

  return true;
}

function validatePriority(priority, lineNum) {
  if (!priority) {
    addWarning(lineNum, 'Missing priority');
    return false;
  }

  if (priority.startsWith('**EPIC')) {
    return true; // EPICs don't need priority
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    addError(lineNum, `Invalid priority: ${priority} (expected one of: ${VALID_PRIORITIES.join(', ')})`);
    return false;
  }

  return true;
}

function parseTableRow(line) {
  const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
  return cells;
}

function validateBacklog(filePath) {
  log(`\n🔍 Validating backlog: ${filePath}`, 'blue');

  if (!fs.existsSync(filePath)) {
    log(`❌ File not found: ${filePath}`, 'red');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let inTaskTable = false;
  let tableHeaders = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Detect table header for Master Task List
    if (line.includes('| ID |') && line.includes('| Priority |') && line.includes('| Status |')) {
      inTaskTable = true;
      tableHeaders = parseTableRow(line);
      return;
    }

    // Skip separator line
    if (line.match(/^\|[-:\s|]+\|$/)) {
      return;
    }

    // Parse task rows
    if (inTaskTable && line.startsWith('|')) {
      const cells = parseTableRow(line);
      
      if (cells.length < 6) {
        addWarning(lineNum, `Incomplete row: expected at least 6 columns, got ${cells.length}`);
        return;
      }

      const [taskId, priority, title, status, primary, affected, dependencies] = cells;

      // Validate task ID
      validateTaskId(taskId, lineNum);

      // Validate priority
      if (!taskId.startsWith('**EPIC-')) {
        validatePriority(priority, lineNum);
      }

      // Validate status
      validateStatus(status, lineNum);

      // Check for missing title
      if (!title || title.trim() === '') {
        addError(lineNum, 'Missing task title');
      }

      // Check for missing module
      if (!taskId.startsWith('**') && (!primary || primary.trim() === '')) {
        addWarning(lineNum, `Task ${taskId} has no primary module assigned`);
      }
    }

    // Exit task table on empty line or new section
    if (inTaskTable && (line.trim() === '' || line.startsWith('#'))) {
      inTaskTable = false;
    }
  });

  // Report results
  log('\n📊 Validation Results:', 'blue');
  log(`   Total tasks found: ${taskIds.size}`, 'blue');

  if (duplicates.size > 0) {
    log(`   Duplicate IDs: ${duplicates.size}`, 'yellow');
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('\n✅ Backlog is valid!', 'green');
    process.exit(0);
  }

  // Print errors
  if (errors.length > 0) {
    log(`\n❌ Errors (${errors.length}):`, 'red');
    errors.forEach(({ line, message }) => {
      log(`   Line ${line}: ${message}`, 'red');
    });
  }

  // Print warnings
  if (warnings.length > 0) {
    log(`\n⚠️  Warnings (${warnings.length}):`, 'yellow');
    warnings.forEach(({ line, message }) => {
      log(`   Line ${line}: ${message}`, 'yellow');
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
const backlogPath = process.argv[2] || 'master-backlog.md';
validateBacklog(backlogPath);
