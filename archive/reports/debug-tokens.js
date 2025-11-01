#!/usr/bin/env node
/**
 * Diagnostic script for token issues
 */

const fs = require('fs');
const path = require('path');

function checkTokenReferences() {
  console.log('🔍 Диагностика токенов...\n');

  // Проверим ссылки на primary токены
  const lightTheme = JSON.parse(fs.readFileSync('design-system/tokens/themes/light.json', 'utf8'));
  const darkTheme = JSON.parse(fs.readFileSync('design-system/tokens/themes/dark.json', 'utf8'));

  console.log('Проверка ссылок на primary токены:');
  console.log('Light theme border.focus:', lightTheme.theme.color.border.focus);
  console.log('Dark theme border.focus:', darkTheme.theme.color.border.focus);

  // Проверим, есть ли проблемы с другими ссылками
  console.log('\nПроверка всех ссылок в темах...');

  function checkReferences(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object' && value !== null && value.value) {
        if (value.value.startsWith('{') && value.value.includes('primary')) {
          console.log(`Найдена ссылка: ${currentPath} = ${value.value}`);
        }
      } else if (typeof value === 'object' && value !== null) {
        checkReferences(value, currentPath);
      }
    }
  }

  console.log('\nСсылки в light theme:');
  checkReferences(lightTheme.theme);

  console.log('\nСсылки в dark theme:');
  checkReferences(darkTheme.theme);

  console.log('\n✅ Диагностика завершена');
}

checkTokenReferences();
