# TD-IMP-003: Создание семантических токенов и настройка тем

## 0. Мета-данные

**Версия**: 1.0  
**Дата**: 2023-06-02  
**Статус**: Draft  
**Приоритет**: P0  
**Родительский контракт**: [TD-MS-001: Системный мастер-контракт внедрения дизайн-токенов](./TD-MS-001-Design-Token-System.md)  
**Зависимости**: [TD-IMP-002: Извлечение и создание базовых токенов](./TD-IMP-002-Base-Tokens.md)  
**Исполнители**: UI-разработчик, Frontend-разработчик

---

## 1. Цель и назначение

Создать семантические токены на основе уже определенных базовых токенов, обеспечить поддержку светлой и темной тем, а также настроить механизм переключения тем. Семантические токены должны обеспечивать смысловой уровень абстракции над базовыми токенами и служить основой для компонентных токенов.

## 2. Технические требования

### 2.1. Создание семантических токенов

Семантические токены должны быть сгруппированы по следующим категориям:
- Цвета интерфейса (фон, тексты, границы, элементы управления)
- Типографика (заголовки, основной текст, вспомогательный текст)
- Отступы (содержимое компонентов, страницы, сетка)
- Тени и возвышения

Семантические токены не должны содержать абсолютных значений, а только ссылки на базовые токены в формате `{token.name.value}`.

### 2.2. Создание тем

#### 2.2.1. Светлая тема (tokens/themes/light.json)

```json
{
  "theme": {
    "color": {
      "background": {
        "default": { "value": "{color.neutral.50}", "type": "color" },
        "muted": { "value": "{color.neutral.100}", "type": "color" },
        "subtle": { "value": "{color.neutral.200}", "type": "color" },
        "card": { "value": "white", "type": "color" },
        "disabled": { "value": "{color.neutral.200}", "type": "color" }
      },
      "foreground": {
        "default": { "value": "{color.neutral.900}", "type": "color" },
        "muted": { "value": "{color.neutral.700}", "type": "color" },
        "subtle": { "value": "{color.neutral.500}", "type": "color" },
        "disabled": { "value": "{color.neutral.400}", "type": "color" }
      },
      "border": {
        "default": { "value": "{color.neutral.200}", "type": "color" },
        "strong": { "value": "{color.neutral.300}", "type": "color" },
        "focus": { "value": "{color.primary.500}", "type": "color" }
      },
      "primary": {
        "default": { "value": "{color.primary.500}", "type": "color" },
        "hover": { "value": "{color.primary.600}", "type": "color" },
        "foreground": { "value": "white", "type": "color" },
        "muted": { "value": "{color.primary.100}", "type": "color" }
      },
      "success": {
        "default": { "value": "{color.success.500}", "type": "color" },
        "foreground": { "value": "white", "type": "color" },
        "muted": { "value": "{color.success.50}", "type": "color" }
      },
      "warning": {
        "default": { "value": "{color.warning.500}", "type": "color" },
        "foreground": { "value": "white", "type": "color" },
        "muted": { "value": "{color.warning.50}", "type": "color" }
      },
      "error": {
        "default": { "value": "{color.error.500}", "type": "color" },
        "foreground": { "value": "white", "type": "color" },
        "muted": { "value": "{color.error.50}", "type": "color" }
      },
      "info": {
        "default": { "value": "{color.info.500}", "type": "color" },
        "foreground": { "value": "white", "type": "color" },
        "muted": { "value": "{color.info.50}", "type": "color" }
      }
    },
    "typography": {
      "heading": {
        "font": { "value": "{fontFamily.sans}", "type": "fontFamily" },
        "h1": {
          "fontSize": { "value": "{fontSize.4xl}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.bold}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.tight}", "type": "lineHeight" }
        },
        "h2": {
          "fontSize": { "value": "{fontSize.3xl}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.semibold}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.tight}", "type": "lineHeight" }
        },
        "h3": {
          "fontSize": { "value": "{fontSize.2xl}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.semibold}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.tight}", "type": "lineHeight" }
        },
        "h4": {
          "fontSize": { "value": "{fontSize.xl}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.semibold}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.tight}", "type": "lineHeight" }
        }
      },
      "body": {
        "font": { "value": "{fontFamily.sans}", "type": "fontFamily" },
        "large": {
          "fontSize": { "value": "{fontSize.lg}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.normal}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.normal}", "type": "lineHeight" }
        },
        "default": {
          "fontSize": { "value": "{fontSize.base}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.normal}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.normal}", "type": "lineHeight" }
        },
        "small": {
          "fontSize": { "value": "{fontSize.sm}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.normal}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.normal}", "type": "lineHeight" }
        },
        "tiny": {
          "fontSize": { "value": "{fontSize.xs}", "type": "fontSize" },
          "fontWeight": { "value": "{fontWeight.normal}", "type": "fontWeight" },
          "lineHeight": { "value": "{lineHeight.normal}", "type": "lineHeight" }
        }
      }
    },
    "size": {
      "container": {
        "xs": { "value": "{size.xs}", "type": "sizing" },
        "sm": { "value": "{size.sm}", "type": "sizing" },
        "md": { "value": "{size.md}", "type": "sizing" },
        "lg": { "value": "{size.lg}", "type": "sizing" },
        "xl": { "value": "{size.xl}", "type": "sizing" },
        "2xl": { "value": "{size.2xl}", "type": "sizing" }
      },
      "input": {
        "height": { "value": "2.5rem", "type": "sizing" },
        "sm": { "value": "2rem", "type": "sizing" },
        "lg": { "value": "3rem", "type": "sizing" }
      },
      "icon": {
        "sm": { "value": "1rem", "type": "sizing" },
        "md": { "value": "1.5rem", "type": "sizing" },
        "lg": { "value": "2rem", "type": "sizing" }
      }
    },
    "space": {
      "component": {
        "xs": { "value": "{spacing.1}", "type": "spacing" },
        "sm": { "value": "{spacing.2}", "type": "spacing" },
        "md": { "value": "{spacing.4}", "type": "spacing" },
        "lg": { "value": "{spacing.6}", "type": "spacing" },
        "xl": { "value": "{spacing.8}", "type": "spacing" }
      },
      "layout": {
        "xs": { "value": "{spacing.2}", "type": "spacing" },
        "sm": { "value": "{spacing.4}", "type": "spacing" },
        "md": { "value": "{spacing.6}", "type": "spacing" },
        "lg": { "value": "{spacing.8}", "type": "spacing" },
        "xl": { "value": "{spacing.16}", "type": "spacing" },
        "2xl": { "value": "{spacing.24}", "type": "spacing" }
      },
      "grid": {
        "base": { "value": "{spacing.4}", "type": "spacing" }
      }
    },
    "elevation": {
      "low": { "value": "{shadow.sm}", "type": "boxShadow" },
      "medium": { "value": "{shadow.base}", "type": "boxShadow" },
      "high": { "value": "{shadow.md}", "type": "boxShadow" },
      "higher": { "value": "{shadow.lg}", "type": "boxShadow" },
      "highest": { "value": "{shadow.xl}", "type": "boxShadow" }
    }
  }
}
```

