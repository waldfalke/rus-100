const StyleDictionary = require('style-dictionary');
const { getStyleDictionaryConfig } = require('./style-dictionary.config.js');

// Аргументы командной строки
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch');

console.log('Build started...');

// Создание экземпляров для каждой темы
['light', 'dark'].forEach(theme => {
  console.log(`\nProcessing: [${theme}]`);
  
  const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
  
  try {
    sd.buildAllPlatforms();
    console.log(`\nCompleted: [${theme}]`);
  } catch (error) {
    console.error(`\nError processing theme [${theme}]:`, error);
  }
});

// Создание единого файла с типами для TypeScript
console.log('\nGenerating shared TypeScript declarations...');

try {
  StyleDictionary.extend({
    source: [
      'design-system/tokens/base/**/*.json'
    ],
    platforms: {
      typescript: {
        transformGroup: 'js',
        buildPath: 'src/tokens/',
        files: [{
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations'
        }]
      }
    }
  }).buildAllPlatforms();
  console.log('Shared TypeScript declarations generated.');
} catch (error) {
  console.error('\nError generating shared TypeScript declarations:', error);
}

console.log('\nBuild completed!');

// Запуск в режиме watch если указан флаг --watch
if (isWatchMode) {
  console.log('\nWatching for changes...');
  try {
    // Функция для перезапуска сборки при изменениях
    const chokidar = require('chokidar');
    let isBuilding = false;
    
    const watcher = chokidar.watch('design-system/tokens/**/*.json');
    watcher.on('change', path => {
      if (isBuilding) return;
      isBuilding = true;
      console.log(`\nChange detected: ${path}`);
      console.log('Rebuilding...');
      
      // Выполняем ту же логику сборки
      ['light', 'dark'].forEach(theme => {
        try {
          const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
          sd.buildAllPlatforms();
        } catch (error) {
          console.error(`\nError processing theme [${theme}] during watch:`, error);
        }
      });
      
      console.log('\nRebuild completed!');
      isBuilding = false;
    });
  } catch (error) {
    console.log('\nWatch mode requires chokidar. Please install it:');
    console.log('npm install --save-dev chokidar');
  }
} 