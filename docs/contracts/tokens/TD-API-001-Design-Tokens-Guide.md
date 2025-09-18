# TD-API-001: Руководство по API дизайн-токенов

## 0. Мета-данные

**Версия**: 1.0  
**Дата**: 2023-06-10  
**Статус**: Draft  
**Приоритет**: P1  
**Родительский контракт**: [TD-MS-001: Системный мастер-контракт внедрения дизайн-токенов](./TD-MS-001-Design-Token-System.md)  
**Зависимости**: 
- [TD-IMP-001: Настройка инфраструктуры Style Dictionary](./TD-IMP-001-Infrastructure-Setup.md)
- [TD-IMP-002: Извлечение и создание базовых токенов](./TD-IMP-002-Base-Tokens.md)  
**Исполнители**: Frontend-разработчик, UI-разработчик, Технический писатель

---

## 1. Цель и назначение

Данное руководство предоставляет подробную документацию по использованию системы дизайн-токенов в проекте. Оно содержит описание всех доступных токенов, примеры их использования в различных контекстах (CSS, JavaScript, React, Tailwind) и рекомендации по лучшим практикам работы с системой токенов.

## 2. Обзор системы дизайн-токенов

### 2.1. Структура токенов

Система дизайн-токенов построена по многоуровневой архитектуре:

1. **Базовые токены (Primitive)**: Фундаментальные значения дизайн-системы
   - Цвета (`color.*`)
   - Размеры шрифтов (`fontSize.*`)
   - Отступы (`spacing.*`)
   - Тени (`shadow.*`)
   - Радиусы скругления (`radius.*`)

2. **Семантические токены (Semantic)**: Смысловые значения на основе базовых токенов
   - Фон (`theme.background.*`)
   - Текст (`theme.text.*`)
   - Границы (`theme.border.*`)
   - Действия (`theme.action.*`)
   - Статусы (`theme.status.*`)

3. **Компонентные токены (Component)**: Специфичные для компонентов значения
   - Кнопки (`button.*`)
   - Карточки (`card.*`)
   - Поля ввода (`input.*`)

### 2.2. Доступные форматы

Токены доступны в следующих форматах:

- **CSS-переменные** для использования в CSS и HTML
- **JavaScript/TypeScript** для программного доступа
- **Tailwind классы** для использования в шаблонах

## 3. Использование токенов

### 3.1. CSS-переменные

#### 3.1.1. Базовое использование

```css
.my-element {
  color: var(--theme-text-primary);
  background-color: var(--theme-background-default);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

#### 3.1.2. Переопределение для компонентов

```css
.custom-component {
  --component-bg: var(--theme-background-paper);
  --component-color: var(--theme-text-secondary);
  
  background-color: var(--component-bg);
  color: var(--component-color);
}

.custom-component.highlighted {
  --component-bg: var(--theme-background-muted);
}
```

### 3.2. Tailwind CSS

#### 3.2.1. Базовое использование с классами

```html
<div class="bg-theme-background-default text-theme-text-primary p-4 rounded-radius-md shadow-md">
  Контент с использованием дизайн-токенов через Tailwind
</div>
```

#### 3.2.2. Использование в JIT режиме

```html
<button class="bg-theme-action-primary hover:bg-theme-action-hover text-white px-4 py-2 rounded-radius-base">
  Кнопка
</button>
```

### 3.3. JavaScript/TypeScript

#### 3.3.1. Прямой импорт токенов

```tsx
import { lightTokens, darkTokens } from '@/design-system';

console.log('Основной цвет:', lightTokens.color.primary['500'].value);
```

#### 3.3.2. Утилиты для работы с токенами

```tsx
import { getTokenVariable } from '@/design-system';

// Получение CSS-переменной
const primaryTextColor = getTokenVariable('theme.text.primary');
// Результат: 'var(--theme-text-primary)'
```

### 3.4. React-компоненты

#### 3.4.1. Использование хука useTokenStyles

```tsx
import { useTokenStyles } from '@/lib/design-tokens';

function MyComponent() {
  const styles = useTokenStyles({
    background: 'token:theme.background.default',
    color: 'token:theme.text.primary',
    padding: 'token:spacing.4',
    borderRadius: 'token:radius.md'
  });
  
  return <div style={styles}>Стилизованный контент</div>;
}
```

#### 3.4.2. Интеграция с CSS-in-JS (styled-components, emotion)

```tsx
import styled from 'styled-components';
import { getTokenVariable } from '@/lib/design-tokens';

