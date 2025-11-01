# Functional Design Tokens

Современная система функциональных дизайн-токенов с поддержкой OKLCH цветового пространства и контекстно-зависимого разрешения для React приложений.

## 🚀 Основные возможности

- **🎨 OKLCH Color System** - Современное цветовое пространство для точной передачи цветов
- **📱 Context-Aware Resolution** - Автоматическая адаптация токенов под платформу и настройки
- **♿ Accessibility Support** - Встроенная поддержка настроек доступности
- **🔧 TypeScript Integration** - Полная типизация для безопасной разработки
- **✅ Testing & Validation** - Комплексная система тестирования и валидации
- **📸 Visual Regression** - Автоматическое тестирование визуальных изменений

## 📦 Установка

```bash
npm install functional-design-tokens
# или
yarn add functional-design-tokens
# или
pnpm add functional-design-tokens
```

## 🎯 Быстрый старт

### 1. Базовое использование

```tsx
import React from 'react';
import { ThemeProvider } from 'functional-design-tokens';

function App() {
  return (
    <ThemeProvider>
      <div style={{
        backgroundColor: 'var(--colors-background-primary)',
        color: 'var(--colors-text-primary)',
        padding: 'var(--spacing-md)',
      }}>
        <h1 style={{
          fontSize: 'var(--typography-heading-large-fontSize)',
          fontWeight: 'var(--typography-heading-large-fontWeight)',
        }}>
          Hello, Design Tokens!
        </h1>
      </div>
    </ThemeProvider>
  );
}
```

### 2. Контекстно-зависимое разрешение

```tsx
import { useTheme, contextResolver } from 'functional-design-tokens';

function AdaptiveButton() {
  const { context } = useTheme();
  
  // Токены автоматически адаптируются под контекст
  const buttonStyle = {
    backgroundColor: 'var(--colors-brand-primary)',
    padding: 'var(--spacing-md)', // Больше на мобильных устройствах
    borderRadius: 'var(--spacing-xs)', // Адаптируется под платформу
  };

  return <button style={buttonStyle}>Adaptive Button</button>;
}
```

### 3. Программное использование токенов

```tsx
import { colorTokens, spacingTokens, contextResolver } from 'functional-design-tokens';

function CustomComponent() {
  const context = {
    platform: { name: 'ios', version: '17.0' },
    theme: 'dark',
    accessibility: { highContrast: true }
  };

  // Разрешение токенов программно
  const primaryColor = contextResolver.resolveToken(colorTokens.brand.primary, context);
  const spacing = contextResolver.resolveToken(spacingTokens.md, context);

  return (
    <div style={{
      backgroundColor: primaryColor.toString(),
      padding: spacing.toString(),
    }}>
      Programmatic Token Usage
    </div>
  );
}
```

## 🎨 Система токенов

### Цветовые токены (OKLCH)

```tsx
import { colorTokens } from 'functional-design-tokens';

// Семантические цвета
colorTokens.brand.primary      // Основной цвет бренда
colorTokens.brand.secondary    // Вторичный цвет бренда

// Цвета интерфейса
colorTokens.background.primary   // Основной фон
colorTokens.background.secondary // Вторичный фон
colorTokens.text.primary        // Основной текст
colorTokens.text.secondary      // Вторичный текст

// Семантические состояния
colorTokens.semantic.success    // Успех
colorTokens.semantic.warning    // Предупреждение
colorTokens.semantic.error      // Ошибка
colorTokens.semantic.info       // Информация
```

### Отступы и размеры

```tsx
import { spacingTokens } from 'functional-design-tokens';

spacingTokens.xs    // 4px (базовое значение)
spacingTokens.sm    // 8px
spacingTokens.md    // 16px
spacingTokens.lg    // 24px
spacingTokens.xl    // 32px
spacingTokens.xxl   // 48px
```

### Типографика

```tsx
import { typographyTokens } from 'functional-design-tokens';

// Заголовки
typographyTokens.heading.large    // Крупные заголовки
typographyTokens.heading.medium   // Средние заголовки
typographyTokens.heading.small    // Малые заголовки

// Основной текст
typographyTokens.body.large       // Крупный текст
typographyTokens.body.medium      // Средний текст
typographyTokens.body.small       // Мелкий текст
```

## 🔧 Контекстно-зависимое разрешение

### Автоматическое определение контекста

```tsx
import { ThemeProvider, PlatformDetector, AccessibilityDetector } from 'functional-design-tokens';

function App() {
  return (
    <ThemeProvider>
      {/* Контекст определяется автоматически */}
      <YourApp />
    </ThemeProvider>
  );
}
```