#### 2.2.2. Темная тема (tokens/themes/dark.json)

```json
{
  "theme": {
    "color": {
      "background": {
        "default": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "{color.neutral.900}", "type": "color" },
        "subtle": { "value": "{color.neutral.800}", "type": "color" },
        "card": { "value": "{color.neutral.900}", "type": "color" },
        "disabled": { "value": "{color.neutral.800}", "type": "color" }
      },
      "foreground": {
        "default": { "value": "{color.neutral.50}", "type": "color" },
        "muted": { "value": "{color.neutral.200}", "type": "color" },
        "subtle": { "value": "{color.neutral.400}", "type": "color" },
        "disabled": { "value": "{color.neutral.600}", "type": "color" }
      },
      "border": {
        "default": { "value": "{color.neutral.800}", "type": "color" },
        "strong": { "value": "{color.neutral.700}", "type": "color" },
        "focus": { "value": "{color.primary.400}", "type": "color" }
      },
      "primary": {
        "default": { "value": "{color.primary.400}", "type": "color" },
        "hover": { "value": "{color.primary.300}", "type": "color" },
        "foreground": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "rgba({color.primary.400}, 0.2)", "type": "color" }
      },
      "success": {
        "default": { "value": "{color.success.500}", "type": "color" },
        "foreground": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "rgba({color.success.500}, 0.2)", "type": "color" }
      },
      "warning": {
        "default": { "value": "{color.warning.500}", "type": "color" },
        "foreground": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "rgba({color.warning.500}, 0.2)", "type": "color" }
      },
      "error": {
        "default": { "value": "{color.error.500}", "type": "color" },
        "foreground": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "rgba({color.error.500}, 0.2)", "type": "color" }
      },
      "info": {
        "default": { "value": "{color.info.500}", "type": "color" },
        "foreground": { "value": "{color.neutral.950}", "type": "color" },
        "muted": { "value": "rgba({color.info.500}, 0.2)", "type": "color" }
      }
    },
    "elevation": {
      "low": { "value": "0 1px 2px 0 rgba(0, 0, 0, 0.4)", "type": "boxShadow" },
      "medium": { "value": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.2)", "type": "boxShadow" },
      "high": { "value": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)", "type": "boxShadow" },
      "higher": { "value": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", "type": "boxShadow" },
      "highest": { "value": "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)", "type": "boxShadow" }
    }
  }
}
```

