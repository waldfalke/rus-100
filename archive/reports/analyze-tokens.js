#!/usr/bin/env node
/**
 * Analyze @token-status annotations in components
 */

const fs = require('fs');
const path = require('path');

function analyzeComponentTokens() {
  const componentsDir = 'd:\\Dev\\rus100\\components\\ui';
  const results = {
    completed: [],
    pending: [],
    partial: [],
    unknown: []
  };

  try {
    const files = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.join(componentsDir, file));

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative('d:\\Dev\\rus100', file);

      // Look for token-status annotation
      const tokenStatusMatch = content.match(/\/\/ @token-status:\s*(.+)/);
      if (tokenStatusMatch) {
        const status = tokenStatusMatch[1].trim();

        if (status.includes('COMPLETED')) {
          results.completed.push({ file: relativePath, status });
        } else if (status.includes('PENDING') || status.includes('PARTIAL')) {
          results.pending.push({ file: relativePath, status });
        } else if (status.includes('PARTIAL')) {
          results.partial.push({ file: relativePath, status });
        } else {
          results.unknown.push({ file: relativePath, status });
        }
      } else {
        // No token-status annotation found
        results.pending.push({ file: relativePath, status: 'NOT_ANNOTATED' });
      }
    });

    return results;
  } catch (error) {
    console.error('Error analyzing components:', error);
    return null;
  }
}

function printResults(results) {
  console.log('\n🔍 COMPONENT TOKEN AUDIT REPORT\n');
  console.log('=' .repeat(50));

  Object.entries(results).forEach(([category, items]) => {
    if (items.length > 0) {
      console.log(`\n📊 ${category.toUpperCase()} (${items.length})`);
      console.log('-'.repeat(30));

      items.forEach(item => {
        console.log(`• ${item.file}`);
        console.log(`  Status: ${item.status}`);
      });
    }
  });

  const total = Object.values(results).flat().length;
  console.log(`\n📈 SUMMARY:`);
  console.log(`Total components analyzed: ${total}`);
  console.log(`✅ Completed: ${results.completed.length}`);
  console.log(`⏳ Pending: ${results.pending.length}`);
  console.log(`🔄 Partial: ${results.partial.length}`);
  console.log(`❓ Unknown: ${results.unknown.length}`);
}

const results = analyzeComponentTokens();
if (results) {
  printResults(results);
}