const StyledCard = styled.div`
  background-color: ${getTokenVariable('theme.background.paper')};
  color: ${getTokenVariable('theme.text.primary')};
  padding: ${getTokenVariable('spacing.4')};
  border-radius: ${getTokenVariable('radius.md')};
  box-shadow: ${getTokenVariable('shadow.md')};
`;
```

## 4. Темизация

### 4.1. Использование dark/light тем

```tsx
import { useTheme } from 'next-themes';

function ThemeAwareComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Текущая тема: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Переключить тему
      </button>
    </div>
  );
}
```

### 4.2. Создание кастомных тем

Для создания новой темы:

1. Создайте новый JSON-файл в директории `tokens/themes/` (например, `custom.json`)
2. Определите семантические токены для темы
3. Добавьте тему в конфигурацию Style Dictionary и перезапустите сборку
4. Обновите конфигурацию ThemeProvider для поддержки новой темы

```json
// tokens/themes/custom.json
{
  "theme": {
    "background": {
      "default": { "value": "#f5f0ff", "type": "color" },
      "paper": { "value": "#ffffff", "type": "color" },
      "muted": { "value": "#f0e6ff", "type": "color" }
    },
    "text": {
      "primary": { "value": "#2d0076", "type": "color" },
      "secondary": { "value": "#4a00c2", "type": "color" }
    }
    // ... другие токены
  }
}
```

## 5. Лучшие практики

### 5.1. Чеклист использования токенов

- ✅ Всегда используйте семантические токены вместо базовых
- ✅ Группируйте похожие свойства (все цвета, все отступы)
- ✅ Используйте соответствующие токены для соответствующих свойств
- ✅ Следите за консистентностью использования токенов в компонентах
- ❌ Не используйте жёсткозакодированные значения (hex-цвета, пиксели)
- ❌ Не переопределяйте значения переменных без необходимости

### 5.2. Рекомендации по стилизации компонентов

1. **Последовательность**: Используйте одинаковый подход к стилизации всех компонентов.
2. **Минимализм**: Используйте минимальное количество токенов для достижения результата.
3. **Семантика**: Выбирайте токены на основе их смыслового назначения.
4. **Иерархия**: Следуйте иерархии токенов (семантические → базовые).

### 5.3. Рекомендации по темизации

1. **Переключение тем**: Используйте `next-themes` для переключения тем.
2. **CSS-переходы**: Добавляйте плавные переходы при смене темы.
3. **Предотвращение мерцания**: Используйте технику предварительной загрузки темы.

```css
/* Пример плавного перехода между темами */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Отключение анимации при начальной загрузке */
.no-animation * {
  transition: none !important;
}
```

## 6. Расширение системы токенов

### 6.1. Добавление новых базовых токенов

```json
// tokens/base/my-custom-tokens.json
{
  "myCategory": {
    "token1": { "value": "value1", "type": "string" },
    "token2": { "value": "value2", "type": "string" }
  }
}
```

### 6.2. Добавление компонентных токенов

```json
// tokens/components/button.json
{
  "button": {
    "primary": {
      "background": { "value": "{theme.action.primary.value}", "type": "color" },
      "text": { "value": "#ffffff", "type": "color" },
      "padding": {
        "x": { "value": "{spacing.4.value}", "type": "spacing" },
        "y": { "value": "{spacing.2.value}", "type": "spacing" }
      },
      "borderRadius": { "value": "{radius.base.value}", "type": "borderRadius" }
    },
    "secondary": {
      "background": { "value": "transparent", "type": "color" },
      "text": { "value": "{theme.action.primary.value}", "type": "color" },
      "border": { "value": "{theme.action.primary.value}", "type": "color" },
      "padding": {
        "x": { "value": "{spacing.4.value}", "type": "spacing" },
        "y": { "value": "{spacing.2.value}", "type": "spacing" }
      },
      "borderRadius": { "value": "{radius.base.value}", "type": "borderRadius" }
    }
  }
}
```

## 7. Диагностика и устранение проблем

### 7.1. Частые проблемы и их решения

| Проблема | Возможная причина | Решение |
|----------|-------------------|---------|
| CSS-переменная не применяется | Опечатка в имени | Проверьте точное имя переменной |
| Неожиданные значения в тёмной теме | Неверные ссылки на токены | Проверьте ссылки в `dark.json` |
| Tailwind не распознаёт новые токены | Не пересобран CSS | Запустите сборку токенов и перезапустите сервер |
| Токен не отображен в Storybook | Отсутствие документации | Добавьте токен в документацию Storybook |

### 7.2. Инструменты отладки

1. **Browser DevTools**: Проверка CSS-переменных в инспекторе элементов
2. **Режим разработки**: `?debug=tokens` в URL для отображения служебной информации
3. **Storybook**: Использование панели Controls для просмотра доступных токенов

## 8. Примеры полного кода

### 8.1. Компонент с использованием всех методов

```tsx
import React from 'react';
import { useTheme } from 'next-themes';
import { useTokenStyles, getTokenVariable } from '@/lib/design-tokens';