### 2.3. Реализация переключения тем

#### 2.3.1. Установка зависимостей

```bash
npm install next-themes
```

#### 2.3.2. Создание провайдера тем (components/theme-provider.tsx)

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

#### 2.3.3. Использование провайдера тем в корневом лейауте (app/layout.tsx)

```tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 2.3.4. Создание компонента-переключателя тем (components/ui/theme-toggle.tsx)

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]" />
      ) : (
        <SunIcon className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]" />
      )}
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
}
```

### 2.4. Обновление конфигурации Style Dictionary

#### 2.4.1. Доработка style-dictionary.config.js

```js
// Настройка для учета разных тем
function getStyleDictionaryConfig(theme) {
  return {
    source: [
      'tokens/base/**/*.json',
      `tokens/themes/${theme}.json`,
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
      }
    }
  };
}
```

#### 2.4.2. Обновление build.js для сборки тем

```js
// Сборка для каждой темы
['light', 'dark'].forEach(theme => {
  console.log(`\nProcessing: [${theme}]`);
  
  const sd = StyleDictionary.extend(getStyleDictionaryConfig(theme));
  
  sd.buildAllPlatforms();
});
```

## 3. Процесс внедрения

### 3.1. Этапы внедрения семантических токенов

1. **Предварительная обработка**:
   - Анализ UI-guidelines
   - Валидация базовых токенов
   - Адаптация семантической структуры

2. **Создание и валидация токенов**:
   - Разработка семантических токенов
   - Генерация CSS для светлой и темной тем
   - Тестирование корректности ссылок

3. **Настройка тем**:
   - Реализация переключения тем
   - Тестирование корректной работы в разных браузерах

4. **Документирование**:
   - Обновление Storybook примерами
   - Создание руководств по использованию

### 3.2. Тестирование

1. **Валидация токенов**: Убедиться, что все ссылки на базовые токены разрешаются корректно.
2. **Тест светлой темы**: Проверить, что токены светлой темы применяются правильно.
3. **Тест темной темы**: Проверить, что токены темной темы применяются правильно.
4. **Тест переключения тем**: Убедиться, что переключение тем работает без мерцания и артефактов.
5. **Кросс-браузерное тестирование**: Проверить работу в разных браузерах и устройствах.

## 4. Ожидаемые результаты

1. **Набор семантических токенов**:
   - Цветовые токены для светлой и темной тем
   - Типографские токены
   - Токены отступов, размеров и теней

2. **CSS-файлы**:
   - tokens.light.css с переменными для светлой темы
   - tokens.dark.css с переменными для темной темы

3. **Компоненты для управления темами**:
   - Провайдер тем для Next.js
   - Компонент-переключатель тем

4. **Документация**:
   - Описание семантических токенов
   - Примеры использования
   - Руководство по расширению системы

## 5. Зависимости и риски

### 5.1. Зависимости

1. **Технические зависимости**:
   - Style Dictionary v3.7.2+
   - next-themes
   - База основных токенов (TD-IMP-002)

2. **Процессные зависимости**:
   - Одобрение UI-команды для семантических токенов
   - Координация с разработчиками компонентов

### 5.2. Риски

| Риск | Воздействие | Вероятность | Стратегия смягчения |
|------|-------------|-------------|---------------------|
| Неполное соответствие ссылок на базовые токены | Высокое | Средняя | Автоматизированное тестирование всех ссылок |
| Проблемы с отображением в определенных браузерах | Среднее | Средняя | Кросс-браузерное тестирование, полифиллы |
| Мерцание при переключении тем | Высокое | Высокая | Использование `disableTransitionOnChange` и дополнительные CSS-правила |
| Перекрытие стилей между темами | Среднее | Средняя | Строгая изоляция стилей через селекторы тем |

## 6. Заключение

Внедрение семантических токенов является критическим шагом для создания надежной и адаптивной дизайн-системы. После завершения этого контракта проект получит:
- Полный набор семантических дизайн-токенов для светлой и темной тем
- Механизм переключения тем с плавными переходами
- Основу для создания компонентных токенов

Это поможет стандартизировать визуальный язык приложения и упростит последующую разработку и поддержку компонентов интерфейса. 