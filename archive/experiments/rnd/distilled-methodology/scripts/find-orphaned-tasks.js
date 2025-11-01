#!/usr/bin/env node
/**
 * Find orphaned tasks (in backlog but no work done, or files without task reference)
 * Usage: node scripts/find-orphaned-tasks.js
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractTaskIds(content) {
  const taskIdPattern = /\b([A-Z]+-\d{3})\b/g;
  const matches = content.matchAll(taskIdPattern);
  return [...new Set([...matches].map(m => m[1]))];
}

function getTasksFromBacklog(backlogPath) {
  if (!fs.existsSync(backlogPath)) {
    return new Set();
  }

  const content = fs.readFileSync(backlogPath, 'utf-8');
  const taskIds = extractTaskIds(content);
  
  const tasks = new Map();
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('|') && !line.includes('| ID |')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        const taskId = cells[0].replace(/\*\*/g, '');
        const status = cells[3].replace(/\*\*/g, '');
        
        if (/^[A-Z]+-\d{3}$/.test(taskId)) {
          tasks.set(taskId, { status, hasFile: false, hasLog: false, hasTraceability: false });
        }
      }
    }
  });

  return tasks;
}

function getTaskFilesInDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return new Set();
  }

  const files = fs.readdirSync(dirPath);
  const taskFiles = files
    .filter(f => f.match(/^[A-Z]+-\d{3}\.md$/))
    .map(f => f.replace('.md', ''));
  
  return new Set(taskFiles);
}

function getTasksFromLogs(logsPath) {
  if (!fs.existsSync(logsPath)) {
    return new Set();
  }

  const taskIds = new Set();
  const logFiles = fs.readdirSync(logsPath).filter(f => f.endsWith('.md'));

  logFiles.forEach(file => {
    const content = fs.readFileSync(path.join(logsPath, file), 'utf-8');
    const ids = extractTaskIds(content);
    ids.forEach(id => taskIds.add(id));
  });

  return taskIds;
}

function getTasksFromTraceability(matrixPath) {
  if (!fs.existsSync(matrixPath)) {
    return new Set();
  }

  const content = fs.readFileSync(matrixPath, 'utf-8');
  const lines = content.split('\n').slice(1); // Skip header
  
  const taskIds = lines
    .map(line => line.split(',')[0]?.trim())
    .filter(id => id && /^[A-Z]+-\d{3}$/.test(id));

  return new Set(taskIds);
}

function findOrphanedTasks() {
  log('\n🔍 Searching for orphaned tasks...', 'blue');

  const backlogPath = 'master-backlog.md';
  const tasksDir = 'tasks';
  const logsDir = 'logs';
  const matrixPath = 'traceability-matrix.csv';

  // Get all task IDs from different sources
  const backlogTasks = getTasksFromBacklog(backlogPath);
  const taskFiles = getTaskFilesInDirectory(tasksDir);
  const loggedTasks = getTasksFromLogs(logsDir);
  const tracedTasks = getTasksFromTraceability(matrixPath);

  log(`\n📊 Found:`, 'blue');
  log(`   Tasks in backlog: ${backlogTasks.size}`, 'blue');
  log(`   Task files: ${taskFiles.size}`, 'blue');
  log(`   Tasks in logs: ${loggedTasks.size}`, 'blue');
  log(`   Tasks in traceability: ${tracedTasks.size}`, 'blue');

  // Mark which tasks have files/logs/traceability
  backlogTasks.forEach((data, taskId) => {
    data.hasFile = taskFiles.has(taskId);
    data.hasLog = loggedTasks.has(taskId);
    data.hasTraceability = tracedTasks.has(taskId);
  });

  // Find orphans
  const orphanedInProgress = [];
  const orphanedDone = [];
  const missingFiles = [];
  const extraFiles = [];

  backlogTasks.forEach((data, taskId) => {
    // Tasks IN_PROGRESS but no logs
    if (data.status === 'IN_PROGRESS' && !data.hasLog) {
      orphanedInProgress.push(taskId);
    }

    // Tasks DONE but not in traceability
    if (data.status === 'DONE' && !data.hasTraceability) {
      orphanedDone.push(taskId);
    }

    // Tasks IN_PROGRESS or DONE but no task file
    if ((data.status === 'IN_PROGRESS' || data.status === 'DONE') && !data.hasFile) {
      missingFiles.push(taskId);
    }
  });

  // Task files that don't exist in backlog
  taskFiles.forEach(taskId => {
    if (!backlogTasks.has(taskId)) {
      extraFiles.push(taskId);
    }
  });

  // Report
  let hasIssues = false;

  if (orphanedInProgress.length > 0) {
    hasIssues = true;
    log(`\n⚠️  Tasks IN_PROGRESS with no logs (${orphanedInProgress.length}):`, 'yellow');
    orphanedInProgress.forEach(id => log(`   - ${id}`, 'yellow'));
  }

  if (orphanedDone.length > 0) {
    hasIssues = true;
    log(`\n❌ Tasks DONE but not in traceability matrix (${orphanedDone.length}):`, 'red');
    orphanedDone.forEach(id => log(`   - ${id}`, 'red'));
  }

  if (missingFiles.length > 0) {
    hasIssues = true;
    log(`\n⚠️  Tasks without task files (${missingFiles.length}):`, 'yellow');
    missingFiles.forEach(id => log(`   - ${id}`, 'yellow'));
  }

  if (extraFiles.length > 0) {
    hasIssues = true;
    log(`\n⚠️  Task files not in backlog (${extraFiles.length}):`, 'yellow');
    extraFiles.forEach(id => log(`   - ${id}`, 'yellow'));
  }

  if (!hasIssues) {
    log('\n✅ No orphaned tasks found!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Found orphaned tasks - please review', 'yellow');
    process.exit(0); // Warning, not error
  }
}

// Main
findOrphanedTasks();
