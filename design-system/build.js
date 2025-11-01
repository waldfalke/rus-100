const StyleDictionary = require('style-dictionary');
const { getStyleDictionaryConfig } = require('./style-dictionary.config.js');

// Аргументы командной строки
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch');

// Build for light theme
console.log('Building light theme...');
const lightSD = StyleDictionary.extend(getStyleDictionaryConfig('light'));
lightSD.buildAllPlatforms();

// Build for dark theme
console.log('Building dark theme...');
const darkSD = StyleDictionary.extend(getStyleDictionaryConfig('dark'));
darkSD.buildAllPlatforms();

// Build shared types
console.log('Building shared TypeScript declarations...');
const sharedSD = StyleDictionary.extend({
  source: ['tokens/base/**/*.json'],
  platforms: {
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.d.ts',
        format: 'typescript/es6-declarations'
      }]
    }
  }
});
sharedSD.buildAllPlatforms();

console.log('✅ Build complete! All tokens from design-system consolidated.');

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