# API Reference

Полная документация по API функциональной системы дизайн-токенов.

## 📋 Содержание

- [Компоненты](#компоненты)
- [Хуки](#хуки)
- [Утилиты](#утилиты)
- [Типы](#типы)
- [Токены](#токены)
- [Валидация](#валидация)

## 🧩 Компоненты

### ThemeProvider

Основной провайдер для системы токенов и контекста.

```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  initialContext?: Partial<ThemeContext>;
  onContextChange?: (context: ThemeContext) => void;
}

function ThemeProvider(props: ThemeProviderProps): JSX.Element
```

**Параметры:**
- `children` - Дочерние компоненты
- `initialContext` - Начальный контекст (опционально)
- `onContextChange` - Колбэк при изменении контекста (опционально)

**Пример использования:**
```tsx
<ThemeProvider 
  initialContext={{ theme: 'dark' }}
  onContextChange={(context) => console.log('Context changed:', context)}
>
  <App />
</ThemeProvider>
```

### TokenInspector

Компонент для отладки и инспекции токенов.

```tsx
interface TokenInspectorProps {
  category?: 'all' | 'colors' | 'spacing' | 'typography';
  searchable?: boolean;
  showResolvedValues?: boolean;
  className?: string;
}

function TokenInspector(props: TokenInspectorProps): JSX.Element
```

**Параметры:**
- `category` - Категория токенов для отображения (по умолчанию: 'all')
- `searchable` - Включить поиск (по умолчанию: true)
- `showResolvedValues` - Показывать разрешенные значения (по умолчанию: true)
- `className` - CSS класс для стилизации

**Пример использования:**
```tsx
<TokenInspector 
  category="colors" 
  searchable={true}
  showResolvedValues={true}
/>
```

### ContextDemo

Демонстрационный компонент для показа контекстно-зависимого разрешения.

```tsx
interface ContextDemoProps {
  showControls?: boolean;
  showPlatformInfo?: boolean;
  className?: string;
}

function ContextDemo(props: ContextDemoProps): JSX.Element
```

**Параметры:**
- `showControls` - Показывать элементы управления (по умолчанию: true)
- `showPlatformInfo` - Показывать информацию о платформе (по умолчанию: true)
- `className` - CSS класс для стилизации

## 🎣 Хуки

### useTheme

Основной хук для работы с темой и контекстом.

```tsx
interface UseThemeReturn {
  context: ThemeContext;
  updateContext: (updates: Partial<ThemeContext>) => void;
  resetContext: () => void;
  isLoading: boolean;
}

function useTheme(): UseThemeReturn
```

**Возвращает:**
- `context` - Текущий контекст темы
- `updateContext` - Функция для обновления контекста
- `resetContext` - Функция для сброса контекста к значениям по умолчанию
- `isLoading` - Индикатор загрузки

**Пример использования:**
```tsx
function MyComponent() {
  const { context, updateContext } = useTheme();
  
  const toggleTheme = () => {
    updateContext({ 
      theme: context.theme === 'light' ? 'dark' : 'light' 
    });
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {context.theme}
    </button>
  );
}
```

### useToken

Хук для разрешения отдельного токена.

```tsx
function useToken<T>(token: DesignToken<T>): T
```

**Параметры:**
- `token` - Токен для разрешения

**Возвращает:**
- Разрешенное значение токена

**Пример использования:**
```tsx
function MyComponent() {
  const primaryColor = useToken(colorTokens.brand.primary);
  
  return (
    <div style={{ backgroundColor: primaryColor.toString() }}>
      Content
    </div>
  );
}
```

## 🛠 Утилиты

### ContextResolver

Основной класс для разрешения токенов в контексте.

```tsx
class ContextResolver {
  constructor(rules?: ResolutionRule[]);
  
  resolveToken<T>(token: DesignToken<T>, context: ThemeContext): T;
  resolveTokens(tokens: DesignToken<any>[], context: ThemeContext): any[];
  addRule(rule: ResolutionRule): void;
  removeRule(ruleId: string): void;
  enableDebug(enabled: boolean): void;
}
```

**Методы:**

#### resolveToken
Разрешает отдельный токен в заданном контексте.

```tsx
resolveToken<T>(token: DesignToken<T>, context: ThemeContext): T
```

#### resolveTokens
Разрешает массив токенов в заданном контексте.

```tsx
resolveTokens(tokens: DesignToken<any>[], context: ThemeContext): any[]
```

#### addRule
Добавляет правило разрешения.

```tsx
addRule(rule: ResolutionRule): void
```

#### removeRule
Удаляет правило разрешения по ID.

```tsx
removeRule(ruleId: string): void
```

#### enableDebug
Включает/выключает режим отладки.

```tsx
enableDebug(enabled: boolean): void
```

**Пример использования:**
```tsx
const resolver = new ContextResolver();
const context = { theme: 'dark', platform: { name: 'ios' } };
const resolvedColor = resolver.resolveToken(colorTokens.brand.primary, context);
```

### PlatformDetector

Утилита для определения платформы.

```tsx
class PlatformDetector {
  static detect(): PlatformInfo;
  static detectUserAgent(userAgent: string): PlatformInfo;
  static isMobile(): boolean;
  static isIOS(): boolean;
  static isAndroid(): boolean;
  static getScreenSize(): 'small' | 'medium' | 'large';
}
```

**Методы:**

#### detect
Определяет текущую платформу.

```tsx
static detect(): PlatformInfo
```

#### detectUserAgent
Определяет платформу по User Agent.

```tsx
static detectUserAgent(userAgent: string): PlatformInfo
```

#### isMobile
Проверяет, является ли устройство мобильным.

```tsx
static isMobile(): boolean
```

**Пример использования:**
```tsx
const platform = PlatformDetector.detect();
console.log('Platform:', platform.name, platform.version);

if (PlatformDetector.isMobile()) {
  // Мобильная логика
}
```

### AccessibilityDetector

Утилита для определения настроек доступности.

```tsx
class AccessibilityDetector {
  static detect(): AccessibilitySettings;
  static prefersReducedMotion(): boolean;
  static prefersHighContrast(): boolean;
  static prefersLargeText(): boolean;
  static getColorScheme(): 'light' | 'dark' | 'auto';
}
```

**Методы:**

#### detect
Определяет все настройки доступности.

```tsx
static detect(): AccessibilitySettings
```

#### prefersReducedMotion
Проверяет предпочтение уменьшенной анимации.

```tsx
static prefersReducedMotion(): boolean
```

#### prefersHighContrast
Проверяет предпочтение высокого контраста.

```tsx
static prefersHighContrast(): boolean
```

**Пример использования:**
```tsx
const a11ySettings = AccessibilityDetector.detect();

if (AccessibilityDetector.prefersReducedMotion()) {
  // Отключить анимации
}
```

## 📝 Типы

### ThemeContext

Основной интерфейс контекста темы.

```tsx
interface ThemeContext {
  theme: 'light' | 'dark';
  platform: PlatformInfo;
  accessibility: AccessibilitySettings;
  userPreferences?: UserPreferences;
}
```

### PlatformInfo

Информация о платформе.

```tsx
interface PlatformInfo {
  name: 'web' | 'ios' | 'android';
  version: string;
  screenSize?: 'small' | 'medium' | 'large';
  touchCapable?: boolean;
}
```

### AccessibilitySettings

Настройки доступности.

```tsx
interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
}
```

### DesignToken

Базовый интерфейс дизайн-токена.

```tsx
interface DesignToken<T = any> {
  id: string;
  category: TokenCategory;
  base: T;
  rules?: TokenRule<T>[];
  metadata?: TokenMetadata;
}
```

### TokenRule

Правило для условного разрешения токена.

```tsx
interface TokenRule<T> {
  condition: TokenCondition;
  value: T;
  priority?: number;
}
```

### TokenCondition

Условие для применения правила токена.

```tsx
interface TokenCondition {
  theme?: 'light' | 'dark';
  platform?: Partial<PlatformInfo>;
  accessibility?: Partial<AccessibilitySettings>;
  custom?: (context: ThemeContext) => boolean;
}
```

### OKLCHColor

OKLCH цветовое значение.

```tsx
interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
  alpha?: number; // Alpha (0-1)
}
```

**Методы:**
```tsx
class OKLCHColor {
  constructor(l: number, c: number, h: number, alpha?: number);
  
  toString(): string;
  toCSS(): string;
  toRGB(): { r: number; g: number; b: number };
  lighten(amount: number): OKLCHColor;
  darken(amount: number): OKLCHColor;
  saturate(amount: number): OKLCHColor;
  desaturate(amount: number): OKLCHColor;
  rotate(degrees: number): OKLCHColor;
  contrast(other: OKLCHColor): number;
}
```

## 🎨 Токены

### Цветовые токены

```tsx
interface ColorTokens {
  brand: {
    primary: DesignToken<OKLCHColor>;
    secondary: DesignToken<OKLCHColor>;
  };
  background: {
    primary: DesignToken<OKLCHColor>;
    secondary: DesignToken<OKLCHColor>;
    tertiary: DesignToken<OKLCHColor>;
  };
  text: {
    primary: DesignToken<OKLCHColor>;
    secondary: DesignToken<OKLCHColor>;
    inverse: DesignToken<OKLCHColor>;
  };
  border: {
    primary: DesignToken<OKLCHColor>;
    secondary: DesignToken<OKLCHColor>;
  };
  semantic: {
    success: DesignToken<OKLCHColor>;
    warning: DesignToken<OKLCHColor>;
    error: DesignToken<OKLCHColor>;
    info: DesignToken<OKLCHColor>;
  };
}

export const colorTokens: ColorTokens;
```

### Токены отступов

```tsx
interface SpacingTokens {
  xs: DesignToken<string>;
  sm: DesignToken<string>;
  md: DesignToken<string>;
  lg: DesignToken<string>;
  xl: DesignToken<string>;
  xxl: DesignToken<string>;
}

export const spacingTokens: SpacingTokens;
```

### Типографические токены

```tsx
interface TypographyTokens {
  heading: {
    large: DesignToken<TypographyValue>;
    medium: DesignToken<TypographyValue>;
    small: DesignToken<TypographyValue>;
  };
  body: {
    large: DesignToken<TypographyValue>;
    medium: DesignToken<TypographyValue>;
    small: DesignToken<TypographyValue>;
  };
}

interface TypographyValue {
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string | number;
  fontFamily?: string;
}

export const typographyTokens: TypographyTokens;
```

## ✅ Валидация

### TokenValidator

Класс для валидации токенов.

```tsx
class TokenValidator {
  constructor(rules: ValidationRule[]);
  
  validateToken(token: DesignToken<any>, context: ThemeContext): Promise<ValidationResult>;
  validateAllTokens(tokenContextPairs: TokenContextPair[]): Promise<ValidationReport>;
  addRule(rule: ValidationRule): void;
  removeRule(ruleId: string): void;
}
```

### ValidationRule

Правило валидации.

```tsx
interface ValidationRule {
  id: string;
  name: string;
  category: TokenCategory;
  validate: (token: DesignToken<any>, context: ThemeContext) => ValidationResult | Promise<ValidationResult>;
  severity: 'error' | 'warning' | 'info';
}
```

### ValidationResult

Результат валидации.

```tsx
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  performance?: {
    executionTime: number;
    memoryUsage: number;
  };
}
```

### ValidationReport

Отчет о валидации.

```tsx
interface ValidationReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  results: ValidationResult[];
  performance: {
    totalTime: number;
    averageTime: number;
    memoryPeak: number;
  };
  timestamp: string;
}
```

### Правила валидации по умолчанию

```tsx
export const DEFAULT_VALIDATION_RULES: ValidationRule[];
```

Включает правила для:
- Контрастности цветов
- Доступности размеров
- Консистентности значений
- Производительности разрешения

**Пример использования:**
```tsx
import { TokenValidator, DEFAULT_VALIDATION_RULES } from 'functional-design-tokens';

const validator = new TokenValidator(DEFAULT_VALIDATION_RULES);

// Валидация отдельного токена
const result = await validator.validateToken(
  colorTokens.brand.primary, 
  { theme: 'light', platform: { name: 'web' } }
);

if (!result.valid) {
  console.error('Validation failed:', result.errors);
}

// Валидация всех токенов
const report = await validator.validateAllTokens([
  { token: colorTokens.brand.primary, context: lightContext },
  { token: colorTokens.brand.primary, context: darkContext },
]);

console.log('Validation report:', report);
```

## 🔧 Утилитные функции

### createToken

Создает новый дизайн-токен.

```tsx
function createToken<T>(config: {
  id?: string;
  category: TokenCategory;
  base: T;
  rules?: TokenRule<T>[];
  metadata?: TokenMetadata;
}): DesignToken<T>
```

**Пример:**
```tsx
const customColor = createToken({
  category: 'color',
  base: new OKLCHColor(0.5, 0.1, 200),
  rules: [
    {
      condition: { theme: 'dark' },
      value: new OKLCHColor(0.3, 0.1, 200)
    }
  ]
});
```

### createColorToken

Создает цветовой токен с OKLCH значениями.

```tsx
function createColorToken(config: {
  id?: string;
  light: OKLCHColor;
  dark: OKLCHColor;
  highContrast?: {
    light: OKLCHColor;
    dark: OKLCHColor;
  };
}): DesignToken<OKLCHColor>
```

### createSpacingToken

Создает токен отступов с адаптацией под платформы.

```tsx
function createSpacingToken(config: {
  id?: string;
  base: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): DesignToken<string>
```

### mergeContexts

Объединяет контексты с приоритетом.

```tsx
function mergeContexts(base: ThemeContext, override: Partial<ThemeContext>): ThemeContext
```

### isTokenEqual

Сравнивает два токена на равенство.

```tsx
function isTokenEqual(token1: DesignToken<any>, token2: DesignToken<any>): boolean
```

## 📊 Мониторинг и отладка

### Performance API

```tsx
interface PerformanceMetrics {
  resolutionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  totalResolutions: number;
}

class PerformanceMonitor {
  static getMetrics(): PerformanceMetrics;
  static reset(): void;
  static startProfiling(): void;
  static stopProfiling(): PerformanceReport;
}
```

### Debug API

```tsx
interface DebugInfo {
  tokenId: string;
  resolvedValue: any;
  appliedRules: string[];
  context: ThemeContext;
  resolutionPath: string[];
}

class DebugLogger {
  static enable(): void;
  static disable(): void;
  static getHistory(): DebugInfo[];
  static clear(): void;
}
```

## 🔗 Экспорты

### Основные экспорты

```tsx
// Компоненты
export { ThemeProvider, TokenInspector, ContextDemo };

// Хуки
export { useTheme, useToken };

// Утилиты
export { 
  ContextResolver, 
  PlatformDetector, 
  AccessibilityDetector,
  TokenValidator 
};

// Токены
export { colorTokens, spacingTokens, typographyTokens };

// Типы
export type {
  ThemeContext,
  DesignToken,
  OKLCHColor,
  ValidationResult,
  ValidationReport
};

// Константы
export { DEFAULT_VALIDATION_RULES };
```

### Тестовые утилиты

```tsx
// Экспортируются из 'functional-design-tokens/testing'
export {
  mockContextResolver,
  createMockContext,
  createMockToken,
  TestThemeProvider
};
```

---

Эта документация покрывает все основные API системы функциональных дизайн-токенов. Для получения дополнительной информации и примеров использования обратитесь к [основной документации](README.md).