const StyleDictionary = require('style-dictionary');
const path = require('path');

// Регистрация кастомных трансформеров
// require('./transformers/custom-transforms');

// Функция для создания конфигурации для темы
function getStyleDictionaryConfig(theme) {
  return {
    source: [
      'design-system/tokens/base/**/*.json',
      `design-system/tokens/themes/${theme}.json`,
    ],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'styles/',
        files: [{
          destination: `tokens.${theme}.css`,
          format: 'css/variables',
          options: {
            selector: theme === 'light' ? ':root' : '.dark',
            outputReferences: true
          }
        }]
      },
      js: {
        transformGroup: 'js',
        buildPath: 'src/tokens/',
        files: [{
          destination: `${theme}.js`,
          format: 'javascript/es6'
        }]
      },
      ts: {
        transformGroup: 'js',
        buildPath: 'src/tokens/',
        files: [{
          destination: `${theme}.d.ts`,
          format: 'typescript/es6-declarations'
        }]
      }
    }
  };
}

module.exports = {
  getStyleDictionaryConfig
}; 