### Ручное управление контекстом

```tsx
import { ThemeProvider } from 'functional-design-tokens';

function App() {
  const customContext = {
    platform: { name: 'android', version: '14' },
    theme: 'dark',
    accessibility: {
      reducedMotion: true,
      highContrast: false,
      largeText: true,
    }
  };

  return (
    <ThemeProvider initialContext={customContext}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Подписка на изменения контекста

```tsx
import { useTheme } from 'functional-design-tokens';

function ContextAwareComponent() {
  const { context, updateContext } = useTheme();

  // Реагируем на изменения контекста
  React.useEffect(() => {
    console.log('Context changed:', context);
  }, [context]);

  return (
    <div>
      <p>Platform: {context.platform.name}</p>
      <p>Theme: {context.theme}</p>
      <button onClick={() => updateContext({ theme: 'light' })}>
        Switch to Light Theme
      </button>
    </div>
  );
}
```

## 🧪 Тестирование и валидация

### Валидация токенов

```bash
# Валидация всех токенов
npm run validate:tokens

# Запуск визуальных тестов
npm run test:visual

# Аудит доступности
npm run audit:a11y

# Бенчмарк производительности
npm run benchmark:tokens
```

### Программная валидация

```tsx
import { TokenValidator, DEFAULT_VALIDATION_RULES } from 'functional-design-tokens';

const validator = new TokenValidator(DEFAULT_VALIDATION_RULES);

// Валидация отдельного токена
const result = await validator.validateToken(colorTokens.brand.primary, context);

// Валидация всех токенов
const report = await validator.validateAllTokens([
  { token: colorTokens.brand.primary, context },
  { token: spacingTokens.md, context },
]);

console.log('Validation report:', report);
```

## 📱 Платформенная адаптация

### iOS адаптация

```tsx
// Автоматически применяется на iOS устройствах
const iosContext = {
  platform: { name: 'ios', version: '17.0' },
  // Увеличенные touch targets
  // Системные шрифты
  // iOS-специфичные цвета
};
```

### Android адаптация

```tsx
// Автоматически применяется на Android устройствах
const androidContext = {
  platform: { name: 'android', version: '14' },
  // Material Design принципы
  // Адаптивные размеры
  // Android-специфичные цвета
};
```

### Web адаптация

```tsx
// Базовая веб-платформа
const webContext = {
  platform: { name: 'web', version: '1.0' },
  // Hover состояния
  // Клавиатурная навигация
  // Веб-специфичные особенности
};
```

## ♿ Поддержка доступности

### Автоматическая адаптация

```tsx
// Система автоматически определяет и применяет:
// - prefers-reduced-motion
// - prefers-contrast
// - prefers-color-scheme
// - font-size preferences
```

### Ручная настройка

```tsx
import { useTheme } from 'functional-design-tokens';

function AccessibilityControls() {
  const { context, updateContext } = useTheme();

  return (
    <div>
      <button onClick={() => updateContext({
        accessibility: { ...context.accessibility, highContrast: true }
      })}>
        Enable High Contrast
      </button>
      
      <button onClick={() => updateContext({
        accessibility: { ...context.accessibility, reducedMotion: true }
      })}>
        Reduce Motion
      </button>
    </div>
  );
}
```

## 🎯 Примеры использования

### Адаптивная карточка

```tsx
import { useTheme } from 'functional-design-tokens';

