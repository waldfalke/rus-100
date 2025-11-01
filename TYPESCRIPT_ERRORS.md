# Каталог TypeScript ошибок в дизайн-системе

## Критические ошибки (блокируют компиляцию)

### 1. Отсутствующие экспорты в theme-contracts
**Файл:** `lib/hooks/useTheme.ts`
- `ComponentSpacingContext` - не экспортируется
- `ComponentBorderRadiusContext` - не экспортируется  
- `SpacingValues` - не экспортируется
- `BorderRadiusValues` - не экспортируется
- `SpacingSize` - не экспортируется

### 2. Проблемы с типами в usePerformance.ts
**Файл:** `lib/hooks/usePerformance.ts`
- `tokenMetrics` не существует в типе `PerformanceReport`
- Множественные `any` типы в параметрах функций
- `summary` не существует в типе `PerformanceReport`
- `slowestTokens` не существует в типе `PerformanceMetrics`

### 3. Ошибки в демо страницах
**Файл:** `pages/demo/tokens.tsx`
- `theme` не существует в типе `ThemeContext` (строка 339)
- `reducedMotion` должно быть `reduceMotion` (строка 437)
- Отсутствует свойство `config` в `ThemeProviderProps` (строка 487)

### 4. Проблемы с Playwright конфигурацией
**Файл:** `playwright.config.ts`
- `mode` не существует в опциях (строки 59, 127)
- `reducedMotion` не существует в опциях Playwright

## Ошибки в тестах

### 1. Accessibility тесты
**Файлы:** `__tests__/accessibility/*.test.tsx`
- Проблемы с типом `ElevationLevel` 
- Неправильные свойства в `accessibility` объектах
- Отсутствующие jest-dom матчеры

### 2. Property-based тесты
- Отсутствующие модули и типы
- Проблемы с импортами

## Архитектурные проблемы

### 1. Неполные типы
- `PerformanceReport` не содержит ожидаемые свойства
- `PerformanceMetrics` не содержит `slowestTokens`
- `ThemeContext` не содержит `theme`

### 2. Несогласованность в именовании
- `reducedMotion` vs `reduceMotion` в разных местах
- Различные подходы к экспорту типов

### 3. Отсутствующие зависимости
- Некоторые модули импортируются, но не экспортируются
- Проблемы с путями импортов

## Рекомендации по исправлению

### Приоритет 1 (критические):
1. Исправить экспорты в `theme-contracts/index.ts`
2. Дополнить типы `PerformanceReport` и `PerformanceMetrics`
3. Исправить `ThemeContext` тип
4. Унифицировать `reduceMotion` во всех файлах

### Приоритет 2 (важные):
1. Исправить Playwright конфигурацию
2. Дополнить типы в usePerformance.ts
3. Исправить демо страницы

### Приоритет 3 (тесты):
1. Исправить accessibility тесты
2. Дополнить property-based тесты
3. Добавить недостающие jest-dom типы

## Влияние на извлечение дизайн-системы

### Блокирующие проблемы:
- Неполные типы в theme-contracts
- Проблемы с usePerformance хуком
- Несогласованность в accessibility API

### Требуют рефакторинга:
- Демо страницы (специфичны для RUS100)
- Playwright конфигурация (тестирование RUS100)
- Некоторые хуки могут быть специфичными для RUS100

### Готовы к извлечению после исправления:
- Базовые токены и контракты
- OKLCH цветовая система
- Accessibility валидатор (после исправления типов)
- Большинство UI компонентов