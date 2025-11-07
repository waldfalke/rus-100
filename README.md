# Functional Design Tokens

Современная система функциональных дизайн-токенов с поддержкой OKLCH цветового пространства и контекстно-зависимого разрешения для React приложений.

## 🚀 Основные возможности

- 🎨 **OKLCH Color System** - Современное цветовое пространство для точной передачи цветов
- 📱 **Context-Aware Resolution** - Автоматическая адаптация токенов под платформу и настройки
- ♿ **Accessibility Support** - Встроенная поддержка настроек доступности
- 🔧 **TypeScript Integration** - Полная типизация для безопасной разработки
- ✅ **Testing & Validation** - Комплексная система тестирования и валидации
- 📸 **Visual Regression** - Автоматическое тестирование визуальных изменений
- 🔄 **CI/CD Integration** - Готовые GitHub Actions для автоматизации

## 📦 Установка

```bash
npm install functional-design-tokens
# или
yarn add functional-design-tokens
# или
pnpm add functional-design-tokens
```

## 🎯 Быстрый старт

### Базовое использование

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

### Контекстно-зависимое разрешение

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

### Программное использование

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
- Семантические цвета (brand, background, text, border)
- Состояния (success, warning, error, info)
- Автоматическая адаптация для светлой/темной темы
- Поддержка высокого контраста

### Отступы и размеры
- Адаптивная система отступов (xs, sm, md, lg, xl, xxl)
- Платформенная адаптация (больше touch targets на мобильных)
- Консистентная типографическая сетка

### Типографика
- Семантическая иерархия (heading, body)
- Адаптивные размеры шрифтов
- Поддержка системных шрифтов
- Настройки доступности (крупный текст)

## 🔧 Возможности

### Автоматическое определение контекста
- Определение платформы (iOS, Android, Web)
- Настройки доступности (reduced motion, high contrast)
- Пользовательские предпочтения (цветовая схема)

### Валидация и тестирование
- Автоматическая валидация контрастности
- Проверка консистентности токенов
- Visual regression тестирование
- Performance benchmarking

### CI/CD интеграция
- GitHub Actions workflow
- Автоматическая валидация в PR
- Visual regression reports
- Performance monitoring

## 🚀 Скрипты

```bash
# Разработка
npm run dev              # Запуск dev сервера
npm run build           # Сборка библиотеки
npm run build:demo      # Сборка демо-приложения

# Тестирование
npm run test            # Запуск всех тестов
npm run test:visual     # Visual regression тесты
npm run test:visual:update  # Обновление скриншотов

# Валидация
npm run validate:tokens # Валидация токенов
npm run audit:a11y      # Аудит доступности
npm run benchmark:tokens # Бенчмарк производительности
```

## 📚 Документация

- 📖 [Полная документация](./docs/README.md) - Подробное руководство по использованию
- 🔧 [API Reference](./docs/API.md) - Полная документация по API
- 🎮 [Демо-приложение](http://localhost:3000/demo) - Интерактивные примеры
- 🔍 [Token Inspector](http://localhost:3000/demo/tokens) - Инспектор токенов
- 🌐 [Context Demo](http://localhost:3000/demo/context) - Демо контекстного разрешения

## Изменения маршрутов
- Удалены страницы `app/tasks`, `app/results`, `app/group-tables-demo` из Next.js маршрутов.
- Навигация и домашняя страница обновлены, чтобы исключить ссылки на удалённые страницы.

## 🏗 Архитектура

```
lib/
├── tokens/          # Определения токенов
├── context/         # Система контекста
├── components/      # React компоненты
├── utils/          # Утилиты
└── testing/        # Система тестирования

tests/
├── visual/         # Visual regression тесты
├── setup/          # Настройка тестов
└── __screenshots__ # Скриншоты для сравнения

scripts/
├── validate-tokens.ts      # Валидация токенов
└── check-performance-regression.js # Проверка производительности
```

## 🤝 Интеграция

### Storybook
```tsx
import { ThemeProvider } from 'functional-design-tokens';

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
```

### CSS-in-JS
```tsx
// Styled Components
const StyledButton = styled.button`
  background-color: var(--colors-brand-primary);
  padding: var(--spacing-md);
`;

// Emotion
const buttonStyles = css`
  background-color: var(--colors-brand-primary);
  padding: var(--spacing-md);
`;
```

### Jest тестирование
```tsx
import { mockContextResolver } from 'functional-design-tokens/testing';

beforeEach(() => {
  mockContextResolver.reset();
});
```

## 📊 Производительность

- **Lazy Resolution** - Токены разрешаются только при необходимости
- **Memoization** - Результаты кешируются для повторного использования
- **Efficient Updates** - Минимальные перерендеры при изменении контекста
- **Tree Shaking** - Неиспользуемые токены исключаются из бандла

## 🔗 Полезные ссылки

- [OKLCH Color Space](https://oklch.com/) - Информация о цветовом пространстве OKLCH
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Руководство по доступности
- [Design Tokens W3C Specification](https://design-tokens.github.io/community-group/format/) - Спецификация дизайн-токенов

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл для деталей.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с нашими рекомендациями по внесению изменений.

## 📞 Поддержка

- 🐛 Сообщить о баге через Issues
- 💡 Предложить улучшение через Discussions
- 📧 Связаться с командой разработки

---

Создано с ❤️ для современных интерфейсов