function AdaptiveCard({ children }) {
  const { context } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--colors-background-secondary)',
      borderRadius: 'var(--spacing-sm)',
      padding: 'var(--spacing-md)',
      border: '1px solid var(--colors-border-primary)',
      // Тень адаптируется под платформу
      boxShadow: context.platform.name === 'ios' 
        ? '0 2px 8px rgba(0,0,0,0.1)' 
        : '0 1px 3px rgba(0,0,0,0.2)',
    }}>
      {children}
    </div>
  );
}
```

### Кнопка с состояниями

```tsx
function InteractiveButton({ variant = 'primary', children, ...props }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  
  const getButtonStyles = () => {
    const base = {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      borderRadius: 'var(--spacing-xs)',
      border: 'none',
      fontSize: 'var(--typography-body-medium-fontSize)',
      fontWeight: 'var(--typography-body-medium-fontWeight)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    const variants = {
      primary: {
        backgroundColor: 'var(--colors-brand-primary)',
        color: 'var(--colors-text-inverse)',
      },
      secondary: {
        backgroundColor: 'var(--colors-background-tertiary)',
        color: 'var(--colors-text-primary)',
        border: '1px solid var(--colors-border-primary)',
      },
    };

    return { ...base, ...variants[variant] };
  };

  return (
    <button
      style={getButtonStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 🔧 Конфигурация

### Кастомные токены

```tsx
import { createToken } from 'functional-design-tokens';

// Создание кастомного цветового токена
const customColor = createToken({
  base: { l: 0.5, c: 0.1, h: 200 }, // OKLCH значения
  rules: [
    {
      condition: { theme: 'dark' },
      value: { l: 0.3, c: 0.1, h: 200 }
    }
  ]
});

// Создание кастомного токена отступов
const customSpacing = createToken({
  base: '12px',
  rules: [
    {
      condition: { platform: { name: 'ios' } },
      value: '16px' // Больше на iOS
    }
  ]
});
```

### Кастомные правила разрешения

```tsx
import { ContextResolver } from 'functional-design-tokens';

const customResolver = new ContextResolver([
  // Кастомное правило для больших экранов
  {
    condition: (context) => context.platform.screenSize === 'large',
    adaptation: (token) => ({
      ...token,
      // Увеличиваем размеры на больших экранах
      value: typeof token.value === 'string' && token.value.includes('px')
        ? `${parseInt(token.value) * 1.2}px`
        : token.value
    })
  }
]);
```

## 📊 Мониторинг и отладка

### Инспектор токенов

```tsx
import { TokenInspector } from 'functional-design-tokens';

function DebugPage() {
  return (
    <div>
      <h1>Token Inspector</h1>
      <TokenInspector />
    </div>
  );
}
```

### Логирование разрешения токенов

```tsx
import { contextResolver } from 'functional-design-tokens';

// Включение отладочного режима
contextResolver.enableDebug(true);

// Теперь все разрешения токенов будут логироваться
const resolvedColor = contextResolver.resolveToken(colorTokens.brand.primary, context);
// Console: "Resolving token brand.primary for context {...}"
```

## 🚀 Производительность

### Оптимизация

- **Lazy Resolution** - Токены разрешаются только при необходимости
- **Memoization** - Результаты кешируются для повторного использования
- **Efficient Updates** - Минимальные перерендеры при изменении контекста
- **Tree Shaking** - Неиспользуемые токены исключаются из бандла

### Мониторинг производительности

```bash
# Бенчмарк производительности
npm run benchmark:tokens

# Анализ размера бандла
npm run analyze:bundle
```

## 🤝 Интеграция с инструментами

### Storybook

```tsx
// .storybook/preview.js
import { ThemeProvider } from 'functional-design-tokens';

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
```

### Jest тестирование

```tsx
// setupTests.js
import { mockContextResolver } from 'functional-design-tokens/testing';

beforeEach(() => {
  mockContextResolver.reset();
});
```

### CSS-in-JS библиотеки

```tsx
// Styled Components
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: var(--colors-brand-primary);
  padding: var(--spacing-md);
  border-radius: var(--spacing-xs);
`;

// Emotion
import { css } from '@emotion/react';

const buttonStyles = css`
  background-color: var(--colors-brand-primary);
  padding: var(--spacing-md);
  border-radius: var(--spacing-xs);
`;
```

## 📚 API Reference

### Компоненты

- `ThemeProvider` - Провайдер темы и контекста
- `TokenInspector` - Инспектор для отладки токенов
- `ContextDemo` - Демонстрация контекстно-зависимого разрешения

### Хуки

- `useTheme()` - Доступ к текущему контексту и функциям обновления

### Утилиты

- `contextResolver` - Основной резолвер токенов
- `PlatformDetector` - Определение платформы
- `AccessibilityDetector` - Определение настроек доступности
- `TokenValidator` - Валидация токенов

### Типы

- `ThemeContext` - Интерфейс контекста темы
- `DesignToken` - Базовый интерфейс токена
- `OKLCHColor` - OKLCH цветовое значение
- `ValidationResult` - Результат валидации

## 🔗 Полезные ссылки

- [Демо-приложение](http://localhost:3000/demo)
- [Context Demo](http://localhost:3000/demo/context)
- [Token Inspector](http://localhost:3000/demo/tokens)
- [GitHub Repository](https://github.com/your-repo/functional-design-tokens)
- [OKLCH Color Space](https://oklch.com/)

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл для деталей.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](CONTRIBUTING.md) для получения информации о том, как внести свой вклад.

## 📞 Поддержка

- 🐛 [Сообщить о баге](https://github.com/your-repo/functional-design-tokens/issues)
- 💡 [Предложить улучшение](https://github.com/your-repo/functional-design-tokens/discussions)
- 📧 [Связаться с командой](mailto:support@functional-design-tokens.com)

---

Создано с ❤️ для современных интерфейсов