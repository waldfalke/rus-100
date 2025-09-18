# TD-IMP-001: Настройка инфраструктуры Style Dictionary

## 0. Мета-данные

**Версия**: 1.0  
**Дата**: 2023-05-31  
**Статус**: Draft  
**Приоритет**: P0  
**Родительский контракт**: [TD-MS-001: Системный мастер-контракт внедрения дизайн-токенов](./TD-MS-001-Design-Token-System.md)  
**Зависимости**: Нет  
**Исполнители**: Frontend-разработчик

---

## 1. Цель и назначение

Создать базовую инфраструктуру для системы дизайн-токенов на основе Style Dictionary, включая установку зависимостей, создание конфигурационных файлов и настройку скриптов сборки. Этот контракт является первым шагом в реализации системы дизайн-токенов и закладывает фундамент для последующих этапов.

## 2. Технические требования

### 2.1. Установка зависимостей

Добавить следующие зависимости в package.json:

```json
{
  "devDependencies": {
    "style-dictionary": "^3.7.2",
    "@types/style-dictionary": "^3.0.2"
  },
  "scripts": {
    "build:tokens": "node design-system/build.js",
    "build:tokens:watch": "node design-system/build.js --watch"
  }
}
```

### 2.2. Структура директорий

Создать следующую структуру директорий:

```
/design-system
  /tokens
    /base
    /themes
    /components
  /transformers
  /formatters
  build.js
  style-dictionary.config.js
  index.ts
/src
  /styles
  /tokens
```

### 2.3. Конфигурационные файлы

#### 2.3.1. Основной конфигурационный файл (style-dictionary.config.js)

```js
const StyleDictionary = require('style-dictionary');
const path = require('path');

// Регистрация кастомных трансформеров
require('./transformers/custom-transforms');

// Функция для создания конфигурации для темы
function getStyleDictionaryConfig(theme) {
  return {
    source: [
      'tokens/base/**/*.json',
      `tokens/themes/${theme}.json`,
      'tokens/components/**/*.json'
    ],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: '../src/styles/',
        files: [{
          destination: `tokens.${theme}.css`,
          format: 'css/variables',
          options: {
            selector: theme === 'light' ? ':root' : `.${theme}`
          }
        }]
      },
      js: {
        transformGroup: 'js',
        buildPath: '../src/tokens/',
        files: [{
          destination: `${theme}.js`,
          format: 'javascript/es6'
        }]
      },
      ts: {
        transformGroup: 'js',
        buildPath: '../src/tokens/',
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
```

#### 2.3.2. Скрипт сборки (build.js)

```js
const StyleDictionary = require('style-dictionary');
const { getStyleDictionaryConfig } = require('./style-dictionary.config');

// Аргументы командной строки
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch');

console.log('Build started...');

// Создание экземпляров для каждой темы
['light', 'dark'].forEach(theme => {
  console.log(`\nProcessing: [${theme}]`);
  
  const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
  
  sd.buildAllPlatforms();
  
  console.log(`\nCompleted: [${theme}]`);
});

// Создание единого файла с типами для TypeScript
console.log('\nGenerating shared TypeScript declarations...');
StyleDictionary.extend({
  source: [
    'tokens/base/**/*.json',
    'tokens/components/**/*.json'
  ],
  platforms: {
    typescript: {
      transformGroup: 'js',
      buildPath: '../src/tokens/',
      files: [{
        destination: 'tokens.d.ts',
        format: 'typescript/module-declarations'
      }]
    }
  }
}).buildAllPlatforms();

console.log('\nBuild completed!');

// Запуск в режиме watch если указан флаг --watch
if (isWatchMode) {
  console.log('\nWatching for changes...');
  // Функция для перезапуска сборки при изменениях
  const chokidar = require('chokidar');
  let isBuilding = false;
  
  const watcher = chokidar.watch('tokens/**/*.json');
  watcher.on('change', path => {
    if (isBuilding) return;
    isBuilding = true;
    console.log(`\nChange detected: ${path}`);
    console.log('Rebuilding...');
    
    // Выполняем ту же логику сборки
    ['light', 'dark'].forEach(theme => {
      const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
      sd.buildAllPlatforms();
    });
    
    console.log('\nRebuild completed!');
    isBuilding = false;
  });
}
```

#### 2.3.3. Базовый трансформер (transformers/custom-transforms.js)

