---
id: typography-guidelines-rus100
title: Руководство по типографике Rus100
date-updated: 2023-07-12
status: active
type: guidelines
dependencies: [typography-contract-rus100.md, TestGenerator-UI-Contract.md]
---

# Руководство по типографике Rus100

<!-- TOC -->
- [1. Шрифтовая система](#1-шрифтовая-система)
- [2. Размеры шрифтов](#2-размеры-шрифтов)
- [3. Интерлиньяж](#3-интерлиньяж-высота-строки)
- [4. Веса шрифтов](#4-веса-шрифтов)
- [5. Рекомендации по применению](#5-рекомендации-по-применению)
- [6. Интеграция с системой токенов](#6-интеграция-с-системой-токенов)
- [7. Рекомендации по компонентам интерфейса](#7-рекомендации-по-работе-с-основными-компонентами-интерфейса)
- [8. Применение к существующим страницам](#8-применение-новой-типографической-системы-к-существующим-страницам)
- [9. Переход на новую систему](#9-переход-на-новую-типографическую-систему)
- [10. Типографика страницы профиля](#10-типографика-страницы-профиля-accountpagetsx)
- [11. Типографика страницы тестирования токенов](#11-типографика-страницы-тестирования-токенов-token-testpagetsx)
- [12. Мобильная типографика](#12-мобильная-типографика)
- [13. Вертикальные ритмы](#13-вертикальные-ритмы)
- [14. Типографика в формах](#14-типографика-в-формах)
- [15. Обновление Storybook](#15-обновление-storybook)
- [16. Распространенные ошибки](#16-распространенные-ошибки-типографики)
- [17. Интеграция с SEO](#17-интеграция-с-seo)
- [18. Матрица соответствия компонентов и типографических правил](#18-матрица-соответствия-компонентов-и-типографических-правил)
- [19. Глоссарий терминов](#19-глоссарий-терминов)
<!-- /TOC -->

**ВАЖНОЕ ОБЩЕЕ ОГРАНИЧЕНИЕ ДЛЯ ИИ АССИСТЕНТА:** При выполнении любых задач на основе данного руководства, ИИ ассистент должен **строго ограничиваться изменениями, связанными исключительно с типографикой**. Это включает в себя: семейство шрифтов, размеры, начертания (вес), межстрочные интервалы и их непосредственное применение в CSS-классах, стилях компонентов или конфигурационных файлах (токены, Tailwind CSS, настройки Next.js). **ИИ не должен изменять:**
-   Общий дизайн и макет компонентов или страниц.
-   Цветовую схему (кроме случаев, когда это напрямую связано с обеспечением читаемости нового шрифта и явно согласовано).
-   Отступы, поля, размеры блоков, не связанные напрямую с текстовым содержимым или его `line-height`.
-   Логику работы компонентов.
-   Структуру JSX/HTML, за исключением добавления/изменения CSS-классов или стилей, необходимых для применения типографики.
Любые предложения по изменениям, выходящим за рамки этих ограничений, должны быть явно обозначены и утверждены пользователем перед реализацией.

## 1. Шрифтовая система
<!-- @section-id: typography-fonts-system -->
<!-- @context: Выбор основных и дополнительных шрифтов для образовательной платформы -->

Для образовательной платформы Rus100 мы используем комбинацию из двух шрифтов, обеспечивающих ясную визуальную иерархию и хорошую читаемость кириллического текста.

### Основной шрифт (интерфейс и основной текст)
<!-- @status: required -->

- **Inter** (400, 500, 600, 700)
- Используется для: интерфейса, основного текста, навигации
- Fallback: Arial, Helvetica, sans-serif
- Интеграция: Next.js Font с поддержкой кириллицы

```typescript
// app/layout.tsx (текущая реализация)
import { Inter } from "next/font/google"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
})

// Используется в HTML как className={inter.variable}
// Сейчас это HTML: <html lang="ru" suppressHydrationWarning className={inter.variable}>
```

### Дополнительный шрифт (заголовки и акценты)
<!-- @status: required -->

- **Source Serif Pro** (400, 500, 600, 700)
- Используется для: заголовков, выделенных блоков с правилами (вместо ранее документированного Bitter)
- Fallback: Georgia, serif
- Интеграция: Next.js Font с поддержкой кириллицы
- **Ограничение для ИИ:** При работе с этим разделом ИИ должен обеспечить корректное подключение и конфигурацию шрифта `Source Serif Pro` (вместо ранее документированного `Bitter`). Это включает обновление имен переменных и параметров в `app/layout.tsx`. Не изменять существующую конфигурацию `Inter` или другую логику файла.

```typescript
// Добавление в app/layout.tsx
import { Inter, Source_Serif_Pro } from "next/font/google" // Убедиться, что используется корректное имя для импорта Source Serif Pro

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
})

const sourceSerifPro = Source_Serif_Pro({ // Настройка для Source Serif Pro
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-source-serif-pro", // CSS переменная для Source Serif Pro
  weight: ["400", "500", "600", "700"] // Указать актуальные веса для Source Serif Pro
})

// В компоненте HTML добавляем обе переменные
<html lang="ru" suppressHydrationWarning className={`${inter.variable} ${sourceSerifPro.variable}`}> {/* Используем переменную для Source Serif Pro */}
```

## 2. Размеры шрифтов

Для обеспечения четкой визуальной иерархии и оптимальной читаемости на всех устройствах, мы используем следующую семантическую шкалу размеров. Базовые размеры предназначены для мобильных устройств, а десктопные размеры применяются с брейкпоинта `md:`.

**Основная шкала типографики Rus100:**

| Семантический элемент | Tailwind Класс (размер)           | Мобильный (px/rem) | Десктоп (px/rem) | Шрифт            | Вес (tailwind) | Применение                               |
| :-------------------- | :-------------------------------- | :----------------- | :--------------- | :--------------- | :------------- | :--------------------------------------- |
| **H1** (Заголовок 1)  | `text-app-h1-mobile md:text-app-h1` | 36px / 2.25rem     | 48px / 3rem      | Source Serif Pro | `font-semibold` (600) | Главные заголовки страниц                 |
| **H2** (Заголовок 2)  | `text-app-h2-mobile md:text-app-h2` | 30px / 1.875rem    | 36px / 2.25rem   | Source Serif Pro | `font-semibold` (600) | Заголовки основных разделов            |
| **H3** (Заголовок 3)  | `text-app-h3-mobile md:text-app-h3` | 20px / 1.25rem     | 24px / 1.5rem    | Source Serif Pro | `font-medium` (500)   | Подзаголовки, заголовки карточек      |
| **Body** (Осн. текст)| `text-app-body`                     | 16px / 1rem        | 16px / 1rem      | Inter            | `font-normal` (400)   | Основной контент, параграфы            |
| **Small** (Уменьш.)   | `text-app-small`                    | 14px / 0.875rem    | 14px / 0.875rem  | Inter            | `font-normal` (400)   | Вспомогательный текст, метки, UI-элементы |
| **Caption** (Подпись) | `text-app-caption`                  | 12px / 0.75rem     | 12px / 0.75rem   | Inter            | `font-normal` (400)   | Мелкий текст, метаданные, сноски       |

**Ограничение для ИИ:** При работе с этим разделом ИИ должен обеспечить, что в примерах конфигурации Tailwind и токенов дизайн-системы используются именно эти семантические имена и значения.

**Конфигурация в Tailwind (`tailwind.config.ts`):**

Обновите секцию `fontSize` в `theme.extend` следующим образом:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontSize: {
      // Новая семантическая шкала типографики
      'app-h1-mobile': '2.25rem',   // 36px
      'app-h1': '3rem',           // 48px
      'app-h2-mobile': '1.875rem',  // 30px
      'app-h2': '2.25rem',          // 36px
      'app-h3-mobile': '1.25rem',   // 20px
      'app-h3': '1.5rem',           // 24px
      'app-body': '1rem',           // 16px
      'app-small': '0.875rem',      // 14px
      'app-caption': '0.75rem',     // 12px
      // Существующие размеры (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl), если они все еще нужны для специфических случаев,
      // могут быть сохранены или удалены, если новая шкала их полностью заменяет.
      // Рекомендуется провести аудит их использования перед удалением.
      // Например, если 'base', 'sm', 'xs' использовались напрямую и их значения совпадают с 'app-body', 'app-small', 'app-caption',
      // то их можно оставить для обратной совместимости или плавной миграции.
    },
    fontFamily: {
      sans: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
      inter: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
      'source-serif-pro': ["var(--font-source-serif-pro)", "Georgia", "serif"],
      serif: ["var(--font-source-serif-pro)", "Georgia", "serif"],
    },
    // ... остальная конфигурация
  }
}
```

**Токены дизайн-системы (`design-system/tokens/base/typography.json`):**

Обновите секцию `fontSize` следующим образом (без комментариев, так как JSON их не поддерживает):

```json
// design-system/tokens/base/typography.json
{
  "fontSize": {
    "app-h1-mobile": { "value": "2.25rem", "type": "fontSize" },
    "app-h1": { "value": "3rem", "type": "fontSize" },
    "app-h2-mobile": { "value": "1.875rem", "type": "fontSize" },
    "app-h2": { "value": "2.25rem", "type": "fontSize" },
    "app-h3-mobile": { "value": "1.25rem", "type": "fontSize" },
    "app-h3": { "value": "1.5rem", "type": "fontSize" },
    "app-body": { "value": "1rem", "type": "fontSize" },
    "app-small": { "value": "0.875rem", "type": "fontSize" },
    "app-caption": { "value": "0.75rem", "type": "fontSize" }
  },
  "fontFamily": {
    "sans": { 
      "value": "Arial, Helvetica, sans-serif", 
      "type": "fontFamily" 
    },
    "serif": {
      "value": "Source Serif Pro, Georgia, Times New Roman, serif", 
      "type": "fontFamily" 
    },
    "inter": {
      "value": "Inter, Arial, Helvetica, sans-serif",
      "type": "fontFamily"
    },
    "source-serif-pro": {
      "value": "Source Serif Pro, Georgia, Times New Roman, serif", 
      "type": "fontFamily"
    },
    "mono": { 
      "value": "Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace", 
      "type": "fontFamily" 
    }
  }
  // ... остальная часть файла (fontWeight, lineHeight и т.д.) остается без изменений для этой секции
}
```

## 3. Интерлиньяж (высота строки)
**Ограничение для ИИ:** Этот раздел касается `lineHeight`. ИИ не должен изменять значения, если это не указано отдельно, и не должен менять семейства шрифтов здесь.

Для кириллического текста оптимизированы значения интерлиньяжа:

| Имя       | Значение | Применение                                       | Tailwind Класс (Пример) |
|-----------|----------|--------------------------------------------------|-------------------------|
| tight     | 1.25     | Заголовки (H1, H2)                               | `leading-tight`         |
| snug      | 1.375    | Подзаголовки (H3)                                | `leading-snug`          |
| normal    | 1.5      | Стандартный интерлиньяж, кнопки, элементы UI   | `leading-normal` или `leading-6` (для 16px base) |
| relaxed   | 1.625    | Альтернатива для основного текста, если `cyr-text` не используется | `leading-relaxed`       |
| loose     | 2        | Расширенные блоки                                | `leading-loose`         |
| **cyr-text** | **1.6**  | **Специально для кириллического основного текста (Body)** | `leading-cyr-text`      |
| cyr-large | 1.7      | Для крупных текстовых блоков с правилами        | `leading-cyr-large`     |
| (числовые) | -        | Для `app-small` (14px) используется `leading-5` (1.25rem = ~1.43 для 14px) | `leading-5`             |
| (числовые) | -        | Для `app-caption` (12px) используется `leading-4` (1rem = ~1.33 для 12px)  | `leading-4`             |


**Рекомендации по применению к семантическим элементам:**

*   **H1 (`text-app-h1`):** `leading-tight` (1.25)
*   **H2 (`text-app-h2`):** `leading-tight` (1.25)
*   **H3 (`text-app-h3`):** `leading-snug` (1.375)
*   **Body (`text-app-body`):** `leading-cyr-text` (1.6) – **важно для кириллицы!**
*   **Small (`text-app-small`):** `leading-5` (Tailwind, соответствует ~1.43 для 14px)
*   **Caption (`text-app-caption`):** `leading-4` (Tailwind, соответствует ~1.33 для 12px)

Добавления в Tailwind и токены (убедитесь, что эти значения присутствуют):

```typescript
// tailwind.config.ts
theme: {
  extend: {
    lineHeight: {
      'cyr-text': '1.6', // Важно для основного текста
      'cyr-large': '1.7',
      // Стандартные Tailwind значения 'tight', 'snug', 'normal', 'relaxed', 'loose', '3'- '10' уже доступны
    },
  }
}
```

```json
// design-system/tokens/base/typography.json
"lineHeight": {
  "none": { "value": "1", "type": "lineHeight" },
  "tight": { "value": "1.25", "type": "lineHeight" },
  "snug": { "value": "1.375", "type": "lineHeight" },
  "normal": { "value": "1.5", "type": "lineHeight" },
  "relaxed": { "value": "1.625", "type": "lineHeight" },
  "loose": { "value": "2", "type": "lineHeight" },
  "cyr-text": { "value": "1.6", "type": "lineHeight" }, // Важно для основного текста
  "cyr-large": { "value": "1.7", "type": "lineHeight" }
  // Числовые значения Tailwind (3-10) обычно не дублируются в токенах lineHeight, 
  // если они не используются для создания кастомных CSS переменных с семантическими именами.
}
```

## 4. Веса шрифтов
**Ограничение для ИИ:** Этот раздел информационный. ИИ не должен вносить сюда изменения, кроме обновления таблицы применения весов к новым семантическим элементам.

Используем существующие веса шрифтов из токенов. Рекомендуемое применение к семантическим элементам:

| Семантический элемент | Вес (Tailwind класс) | Значение | Шрифт            |
|:----------------------|:---------------------|:---------|:-----------------|
| H1                    | `font-semibold`      | 600      | Source Serif Pro |
| H2                    | `font-semibold`      | 600      | Source Serif Pro |
| H3                    | `font-medium`        | 500      | Source Serif Pro |
| Body (p)              | `font-normal`        | 400      | Inter            |
| Small                 | `font-normal`        | 400      | Inter            |
| Caption               | `font-normal`        | 400      | Inter            |

## 5. Рекомендации по применению
**Ограничение для ИИ:** При работе с этим разделом ИИ должен использовать класс `font-source-serif-pro` (для шрифта `Source Serif Pro`, который применяется вместо ранее документированного `Bitter`) в примерах для заголовков. ИИ должен применять только шрифтовые стили, не изменяя другие аспекты дизайна (цвета, отступы, структуру) в примерах кода.

### Для заголовков (font-source-serif-pro)

Используется шрифт `Source Serif Pro`. Размеры адаптивны: базовые для мобильных, с префиксом `md:` для десктопа.

- **H1 (`variant="h1"`):**
    - Размер: `text-app-h1-mobile md:text-app-h1` (36px / 48px)
    - Вес: `font-semibold` (600)
    - Интерлиньяж: `leading-tight` (1.25)
- **H2 (`variant="h2"`):**
    - Размер: `text-app-h2-mobile md:text-app-h2` (30px / 36px)
    - Вес: `font-semibold` (600)
    - Интерлиньяж: `leading-tight` (1.25)
- **H3 (`variant="h3"`):**
    - Размер: `text-app-h3-mobile md:text-app-h3` (20px / 24px)
    - Вес: `font-medium` (500)
    - Интерлиньяж: `leading-snug` (1.375)

Пример использования компонента `Typography`:
```html
<Typography variant="h1" as="h1">Заголовок первого уровня</Typography>
<Typography variant="h2" as="h2">Заголовок второго уровня</Typography>
<Typography variant="h3" as="h3">Заголовок третьего уровня</Typography>
```

Или при прямом использовании классов Tailwind:
```html
<h1 class="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">Заголовок первого уровня</h1>
<h2 class="font-source-serif-pro text-app-h2-mobile md:text-app-h2 leading-tight font-semibold text-foreground">Заголовок второго уровня</h2>
```

### Для основного текста (font-inter)

- **Шрифт:** `Inter`
- **Вариант компонента:** `variant="p"`
- **Размер:** `text-app-body` (16px)
- **Вес:** `font-normal` (400)
- **Интерлиньяж:** `leading-cyr-text` (1.6) – **оптимизировано для кириллицы**

Пример использования компонента `Typography`:
```html
<Typography variant="p">Основной текст параграфа с кириллицей...</Typography>
```

Или при прямом использовании классов Tailwind:
```html
<p class="font-inter text-app-body leading-cyr-text font-normal text-foreground">Основной текст параграфа с кириллицей...</p>
```

### Для бейджей/пилюль (font-inter)

Используется шрифт `Inter`.

- **Размер текста:** `text-app-small` (14px)
- **Вес текста метки (`label`):** `font-normal` (400)
- **Вес текста числа (`count` в `CounterBadge`):** `font-semibold` (600)

Пример реализации `CounterBadge.tsx` (показывает разный вес для текста и числа):
```tsx
// Текущая реализация CounterBadge.tsx
export function CounterBadge({ className, variant = "outline", label, count, ...props }: CounterBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5", // Стили для CounterBadge
        className
      )}
      {...props}
    >
      {/* Текст метки с обычным начертанием и размером app-small */}
      <span className="font-inter text-app-small font-normal">{label}</span>
      {typeof count === "number" && (
        /* Число с полужирным начертанием и размером app-small */
        <span className="font-inter text-app-small font-semibold">{count}</span>
      )}
    </Badge>
  );
}
```

Рекомендация по обновлению `badgeVariants` в `components/ui/badge.tsx` (для базового компонента `Badge`):
Основной класс размера должен быть обновлен на `text-app-small`.

```tsx
// Рекомендуемое обновление для badgeVariants в badge.tsx
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-inter text-app-small font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Для блоков с правилами русского языка

Используем комбинацию `Source Serif Pro` для заголовка и `Inter` для содержимого.
Пример для компонента, отображающего блок с правилом (например, `RuleBlock.tsx` или аналогичный):

- **Заголовок блока:**
    - Шрифт: `Source Serif Pro`
    - Стиль: Как H3 (`variant="h3"`)
    - Классы: `font-source-serif-pro text-app-h3-mobile md:text-app-h3 leading-snug font-medium text-primary` (цвет `text-primary` как в примере, не меняем)
- **Основной текст правила:**
    - Шрифт: `Inter`
    - Стиль: Как Body (`variant="p"`)
    - Классы: `font-inter text-app-body leading-cyr-text text-foreground` (цвет `text-foreground` как в примере, не меняем)

Пример обновления кода для такого компонента:
```tsx
// components/ui/RuleBlock.tsx (или аналогичный)
import { cn } from "@/lib/utils";
import React from "react";
import { Typography } from "@/components/ui/typography"; // Предполагаем импорт

interface RuleBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  children: React.ReactNode;
  // ... другие пропсы если есть
}

export function RuleBlock({ title, children, className, ...props }: RuleBlockProps) {
  return (
    <div 
      className={cn(
        "bg-blue-50 p-6 rounded-lg mb-8", // Внешние стили блока (фон, отступы) ИИ не меняет
        className
      )}
      {...props}
    >
      <Typography variant="h3" as="h3" className="text-primary mb-3"> {/* Используем Typography для заголовка, цвет text-primary ИИ не меняет */}
        {title}
      </Typography>
      <Typography variant="p" className="text-foreground"> {/* Используем Typography для текста, цвет text-foreground ИИ не меняет. leading-cyr-text уже включен в variant="p" */}
        {children}
      </Typography>
    </div>
  );
}
```

## 6. Интеграция с системой токенов
**Ограничение для ИИ:** При работе с этим разделом ИИ должен корректно указывать названия CSS-переменных (например, `fontFamily-source-serif-pro` для шрифта `Source Serif Pro`, который используется вместо ранее документированного `Bitter`) и команд. ИИ не должен изменять описанный процесс работы с токенами или структуру команд.

Для обеспечения согласованного использования типографики через всё приложение, новая типографическая система интегрируется с существующей системой дизайн-токенов проекта.

### 6.1. Процесс обновления токенов

1. Все изменения производятся в файле `design-system/tokens/base/typography.json`
2. После внесения изменений **обязательно** запустите сборку токенов:
   ```bash
   npm run build:tokens
   ```
3. Эта команда обновит:
   - CSS-переменные в `styles/tokens.light.css` и `styles/tokens.dark.css` 
   - TypeScript типы и JS-объекты в `src/tokens/`

### 6.2. Использование через Tailwind CSS (предпочтительно)

Tailwind CSS автоматически интегрирован с системой токенов через специальный форматтер. После обновления токенов, предпочтительным способом применения стилей является использование компонента `Typography`:

```html
<!-- Заголовок с шрифтом Source Serif Pro через компонент Typography -->
<Typography variant="h1" as="h1">Заголовок</Typography>

<!-- Основной текст с оптимизированным интерлиньяжем для кириллицы через компонент Typography -->
<Typography variant="p">Текстовый блок с кириллицей...</Typography>
```

При необходимости прямого использования классов Tailwind (например, внутри других компонентов или для специфических случаев):

```html
<!-- Заголовок с шрифтом Source Serif Pro и новыми семантическими классами -->
<h1 class="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">Заголовок</h1>

<!-- Основной текст с оптимизированным интерлиньяжем для кириллицы -->
<p class="font-inter text-app-body leading-cyr-text font-normal text-foreground">Текстовый блок с кириллицей...</p>
```

### 6.3. Прямое использование CSS-переменных

При необходимости можно использовать CSS-переменные напрямую:

```css
.custom-element {
  /* Для размера шрифта */
  font-size: var(--theme-typography-body-small-font-size); /* ИИ не меняет этот пример, если не указано */
  
  /* Для интерлиньяжа оптимизированного для кириллицы */
  line-height: var(--lineHeight-cyr-text); /* ИИ не меняет этот пример, если не указано */
  
  /* Для шрифтов */
  font-family: var(--fontFamily-source-serif-pro); /* Используем переменную для Source Serif Pro */
}
```

### 6.4. Отладка с TokenDebugger

Для визуализации всех доступных типографических токенов используйте компонент `TokenDebugger`:

```tsx
import { TokenDebugger } from '@/components/debug/TokenDebugger';

// В вашем компоненте
<TokenDebugger />
```

Этот инструмент покажет все CSS-переменные, связанные с типографикой, их текущие значения и предпросмотр для лучшего понимания системы.

## 7. Рекомендации по работе с основными компонентами интерфейса
**ВАЖНОЕ ОГРАНИЧЕНИЕ ДЛЯ ИИ АССИСТЕНТА:** При работе с этим разделом и обновлении примеров кода для компонентов, ИИ должен **строго ограничиваться применением класса `font-source-serif-pro`** (для шрифта `Source Serif Pro`, используемого вместо ранее документированного `Bitter`) к заголовкам и соответствующим обновлением CSS-классов, связанных *только* с семейством шрифтов, размером, весом или межстрочным интервалом. **ИИ не должен изменять** цвета, отступы, структуру JSX, логику или любые другие стили, не являющиеся непосредственно типографическими. Все классы, не относящиеся к шрифтам (`text-foreground`, `mb-4`, `p-4`, `bg-card` и т.д.), должны оставаться неизменными.

На основе анализа страниц приложения (`app/page.tsx`, `app/account/page.tsx`, `app/token-test/page.tsx`), здесь приведены детальные рекомендации по типографике для всех ключевых компонентов.

### 7.1. Заголовки страниц и секций

В проекте используется несколько уровней заголовков. Применяйте компонент `Typography` для их стилизации.

```jsx
// Главный заголовок страницы (H1)
<Typography variant="h1" as="h1">
  Генерация теста
</Typography>

// Заголовок секции, например в карточке (H2)
<Typography variant="h2" as="h2" className="mb-4"> {/* Пример добавления отступа */}
  Генерация по заданиям
</Typography>

// Подзаголовок для категорий (H3)
<Typography variant="h3" as="h3">
  {category.category}
</Typography>
```

### 7.2. Основные текстовые элементы

Для описательного текста, особенно с кириллицей, используйте вариант `p` (Body) или `small` (Small) компонента `Typography`.

```jsx
// Параграф с объяснением функций (Body)
<Typography variant="p" className="text-muted-foreground mt-2 mb-6"> {/* text-muted-foreground и отступы добавляются при необходимости */}
  Выберите задания для включения в тест (не более 50), укажите название, аккаунт и группу, затем нажмите
  "Создать тест".
</Typography>

// Мелкий вспомогательный текст (Small)
<Typography variant="small" className="text-muted-foreground mb-6"> {/* text-muted-foreground и отступы добавляются */}
  Выберите количество вопросов и уровень сложности для каждого задания:
</Typography>
```

### 7.3. TopNavBlock

Компонент используется на всех страницах. Предпочтительно обновить внутреннюю разметку `TopNavBlock` для использования `<Typography>`, либо применять семантические классы.

```jsx
// В компоненте TopNavBlock

// Навигационные ссылки: Используем стиль Small, но с весом medium
// Пример с Typography: 
// <Typography variant="small" as="a" href={link.href} className="font-medium text-muted-foreground hover:text-foreground px-3 py-2">
//   {link.label}
// </Typography>

// Пример с прямыми классами (если Typography не используется внутри TopNavBlock):
{
  navLinks.map((link) => (
    <a 
      key={link.href} 
      href={link.href}
      className="font-inter text-app-small font-medium text-muted-foreground hover:text-foreground px-3 py-2"
    >
      {link.label}
    </a>
  ))
}

// Имя пользователя: Стиль Small, вес medium
// Пример с Typography: 
// <Typography variant="small" className="font-medium text-foreground">{userName}</Typography>

// Пример с прямыми классами:
<div className="font-inter text-app-small font-medium text-foreground">{userName}</div>

// Email пользователя: Стиль Caption, вес normal
// Пример с Typography: 
// <Typography variant="caption" className="text-muted-foreground">{userEmail}</Typography>

// Пример с прямыми классами:
<div className="font-inter text-app-caption font-normal text-muted-foreground">{userEmail}</div>
```

### 7.4. Кнопки (Button)

Текст в кнопках должен использовать шрифт `Inter` и, как правило, среднее начертание (`font-medium`). Размер может варьироваться.

```jsx
// Стандартная кнопка: Используем стиль Small, вес medium
// <Button className="font-medium" variant="default"> {/* Типографика из Typography variant="small" + font-medium */}
//   <Typography variant="small" as="span" className="font-medium">Создать тест</Typography>
// </Button>
// ИЛИ, если Button не использует Typography внутри, а имеет свои стили текста:
<Button 
  className="font-inter text-app-small font-medium" // text-app-small (14px), font-medium (500)
  variant="default"
>
  Создать тест
</Button>

// Большая кнопка (например, в ProgressPanelBlock): Используем стиль Body, вес medium
// <Button className="font-medium px-6" variant="default">
//   <Typography variant="p" as="span" className="font-medium leading-normal">{buttonText}</Typography> {/* variant="p" (16px), font-medium, обычный leading для кнопки */}
// </Button>
// ИЛИ:
<Button 
  className="font-inter text-app-body font-medium px-6 leading-normal" // text-app-body (16px), font-medium (500), standard line-height for buttons
  variant="default"
>
  {buttonText}
</Button>
```

### 7.5. Badge и CounterBadge

Компоненты `Badge` и `CounterBadge` используются для отображения статусов, меток и счетчиков. Используют шрифт `Inter`.

- **Базовый `Badge`:** Текст `text-app-small` (14px), `font-normal` (400).
- **`CounterBadge`:**
    - Метка (`label`): `text-app-small` (14px), `font-normal` (400).
    - Число (`count`): `text-app-small` (14px), `font-semibold` (600).

```jsx
// Badge с обычным текстом
// <Typography variant="small" as="span" className="inline-flex ..."> <Badge>...</Badge>
// ИЛИ если Badge стилизует текст сам (предпочтительно обновить сам Badge):
<Badge className="font-inter text-app-small font-normal">Активно</Badge>

// CounterBadge с текстом и числом
// Предполагается, что CounterBadge внутри себя использует text-app-small 
// и управляет весом метки и числа как описано выше.
<CounterBadge label="Задания" count={5} />
```

### 7.6. Карточки (Card, CardContent)

Карточки используются для группировки информации. Текст внутри карточек, такой как метки полей ввода, должен использовать соответствующие стили.

```jsx
<div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
  <div className="space-y-4">
    {/* Метка для поля ввода: Стиль Small, вес medium */}
    {/* <Typography variant="small" as="label" htmlFor="test-name" className="block font-medium text-foreground mb-1">
          Название теста <span className="text-destructive">*</span>
    </Typography> */}
    {/* ИЛИ прямыми классами: */}
    <label htmlFor="test-name" className="block font-inter text-app-small font-medium text-foreground mb-1">
      Название теста <span className="text-destructive">*</span>
    </label>
    <Input
      id="test-name"
      placeholder="Введите название теста"
      className="w-full" // Input сам управляет своей внутренней типографикой
    />
  </div>
</div>
```

### 7.7. Вкладки (Tabs, TabsTrigger, TabsContent)

Компоненты вкладок на странице генерации теста.

```jsx
// TabsTrigger: Стиль Small, вес medium
// <Typography variant="small" as="div" className="font-medium ...">По заданиям</Typography> // Если TabsTrigger принимает ReactNode
// ИЛИ, если TabsTrigger стилизуется классами напрямую:
<TabsTrigger
  value="tasks"
  className="font-inter text-app-small font-medium text-muted-foreground py-3 px-4 ..." // text-app-small (14px), font-medium
>
  По заданиям
</TabsTrigger>

<TabsContent value="tasks" className="w-full max-w-full mt-0">
  <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
    {/* Заголовок внутри вкладки: H2 стиль */}
    <Typography variant="h2" as="h2" className="mb-4">
      Генерация по заданиям
    </Typography>
    {/* Пояснительный текст: Small стиль */}
    <Typography variant="small" className="text-muted-foreground mb-6">
      Выберите количество вопросов и уровень сложности для каждого задания:
    </Typography>
  </div>
</TabsContent>
```

### 7.8. ProfileCard и TariffPaymentCard

На странице профиля используются специализированные карточки. Их внутренние заголовки должны использовать стиль H3, а текстовые метки и значения — стили Small и Body соответственно.

```jsx
// В компонентах карточек (например, ProfileCard)

// Заголовок карточки: H3 стиль
<Typography variant="h3" as="h3" className="mb-2"> {/* Отступ mb-2 можно оставить или управлять им снаружи */}
  Информация о профиле
</Typography>

<div className="flex flex-col">
  {/* Метка: Small стиль */}
  <Typography variant="small" as="span" className="text-muted-foreground">Email:</Typography>
  {/* Значение: Body стиль, вес medium */}
  <Typography variant="p" as="span" className="font-medium">{userEmail}</Typography> {/* variant="p" (app-body), но с font-medium */}
</div>
```

### 7.9. SelectionDropdown и другие выпадающие списки

Компонент `SelectionDropdown` используется для выбора опций. Текст метки и опций должен использовать стиль `Small`.

```jsx
// В компоненте SelectionDropdown
<div className="flex items-center justify-between">
  {/* Метка: Small стиль, вес medium */}
  {/* <Typography variant="small" as="span" className="font-medium text-foreground">
    {label}
  </Typography> */}
  <span className="font-inter text-app-small font-medium text-foreground">
    {label}
  </span>

  {selectedOption && (
    // Badge будет использовать text-app-small из своих стилей (см. секцию 7.5)
    <Badge className="ml-2"> 
      <span className="font-normal">{selectedOption.label}</span>
      {selectedOption.count && <span className="ml-1 font-semibold">{selectedOption.count}</span>}
    </Badge>
  )}
</div>
```

### 7.10. BreadcrumbsBlock

Хлебные крошки используются для навигации. Текст должен использовать стиль `Small`.

```jsx
// <Typography variant="small" as="nav" className="breadcrumbs text-muted-foreground hidden sm:block">...</Typography>
// ИЛИ, если стилизуется напрямую:
<nav className="breadcrumbs font-inter text-app-small text-muted-foreground hidden sm:block"> {/* text-app-small (14px) */}
  <a href="#" className="hover:text-foreground hover:underline">
    Главная
  </a>{" "}
  &gt; <span>Генерация теста</span> {/* Активный элемент может иметь font-medium, если нужно выделить */}
</nav>
```

### 7.11. TaskCardBlock

Компонент для отображения заданий.

```jsx
// Заголовок задания: Стиль Body, вес medium
// <Typography variant="p" as="h4" className="font-medium text-foreground"> {/* variant="p" дает text-app-body (16px) */}
//   {item.title}
// </Typography>
// ИЛИ прямыми классами:
<h4 className="font-inter text-app-body font-medium text-foreground"> {/* text-app-body (16px), font-medium (500) */}
  {item.title}
</h4>

// Описание задания: Стиль Small, обычный вес, оптимизированный интерлиньяж
// <Typography variant="small" className="text-muted-foreground mt-1 leading-cyr-text"> {/* variant="small" (14px), но с интерлиньяжем от Body для читаемости */}
//  {item.description}
// </Typography>
// ИЛИ прямыми классами:
<p className="font-inter text-app-small leading-cyr-text text-muted-foreground mt-1"> {/* text-app-small (14px), leading-cyr-text */}
  {item.description}
</p>
```

### 7.12. ProgressPanelBlock

Панель прогресса внизу страницы.

```jsx
<div className="fixed bottom-0 left-0 right-0 bg-background border-t py-3 px-4">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="w-full md:w-auto">
      <Progress value={progress} className="h-2 w-full md:w-48" />
      {/* Текст статуса: Стиль Caption */}
      {/* <Typography variant="caption" className="text-muted-foreground mt-1">
           Выбрано {totalSelected} из {totalLimit} заданий
      </Typography> */}
      <p className="font-inter text-app-caption text-muted-foreground mt-1"> {/* text-app-caption (12px) */}
        Выбрано {totalSelected} из {totalLimit} заданий
      </p>
    </div>
    {/* Кнопка: Стиль Small, вес medium (или Body, если это основное действие, см. секцию 7.4) */}
    {/* Предположим, это стандартная кнопка, как в 7.4 */}
    <Button 
      className="w-full md:w-auto font-inter text-app-small font-medium" // text-app-small (14px), font-medium
      onClick={onCreate}
    >
      {buttonText}
    </Button>
  </div>
</div>
```

### 7.13. Формы и элементы ввода

Поля ввода, метки и селекты на страницах.

```jsx
// Метка для поля ввода: Стиль Small, вес medium
// <Typography variant="small" as="label" htmlFor="test-name" className="block font-medium text-foreground mb-1">...</Typography>
<label htmlFor="test-name" className="block font-inter text-app-small font-medium text-foreground mb-1">
  Название теста <span className="text-destructive">*</span>
</label>

// Селект с опциями
// Текст в SelectTrigger и SelectItem: Стиль Small, вес normal
<Select value={testGroup} onValueChange={setTestGroup}>
  <SelectTrigger className="w-full font-inter text-app-small font-normal"> {/* text-app-small (14px), font-normal */}
    <SelectValue placeholder="-- Выберите --" />
  </SelectTrigger>
  <SelectContent>
    {/* Предполагается, что SelectItem наследует или явно устанавливает text-app-small font-normal */}
    <SelectItem value="3" className="font-inter text-app-small font-normal">Тесты-25</SelectItem>
    <SelectItem value="4" className="font-inter text-app-small font-normal">Пунктуация</SelectItem>
  </SelectContent>
</Select>
```

## 8. Применение новой типографической системы к существующим страницам

Для обеспечения последовательного применения новой типографической системы, следуйте этим шагам:

1. Обновите компонент TopNavBlock (используется на всех страницах)
2. Обновите заголовки (h1, h2, h3) и основной текст
3. Обновите Badge и CounterBadge
4. Последовательно внедрите обновления в другие компоненты

Приоритет внедрения:
1. Компоненты верхнего уровня (TopNavBlock, заголовки страниц)
2. Интерактивные элементы (Button, Badge, SelectionDropdown)
3. Контентные компоненты (Card, TabsContent)
4. Специализированные компоненты (TaskCardBlock, ProfileCard)

## 9. Переход на новую типографическую систему
**Ограничение для ИИ:** При работе с этим разделом ИИ должен корректно отразить интеграцию шрифта `Source Serif Pro` (вместо ранее документированного `Bitter`) в этапах и помнить о строгих ограничениях на модификации: только шрифты.

### Этапы внедрения с учетом особенностей проекта

1. Интеграция шрифта **Source Serif Pro** в `app/layout.tsx` (вместо ранее документированного `Bitter`)
2. Обновление дизайн-токенов в `design-system/tokens/base/typography.json` для определения `fontFamily` для `serif` и `source-serif-pro`, а также размеров и интерлиньяжей, если они меняются.
3. Обновление конфигурации `tailwind.config.ts` (секция `fontFamily` для `source-serif-pro` и `serif`, а также `fontSize` и `lineHeight`, если они меняются).
4. Создание новых типографических компонентов
5. Обновление существующих компонентов
   - Обновление Badge и CounterBadge
   - Обновление SelectionDropdown
   - Проверка других компонентов
6. Тестирование сборки проекта с учетом имеющихся webpack fix'ов
7. Визуальное тестирование

### Важные моменты для учета при внедрении

1. В проекте используется webpack с особыми настройками и потенциальные проблемы с WasmHash
2. Проект настроен для GitHub Pages с особым basePath
3. TypeScript сборка настроена с опцией ignoreBuildErrors
4. Проект использует React в режиме не-strict

## 10. Типографика страницы профиля (account/page.tsx)
**Ограничение для ИИ:** Применить `font-source-serif-pro` (для шрифта `Source Serif Pro`, используемого вместо ранее документированного `Bitter`) к заголовкам в примерах. Остальные классы (`text-xl`, `font-semibold`, `text-foreground`, `mb-4` и т.д.) и структура JSX должны оставаться неизменными.

Страница профиля содержит ряд специфических компонентов, которые требуют особого внимания:

### 10.1. EditProfileModal

Модальное окно для редактирования профиля:

```jsx
// Заголовок модального окна
<h2 className="text-xl font-semibold text-foreground font-source-serif-pro mb-4">
  Редактировать профиль
</h2>

// Метки полей
<label className="block text-sm font-medium text-foreground mb-1 font-inter">
  ФИО
</label>

// Вспомогательный текст
<p className="text-xs text-muted-foreground mt-1 font-inter">
  Имя, которое будет отображаться в интерфейсе
</p>
```

### 10.2. ProfileCard

Карточка профиля пользователя:

```jsx
// Заголовок карточки
<h2 className="text-lg font-semibold text-foreground font-source-serif-pro mb-3">
  Информация о профиле
</h2>

// Метки и значения
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <div className="text-sm text-muted-foreground font-inter">ФИО:</div>
    <div className="font-medium font-inter">{userName}</div>
  </div>
  <div>
    <div className="text-sm text-muted-foreground font-inter">Email:</div>
    <div className="font-medium font-inter">{userEmail}</div>
  </div>
</div>

// Информация о дате регистрации
<div className="mt-3 text-sm text-muted-foreground font-inter leading-normal">
  Дата регистрации: {registrationDate}
</div>
```

### 10.3. TariffPaymentCard

Карточка с информацией о тарифе:

```jsx
// Заголовок секции тарифа
<h2 className="text-lg font-semibold text-foreground font-source-serif-pro mb-3">
  Тариф и оплата
</h2>

// Информация о текущем тарифе
<div className="mb-4">
  <div className="text-sm text-muted-foreground font-inter mb-1">Текущий тариф:</div>
  <div className="flex items-center">
    <span className="font-medium text-foreground font-inter">{currentTariff.name}</span>
    <Badge variant="outline" className="ml-2 font-inter">
      <span className="font-normal">Учеников:</span>
      <span className="font-semibold ml-1">{currentStudentCount}</span>
      <span className="font-normal ml-1">/ {currentTariff.studentLimit}</span>
    </Badge>
  </div>
</div>

// Варианты оплаты
<p className="text-sm font-inter mb-2">Варианты оплаты:</p>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {paymentOptions.map((option) => (
    <Button
      key={option.id}
      variant="outline"
      className="w-full p-3 h-auto font-inter text-left flex flex-col items-start"
    >
      <span className="font-medium text-foreground">{option.period}</span>
      <span className="text-sm text-muted-foreground mt-1">{option.description}</span>
    </Button>
  ))}
</div>
```

### 10.4. AccountSelectorDropdown

Выпадающий список для выбора аккаунта (для админа):

```jsx
// Метка селектора
<label className="block text-sm font-medium text-foreground mb-2 font-inter">
  Выбрать пользователя:
</label>

// Опции выпадающего списка
<SelectItem 
  key={user.id} 
  value={user.id}
  className="font-inter"
>
  <div className="flex flex-col">
    <span className="font-medium">{user.name}</span>
    <span className="text-xs text-muted-foreground">{user.email}</span>
  </div>
</SelectItem>
```

### 10.5. BreadcrumbsBlock

Блок навигации по страницам (хлебные крошки):

```jsx
<nav aria-label="Breadcrumbs" className="flex items-center space-x-1 text-sm font-inter mb-4">
  {items.map((item, index) => (
    <React.Fragment key={index}>
      {index > 0 && <span className="text-muted-foreground mx-1">/</span>}
      {item.href ? (
        <a 
          href={item.href} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {item.label}
        </a>
      ) : (
        <span className="text-foreground font-medium">{item.label}</span>
      )}
    </React.Fragment>
  ))}
</nav>
```

## 11. Типографика страницы тестирования токенов (token-test/page.tsx)
**Ограничение для ИИ:** Применить `font-source-serif-pro` (для шрифта `Source Serif Pro`, используемого вместо ранее документированного `Bitter`) к заголовкам в примерах. Остальные классы и структура JSX должны оставаться неизменными.

Страница тестирования токенов служит для проверки корректности отображения компонентов:

### 11.1. ThemeToggle

Переключатель темы оформления:

```jsx
<Button
  variant="ghost"
  size="sm"
  className="h-8 w-8 px-0 font-inter"
>
  <span className="sr-only font-inter">Переключить тему</span>
  <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</Button>
```

### 11.2. TokenDebugger

Компонент для визуализации CSS-переменных:

```jsx
// Заголовок отладчика
<h3 className="text-xl font-semibold mb-3 font-source-serif-pro">Token Debugger</h3>

// Сегменты переменных
<div className="text-sm font-medium mb-2 font-inter text-foreground">Typography Tokens</div>

// Отображение значений токенов
<div className="grid grid-cols-2 gap-x-4 gap-y-1">
  <div className="text-xs font-mono text-muted-foreground">--fontSize-base</div>
  <div className="text-xs font-medium font-inter">1rem (16px)</div>
</div>
```

### 11.3. Примеры компонентов на тестовой странице

```jsx
// Заголовок тестовой страницы
<h1 className="text-3xl font-bold mb-8 font-source-serif-pro">Design Token Test Page</h1>

// Заголовки секций
<h2 className="text-xl font-semibold mb-4 font-source-serif-pro">Buttons & Progress</h2>

// Содержимое вкладок
<TabsContent value="tab1" className="p-4 bg-muted rounded-lg">
  <p className="font-inter leading-cyr-text">Tab 1 Content with token-based colors</p>
</TabsContent>

// Заголовок SelectionDropdown
<h2 className="text-2xl font-bold font-source-serif-pro">Selection Dropdown</h2>
```

### 11.4. Примеры кнопок

```jsx
// Различные варианты кнопок
<div className="flex flex-wrap gap-2">
  <Button variant="default" className="font-inter">Default</Button>
  <Button variant="secondary" className="font-inter">Secondary</Button>
  <Button variant="outline" className="font-inter">Outline</Button>
  <Button variant="ghost" className="font-inter">Ghost</Button>
  <Button variant="destructive" className="font-inter">Destructive</Button>
</div>
```

### 11.5. Текст внутри содержимого вкладок

```jsx
<TabsContent value="tab1" className="p-4 bg-muted rounded-lg">
  <p className="font-inter leading-cyr-text text-foreground">
    Текст с оптимизированным интерлиньяжем для кириллицы. 
    Здесь можно увидеть различия между стандартным 
    интерлиньяжем и специальным для кириллического текста.
  </p>
</TabsContent>
```

## 12. Мобильная типографика
**Ограничение для ИИ:** Применить семантические классы (`text-app-h1-mobile md:text-app-h1` и т.д.) и корректные шрифты (`font-source-serif-pro`, `font-inter`) к примерам. Рекомендации по адаптивности нешрифтовых стилей (отступы, размеры кнопок) ИИ не должен изменять, если это не касается непосредственно применения нового шрифта и его адаптивных размеров.

Адаптивный подход к типографике позволяет оптимизировать чтение на мобильных устройствах, сохраняя при этом иерархию и читаемость.

### 12.1. Адаптация размеров текста

Наша новая типографическая шкала уже включает адаптивные размеры для заголовков. Базовые размеры являются мобильными, а десктопные применяются с префикса `md:`.

**Напоминание адаптивной шкалы:**

| Семантический элемент | Мобильный (px/rem) | Десктоп (px/rem) | Tailwind Класс (размер)           |
| :-------------------- | :----------------- | :--------------- | :-------------------------------- |
| **H1**                | 36px / 2.25rem     | 48px / 3rem      | `text-app-h1-mobile md:text-app-h1` |
| **H2**                | 30px / 1.875rem    | 36px / 2.25rem   | `text-app-h2-mobile md:text-app-h2` |
| **H3**                | 20px / 1.25rem     | 24px / 1.5rem    | `text-app-h3-mobile md:text-app-h3` |
| **Body**              | 16px / 1rem        | 16px / 1rem      | `text-app-body`                     |
| **Small**             | 14px / 0.875rem    | 14px / 0.875rem  | `text-app-small`                    |
| **Caption**           | 12px / 0.75rem     | 12px / 0.75rem   | `text-app-caption`                  |

**Примеры использования с компонентом `Typography`:**
Компонент `Typography` автоматически обрабатывает адаптивные размеры, определенные в его вариантах.

```jsx
// Адаптивный заголовок H1
<Typography variant="h1" as="h1">
  Заголовок страницы
</Typography> // По умолчанию: 36px, на md и выше: 48px

// Адаптивный заголовок H2
<Typography variant="h2" as="h2" className="mt-8 mb-4"> {/* Дополнительные классы для отступов */}
  Раздел страницы
</Typography> // По умолчанию: 30px, на md и выше: 36px

// Основной текст (Body) - размер одинаковый на всех экранах
<Typography variant="p">
  Этот текст будет 16px как на мобильных, так и на десктопных устройствах.
</Typography>
```

**Примеры с прямым использованием классов Tailwind:**
```jsx
<h1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">
  Заголовок страницы
</h1>

<h2 className="font-source-serif-pro text-app-h2-mobile md:text-app-h2 leading-tight font-semibold text-foreground mt-8 mb-4">
  Раздел страницы
</h2>

<p className="font-inter text-app-body leading-cyr-text text-foreground">
  Этот текст будет 16px как на мобильных, так и на десктопных устройствах.
</p>
```

### 12.2. Оптимизация интерфейсных элементов

На мобильных устройствах:
- Увеличьте высоту интерактивных элементов до 44-48px
- Уменьшите горизонтальные отступы
- Используйте полную ширину для кнопок действий

```jsx
// Адаптивная кнопка
<Button 
  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-inter font-medium"
  variant="default"
>
  Продолжить
</Button>

// Адаптивная карточка с меньшими отступами на мобильных
<div className="bg-card p-4 sm:p-6 rounded-lg">
  <h3 className="text-lg sm:text-xl font-semibold font-source-serif-pro">Заголовок карточки</h3>
  <p className="text-base font-inter leading-cyr-text mt-2">Содержимое карточки</p>
</div>
```

### 12.3. Увеличение тач-зон

Для мобильных устройств увеличьте размер интерактивных элементов, особенно ссылок в тексте:

```jsx
// Ссылка в тексте с увеличенной тач-зоной на мобильных
<a 
  href="/link" 
  className="text-primary font-medium inline-block py-1 px-0.5 -my-1 -mx-0.5 sm:p-0 sm:m-0"
>
  Текст ссылки
</a>
```

## 13. Вертикальные ритмы
**Ограничение для ИИ:** Применить `font-source-serif-pro` (для шрифта `Source Serif Pro`, используемого вместо ранее документированного `Bitter`) к заголовкам в примерах. Рекомендации по отступам (`mb-6`, `mt-8` и т.д.) ИИ не должен изменять.

Последовательные и пропорциональные вертикальные отступы создают визуальную гармонию и улучшают удобочитаемость.

### 13.1. Базовая единица вертикального ритма

Используйте базовую единицу в 4px (0.25rem) для создания согласованных отступов:

```jsx
// Применение вертикальных ритмов
<article className="prose">
  <h1 className="font-source-serif-pro font-bold text-3xl mb-6">Заголовок статьи</h1>
  <p className="font-inter leading-cyr-text mb-4">Первый параграф...</p>
  <h2 className="font-source-serif-pro font-semibold text-2xl mt-8 mb-4">Раздел статьи</h2>
  <p className="font-inter leading-cyr-text mb-4">Второй параграф...</p>
  <ul className="list-disc pl-6 mb-4">
    <li className="font-inter mb-2">Первый пункт</li>
    <li className="font-inter mb-2">Второй пункт</li>
  </ul>
</article>
```

### 13.2. Рекомендуемые отступы

| Элемент | Отступ сверху | Отступ снизу |
|---------|--------------|-------------|
| H1 | mt-0 или mt-6 | mb-6 |
| H2 | mt-8 | mb-4 |
| H3 | mt-6 | mb-3 |
| Параграф | mt-0 | mb-4 |
| Список | mt-0 | mb-4 |
| Элемент списка | mt-0 | mb-2 |
| Карточка | mt-0 | mb-6 |
| Секция | mt-12 | mb-12 |

### 13.3. Группировка контента

Используйте принцип близости для организации связанных элементов:

```jsx
// Группировка связанных элементов
<div className="space-y-2 mb-6">
  <h3 className="font-source-serif-pro font-medium text-lg">Задание 1</h3>
  <p className="font-inter text-muted-foreground">Описание задания</p>
</div>

// Отделение групп
<div className="space-y-6">
  <div className="space-y-2">
    <h3 className="font-source-serif-pro font-medium text-lg">Группа 1</h3>
    <p className="font-inter">Элементы группы 1</p>
  </div>
  <div className="space-y-2">
    <h3 className="font-source-serif-pro font-medium text-lg">Группа 2</h3>
    <p className="font-inter">Элементы группы 2</p>
  </div>
</div>
```

## 14. Типографика в формах

Формы требуют особого внимания к типографике для обеспечения ясности и удобства использования.

### 14.1. Метки полей

Метки должны быть четкими и информативными:

```jsx
// Стандартная метка
<label 
  htmlFor="fullName" 
  className="block text-sm font-medium text-foreground mb-1.5 font-inter"
>
  ФИО <span className="text-destructive">*</span>
</label>

// Группа полей
<fieldset className="mb-4">
  <legend className="text-base font-medium font-inter mb-2">Контактная информация</legend>
  <!-- Поля ввода -->
</fieldset>
```

### 14.2. Текст ввода

Текст внутри полей ввода должен быть хорошо читаемым:

```jsx
// Стилизация текста ввода
<Input
  id="fullName"
  className="font-inter text-base"
  placeholder="Введите ваше имя"
/>

// Многострочное поле
<Textarea
  id="comments"
  className="font-inter text-base leading-cyr-text"
  placeholder="Введите комментарий"
  rows={4}
/>
```

### 14.3. Вспомогательный текст и сообщения валидации

```jsx
// Вспомогательный текст
<p className="text-xs text-muted-foreground mt-1 font-inter">
  Укажите ФИО так, как оно должно отображаться в сертификате
</p>

// Сообщение об ошибке
<div className="text-sm text-destructive mt-1 font-inter">
  Это поле обязательно для заполнения
</div>

// Сообщение об успехе
<div className="text-sm text-success mt-1 font-inter">
  Данные сохранены
</div>
```

### 14.4. Кнопки форм

```jsx
// Основная кнопка действия
<Button 
  type="submit" 
  className="font-inter font-medium mt-6"
>
  Сохранить изменения
</Button>

// Вторичное действие
<Button 
  type="button" 
  variant="outline"
  className="font-inter font-normal mt-6 mr-2"
>
  Отмена
</Button>
```

## 15. Обновление Storybook
**Ограничение для ИИ:** В примерах кода и описаниях использовать `Source Serif Pro` / `font-source-serif-pro` для заголовков (вместо ранее документированного `Bitter`). Структура историй и другие детали (названия, `argTypes`) ИИ не должен изменять без явного указания.

Для демонстрации и документирования новой типографической системы необходимо создать/обновить истории в Storybook.

### 15.1. Создание основных историй типографики

```tsx
// components/stories/Typography.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@/components/ui/typography'; // Убедитесь, что путь корректен

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'p', 'small', 'caption', 'lead', 'blockquote', 'list', 'inlineCode', 'hint'], // Обновленные варианты
    },
    children: {
      control: 'text',
    },
    as: {
      control: 'text', // Позволяет задать тег, например 'h1', 'p', 'span'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    as: 'h1',
    children: 'Заголовок первого уровня (H1)',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    as: 'h2',
    children: 'Заголовок второго уровня (H2)',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    as: 'h3',
    children: 'Заголовок третьего уровня (H3)',
  },
};

export const Paragraph: Story = {
  args: {
    variant: 'p',
    as: 'p',
    children: 'Основной текст параграфа (Body) с оптимизированным интерлиньяжем для кириллического текста. Обратите внимание на высоту строки и удобочитаемость.',
  },
};

export const SmallText: Story = {
  args: {
    variant: 'small',
    as: 'p', // или 'span'
    children: 'Уменьшенный текст (Small) для вспомогательной информации.',
  },
};

export const CaptionText: Story = {
  args: {
    variant: 'caption',
    as: 'p', // или 'span'
    children: 'Очень мелкий текст (Caption) для подписей или метаданных.',
  },
};

export const TypographyScale: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1" as="h1">H1 (моб: 36px, деск: 48px) - Source Serif Pro Semibold</Typography>
      <Typography variant="h2" as="h2">H2 (моб: 30px, деск: 36px) - Source Serif Pro Semibold</Typography>
      <Typography variant="h3" as="h3">H3 (моб: 20px, деск: 24px) - Source Serif Pro Medium</Typography>
      <Typography variant="p" as="p">Body (16px) - Inter Normal, cyr-text</Typography>
      <Typography variant="small" as="small">Small (14px) - Inter Normal</Typography>
      <Typography variant="caption" as="p">Caption (12px) - Inter Normal</Typography>
      <hr />
      <Typography variant="lead" as="p">Lead (стиль как H3, Inter Normal, relaxed)</Typography>
      <Typography variant="blockquote" as="blockquote">Blockquote (стиль как Body, italic)</Typography>
      <Typography variant="list" as="ul"><li className="ml-5">List item (стиль как Body)</li></Typography>
      <Typography variant="inlineCode" as="code">Inline Code (стиль как Small, mono)</Typography>
      <Typography variant="hint" as="p">Hint (стиль как Caption)</Typography>
    </div>
  ),
};
```

### 15.2. Демонстрация шрифтовых пар

```tsx
// components/stories/FontPairs.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const FontPairsDemo = () => (
  <div className="space-y-8">
    <section className="p-6 border rounded-lg">
      <h2 className="font-source-serif-pro text-2xl font-semibold mb-4">Source Serif Pro + Inter: Учебный блок</h2>
      <p className="font-inter text-base leading-cyr-text mb-4">
        Этот пример демонстрирует сочетание заголовка в шрифте Source Serif Pro с основным текстом в шрифте Inter.
        Такое сочетание придает академический и образовательный характер контенту, что идеально 
        для учебных материалов на платформе RUS100.
      </p>
      <p className="font-inter text-base leading-cyr-text">
        Обратите внимание на специальный интерлиньяж для кириллического текста, который 
        обеспечивает оптимальное расстояние между строками и повышает удобочитаемость.
      </p>
    </section>
    
    <section className="p-6 border rounded-lg">
      <h2 className="font-inter text-2xl font-bold mb-4">Inter Bold + Inter Normal: Интерфейс</h2>
      <p className="font-inter text-base leading-normal mb-4">
        Этот пример показывает использование только шрифта Inter с разными весами для создания
        иерархии в интерфейсных элементах. Такой подход применяется в компонентах управления,
        навигации и других элементах интерфейса.
      </p>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Font Pairs',
  component: FontPairsDemo,
};

export default meta;
type Story = StoryObj;

export const DefaultFontPairs: Story = {};
```

### 15.3. Демонстрация интерлиньяжа для кириллицы

```tsx
// components/stories/CyrillicLineHeight.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const LineHeightDemo = () => (
  <div className="space-y-8">
    <section>
      <h2 className="font-source-serif-pro text-xl font-semibold mb-4">Сравнение интерлиньяжа для кириллического текста</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="font-inter text-base font-medium mb-2">Стандартный интерлиньяж (1.5)</h3>
          <p className="font-inter text-base leading-normal">
            Это пример кириллического текста со стандартным значением интерлиньяжа (line-height: 1.5). 
            Обратите внимание, как выглядят строки по отношению друг к другу. При стандартном 
            интерлиньяже кириллический текст может казаться слишком плотным из-за высоты букв.
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-inter text-base font-medium mb-2">Оптимизированный интерлиньяж (1.6)</h3>
          <p className="font-inter text-base leading-cyr-text">
            Это пример кириллического текста с оптимизированным значением интерлиньяжа (line-height: 1.6). 
            Обратите внимание на улучшенную удобочитаемость за счет дополнительного пространства 
            между строками, которое учитывает особенности высоты кириллических букв.
          </p>
        </div>
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Cyrillic Line Height',
  component: LineHeightDemo,
};

export default meta;
type Story = StoryObj;

export const DefaultLineHeightComparison: Story = {};
```

## 16. Распространенные ошибки типографики
**Ограничение для ИИ:** В примерах и рекомендациях использовать `Source Serif Pro` для заголовков (вместо ранее документированного `Bitter`). Суть рекомендаций по хорошей и плохой типографике ИИ не должен изменять.

### 16.1. Что делать

✅ **Делайте:**
- Используйте подходящие шрифты для каждой цели (Source Serif Pro для заголовков, Inter для текста)
- Последовательно придерживайтесь иерархии размеров
- Используйте оптимизированный интерлиньяж для кириллицы (1.6-1.7)
- Обеспечивайте достаточный контраст между текстом и фоном
- Используйте переносы строк для улучшения читаемости на мобильных устройствах
- Применяйте семантическую разметку (h1-h6, p, etc.)

```jsx
// Правильно: семантическая разметка с правильными шрифтами
<h1 className="font-source-serif-pro text-3xl font-bold leading-tight">Заголовок</h1>
<p className="font-inter text-base leading-cyr-text">Параграф с кириллицей</p>
```

### 16.2. Чего избегать

❌ **Избегайте:**
- Смешивания слишком многих размеров и весов шрифта на одной странице
- Использования слишком маленького текста (менее 14px)
- Полностью заглавного текста для длинных фраз
- Низкого контраста между текстом и фоном
- Переполнения текстом мобильных экранов
- Недостаточных отступов между текстовыми элементами

```jsx
// Неправильно: слишком много стилей, низкая читаемость
<div>
  <span className="font-bold text-xs uppercase tracking-widest">Маленький заголовок</span>
  <p className="text-xs leading-tight">Этот текст слишком маленький и плотный, что затрудняет чтение, особенно на мобильных устройствах или людям с нарушениями зрения.</p>
</div>

// Правильно: более читаемая альтернатива
<div>
  <h4 className="font-source-serif-pro text-sm font-semibold mb-2">Маленький заголовок</h4>
  <p className="font-inter text-base leading-cyr-text">Этот текст более читаемый благодаря правильному размеру и интерлиньяжу.</p>
</div>
```

### 16.3. Распространенные проблемы в проекте

- Недостаточный интерлиньяж в плотных блоках текста
- Непоследовательное использование шрифтов в разных компонентах
- Слишком маленький размер текста в мобильных представлениях
- Отсутствие адаптивности в размерах заголовков
- Недостаточный контраст для текста на цветном фоне

## 17. Интеграция с SEO
**Ограничение для ИИ:** В примерах использовать `font-source-serif-pro` для заголовков (вместо ранее документированного `font-bitter`). Принципы SEO и доступности ИИ не должен изменять.

Правильная структура типографики важна не только для пользователей, но и для поисковых систем.

### 17.1. Семантическая структура заголовков

```jsx
// Правильная структура заголовков для SEO
<main>
  <h1 className="font-source-serif-pro text-3xl sm:text-4xl font-bold">Генерация теста</h1>
  
  <section>
    <h2 className="font-source-serif-pro text-2xl sm:text-3xl font-semibold mt-8">Выбор заданий</h2>
    <!-- Содержимое раздела -->
    
    <div>
      <h3 className="font-source-serif-pro text-xl sm:text-2xl font-medium mt-6">Категория 1</h3>
      <!-- Подраздел -->
    </div>
  </section>
  
  <section>
    <h2 className="font-source-serif-pro text-2xl sm:text-3xl font-semibold mt-8">Настройка параметров</h2>
    <!-- Содержимое раздела -->
  </section>
</main>
```

### 17.2. Правильное использование микроразметки

```jsx
// Микроразметка для образовательного контента
<article itemScope itemType="https://schema.org/LearningResource">
  <h1 className="font-source-serif-pro text-3xl font-bold" itemProp="name">Правила пунктуации</h1>
  
  <p className="font-inter text-base leading-cyr-text" itemProp="description">
    Основные правила постановки знаков препинания в русском языке.
  </p>
  
  <div itemProp="educationalLevel">Старшие классы</div>
</article>
```

### 17.3. Доступность и SEO

```jsx
// Доступный и SEO-ориентированный компонент
<Button
  aria-label="Создать новый тест"
  className="font-inter text-base font-medium"
>
  Создать тест
</Button>

// Описательные заголовки
<h2 id="test-settings" className="font-source-serif-pro text-2xl font-semibold">
  Настройки теста по русскому языку
</h2>

// Использование aria-describedby
<div>
  <label htmlFor="test-name" className="font-inter text-sm font-medium">Название теста</label>
  <Input 
    id="test-name" 
    aria-describedby="test-name-hint"
  />
  <p id="test-name-hint" className="font-inter text-xs text-muted-foreground">
    Название будет видно ученикам при прохождении теста
  </p>
</div>
```

### 17.4. Оптимизация для скринридеров

```jsx
// Создание доступной типографики для скринридеров
<div className="flex items-center">
  <Badge variant="outline" className="mr-2">
    <span className="sr-only">Количество: </span>
    <span aria-hidden="true">Х</span>
    <span>5</span>
  </Badge>
  
  <h3 className="font-source-serif-pro text-lg font-medium">
    <span className="sr-only">Категория: </span>
    Орфография
  </h3>
</div>

// Пропуск навигации
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-background">
  Перейти к основному содержимому
</a>
```

## 18. Матрица соответствия компонентов и типографических правил
<!-- @section-id: typography-component-matrix -->
<!-- @context: Соответствие между компонентами интерфейса и типографическими правилами -->
<!-- @status: reference -->
**Ограничение для ИИ:** В таблицах использовать `Source Serif Pro` для заголовков. Остальные данные в матрице (размеры, веса, компоненты) ИИ не должен изменять без явного указания.

Данная матрица показывает, какие типографические правила из компонента `Typography` и семантической шкалы применяются к основным компонентам интерфейса.

### 18.1. Базовые стили из `Typography`

| `Typography` вариант | Шрифт            | Размер (моб/деск) | Вес (Tailwind) | Интерлиньяж (Tailwind) | Адаптивность | Применение                                      |
| :------------------- | :--------------- | :---------------- | :------------- | :--------------------- | :----------- | :---------------------------------------------- |
| `h1`                 | Source Serif Pro | 36px / 48px       | `font-semibold`  | `leading-tight`        | ✅           | Главные заголовки страниц                       |
| `h2`                 | Source Serif Pro | 30px / 36px       | `font-semibold`  | `leading-tight`        | ✅           | Заголовки основных разделов                     |
| `h3`                 | Source Serif Pro | 20px / 24px       | `font-medium`    | `leading-snug`         | ✅           | Подзаголовки, заголовки карточек                |
| `p` (Body)           | Inter            | 16px / 16px       | `font-normal`    | `leading-cyr-text`     | ❌           | Основной контент, параграфы                     |
| `small`              | Inter            | 14px / 14px       | `font-normal`    | `leading-5` (1.43)     | ❌           | Вспомогательный текст, метки, UI-элементы       |
| `caption`            | Inter            | 12px / 12px       | `font-normal`    | `leading-4` (1.33)     | ❌           | Мелкий текст, метаданные, сноски                |
| `lead`               | Inter            | 20px / 24px       | `font-normal`    | `leading-relaxed`      | ✅           | Выделенный абзац (стиль текста как у H3, но Inter) |
| `blockquote`         | Inter            | 16px / 16px       | `font-normal`*italic* | `leading-cyr-text`| ❌         | Цитаты                                          |
| `list`               | Inter            | 16px / 16px       | `font-normal`    | `leading-cyr-text`     | ❌           | Списки                                          |
| `inlineCode`         | System Mono      | 14px / 14px       | `font-normal`    | `leading-5`            | ❌           | Встроенный код                                  |
| `hint`               | Inter            | 12px / 12px       | `font-normal`    | `leading-4`            | ❌           | Подсказки, очень мелкий вспомогательный текст   |

### 18.2. Применение к UI Компонентам (Примеры)

| Компонент          | Элемент компонента      | Рекомендуемый `Typography` вариант / Семантический класс | Вес (если отличается от варианта) | Примечания                               |
| :----------------- | :---------------------- | :----------------------------------------------------- | :------------------------------- | :--------------------------------------- |
| `Button`           | Текст кнопки (стандарт.)| `small` (`text-app-small`)                             | `font-medium`                    |                                          |
| `Button`           | Текст кнопки (большая)  | `p` (`text-app-body`)                                  | `font-medium`, `leading-normal`  |                                          |
| `Badge`            | Текст                   | `small` (`text-app-small`)                             | `font-normal`                    |                                          |
| `CounterBadge`     | Метка (`label`)         | `small` (`text-app-small`)                             | `font-normal`                    |                                          |
| `CounterBadge`     | Число (`count`)         | `small` (`text-app-small`)                             | `font-semibold`                  |                                          |
| `Input` / `Textarea` | Текст ввода             | `p` (`text-app-body`) или `small` (`text-app-small`)   | `font-normal`                    | Зависит от контекста, обычно `p`          |
| `SelectTrigger`    | Текст                   | `small` (`text-app-small`)                             | `font-normal`                    |                                          |
| `SelectItem`       | Текст                   | `small` (`text-app-small`)                             | `font-normal`                    |                                          |
| `Label` (для форм) | Текст метки             | `small` (`text-app-small`)                             | `font-medium`                    |                                          |
| `TopNavBlock`      | Навигационные ссылки    | `small` (`text-app-small`)                             | `font-medium`                    |                                          |
| `TopNavBlock`      | Имя пользователя        | `small` (`text-app-small`)                             | `font-medium`                    |                                          |
| `TopNavBlock`      | Email пользователя      | `caption` (`text-app-caption`)                         | `font-normal`                    |                                          |
| `Card`             | Заголовок карточки      | `h3`                                                   | -                                |                                          |
| `Card`             | Текст в карточке        | `p` или `small`                                        | -                                | Зависит от контента                      |
| `TaskCardBlock`    | Заголовок задания       | `p` (`text-app-body`)                                  | `font-medium`                    | `as="h4"`                                |
| `TaskCardBlock`    | Описание задания        | `small` (`text-app-small`)                             | `font-normal`, `leading-cyr-text`|                                          |
| `BreadcrumbsBlock` | Текст крошек            | `small` (`text-app-small`)                             | `font-normal`                    | Активный элемент `font-medium`          |
| `ProgressPanelBlock`| Текст статуса          | `caption` (`text-app-caption`)                         | `font-normal`                    |                                          |

### 18.3. Системные правила типографики (не изменились)

Для обеспечения последовательности в применении типографических правил:

1. **Приоритет правил**:
   - Специфичные правила для компонента > Общие правила для типа элемента > Тема по умолчанию

2. **Наследование шрифта**:
   - Заголовки всегда используют Source Serif Pro (если не указано иное в варианте `Typography`)
   - Основной текст и большинство UI элементов используют Inter (если не указано иное)

## 19. Глоссарий терминов