export function TokenShowcase() {
  const { theme } = useTheme();
  
  // Использование через хук
  const containerStyles = useTokenStyles({
    backgroundColor: 'token:theme.background.paper',
    color: 'token:theme.text.primary',
    padding: 'token:spacing.6',
    borderRadius: 'token:radius.lg',
    boxShadow: 'token:shadow.md',
    border: '1px solid token:theme.border.default'
  });
  
  // CSS-переменные для inline стилей
  const headingStyle = {
    color: `var(--theme-text-primary)`,
    fontSize: `var(--fontSize-2xl)`,
    fontWeight: `var(--fontWeight-bold)`,
    marginBottom: `var(--spacing-4)`
  };
  
  return (
    <div style={containerStyles}>
      <h2 style={headingStyle}>Токены темы: {theme}</h2>
      
      {/* Tailwind-классы */}
      <div className="bg-theme-background-muted p-4 rounded-radius-md mb-4">
        <p className="text-theme-text-secondary mb-2">
          Пример с использованием Tailwind-классов
        </p>
        
        <button className="bg-theme-action-primary hover:bg-theme-action-hover text-white px-4 py-2 rounded-radius-base">
          Кнопка через Tailwind
        </button>
      </div>
      
      {/* CSS-переменные в inline стилях */}
      <div style={{
        backgroundColor: 'var(--theme-background-muted)',
        padding: 'var(--spacing-4)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-4)'
      }}>
        <p style={{
          color: 'var(--theme-text-secondary)',
          marginBottom: 'var(--spacing-2)'
        }}>
          Пример с использованием CSS-переменных
        </p>
        
        <button style={{
          backgroundColor: 'var(--theme-action-primary)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-base)',
          border: 'none',
          cursor: 'pointer'
        }}>
          Кнопка через CSS-переменные
        </button>
      </div>
      
      {/* Комбинированный подход */}
      <div className="bg-theme-background-default" style={{ padding: 'var(--spacing-4)' }}>
        <p className="text-theme-text-muted mb-2">
          Комбинированный подход (Tailwind + CSS-переменные)
        </p>
      </div>
    </div>
  );
}
```

### 8.2. Пример создания компонента кнопки с использованием токенов

```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Определение вариантов кнопки с использованием токенов через Tailwind
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-border-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-theme-action-primary hover:bg-theme-action-hover text-white",
        secondary: "bg-theme-background-muted hover:bg-theme-background-default text-theme-text-primary",
        outline: "border border-theme-border-default hover:bg-theme-background-muted text-theme-text-primary",
        ghost: "hover:bg-theme-background-muted text-theme-text-primary",
      },
      size: {
        sm: "h-8 rounded-radius-sm px-3 text-xs",
        md: "h-10 rounded-radius-base px-4 py-2",
        lg: "h-12 rounded-radius-md px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## 9. FAQ

**Q: Где находятся исходные файлы токенов?**  
A: В директории `/design-system/tokens/`.

**Q: Как добавить новый токен?**  
A: Добавьте токен в соответствующий JSON-файл в директории `/design-system/tokens/` и запустите `npm run build:tokens`.

**Q: Как изменить значение существующего токена?**  
A: Найдите токен в JSON-файле, измените его значение и запустите `npm run build:tokens`.

**Q: Как использовать токены с CSS-in-JS библиотеками?**  
A: Импортируйте функцию `getTokenVariable` и используйте её для получения CSS-переменных.

**Q: Можно ли использовать токены без Tailwind?**  
A: Да, токены доступны как CSS-переменные и JavaScript-объекты.

**Q: Как добавить новую тему?**  
A: Создайте новый JSON-файл в директории `/design-system/tokens/themes/`, добавьте его в конфигурацию Style Dictionary и обновите ThemeProvider.

---

_Данное руководство предназначено для разработчиков, работающих с системой дизайн-токенов. При возникновении вопросов, не освещенных в руководстве, обратитесь к документации библиотек или к руководителю проекта._ 