```js
const StyleDictionary = require('style-dictionary');

// Регистрация трансформера для обработки ссылок в токенах
StyleDictionary.registerTransform({
  name: 'attribute/cti',
  type: 'attribute',
  transformer: function(token) {
    return {
      category: token.attributes.category,
      type: token.attributes.type,
      item: token.attributes.item
    };
  }
});

// Трансформер для разрешения ссылок вида {color.primary.500.value}
StyleDictionary.registerTransform({
  name: 'value/resolveReferences',
  type: 'value',
  matcher: token => typeof token.value === 'string' && token.value.includes('{'),
  transformer: (token, dictionary) => {
    let value = token.value;
    
    // Регулярное выражение для поиска ссылок
    const referenceRegex = /\{([^}]+)\}/g;
    
    // Заменяем все ссылки на фактические значения
    value = value.replace(referenceRegex, (match, path) => {
      const refToken = dictionary.tokens[path.split('.')[0]];
      if (!refToken) {
        console.warn(`Reference not found: ${path} in token ${token.name}`);
        return match;
      }
      
      // Получаем значение по пути
      let tokenValue = refToken;
      path.split('.').slice(1).forEach(segment => {
        if (tokenValue[segment]) {
          tokenValue = tokenValue[segment];
        } else {
          console.warn(`Reference segment not found: ${segment} in path ${path}`);
          return match;
        }
      });
      
      return tokenValue.value || match;
    });
    
    return value;
  }
});

// Регистрация группы трансформеров для CSS
StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: [
    'attribute/cti',
    'value/resolveReferences',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css'
  ]
});

// Регистрация группы трансформеров для JS
StyleDictionary.registerTransformGroup({
  name: 'js',
  transforms: [
    'attribute/cti',
    'value/resolveReferences',
    'name/cti/camel',
    'size/rem',
    'color/hex'
  ]
});
```

#### 2.3.4. Индексный файл (index.ts)

```ts
// Экспорт типов токенов
export interface DesignTokens {
  color: {
    [key: string]: {
      [key: string]: { value: string };
    };
  };
  spacing: {
    [key: string]: { value: string };
  };
  typography: {
    [key: string]: { value: string };
  };
  shadow: {
    [key: string]: { value: string };
  };
  radius: {
    [key: string]: { value: string };
  };
  // Другие категории...
}

// Экспорт для доступа к токенам из кода
export { default as lightTokens } from '../src/tokens/light';
export { default as darkTokens } from '../src/tokens/dark';

// Утилиты для работы с токенами
export function getTokenVariable(path: string): string {
  return `var(--${path.replace(/\./g, '-')})`;
}
```

### 2.4. Пример токенов для тестирования

#### 2.4.1. Базовые цвета (tokens/base/colors.json)

```json
{
  "color": {
    "primary": {
      "500": { "value": "#0ea5e9", "type": "color" }
    },
    "neutral": {
      "50": { "value": "#f9fafb", "type": "color" },
      "900": { "value": "#111827", "type": "color" }
    }
  }
}
```

#### 2.4.2. Светлая тема (tokens/themes/light.json)

```json
{
  "theme": {
    "background": {
      "default": { "value": "{color.neutral.50.value}", "type": "color" }
    },
    "text": {
      "primary": { "value": "{color.neutral.900.value}", "type": "color" }
    }
  }
}
```

#### 2.4.3. Темная тема (tokens/themes/dark.json)

```json
{
  "theme": {
    "background": {
      "default": { "value": "{color.neutral.900.value}", "type": "color" }
    },
    "text": {
      "primary": { "value": "{color.neutral.50.value}", "type": "color" }
    }
  }
}
```

## 3. Валидация и тестирование

### 3.1. Установка

- Успешная установка всех зависимостей без ошибок и конфликтов
- Создание корректной структуры директорий

### 3.2. Скрипты сборки

- Команда `npm run build:tokens` успешно выполняется без ошибок
- В директориях `/src/styles` и `/src/tokens` генерируются соответствующие файлы
- Файлы содержат корректные CSS-переменные и TypeScript-типы

### 3.3. Проверка содержимого сгенерированных файлов

CSS-файл должен содержать переменные вида:
```css
:root {
  --theme-background-default: #f9fafb;
  --theme-text-primary: #111827;
}
```

TypeScript-файл должен содержать типы и интерфейсы:
```ts
export interface DesignTokens { /* ... */ }
```

## 4. Доставка результатов

1. Все необходимые файлы должны быть созданы в указанных директориях
2. Скрипт `build:tokens` должен быть добавлен в `package.json`
3. Базовые токены для тестирования должны быть созданы
4. Демонстрация успешной сборки и генерации файлов

## 5. Критерии приемки

- ✅ Установлены все необходимые зависимости
- ✅ Создана полная структура директорий
- ✅ Написан и работает конфигурационный файл Style Dictionary
- ✅ Скрипт сборки успешно генерирует CSS и TypeScript-файлы
- ✅ Созданы базовые примеры токенов
- ✅ Все тесты пройдены успешно

## 6. Дополнительные рекомендации

- При работе в режиме watch рекомендуется использовать debounce для предотвращения множественных сборок
- Для больших проектов рассмотреть возможность кэширования результатов сборки
- В будущем можно добавить валидацию JSON-файлов токенов через JSON-схему 